// Hot reloading
import * as _unused from "raw-loader!./index.ejs";
// TODO: disable before publishing

import Trajectories from "./diagrams/trajectories.svelte";
import Back from "./diagrams/back.svelte"
import Incremental from "./diagrams/incremental.svelte"
import Grid from "./diagrams/grid.svelte"

// lazily initialize any diagram below the fold. E.G:

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

const gridTag = document.getElementById("grid-visualization");
let grid;
gridTag.addEventListener("ready", () => {
	const target = gridTag.querySelector("#grid-visualization-target");
	grid = new Grid({ target });
});