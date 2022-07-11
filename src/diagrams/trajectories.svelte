<script>
  const len = 5;
  let count = 0;

  // the `$:` means 're-run whenever these values change'
  $: doubled = count * 2;
  $: quadrupled = doubled * 2;

  function handleClick() {
    count += 1;
    count %= len
  }
</script>

Trajectory {count + 1}
<button on:click={handleClick}>Next</button>
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
