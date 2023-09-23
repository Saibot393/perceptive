import {GeometricUtils} from "./GeometricUtils.js";
import { PerceptiveUtils, cModuleName } from "./PerceptiveUtils.js";
import { PerceptiveFlags } from "../helpers/PerceptiveFlags.js";
import { PerceptiveCompUtils, cVision5e } from "../compatibility/PerceptiveCompUtils.js";

//const cTransparentalpha = 0.5;

const cDimInterval = [1/4, 3/4]; //Scene darkness values between which the scene is dim (lower is bright, higher is dark)

const cLightLevel = {
					Dark : 0,
					Dim : 1,
					Bright : 2
					};
					
const cVisionLevel = {
					 Normal : 0,
					 LowLight : 1,
					 Dark : 2,
					 TotalDark : 3
					 };
					 
export {cLightLevel, cVisionLevel};

class VisionUtils {
	//DECLARATIONS
	//support
	static spotablesinVision(pToken, pCategory = {Walls : true, Tokens : true}) {} //returns spotables in tokens vision of specified categories
	
	static spotableDoorsinVision(pToken) {} //returns an array of walls that are spotable and within the vision of pToken
	
	static spotableTokensinVision(pToken) {} //returns an array of tokens that are spotable and within the vision of pToken
	
	static async PassivPerception(pToken) {} //returns the passive perception of pToken
	
	static MaketempVisible(pObjects) {} //makes pObjects visible until next vision refresh
	
	static async PrepareSpotables() {} //generates spotables and makes them pre visible
	
	static async PreapreSpotableToken(pToken) {} //generates pToken and makes them pre visible
	
	static simpletestVisibility(ppoint, pInfos = {tolerance : 2, object : null}) {} //simple visibility test without vision mode check
	
	static VisionLevel(pToken) {} //returns the Vision level of pToken (special calc for Pf2e)
	
	static LightingLevel(pPoint, pScene = null) {} //returns the lightning level at a given point in a given scene (Dark = 0, Dim = 1, Bright = 2)
	
	static correctedLightLevel(pLightLevel, pVisionLevel) {} //returns pLightLevel with pVisionLevel(Normalsight = 0, Low-Light Vision = 1, Darkvision = 2, TotalDarkvision = 3)
	
	static LightingPDCModifier(pLightLevel) {} //returns the PDC modifier for pLightLevel
	
	static LightingPDCModifierToken(pToken, pVisionLevel = 0) {} //returns PDC modifier of pToken when viewed with pVisionLevel(Normalsight = 0, Low-Light Vision = 1, Darkvision = 2)
	
	static LightingAPDCBehaviour(pLightLevel, pVisionLevel = 0) {} //returns the APDC behaviour for pLightLevel (-1:disadvantage, 0:normal, 1:advantage)
	
	static LightingAPDCBehaviourObject(pToken, pVisionLevel = 0) {} //returns APDC behaviour of pToken when viewed with pVisionLevel(Normalsight = 0, Low-Light Vision = 1, Darkvision = 2)	
	
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
				  return canvas.effects.visibility.testVisibility(p, {tolerance : 0, object : {document : null}}) /*&& (Math.sqrt((p.x - pToken.x)**2 + (p.y - pToken.y)**2) < vRange)*/;
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
				//if ( !canvas.effects.visibility.tokenVision ) return true;
				//if ( vTokens[i].controlled ) return true;
				
				// Otherwise, test visibility against current sight polygons
				//if ( canvas.effects.visionSources.get(vTokens[i].sourceId)?.active ) return true;
				const tolerance = Math.min(vTokens[i].w, vTokens[i].h) / 4;
				vinVision = VisionUtils.simpletestVisibility(vTokens[i].center, {tolerance, object: vTokens[i]});
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
				pObjects[i].object.mesh.alpha = game.settings.get(cModuleName, "SpottedTokenTransparency");
			}
		}		
	}
	
	static async PrepareSpotables() {
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
				VisionUtils.PreapreSpotableToken(vTokens[i]);
			}
		}
	}
	
	static async PreapreSpotableToken(pToken) {
		if ((pToken.mesh.alpha < game.settings.get(cModuleName, "SpottedTokenTransparency")) || PerceptiveFlags.isPerceptiveStealthing(pToken.document)) {
			pToken.mesh.alpha = game.settings.get(cModuleName, "SpottedTokenTransparency");
		}
	}
	
	static simpletestVisibility(ppoint, pInfos = {tolerance : 0, object : null}) { //adapted from foundry.js
		// If no vision sources are present, the visibility is dependant of the type of user
		if ( !canvas.effects.visionSources.some(s => s.active) ) return game.user.isGM;

		// Prepare an array of test points depending on the requested tolerance
		const t = pInfos.tolerance;
		const offsets = t > 0 ? [[0, 0], [-t, -t], [-t, t], [t, t], [t, -t], [-t, 0], [t, 0], [0, -t], [0, t]] : [[0, 0]];
		const points = offsets.map(o => new PIXI.Point(ppoint.x + o[0], ppoint.y + o[1]));

		return points.some(p => {
			return canvas.effects.visibility.testVisibility(p, {tolerance : 0, object : {document : null}});
		});
	}
	
	static VisionLevel(pToken) {
		let vVLevel = cVisionLevel.Normal;
		
		if (PerceptiveUtils.isPf2e() && pToken.actor?.system?.traits?.senses?.length) {
			let vsenses = pToken.actor.system.traits.senses;
			
			if (vsenses.find(vsense => (vsense.type == "darkvision") && (vsense.range > 0))) {
				vVLevel = cVisionLevel.TotalDark;
			}
			else {
				if (vsenses.find(vsense => (vsense.type == "lowLightVision") && (vsense.range > 0))) {
					vVLevel = cVisionLevel.LowLight;
				}				
			}
		}
		else {
			let vVisionMode;
			if (PerceptiveCompUtils.isactiveModule(cVision5e) && game.settings.get(cModuleName, "Vision5eIntegration")) {
				vVisionMode = pToken._source.sight.visionMode
			}
			else {
				vVisionMode = pToken.sight.visionMode;
			}
			
			switch (vVisionMode) {
				case "lightAmplification":
					vVLevel = cVisionLevel.LowLight;
				case "darkvision":
					vVLevel = cVisionLevel.Dark;
					break;
				case "blindsight":
				case "truesight":
				case "devilsSight":
					vVLevel = cVisionLevel.TotalDark;
					break;
			}
		}
		
		//document._source.sight.visionMode
		
		return vVLevel;
	}
	
	static LightingLevel(pPoint, pScene = null) {
		//start value Darkness
		let vLightningLevel = cLightLevel.Dark;
		
		let vScene = pScene;
		
		if (!vScene) {
			vScene = canvas.scene;
		}
		
		if (vScene) {
			if (vScene.darkness < PerceptiveFlags.SceneBrightEnd(vScene)/*cDimInterval[0]*/) {
				vLightningLevel = cLightLevel.Bright;
			}
			else {
				if (vScene.darkness < PerceptiveFlags.SceneDimEnd(vScene)/*cDimInterval[1]*/) {
					vLightningLevel = cLightLevel.Dim;
				}
				
				let vrelevantLightSources = vScene.lights.filter(vDocument => vDocument._object?.source.shape?.contains(pPoint.x, pPoint.y));
				
				if (vrelevantLightSources.length > 0) {
					//at least Dim
					vLightningLevel = cLightLevel.Dim;
					
					if (vrelevantLightSources.find(vDocument => GeometricUtils.DistanceXY(pPoint, vDocument)/(canvas.scene.dimensions.size)*(canvas.scene.dimensions.distance) < vDocument.config.bright)) {
						//is Bright
						vLightningLevel = cLightLevel.Bright;
					}
				}
			}
		}
		
		return vLightningLevel;
	}
	
	static correctedLightLevel(pLightLevel, pVisionLevel) {
		let vValue = pLightLevel;
		
		if (vValue < 0) {
			return vValue;
		}
		
		switch (pVisionLevel) {
			case cVisionLevel.LowLight: //Pf2e rules
				if (vValue == cLightLevel.Dim) {
					vValue = cLightLevel.Bright;
				}
				break;
			case cVisionLevel.Dark: //D&D rules
				if (vValue < cLightLevel.Bright) {
					vValue = vValue + 1;
				}
				break;
			case cVisionLevel.TotalDark: //Pf2e rules
				if (vValue < cLightLevel.Bright) {
					vValue = cLightLevel.Bright;
				}
				break;
		}
		
		return vValue;
	}
	
	static LightingPDCModifier(pLightLevel) {
		if (pLightLevel < 0) {
			return 0;
		}
		
		let vModifier = game.settings.get(cModuleName, "IlluminationPDCModifier")[Math.max(0, pLightLevel-1)];
		
		return Number(vModifier);
	}
	
	static LightingPDCModifierToken(pToken, pVisionLevel = 0) {
		if (!game.settings.get(cModuleName, "IlluminationPDCModifier").find(vValue != 0)) {
			return 0;
		}
		else {
			return VisionUtils.LightingPDCModifier(VisionUtils.correctedLightLevel(VisionUtils.LightingLevel(pToken, pToken.parent), pVisionLevel));
		}
	}
	
	static LightingAPDCBehaviour(pLightLevel, pVisionLevel = 0) {
		let vBehaviour = game.settings.get(cModuleName, "IlluminationAPDCBehaviour")[Math.max(0, VisionUtils.correctedLightLevel(pLightLevel, pVisionLevel)-1)];
		
		return vBehaviour;		
	}
	
	static LightingAPDCBehaviourToken(pToken, pVisionLevel = 0) {
		return VisionUtils.LightingAPDCBehaviour(VisionUtils.correctedLightLevel(VisionUtils.LightingLevel(pToken, pToken.parent), pVisionLevel));
	}	
}

export { VisionUtils }