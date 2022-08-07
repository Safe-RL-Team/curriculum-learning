<script>
  import { onMount } from 'svelte';

  let canvas;
  let maps = {
    'small': [
      'SFFFFFFFFF',
      'FFFFFFFFFF',
      'HFFFFFFFFF',
      'FFHFFFFFFF',
      'HFFFFHFFFF',
      'FFHFFFHFFF',
      'HFFFFHFFFF',
      'FFHFFFFFFF',
      'HFFFFFFFFF',
      'FFFGFFFFFF'
    ],
    '16x16': [
      'HHFFFFFFFFFFFFHH',
      'HFFFFFFFFFFFFFFH',
      'FFFFFFFFFFFFFFFF',
      'FFFHHHFFFFHHHFFF',
      'FFFHHHFFFFHHHFFF',
      'FFFFFFFFFFFFFFFF',
      'FFFFFFFFFFFFFFFF',
      'FFFFFFFFGFFFFFFF',
      'FFFFFFFFFFFFFFFF',
      'FFFFFFFFFFFFFFFF',
      'FFFHHHFFFFHHHFFF',
      'FFFHHHHHHHHHHFFF',
      'FFFFHHHHHHHHFFFF',
      'FFFFFFFFFFFFFFFF',
      'HFFFFFFFSFFFFFFH',
      'HHFFFFFFFFFFFFHH'
    ]
  }
  let colors = {
    'H': '#1976d2',
    'S': '#ef9a9a',
    'F': '#e1f5fe',
    'G': '#81c784',
    'T': '#ffe0b2'
  }

  let selectedMap;
  let selectedTeacher;
  let selectedReset;

  var rightPressed = false;
  var leftPressed = false;
  var upPressed = false;
  var downPressed = false;

  var mapChanged = true;

  onMount(() => {
    const ctx = canvas.getContext('2d')

    var tileSize;
    var map;
    var start;
    var x,y;
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

    function drawAgent() {
      ctx.beginPath();
      ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.fillStyle = '#9575cd';
      ctx.fill();
      ctx.closePath(); 
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawEnvironment();

      if (mapChanged) {
        [x, y] = start;
      }

      drawAgent();

      lastPosition = [x, y];
      
      if (rightPressed) {
        if (x < map[0].length - 1) x += 1
      } else if (leftPressed) {
        if (x > 0) x -= 1
      } else if (upPressed) {
        if (y > 0) y -= 1
      } else if (downPressed) {
        if (y < map.length - 1) y += 1
      }

      if (map[y][x] == 'G' || map[y][x] == 'H') {
        [x, y] = start;
      }

      if (teacherMap[y][x] == 'T') {
        if (selectedReset == 'HR') {
          [x, y] = start;
        } else if (selectedReset == 'SR') {
          [x, y] = lastPosition;
        }
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
		}
		else if(e.keyCode == 37 || e.key == 'a') {
			leftPressed = true;
		}
    else if(e.keyCode == 38 || e.key == 'w') {
      upPressed = true;
    }
    else if(e.keyCode == 40 || e.key == 's') {
      downPressed = true;
    }
	}
</script>

<svelte:window on:keydown={keyDownHandler}/>

<div style="display: flex; flex-direction: column; align-items: center;">

  <canvas
    bind:this={canvas}
    width={300}
    height={300}
  ></canvas>

  <div class="menu">
    <select bind:value={selectedMap} on:change={mapChangedHandler} name="map" id="map">
      <option value="small">Small</option>
      <option value="16x16">16x16</option>
    </select>

    <select bind:value={selectedTeacher} name="teacher" id="teacher">
      <option value="0">No Teacher</option>
      <option value="1">Distance 1</option>
      <option value="2">Distance 2</option>
    </select>

    <select bind:value={selectedReset} name="reset" id="reset">
      <option value="SR">Soft Reset</option>
      <option value="HR">Hard Reset</option>
    </select>
  </div>

  <div class="keyboard">
    <div></div>
    <button on:click={() => upPressed = true} class="key">&#8593;</button>
    <div></div>
    <button on:click={() => leftPressed = true} class="key">&#8592;</button>
    <button on:click={() => downPressed = true} class="key">&#8595;</button>
    <button on:click={() => rightPressed = true} class="key">&#8594;</button>
  </div>

</div>

<style>
	canvas {
    padding: 1em
  }

  .menu {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .menu select {
    margin: 1em;
  }

  .keyboard {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 0.5em;
    padding: 1em;
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
    width: 3em;
    height: 3em;
    cursor:pointer;
	}

  .key:active {
    background-color: #ddd;
  }
</style>