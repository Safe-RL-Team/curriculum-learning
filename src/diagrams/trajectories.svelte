<script>
  const len = 5;
  let count = 0;

  // the `$:` means 're-run whenever these values change'
  $: doubled = count * 2;
  $: quadrupled = doubled * 2;

  function input(x) {
    console.log(x.target.value)
    count = parseInt(x.target.value)
  }
</script>

<div style="width:300px; margin:auto; text-align:center;">
  <p>Trajectory {count + 1}</p>
  <input type="range" min="0" max="{len}" value="0" on:input={input}>
</div>
<!-- <embed
  src="images/trajectories{count}.pdf"
  type="application/pdf"
  frameBorder="0"
  scrolling="no"
  height="600px"
  width="600px"
/> -->
<img 
  src="images/trajectories{count}.svg"
  alt="TODO"
  height="300px"
  width="300px"
/>
