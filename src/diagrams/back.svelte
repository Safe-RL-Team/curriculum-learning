<script>
  const len = 9;
  let count = 1;

  function input(x) {
    console.log(x.target.value)
    count = parseInt(x.target.value)
  }
</script>

<div style="display: flex; flex-direction: column; align-items: center;"> 
  <div style="width:300px; margin:auto; text-align:center;">
    <p>x = {count}</p>
    <input type="range" min="1" max="{len}" value="0" on:input={input}>
  </div>
  <img 
    src="images/16x16_back{count}_successes.svg"
    alt="TODO"
    height="300px"
    width="400px"
  />  
</div>