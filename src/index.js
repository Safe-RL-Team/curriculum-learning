// Hot reloading
import * as _unused from "raw-loader!./index.ejs";
// TODO: disable before publishing

import Example from "./diagrams/svelte-example.svelte";
import Trajectories from "./diagrams/trajectories.svelte";
import Back from "./diagrams/back.svelte"
import Incremental from "./diagrams/incremental.svelte"

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

const backTag = document.getElementById("back-visualization");
let back;
backTag.addEventListener("ready", () => {
	const target = backTag.querySelector("#back-visualization-target");
	back = new Back({ target });
});

const incrementalTag = document.getElementById("incremental-visualization");
let incremental;
incrementalTag.addEventListener("ready", () => {
	const target = incrementalTag.querySelector("#incremental-visualization-target");
	incremental = new Incremental({ target });
});