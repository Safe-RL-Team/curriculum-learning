<script>
  const len = 5;
  let count = 0;
  let hasInteracted = false;

  function input(x) {
    if (!hasInteracted) {
      hasInteracted = true;
    }
    count = parseInt(x.target.value);
  }
</script>

<div style="display: flex; flex-direction: column; align-items: center; padding-top: 1em">
  <div style="max-width:300px; width:100%;">
    <img
      src="images/trajectories{count}.svg"
      alt="Interactive plot displaying the trajectories of the RL agent on the map"
    />
  </div>
  <div style="text-align:center;">
    <p>Trajectory after curriculum step {count + 1}</p>
    <input type="range" min="0" max="{len}" value="0" on:input={input}>
    <p style="transition: 1s opacity; {hasInteracted && 'opacity: 0;'}">Move the slider to change the step!</p>
  </div>
</div>
