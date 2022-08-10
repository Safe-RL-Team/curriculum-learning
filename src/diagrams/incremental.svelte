<script>
  const len = 4;
  let count = 0;
  let hasInteracted = false;

  function input(x) {
    if (!hasInteracted) {
      hasInteracted = true;
    }
    count = parseInt(x.target.value)
  }
</script>

<div style="display: flex; flex-direction: column; align-items: center;"> 
  <img 
    src="images/16x16_incremental{count}_successes.svg"
    alt="Interactive plot displaying the success rate of the incremental curriculum policy over the number of curriculum steps"
    height="300px"
    width="400px"
  />
  <div style="width:300px; margin:auto; text-align:center;">
    <p>x = {count}</p>
    <input type="range" min="0" max="{len}" value="0" on:input={input}>
    <p style="height: 1em; transition: 1s opacity; {hasInteracted && 'opacity: 0;'}">Move the slider to change x!</p>
  </div>
</div>
