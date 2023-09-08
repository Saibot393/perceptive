import { PerceptiveUtils, cModuleName } from "./PerceptiveUtils.js";
import { PerceptiveFlags } from "../helpers/PerceptiveFlags.js";

const cTransparentalpha = 0.5;

class VisionUtils {
	//DECLARATIONS
	//support
	static spotablesinVision(pToken, pCategory = {Walls : true, Tokens : true}) {} //returns spotables in tokens vision of specified categories
	
	static spotableDoorsinVision(pToken) {} //returns an array of walls that are spotable and within the vision of pToken
	
	static spotableTokensinVision(pToken) {} //returns an array of tokens that are spotable and within the vision of pToken
	
	static async PassivPerception(pToken) {} //returns the passive perception of pToken
	
	static MaketempVisible(pObjects) {} //makes pObjects visible until next vision refresh
	
	static async GenerateSpotables() {} //generates spotables and makes them pre visible
	
	//IMPLEMENTATIONS
	static spotablesinVision(pToken, pCategory = {Walls : true, Tokens : true}) {
		let vSpotables = [];
		
		if (pCategory.Walls) {
			vSpotables = vSpotables.concat(VisionUtils.spotableDoorsinVision(pToken));
		}
		
		if (pCategory.Tokens) {
			vSpotables = vSpotables.concat(VisionUtils.spotableTokensinVision(pToken));
		}
		
		return vSpotables;
	}
	
	static spotableDoorsinVision(pToken) {
		let vDoors = canvas.walls.doors;
		
		let vDoorsinRange = [];
		
		//let vRange = pToken.sight.range;
		
		let vinVision;
		
		for (let i = 0; i < vDoors.length; i++) {
			vinVision = false;
			
			if (PerceptiveFlags.canbeSpotted(vDoors[i].document)) {//partly modified from foundry.js
				const ray = vDoors[i].toRay();
				const [x, y] = vDoors[i].midpoint;
				const [dx, dy] = [-ray.dy, ray.dx];
				const t = 3 / (Math.abs(dx) + Math.abs(dy)); // Approximate with Manhattan distance for speed
				const points = [
				  {x: x + (t * dx), y: y + (t * dy)},
				  {x: x - (t * dx), y: y - (t * dy)}
				];
				
				// Test each point for visibility
				vinVision = points.some(p => {
				  return canvas.effects.visibility.testVisibility(p) /*&& (Math.sqrt((p.x - pToken.x)**2 + (p.y - pToken.y)**2) < vRange)*/;
				});				
			}
			
			if (vinVision) {
				vDoorsinRange.push(vDoors[i]);
			}
		}
		
		return vDoorsinRange.map(vDoor => vDoor.document);
	}
	
	static spotableTokensinVision(pToken) {
		let vTokens = canvas.tokens.placeables;
		
		let vTokensinRange = [];
		
		let vinVision;
		
		for (let i = 0; i < vTokens.length; i++) {
			vinVision = false;
			
			if (PerceptiveFlags.canbeSpotted(vTokens[i].document)) {//partly modified from foundry.js
				// Clear the detection filter
				vTokens[i].detectionFilter = undefined;

				// Some tokens are always visible
				if ( !canvas.effects.visibility.tokenVision ) return true;
				if ( vTokens[i].controlled ) return true;
				
				// Otherwise, test visibility against current sight polygons
				if ( canvas.effects.visionSources.get(vTokens[i].sourceId)?.active ) return true;
				const tolerance = Math.min(vTokens[i].w, vTokens[i].h) / 4;
				vinVision = canvas.effects.visibility.testVisibility(vTokens[i].center, {tolerance, object: vTokens[i]});
			}
			
			if (vinVision) {
				vTokensinRange.push(vTokens[i]);
			}
		}
		
		return vTokensinRange.map(vToken => vToken.document);
	}
	
	static async PassivPerception(pToken) {
		if (pToken && pToken.actor) {
			if (PerceptiveUtils.isPf2e()) {
				return await pToken.actor.system.attributes.perception.dc;
			}
			else {
				let vRollData = {actor : pToken.actor};
				let vRollFormula = game.settings.get(cModuleName, "PassivePerceptionFormula");
				
				let vRoll = new Roll(vRollFormula, vRollData);
				await vRoll.evaluate();
				return vRoll.total;
			}
		}
		
		return 0; //if anything fails
	}
	
	static MaketempVisible(pObjects) {
		for (let i = 0; i < pObjects.length; i++) {
			if ((pObjects[i].documentName == "Wall") && pObjects[i]._object?.doorControl) {
				pObjects[i]._object.doorControl.visible = true;
			}
			
			if ((pObjects[i].documentName == "Token") && !pObjects[i].object?.visible) {
				pObjects[i].object.visible = true;
				pObjects[i].object.mesh.alpha = cTransparentalpha;
			}
		}		
	}
	
	static async GenerateSpotables() {
		let vDoors = canvas.walls.doors;
		
		for (let i = 0; i < vDoors.length; i++) {
			//make sure all spotable doors have doorcontrols
			if (!vDoors[i].doorControl && PerceptiveFlags.canbeSpotted(vDoors[i].document)) {
				vDoors[i].doorControl = canvas.controls.doors.addChild(new DoorControl(vDoors[i]));
				vDoors[i].doorControl.draw();
				//vDoors[i].doorControl.visible = false;
			}
		}

		let vTokens = canvas.tokens.placeables;
		
		for (let i = 0; i < vTokens.length; i++) {
			if (vTokens[i].document.hidden && PerceptiveFlags.canbeSpotted(vTokens[i].document)) {
				//make token mesh half visible
				vTokens[i].mesh.alpha = cTransparentalpha;
			}
		}
	}
}

export { VisionUtils }