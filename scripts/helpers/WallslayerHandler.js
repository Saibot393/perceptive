import {PerceptiveFlags} from "./PerceptiveFlags.js";
import {cModuleName} from "../utils/PerceptiveUtils.js";

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
	if (game.settings.get(cModuleName, "hidePerceptiveWalls")) {
		let vPlaceables = canvas.walls.placeables;
		
		for (let i = 0; i < vPlaceables.length; i++) {
			if (PerceptiveFlags.isPerceptiveWall(vPlaceables[i].document)) {
				vPlaceables[i].visible = false;
			}
		}
	}
});