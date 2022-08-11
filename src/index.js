// Hot reloading
import * as _unused from "raw-loader!./index.ejs";
// TODO: disable before publishing

import Trajectories from "./diagrams/trajectories.svelte";
import Back from "./diagrams/back.svelte"
import Incremental from "./diagrams/incremental.svelte"
import Minigame from "./diagrams/minigame.svelte"

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

const minigameTag = document.getElementById("minigame");
let minigame;
minigameTag.addEventListener("ready", () => {
	const target = minigameTag.querySelector("#minigame-target");
	minigame = new Minigame({ target });
});