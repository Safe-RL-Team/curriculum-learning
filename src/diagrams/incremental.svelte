<script>
  const len = 4;
  let count = 0;

  function input(x) {
    console.log(x.target.value)
    count = parseInt(x.target.value)
  }
</script>

<div style="display: flex; flex-direction: column; align-items: center;"> 
  <img 
    src="images/16x16_incremental{count}_successes.svg"
    alt="TODO"
    height="300px"
    width="400px"
  />
  <div style="width:300px; margin:auto; text-align:center;">
    <p>x = {count}</p>
    <input type="range" min="0" max="{len}" value="0" on:input={input}>
  </div>
</div>