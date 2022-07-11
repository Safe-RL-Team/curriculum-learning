// Hot reloading
import * as _unused from "raw-loader!./index.ejs";
// TODO: disable before publishing

import Example from "./diagrams/svelte-example.svelte";
import Trajectories from "./diagrams/trajectories.svelte";

// lazily initialize any diagram below the fold. E.G:
const exampleTag = document.getElementById("svelte-example-dfigure");
let example;
exampleTag.addEventListener("ready", () => {
	const target = exampleTag.querySelector("#svelte-example-target");
	example = new Example({ target });
});


const trajectoriesTag = document.getElementById("trajectories-visualization");
let trajectories;
trajectoriesTag.addEventListener("ready", () => {
	const target = trajectoriesTag.querySelector("#trajectories-visualization-target");
	trajectories = new Trajectories({ target });
});
