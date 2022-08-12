<script>
  const len = 9;
  let count = 1;
  let hasInteracted = false;

  function input(x) {
    if (!hasInteracted) {
      hasInteracted = true;
    }
    count = parseInt(x.target.value);
  }
</script>

<div style="display: flex; flex-direction: column; align-items: center;">
  <img 
    src="images/16x16_back{count}_successes.svg"
    alt="Interactive plot displaying the success rate of the back curriculum policy over the number of curriculum steps"
  /> 
  <div style="text-align:center;">
    <p>x = {count}</p>
    <input type="range" min="1" max="{len}" value="0" on:input={input}>
    <p style="transition: 1s opacity; {hasInteracted && 'opacity: 0;'}">Move the slider to change x!</p>
  </div> 
</div>
