import {PerceptiveFlags} from "./PerceptiveFlags.js";

const cPerceptiveWallsInvisible = true;

//hooks
Hooks.on("deactivateWallsLayer", () => {
	//make Perceptive Walls invisble
	let vPlaceables = canvas.walls.placeables;
	
	for (let i = 0; i < vPlaceables.length; i++) {
		if (PerceptiveFlags.isPerceptiveWall(vPlaceables[i].document)) {
			vPlaceables[i].visible = true;
		}
	}
});

Hooks.on("activateWallsLayer", () => {
	//make Perceptive Walls visible
	if (cPerceptiveWallsInvisible) {
		let vPlaceables = canvas.walls.placeables;
		
		for (let i = 0; i < vPlaceables.length; i++) {
			if (PerceptiveFlags.isPerceptiveWall(vPlaceables[i].document)) {
				vPlaceables[i].visible = false;
			}
		}
	}
});