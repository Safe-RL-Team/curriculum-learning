<script>
  const len = 5;
  let count = 0;

  function input(x) {
    count = parseInt(x.target.value)
  }
</script>

<img 
  src="images/trajectories{count}.svg"
  alt="TODO"
  height="300px"
  width="300px"
/>
<div style="width:300px; margin:auto; text-align:center;">
  <p>Trajectory after curriculum step {count + 1}</p>
  <input type="range" min="0" max="{len}" value="0" on:input={input}>
</div>
