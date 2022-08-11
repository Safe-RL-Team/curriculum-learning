<script>
  import { onMount, tick } from 'svelte';
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { Confetti } from "svelte-confetti";
  import { maps, colors } from "./constants.svelte"

  let canvas;

  let selectedMap;
  let selectedTeacher;
  let selectedReset;

  var rightPressed = false;
  var leftPressed = false;
  var upPressed = false;
  var downPressed = false;

  var mapChanged = true;

  var pos;  // the position where the player is displayed
  var realPos;  // the actual position of the player (animations don't change this)
  var history = [];  // the history of player positions

  var hasInteracted = false;  // has the reader interacted with the game yet?
  var statusMessage = '';  // displayed status message
  var statusTimer = null;  // timer id for clearing old timer

  var confetti = false;

  var pixelRatio; // adjust game resolution to higher resolution displays

  const robot = new Image();
  robot.src = './images/robot.png';

  const robotFlipped = new Image();
  robotFlipped.src = './images/robot-flipped.png'

  var flipped = false;
  var image = robot;

  var score = 0;
  var lastScore = 0;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    pixelRatio = window.devicePixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    var tileSize;
    var map;
    var start;
    var lastPosition;
    var teacherMap;

    drawEnvironment();

    function oneStepReach(baseMask) {
      let rows = baseMask.length;
      let cols = baseMask[0].length;

      let oneStepMask = new Array(rows).fill(false).map(() => new Array(cols).fill(false));
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          var res = false;
          try {
            res |= baseMask[i][j+1]
          } catch(e) {}
          try {
            res |= baseMask[i+1][j]
          } catch(e) {}
          try {
            res |= baseMask[i][j-1]
          } catch(e) {}
          try {
            res |= baseMask[i-1][j]
          } catch(e) {}

          oneStepMask[i][j] = res
        }
      }

      return oneStepMask;
    }

    function addTeacher(baseMap, distance) {

      if (distance == 0) {
        return baseMap
      }

      var newBaseMap = new Array();
      for (let i = 0; i < map.length; i++) {
        newBaseMap.push(map[i].split(''))
      }

      let baseDangerMask = newBaseMap.map((row) => {
        return row.map(element => element == 'H')
      })
      let baseEmptyMask = newBaseMap.map((row) => {
        return row.map(element => element == 'F')
      })

      var previousMask = Array.from(baseDangerMask);
      var reachMask
      for (let i = 0; i < distance; i++) {
        reachMask = oneStepReach(previousMask);
        previousMask = reachMask.map((row, i) => {
          return row.map((element, j) => element || previousMask[i][j])
        })
      }

      var newMap = Array.from(newBaseMap);
      for (let i = 0; i < newBaseMap.length; i++) {
        for (let j = 0; j < newBaseMap[0].length; j++) {
          if (reachMask[i][j] && baseEmptyMask[i][j]) {
            newMap[i][j] = 'T'
          }
        }
      }

      let teacherMap = new Array();
      for (let i = 0; i < baseMap.length; i++) {
        teacherMap.push(newMap[i].join(''));
      }

      return teacherMap;
    }

    function drawEnvironment() {
      map = maps[selectedMap]
      tileSize = canvas.height / map.length;
      teacherMap = addTeacher(map, selectedTeacher);

      for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
          let state = teacherMap[i][j];

          if (state == 'S') {
            start = [j, i];
          }

          let x = j * tileSize;
          let y = i * tileSize;

          ctx.beginPath();
          ctx.rect(x, y, tileSize + 1, tileSize + 1);
          ctx.fillStyle = colors[state];
          ctx.fill();
          ctx.closePath(); 
        }
      }
    }

    async function drawAgent() {
      if (flipped) {
        image = robotFlipped;
      } else {
        image = robot;
      }

      ctx.drawImage(image, $pos[0] * tileSize, $pos[1] * tileSize, tileSize, tileSize);
    }

    function moveAgent(newPos) {
      pos.set(newPos);
      realPos = newPos;
      history.push(realPos);
      score -= 0.01;
    }

    function resetAgent() {
      history = [];
      lastScore = score;
      moveAgent(start);
      score = 0;
    }

    function draw() {

      if (leftPressed || rightPressed || upPressed || downPressed) {
        hasInteracted = true;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawEnvironment();

      if (mapChanged) {
        pos = tweened(start, {
          duration: 150,
          easing: cubicOut,
        });
        score = 0;
        resetAgent();
      }

      drawAgent(); 

      // slip with 20% probability
      const rnd = Math.random()
      if (leftPressed || rightPressed) {
        if (rnd < 0.1) {
          leftPressed = false;
          rightPressed = false;
          upPressed = true;
        } else if (rnd < 0.2) {
          leftPressed = false;
          rightPressed = false;
          downPressed = true;
        }
      } else if (upPressed || downPressed) {
        if (rnd < 0.1) {
          upPressed = false;
          downPressed = false;
          leftPressed = true;
        } else if (rnd < 0.2) {
          upPressed = false;
          downPressed = false;
          rightPressed = true;
        }
      }
      if (rnd < 0.2 && (upPressed || downPressed || leftPressed || rightPressed)) {
        showMessage('You just slipped.')
      }

      if (leftPressed) flipped = true;
      if (rightPressed) flipped = false;

      // remember last position
      lastPosition = Array.from(realPos);
      let [x, y] = Array.from(lastPosition);

      // change player pos
      if (rightPressed) {
        if (x < map[0].length - 1) x += 1
      } else if (leftPressed) {
        if (x > 0) x -= 1
      } else if (upPressed) {
        if (y > 0) y -= 1
      } else if (downPressed) {
        if (y < map.length - 1) y += 1
      }

      // move if button is pressed
      if (rightPressed || leftPressed || downPressed || upPressed) {
        moveAgent([x, y]);
      }
      
      // check for win and fail
      if (map[y][x] == 'G') {
        confetti = true;
        score += 6;
        setTimeout(() => {confetti = false}, 3000);
        showMessage('You won!');
        resetAgent();
      } else if (map[y][x] == 'H') {
        showMessage('You failed.');
        score = 0;
        resetAgent();
      }

      // Teacher interventions
      else if (teacherMap[y][x] == 'T') {
        if (selectedReset == 'HR') {
          // hard reset
          let tmpScore = score;
          resetAgent();
          score = tmpScore;
        } else if (selectedReset == 'B4') {
          // back 4 reset
          for (let i = 0; i < 4 && history.length > 1; i++) {
            history.pop()
          }
          score += 0.01;
          moveAgent(history[history.length-1]);
        } else if (selectedReset == 'SR') {
          // soft reset
          score += 0.01;
          moveAgent(lastPosition);
        }
        showMessage('The teacher set you back.');
      }

      mapChanged = false;

      rightPressed = false;
      leftPressed = false;
      upPressed = false;
      downPressed = false;

      requestAnimationFrame(draw);
    }

    draw();
  });

  function mapChangedHandler() {
    mapChanged = true;
  }
  
  function keyDownHandler(e) {
		if(e.keyCode == 39 || e.key == 'd') {
			rightPressed = true;
      e.preventDefault();
		}
		else if(e.keyCode == 37 || e.key == 'a') {
			leftPressed = true;
      e.preventDefault();
		}
    else if(e.keyCode == 38 || e.key == 'w') {
      upPressed = true;
      e.preventDefault();
    }
    else if(e.keyCode == 40 || e.key == 's') {
      downPressed = true;
      e.preventDefault();
    }
	}

  function showMessage(msg) {
    // show a status message below the map
    statusMessage = '';  // clear status message and css transition
    clearTimeout(statusTimer);  // reset previous status message clear
    setTimeout(() => {statusMessage = msg}, 1)  // wait for statusMessage to be reset
    statusTimer = setTimeout(() => {statusMessage = ''}, 2000)  // clear status message after some time
  }
</script>

<svelte:window on:keydown={keyDownHandler}/>

<div class="game">

  <div class="view">
    <div class="map">
      
      <p>Score: {score == 0 ? lastScore.toFixed(2) : score.toFixed(2) }</p>
  
      <canvas
        bind:this={canvas}
        width={500 * pixelRatio}
        height={500 * pixelRatio}
        style="max-width: 300px; width: 100%; height: 100%;"
        on:click={() => showMessage('Press the arrow keys to move...')}
      ></canvas>
  
      {#if confetti}
        <Confetti cone delay={[0, 200]} amount=50 x={[-0.7, 0.7]} y={[0.5, 1.5]} />
      {/if}
    </div>

    <div class="legend">
      <div class="color" style="background-color: {colors['F']}"></div>
      <div>Safe</div>
      <div class="color" style="background-color: {colors['G']}"></div>
      <div>Goal</div>
      <div class="color" style="background-color: {colors['H']}"></div>
      <div>Danger</div>
      <div class="color" style="background-color: {colors['S']}"></div>
      <div>Start</div>
      <div class="color" style="background-color: {colors['T']}"></div>
      <div>Trigger</div>
    </div>
  </div>

  <div class="controls">

    {#if hasInteracted}
      <p class="status" style="transition: color {statusMessage ? 2 : 0}s; transition-timing-function: ease-in; color: {statusMessage ? 'white' : 'black'};">{statusMessage}</p>
    {:else}
      <p class="status">Press the arrow keys to move...</p>
    {/if}

    <div class="keyboard">
      <div></div>
      <button on:click={() => upPressed = true} class="key">&#8593;</button>
      <div></div>
      <button on:click={() => leftPressed = true} class="key">&#8592;</button>
      <button on:click={() => downPressed = true} class="key">&#8595;</button>
      <button on:click={() => rightPressed = true} class="key">&#8594;</button>
    </div>

    <div class="menu">
      <div>
        <label for="map">Choose a map:</label>
        <select bind:value={selectedMap} on:change={mapChangedHandler} name="map" id="map">
          <option value="small">Frozen Lake</option>
          <option value="16x16">Frozen Smiley</option>
          <option value="32x32">Large Lake</option>
        </select>
      </div>

      <div>
        <label for="teacher">Add a teacher:</label>
        <select bind:value={selectedTeacher} name="teacher" id="teacher">
          <option value="0">No Teacher</option>
          <option value="1">Distance 1</option>
          <option value="2">Distance 2</option>
        </select>
      </div>

      <div>
        <label for="reset">Reset strategy:</label>
        <select bind:value={selectedReset} name="reset" id="reset" disabled={selectedTeacher==0}>
          <option value="SR">Soft Reset</option>
          <option value="B4">Back 4</option>
          <option value="HR">Hard Reset</option>
        </select>
      </div>
    </div>

  </div>

</div>

<style>
	canvas {
    padding-bottom: 1em;
    padding-top: 1em;
  }

  .game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 1.5em;
  }

  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 350px;
  }

  .status {
    height: 1em;
    width: 100%;
    max-width: 300px;
    text-align: center;
    transition: color 1s;
    padding-top: 1em;
  }

  .map {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .view {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .map p {
    margin: 0;
  }

  .menu {
    display: flex;
    flex-direction: row;
    gap: 0.2em;
    overflow: auto;
    flex-wrap: wrap;
  }

  .menu div {
    margin: 0.3em;
    display: flex;
    flex-direction: column;
  }

  .key {
		background-color: #eee;
		border-radius: 4px;
		font-size: 1em;
		padding: 0.5em 0.5em;
		border-top: 5px solid rgba(255, 255, 255, 0.5);
		border-left: 5px solid rgba(255, 255, 255, 0.5);
		border-right: 5px solid rgba(0, 0, 0, 0.2);
		border-bottom: 5px solid rgba(0, 0, 0, 0.2);
		color: #555;
    text-align: center;
    width: 4em;
    height: 4em;
    cursor: pointer;
	}

  .legend {
    display: grid;
    grid-template-columns: 1.5em 1fr 1.5em 1fr 1.5em 1fr;
    width: 100%;
    max-width: 300px;
    gap: 0.5em;
  }

  .legend div {
    display: flex;
    justify-content: center left;
  }

  @media (min-width: 1000px) {
    .view {
      flex-direction: row;
    }
    .legend {
      grid-template-columns: 1.5em 1fr;
      max-width: 100px;
      padding-left: 1em;
    }
    .controls {
      max-width: 350px;
    }
  }

  @media (min-width: 768px) {
    .game {
      flex-direction: row;
    }
    .controls {
      flex-direction: column;
      max-width: 300px;
    }
    .menu {
      flex-direction: column;
    }
    .menu div {
      flex-direction: row;
      gap: 10px;
    }
    .key {
      width: 3em;
      height: 3em;
    }
  }

  .keyboard {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 0.5em;
    padding-top: 1em;
    padding-bottom: 1em;
  }

  .key:active {
    background-color: #ddd;
  }
   
  .color {
    width: 1.5em;
    height: 1.5em;
  }
</style>
