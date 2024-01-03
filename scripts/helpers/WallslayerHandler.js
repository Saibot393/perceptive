import {PerceptiveFlags} from "./PerceptiveFlags.js";
import {cModuleName} from "../utils/PerceptiveUtils.js";
import {WallUtils} from "../utils/WallUtils.js";

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
	if (!game.settings.get(cModuleName, "showPerceptiveWalls")) {
		let vPlaceables = canvas.walls.placeables;
		
		for (let i = 0; i < vPlaceables.length; i++) {
			if (PerceptiveFlags.isPerceptiveWall(vPlaceables[i].document)) {
				vPlaceables[i].visible = false;
			}
		}
	}
});

Hooks.on("refreshWall", (pWall) => {
	if (pWall.visible && (!game.settings.get(cModuleName, "showPerceptiveWalls"))) {
		if (PerceptiveFlags.isPerceptiveWall(pWall.document)) {
			pWall.visible = false;
		}
	}
});

Hooks.on("canvasReady", async (pCanvas) => { //precreate walls to prevent lag bugs
	if (game.user == game.users.find(user => user.isGM && user.active)) {
		let vWalls = pCanvas.walls.placeables.map(vWall => vWall?.document);
		
		vWalls = vWalls.filter(vWall => vWall);
		
		if (game.settings.get(cModuleName, "recreatePerceptiveWalls")) {
			for (let vWall of vWalls) {
				if (PerceptiveFlags.isPerceptiveWall(vWall)) {
					await WallUtils.deletewall(vWall);
				}
			}
		}
		
		for (let vWall of vWalls) {
			if (PerceptiveFlags.canbeLockpeeked(vWall)) {
				await PerceptiveFlags.createLockpeekingWalls(vWall);
			}
			
			if (PerceptiveFlags.Doorcanbemoved(vWall)) {
				await PerceptiveFlags.createMovingWall(vWall);
			}
		}
	}
})