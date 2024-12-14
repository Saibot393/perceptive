import {PerceptiveUtils, cModuleName, Translate, TranslateandReplace} from "./utils/PerceptiveUtils.js";
import {VisionUtils, cLightLevel} from "./utils/VisionUtils.js";
import {vDCVisionFunctions, vTokenVisionFunctions, vTileVisionFunctions} from "./helpers/BasicPatches.js";
import {PerceptiveSystemUtils} from "./utils/PerceptiveSystemUtils.js";
import {GeometricUtils } from "./utils/GeometricUtils.js";
import {PerceptiveFlags } from "./helpers/PerceptiveFlags.js";
import {EffectManager } from "./helpers/EffectManager.js";
import {PerceptiveCompUtils, cLibWrapper } from "./compatibility/PerceptiveCompUtils.js";
import {cPf2eAPDCautomationTypes } from "./utils/PerceptiveSystemUtils.js";
import {PerceptivePopups} from "./helpers/PerceptivePopups.js";
import {PerceptiveSound} from "./helpers/PerceptiveSound.js";

const cIconDark = "fa-regular fa-circle";
const cIconDim = "fa-solid fa-circle-half-stroke";
const cIconBright = "fa-solid fa-circle";

const cStealthIcon = "fa-solid fa-user-ninja";
const cnotStealthIcon = "fa-solid fa-user";

//bunch of variables for the sake of performance/simplicity
var vLocalVisionData = {
	vlastPPvalue : 0,
	vlastVisionLevel : 0,
	vlastDisposition : 0,
	vSimulatePlayerVision : false,
	vSpottingRange : Infinity,
	vSpottingConeRange : 0,
	vSpottingConeRotation : 0,
	vActiveRange : false,
	vPassiveRange : false,
	vCritType : 0,
	vPf2eRules : false,
	vUseRangeTollerance : false,
	vPPModifiers : {},
	vRangeDCInterval : 0,
	vRangeDCModifier : 0,
	v3DRange : false,
	vGMVision : false
}

var vPingIgnoreVisionCycles = 2;

const cVisibleNameModes = [30, 50];

class SpottingManager {
	//DECLARATIONS
	static DControlSpottingVisible(pDoorControl) {} //returns wether this pDoorControl is visible thrrough spotting

	static TokenSpottingVisible(pToken, pInfos = {}) {} //returns wether this pToken is visible through spotting
	
	static TileSpottingVisible(pTile) {} //returns wether this pTile is visible through spotting
	
	static CheckTilesSpottingVisible(pIgnoreNewlyVisible = false){} //rechecks the visibility of all spottable tiles in the canvas

	static async updateVisionValues(pIgnoreNewlyVisibleTiles = false) {} //retruns the passive perception value of pToken

	static async CheckAPerception(pSpotters, pResults, pInfos = {isLingeringAP : false, SourceRollBehaviour : 0, Skill : ""}) {} //starts an active perception check
	
	static RemoveLingeringAP(pTokens, pPopup = true) {} //removes the lingering AP from pToken
	
	static async SpotObjectsinVision(pCategory = {Walls : false, Tokens : false, Tiles : false}) {} //requests from the gm to spot all specified objects in vision

	static async SpotObjectsGM(pObjects, pSpotters, pInfos) {} //sets pObjects to be spotted by pSpotters

	static async RequestSpotObjects(pObjects, pSpotters, pInfos) {} //starts a request for pSpotters to spot pObjects

	static async SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {} //handles a request for pSpotterIDs to spot pObjectIDs in pSceneID

	static async PlayerMakeTempVisible(pPlayerID, pObjectIDs, pInfos = {}) {} //call to let Player make the Objects temp visible

	static async resetStealthData(pObjects, pInfos) {} //resets the stealth data of pObject, including removing effects (or chaning them)
	
	static RequestresetStealth(pObjects, pInfos) {} //starts a request to reset stealth of pObject
	
	static resetStealthRequest(pObjectID, pSceneID, pInfos) {} //answers a request to reset stealth

	static resetStealthDataSelected() {} //resets the stealth data of selected tokens (if owned)
	
	static toggleDoorState(pWalls, pInfos) {} //opens/closses specified door
	
	static RequestToggleDoorState(pWalls, pInfos) {} //request to toggle pWalls door state
	
	static toggleDoorStateRequest(pObjectID, pSceneID, pInfos) {} //answers a request for toggeling the doorstate

	static isSpottedby(pObject, pSpotter,  pChecks = {LOS : false, Range : true, Effects : true, canbeSpotted : true}) {} //returns of pObject is spotted by pSpotter
	
	//ui
	static async addPerceptiveHUD(pHUD, pHTML, pToken) {} //adds a illumination state icon to the HUd of pToken

	static openSpottingDialoge(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {} //opens a spotting dialoge for the GM to accept spotting of certain spottables

	//ons
	static async onTokenupdate(pToken, pchanges, pInfos) {}//called when a token is updated
	
	static oncreateCombatant(pCombatant, pInfos, pUserID) {} //called when a combatant is created 
	
	static onTokenpreupdate(pToken, pchanges, pInfos) {}//called pre update token

	static async onChatMessage(pMessage, pInfos, pSenderID) {} //called when a chat message is send

	static async onPerceptionRoll(pActor, pRoll, pUserID, pReplaceSkill = "") {} //called when a perception roll is rolled

	static onNewlyVisible(pObjects, pInfos = {PassivSpot : false}, pSpotters = canvas.tokens.controlled.map(vToken => vToken.document)) {} //called when a new object is revealed
	
	//static onPerceptiveEffectdeletion(pEffect, pInfos, pUserID, pActor) {} //called when an effect marked as perceptive effect is deleted

	static async onStealthRoll(pActor, pRoll) {} //called when a stealth roll is rolled
	
	static async onStealthRollPf2e(pActor, pRoll, pType) {} //called when a pf2e stealth roll is rolled

	static onWallUpdate(pWall, pChanges, pInfos, pSender) {} //called when a wall is updates

	static onrefreshToken(pToken, pInfos) {} //called when a token is refreshed
	
	static onsightRefresh() {} //called when sight is refreshed

	static onDoorLClick(pWall, pKeyInfo) {} //called when a door control is left clicked

	static onCanvasReady(pCanvas) {} //called when a canvas is ready

	static async initializeVisionSources(pData) {} //called when new vision sources are initialized
	
	//support
	static inCurrentVisionRange(pSpotters, pObject, pSettings = {RangeReplacement : undefined, Tolerance : undefined}, pInfos = undefined) {} //returns if pObject is in vision range of one of pSpotters

	//IMPLEMENTATIONS
	static DControlSpottingVisible(pDoorControl) { //modified from foundry.js
		let vWallObject = pDoorControl.wall;
		
		if (vWallObject) {
			if (!PerceptiveFlags.canbeSpotted(vWallObject.document)) return false;
			
			let vTolerance;
			let vCustomRange;
		
			if (vLocalVisionData.vRangeDCModifier || vLocalVisionData.vPassiveRange || vCustomRange) {
				if (vLocalVisionData.vUseRangeTollerance) {
					vTolerance = {PointTolerance : 0};
				}
								
				if (PerceptiveFlags.HasSpottingRange(vWallObject.document)) {
					vCustomRange = {Range : PerceptiveFlags.SpottingRange(vWallObject.document)};
				}		
			}
			
			let vRangeInfo = {};
			
			let vSpotPoint = pDoorControl.center;
			
			if (vLocalVisionData.v3DRange) {
				vSpotPoint = {...vSpotPoint, elevation : VisionUtils.objectelevation(vWallObject.document)}
			}
			
			if (vLocalVisionData.vRangeDCModifier && !SpottingManager.inCurrentVisionRange(PerceptiveUtils.selectedTokens(), vSpotPoint, {Tolerance : vTolerance, RangeReplacement : vCustomRange}, vRangeInfo)) {
				//performance reason (vLocalVisionData.vRangeDCModifier)
				if ((vLocalVisionData.vPassiveRange || vCustomRange)) {
					return false;
				}
			}
			
			let vRangeDCModifier = VisionUtils.RangeDCModifier(vRangeInfo, vLocalVisionData.vRangeDCInterval, vLocalVisionData.vRangeDCModifier);
			
			if (PerceptiveFlags.canbeSpottedwith(pDoorControl.wall.document, PerceptiveUtils.selectedTokens(), vLocalVisionData.vlastVisionLevel, vLocalVisionData.vlastPPvalue + vLocalVisionData.vPPModifiers.Wall, vRangeDCModifier)) {
				// Hide secret doors from players
				//const w = vWallObject;
				//if ( (w.document.door === CONST.WALL_DOOR_TYPES.SECRET) && !game.user.isGM ) return false;
				
				if (!vLocalVisionData.vRangeDCModifier && (vLocalVisionData.vPassiveRange || vCustomRange) && !SpottingManager.inCurrentVisionRange(PerceptiveUtils.selectedTokens(), vSpotPoint, {Tolerance : vTolerance, RangeReplacement : vCustomRange})) {
					return false;
				}

				// Test two points which are perpendicular to the door midpoint
				/*
				const ray = w.toRay();
				const [x, y] = w.midpoint;
				const [dx, dy] = [-ray.dy, ray.dx];
				const t = 3 / (Math.abs(dx) + Math.abs(dy)); // Approximate with Manhattan distance for speed
				const points = [
				  {x: x + (t * dx), y: y + (t * dy)},
				  {x: x - (t * dx), y: y - (t * dy)}
				];

				// Test each point for visibility
				return points.some(p => {
					return canvas.effects.visibility.testVisibility(p, {object: pDoorControl, tolerance: 0});
				});
				*/
				
				return VisionUtils.simpletestVisibility(vWallObject.midpoint, {tolerance: 0, object: pDoorControl, ray : true});
			}
		}

		return false;
	}

	static TokenSpottingVisible(pToken, pInfos = {}) { //modified from foundry.js
		// Clear the detection filter
		pToken.detectionFilter = undefined;

		// Some tokens are always visible
		if ( pToken.controlled ) return true;
		//or invisible
		if (!PerceptiveFlags.canbeSpotted(pToken.document)) return false;

		pInfos.CritMode = vLocalVisionData.vCritType;
		pInfos.Pf2eRules = vLocalVisionData.vPf2eRules && cPf2eAPDCautomationTypes.includes(pToken.actor?.type);
		
		let vTolerance;
		let vCustomRange;
		
		if (vLocalVisionData.vRangeDCModifier || vLocalVisionData.vPassiveRange || vCustomRange) {
			if (vLocalVisionData.vUseRangeTollerance) {
				vTolerance = {PointTolerance : Math.max(pToken.width, pToken.height)/2};
			}
							
			if (PerceptiveFlags.HasSpottingRange(pToken.document)) {
				vCustomRange = {Range : PerceptiveFlags.SpottingRange(pToken.document)};
			}		
		}
		
		let vRangeInfo = {};
		
		let vSpotPoint = pToken.center;
		
		if (vLocalVisionData.v3DRange) {
			vSpotPoint = {...vSpotPoint, elevation : VisionUtils.objectelevation(pToken.document)}
		}
		
		if (vLocalVisionData.vRangeDCModifier && !SpottingManager.inCurrentVisionRange(PerceptiveUtils.selectedTokens(), vSpotPoint, {Tolerance : vTolerance, RangeReplacement : vCustomRange}, vRangeInfo)) {
			//performance reason (vLocalVisionData.vRangeDCModifier)
			if ((vLocalVisionData.vPassiveRange || vCustomRange)) {
				return false;
			}
		}
		
		let vRangeDCModifier = VisionUtils.RangeDCModifier(vRangeInfo, vLocalVisionData.vRangeDCInterval, vLocalVisionData.vRangeDCModifier);

		if ( PerceptiveFlags.canbeSpottedwith(pToken.document, PerceptiveUtils.selectedTokens(), vLocalVisionData.vlastVisionLevel, vLocalVisionData.vlastPPvalue + vLocalVisionData.vPPModifiers.Token, vRangeDCModifier, pInfos) ) {
			// Otherwise, test visibility against current sight polygons
			if (!vLocalVisionData.vRangeDCModifier && (vLocalVisionData.vPassiveRange || vCustomRange) && !SpottingManager.inCurrentVisionRange(PerceptiveUtils.selectedTokens(), vSpotPoint, {Tolerance : vTolerance, RangeReplacement : vCustomRange})) {
				return false;
			}
				
			if ( canvas.effects.visionSources.get(pToken.sourceId)?.active ) return true;
			const tolerance = Math.min(pToken.w, pToken.h) / 4;
			//return canvas.effects.visibility.testVisibility(pToken.center, {tolerance, object: pToken});
			return VisionUtils.simpletestVisibility(pToken.center, {tolerance, object: pToken});
		}

		return false;
	}
	
	static TileSpottingVisible(pTile) {
		if (game.release.generation >= 12) {
			if ( !canvas.visibility.tokenVision ) return true;
		}
		else {
			if ( !canvas.effects.visibility.tokenVision ) return true;
		}
		if (!PerceptiveFlags.canbeSpotted(pTile.document)) return false;
		
		let vTolerance;
		let vCustomRange;
		
		if (vLocalVisionData.vRangeDCModifier || vLocalVisionData.vPassiveRange || vCustomRange) {
			if (vLocalVisionData.vUseRangeTollerance) {
				if (pTile.mesh) {
					vTolerance = {PointTolerance : Math.max(pTile.mesh.width, pTile.mesh.height)/2};
				}
				else {
					vTolerance = {PointTolerance : Math.max(pTile.width, pTile.height)/2};
				}
			}
							
			if (PerceptiveFlags.HasSpottingRange(pTile.document)) {
				vCustomRange = {Range : PerceptiveFlags.SpottingRange(pTile.document)};
			}			
		}
		
		let vRangeInfo = {};
		
		let vSpotPoint = pTile.center;
		
		if (vLocalVisionData.v3DRange) {
			vSpotPoint = {...vSpotPoint, elevation : VisionUtils.objectelevation(pTile.document)}
		}
		
		if (vLocalVisionData.vRangeDCModifier && !SpottingManager.inCurrentVisionRange(PerceptiveUtils.selectedTokens(), vSpotPoint, {Tolerance : vTolerance, RangeReplacement : vCustomRange}, vRangeInfo)) {
			//performance reason (vLocalVisionData.vRangeDCModifier)
			if ((vLocalVisionData.vPassiveRange || vCustomRange)) {
				return false;
			}
		}
		
		let vRangeDCModifier = VisionUtils.RangeDCModifier(vRangeInfo, vLocalVisionData.vRangeDCInterval, vLocalVisionData.vRangeDCModifier);
		
		if ( PerceptiveFlags.canbeSpottedwith(pTile.document, PerceptiveUtils.selectedTokens(), vLocalVisionData.vlastVisionLevel, vLocalVisionData.vlastPPvalue + vLocalVisionData.vPPModifiers.Tile, vRangeDCModifier) ) {
			// Otherwise, test visibility against current sight polygons
			
			if (!vLocalVisionData.vRangeDCModifier && (vLocalVisionData.vPassiveRange || vCustomRange) && !SpottingManager.inCurrentVisionRange(PerceptiveUtils.selectedTokens(), vSpotPoint, {Tolerance : vTolerance, RangeReplacement : vCustomRange})) {
				return false;
			}
				
			let tolerance;
			
			if (pTile.mesh) {
				tolerance = Math.min(pTile.mesh.width, pTile.mesh.height) / 4;
			}
			else {
				tolerance = Math.min(pTile.width, pTile.height) / 4;
			}
			
			return VisionUtils.simpletestVisibility(pTile.center, {tolerance, object: pTile});
			//return true;
		}

		return false;		
	}
	
	static CheckTilesSpottingVisible(pIgnoreNewlyVisible = false){
		let vTiles = canvas.tiles.placeables.map(vTile => vTile.document).filter(vTile => vTile.hidden && PerceptiveFlags.canbeSpotted(vTile));
		
		let vPrevVisible;
		
		let vSelectedTokens = PerceptiveUtils.selectedTokens();
		
		for (let i = 0; i < vTiles.length; i++) {
			if (vSelectedTokens.length > 0) {
				vPrevVisible = 	vTiles[i].object?.visible;

				vTiles[i].object.visible = SpottingManager.TileSpottingVisible(vTiles[i].object);
				
				if (vTiles[i].object.visible && !vPrevVisible && !pIgnoreNewlyVisible) {
					SpottingManager.onNewlyVisible([vTiles[i]], {PassivSpot : true});
				}
			}
			else {
				vTiles[i].object.visible = game.user.isGM;
			}
		}
	}

	static async updateVisionValues(pIgnoreNewlyVisibleTiles = false) {
		if (!game.user.isGM || game.settings.get(cModuleName, "SimulatePlayerVision")) {
			vLocalVisionData.vGMVision = false;
			
			let vTokens = PerceptiveUtils.selectedTokens();

			let vBuffer;

			vLocalVisionData.vlastVisionLevel = Math.max(vTokens.map(vToken => VisionUtils.VisionLevel(vToken)));
			vLocalVisionData.vlastDisposition = Math.max(vTokens.map(vToken => vToken.disposition));

			vLocalVisionData.vlastPPvalue = 0;
			for (let i = 0; i < vTokens.length; i++) {
				vBuffer = await VisionUtils.PassivPerception(vTokens[i]);

				if (vBuffer > vLocalVisionData.vlastPPvalue) {
					vLocalVisionData.vlastPPvalue = vBuffer;
				}
			}
			
			vLocalVisionData.vPPModifiers = { //Add AE modifiers
				Wall: Math.max(vTokens.map(vToken => PerceptiveFlags.getPerceptionAEBonus(vToken, "Wall", "passive"))),
				Token: Math.max(vTokens.map(vToken => PerceptiveFlags.getPerceptionAEBonus(vToken, "Token", "passive"))),
				Tile: Math.max(vTokens.map(vToken => PerceptiveFlags.getPerceptionAEBonus(vToken, "Tile", "passive")))
			}
			
			if (game.user.isGM) {
				vLocalVisionData.vSimulatePlayerVision = true;
			}
			
			//burst
			if (game.settings.get(cModuleName, "SpottingRange") < 0) {
				vLocalVisionData.vSpottingRange = Infinity;
			}
			else {
				vLocalVisionData.vSpottingRange = game.settings.get(cModuleName, "SpottingRange")*(canvas.scene.dimensions.size)/(canvas.scene.dimensions.distance);
			}
			
			//cone
			if (game.settings.get(cModuleName, "SpottingConeRange") < 0) {
				vLocalVisionData.vSpottingConeRange = 0;
			}
			else {
				vLocalVisionData.vSpottingConeRange = game.settings.get(cModuleName, "SpottingConeRange")*(canvas.scene.dimensions.size)/(canvas.scene.dimensions.distance);
			}
			
			vLocalVisionData.vSpottingConeRotation = game.settings.get(cModuleName, "StandardVisionDirection");
			
			vLocalVisionData.vCritType = PerceptiveUtils.CritType();
			
			vLocalVisionData.vPf2eRules = game.settings.get(cModuleName, "UsePf2eRules");
			
			let vInCombatRange = (game.settings.get(cModuleName, "ApplyRange") == "incombatonly") && vTokens.find(vToken => vToken.actor?.inCombat); //if vision range is on because of combat
			let vOutCombatRange = (game.settings.get(cModuleName, "ApplyRange") == "outcombatonly") && !vTokens.find(vToken => vToken.actor?.inCombat); //if vision range is on because of combat
			
			vLocalVisionData.vActiveRange = vInCombatRange || vOutCombatRange || ["always", "activeonly"].includes(game.settings.get(cModuleName, "ApplyRange"));
			vLocalVisionData.vPassiveRange = vInCombatRange || vOutCombatRange || ["always", "passiveonly"].includes(game.settings.get(cModuleName, "ApplyRange"));
			
			vLocalVisionData.vUseRangeTollerance = game.settings.get(cModuleName, "UseBordertoBorderRange");
			
			vLocalVisionData.vRangeDCModifier = Number(game.settings.get(cModuleName, "RangePDCModifier").split("/")[0]);
			vLocalVisionData.vRangeDCInterval = Number(game.settings.get(cModuleName, "RangePDCModifier").split("/")[1])*(canvas.scene.dimensions.size)/(canvas.scene.dimensions.distance);
			
			if (isNaN(vLocalVisionData.vRangeDCModifier)) {
				vLocalVisionData.vRangeDCModifier = 0;
			}
			
			if (isNaN(vLocalVisionData.vRangeDCInterval)) {
				vLocalVisionData.vRangeDCInterval = 0;
			}	

			vLocalVisionData.v3DRange = game.settings.get(cModuleName, "Range3DCalculation");
		}
		else {
			vLocalVisionData.vGMVision = true;
			
			vLocalVisionData.vlastPPvalue = Infinity;

			vLocalVisionData.vlastVisionLevel = 3;
			
			vLocalVisionData.vSpottingConeRange = Infinity;
			
			vLocalVisionData.vPPModifiers = { //Add AE modifiers
				Wall: 0,
				Token: 0,
				Tile: 0
			}
		}
		
		//SpottingManager.CheckTilesSpottingVisible(pIgnoreNewlyVisibleTiles);
		
		if (CONFIG.debug.perceptive.SpottingScript) {//DEBUG
			console.log("perceptive: New vision data:", vLocalVisionData);
		}
	}
	
	static async CheckAPerception(pSpotters, pResults,  pInfos = {isLingeringAP : false, SourceRollBehaviour : 0, Skill : ""}) {
		if (pSpotters.length > 0 && pResults.length > 0) {
			let vSpotables = VisionUtils.spotablesinVision();
			
			//filter out already spotted
			if (game.settings.get(cModuleName, "UsePf2eRules")) {
				//in Pf2e hidden tokens are also spottable, even if already spotted
				vSpotables = vSpotables.filter(vObject => !PerceptiveFlags.isSpottedbyone(vObject, pSpotters) || PerceptiveSystemUtils.StealthStatePf2e(vObject) == "hide");
			}
			else {
				vSpotables = vSpotables.filter(vObject => !PerceptiveFlags.isSpottedbyone(vObject, pSpotters));
			}	

			vSpotables = vSpotables.filter(vSpottable => !pSpotters.includes(vSpottable));
					
			//prepare data
			let vSpotted = [];
			
			let vRollBehaviours = {};
			
			let vTokenSuccessDegrees = {};
			
			let vTokenSpotted = {};
			
			//buffers
			let vCurrentRollbehaviour;
			
			let vResultBuffer;
			
			let vADC;
			
			let vSuccessDegree;
			
			let vSpotPoint;
			
			for (let i = 0; i < vSpotables.length; i++) {
				
				let vTolerance;
				
				if (vLocalVisionData.vUseRangeTollerance) {
					switch (vSpotables[i].documentName) {
						case "Token":
							vTolerance = {PointTolerance : Math.max(vSpotables[i].object.width, vSpotables[i].object.height)/2};
							break;
						case "Tile":
							if (vSpotables[i].object.mesh) {
								vTolerance = {PointTolerance : Math.max(vSpotables[i].object.mesh.width, vSpotables[i].object.mesh.height)/2};
							}
							else {
								vTolerance = {PointTolerance : Math.max(vSpotables[i].object.width, vSpotables[i].object.height)/2};
							}
						default:
							vTolerance = {PointTolerance : 0};
					}
				}
					
				if (PerceptiveFlags.HasSpottingRange(vSpotables[i])) {
					if(!pInfos.Ranges) {
						pInfos.Ranges = {};
					}
					
					pInfos.Ranges.Range = PerceptiveFlags.SpottingRange(vSpotables[i]);
				}
				else {
					pInfos.Ranges = undefined;
				}
						
				if (CONFIG.debug.perceptive.SpottingScript) {//DEBUG
					console.log("perceptive: Range Check AP:", vSpotables[i].object.center, {RangeReplacement : pInfos.Ranges, Tolerance : vTolerance}, vLocalVisionData);
				}
		
				let vRangeInfo = {visionPoint : pInfos.visionPoint};
				
				let vInRange = false;
				
				if (vLocalVisionData.vRangeDCModifier || vLocalVisionData.vActiveRange || pInfos.Ranges) {
					vSpotPoint = vSpotables[i].object.center;
					
					if (vLocalVisionData.v3DRange) {
						vSpotPoint = {...vSpotPoint, elevation : VisionUtils.objectelevation(vSpotables[i])}
					}				
	
					vInRange = SpottingManager.inCurrentVisionRange(PerceptiveUtils.selectedTokens(), vSpotPoint, {RangeReplacement : pInfos.Ranges, Tolerance : vTolerance}, vRangeInfo);
				}
				
				if ((!vLocalVisionData.vActiveRange && !pInfos.Ranges) || vInRange) {	
					vCurrentRollbehaviour = PerceptiveFlags.getAPRollBehaviour(vSpotables[i], vLocalVisionData.vlastVisionLevel);
					
					vCurrentRollbehaviour = PerceptiveUtils.AddRollBehaviour(vCurrentRollbehaviour, pInfos.SourceRollBehaviour);

					vCurrentRollbehaviour = PerceptiveUtils.AddRollBehaviour(vCurrentRollbehaviour, Math.max(pSpotters.map(vSpotter => PerceptiveFlags.getPerceptionAEBehaviour(vSpotter, vSpotables[i].documentName, pInfos.Skill)))); //Add AE behaviour
					
					if (CONFIG.debug.perceptive.SpottingScript) {//DEBUG
						console.log("perceptive: Roll Behaviour:", vCurrentRollbehaviour, vSpotables[i]);
					}
			
					if (pResults.length > 1) {
						vResultBuffer = PerceptiveUtils.ApplyrollBehaviour(vCurrentRollbehaviour, pResults[0], pResults[1]);
					}
					else {
						vResultBuffer = pResults[0]
					}
					
					vADC = Number(PerceptiveFlags.getAPDCModified(vSpotables[i], vLocalVisionData.vlastVisionLevel, pInfos.Skill)) + Number(VisionUtils.RangeDCModifier(vRangeInfo, vLocalVisionData.vRangeDCInterval, vLocalVisionData.vRangeDCModifier));

					if (vADC < Infinity || !(pInfos.Skill?.length > 0)) {
						//only continue with objects spottable with this attribute unless it is a perception roll
						vSuccessDegree = PerceptiveUtils.successDegree(vResultBuffer, vADC, -1, Math.max(pSpotters.map(vSpotter => PerceptiveFlags.getPerceptionAEBonus(vSpotter, vSpotables[i].documentName, pInfos.Skill)))); //Add AE modifier

						if ((vSuccessDegree > 0) || (game.settings.get(cModuleName, "ShowfailuresinGMconfirm") && (vSpotables[i].documentName == "Token" || vSpotables[i].documentName == "Tile"))) {
							vSpotted.push(vSpotables[i]);
							
							if (vSpotables[i].documentName == "Token" || vSpotables[i].documentName == "Tile"){
								vRollBehaviours[vSpotables[i].id] = vCurrentRollbehaviour;
								
								vTokenSuccessDegrees[vSpotables[i].id] = vSuccessDegree;
								
								vTokenSpotted[vSpotables[i].id] = (vSuccessDegree > 0);
							}
						}
					}
				}
			}
			
			if (!pInfos.isLingeringAP && !pInfos.Skill) {
				for (let i = 0; i < pSpotters.length; i++) {
					if (game.settings.get(cModuleName, "LingeringAP") == "always" || (game.settings.get(cModuleName, "LingeringAP") == "outofcombatonly" && !pSpotters[i].inCombat)) {
						PerceptiveFlags.setLingeringAP(pSpotters[i], pResults, {Ranges : {...pInfos.Ranges},
																				SourceRollBehaviour : pInfos.SourceRollBehaviour,
																				Skill : pInfos.Skill,
																				RollPosition : {x : pSpotters[i].x, y : pSpotters[i].y},
																				UserSource : game.user.id,
																				WhisperonRemoval : game.settings.get(cModuleName, "WhisperLingeringAPremoval")});
						
						PerceptivePopups.TextPopUpID(pSpotters[i], "GainedLingeringAP") //MESSAGE POPUP
						
						if (game.settings.get(cModuleName, "LingeringAPDuration") > 0) {
							setTimeout(() => {SpottingManager.RemoveLingeringAP([pSpotters[i]])}, game.settings.get(cModuleName, "LingeringAPDuration") * 1000);
						}
					}
				}
			}

			let vInfos = 	{APerceptionResult : pResults[0],
							RolledSkill : pInfos.Skill,
							SecondResult : pResults[1], //used for adv/disadv
							RollBehaviours : vRollBehaviours,
							SourceRollBehaviour : pInfos.SourceRollBehaviour,
							TokenSuccessDegrees : vTokenSuccessDegrees, 
							TokenSpotted : vTokenSpotted,
							VisionLevel : vLocalVisionData.vlastVisionLevel, 
							sendingPlayer : game.user.id,
							isLingeringAP : pInfos.isLingeringAP,
							overrideVFilter : game.settings.get(cModuleName, "UsePf2eRules")};
							
			if (CONFIG.debug.perceptive.SpottingScript) {//DEBUG
				console.log("perceptive: Infos AP:", vInfos);
			}
							
			await SpottingManager.RequestSpotObjects(vSpotted, pSpotters, vInfos);

			Hooks.call(cModuleName + ".PerceptionCheck", vSpotted, pSpotters, vInfos);
		}
	}
	
	static RemoveLingeringAP(pTokens, pPopup = true) {
		let vChatMessage = ``;
		
		let vRemovals = 0;
		
		let vInfos = pTokens.map(pToken => PerceptiveFlags.LingeringAPInfo(pToken));
		
		for (let i = 0; i <= pTokens.length; i++) {
			if (PerceptiveFlags.hasLingeringAP(pTokens[i]) && pTokens[i].isOwner) {
				PerceptiveFlags.resetLingeringAP(pTokens[i]);
				
				vRemovals = vRemovals + 1;
				
				if (pPopup) {
					PerceptivePopups.TextPopUpID(pTokens[i], "RemovedLingeringAP") //MESSAGE POPUP
				}
				
				//chat message
				vChatMessage = vChatMessage + 	`<div class="form-group" style="display:flex;flex-direction:row;align-items:center;gap:1em"> `
				
				vChatMessage = vChatMessage	+   `<img src="${pTokens[i].texture.src}" style = "height: 2em;width : 2em">`;
				
				vChatMessage = vChatMessage + 	`<p>${TranslateandReplace("ChatMessage.LostLingeringAP", {pName : PerceptiveFlags.PerceptiveName(pTokens[i])})}</p>
												</div>`;
			}
		}
		
		if (vRemovals > 0) {
			let vRecipients = [];
			
			if (game.settings.get(cModuleName, "GMReciveInformationWhisper")) {
				vRecipients = vRecipients.concat(PerceptiveUtils.GMUserIDs());
			}
			
			for (let i = 0; i < vInfos.length; i++) {
				if (vInfos[i].WhisperonRemoval) {
					vRecipients.push(vInfos[i].UserSource);
				}
			}			
			
			ChatMessage.create({user: game.user.id, 
								content : vChatMessage,
								whisper : vRecipients});
		}
	}
	
	static async SpotObjectsinVision(pCategory = {Walls : false, Tokens : false, Tiles : false}) {
		let vSpotters = PerceptiveUtils.selectedTokens();
		
		if (vSpotters.length > 0) {
			let vSpotables = VisionUtils.spotablesinVision(null, pCategory);

			//filter out already spotted
			if (game.settings.get(cModuleName, "UsePf2eRules")) {
				//in Pf2e hidden tokens are also spottable, even if already spotted
				vSpotables = vSpotables.filter(vObject => !PerceptiveFlags.isSpottedbyone(vObject, vSpotters) || PerceptiveSystemUtils.StealthStatePf2e(vObject) == "hide");
			}
			else {
				vSpotables = vSpotables.filter(vObject => !PerceptiveFlags.isSpottedbyone(vObject, vSpotters));
			}	
					
			//prepare data
			let vSpotted = [];
			
			let vTokenSpotted = {};
			
			let vSpotPoint;
			
			for (let i = 0; i < vSpotables.length; i++) {
				
				let vTolerance;
				
				if (vLocalVisionData.vUseRangeTollerance) {
					if (vSpotables[i].documentName == "Token" || vSpotables[i].documentName == "Tile") {
						vTolerance = {PointTolerance : Math.max(vSpotables[i].object.width, vSpotables[i].object.height)/2};
					}
					else {
						vTolerance = {PointTolerance : 0};
					}
				}
						
				vSpotPoint = vSpotables[i].object.center;
				
				if (vLocalVisionData.v3DRange) {
					vSpotPoint = {...vSpotPoint, elevation : VisionUtils.objectelevation(vSpotables[i])}
				}
					
				if ((!vLocalVisionData.vActiveRange /*&& !pInfos.Ranges*/) || SpottingManager.inCurrentVisionRange(PerceptiveUtils.selectedTokens(), vSpotables[i].object.center, {RangeReplacement : undefined/*pInfos.Ranges*/, Tolerance : vTolerance})) {			
					vSpotted.push(vSpotables[i]);
					
					if (vSpotables[i].documentName == "Token" || vSpotables[i].documentName == "Tile"){
						vTokenSpotted[vSpotables[i].id] = false;
					}
				}
			}

			let vInfos = 	{TokenSpotted : vTokenSpotted,
							sendingPlayer : game.user.id,
							forceConfirmDialog : true};
							
			await SpottingManager.RequestSpotObjects(vSpotted, vSpotters, vInfos);

			//Hooks.call(cModuleName + ".PerceptionCheck", vSpotted, pSpotters, vInfos);
		}		
	}

	static async SpotObjectsGM(pObjects, pSpotters, pInfos) {
		let vSpottables = pObjects.filter(vObject => PerceptiveFlags.canbeSpotted(vObject));
		
		vSpottables = vSpottables.filter(vObject => !(vObject.documentName == "Token" || vObject.documentName == "Tile") || pInfos.TokenSpotted[vObject.id]);

		if (game.release.generation >= 12) {
			for (let i = 0; i < pSpotters.length; i++) {
				for(let j = 0; j < vSpottables.length; j++) {
					await PerceptiveFlags.addSpottedby(vSpottables[j], pSpotters[i]);
				}
			}
		}

		if (pInfos.sendingPlayer == game.user.id) {
			pInfos.GMSpotting = true;
			SpottingManager.PlayerMakeTempVisible(game.user.id, vSpottables.map(vObject => vObject.id), pInfos);
		}
		else {
			game.socket.emit("module." + cModuleName, {pFunction : "PlayerMakeTempVisible", pData : {pPlayerID : pInfos.sendingPlayer, pObjectIDs : vSpottables.map(vObject => vObject.id), pInfos : pInfos}})
		}
		
		if (game.release.generation < 12) {
			for (let i = 0; i < pSpotters.length; i++) {
				for(let j = 0; j < vSpottables.length; j++) {
					await PerceptiveFlags.addSpottedby(vSpottables[j], pSpotters[i]);
				}
			}
		}
	}

	static async RequestSpotObjects(pObjects, pSpotters, pInfos) {
		let vObjectIDs = {	Walls : PerceptiveUtils.IDsfromWalls(pObjects.filter(vObject => vObject.documentName == "Wall")), 
							Tokens : PerceptiveUtils.IDsfromWalls(pObjects.filter(vObject => vObject.documentName == "Token")),
							Tiles : PerceptiveUtils.IDsfromWalls(pObjects.filter(vObject => vObject.documentName == "Tile"))};
		
		if (game.user.isGM) {
			if (["always"].includes(game.settings.get(cModuleName, "GMSpotconfirmDialogbehaviour")) || pInfos.forceConfirmDialog) {
				SpottingManager.openSpottingDialoge(vObjectIDs, PerceptiveUtils.IDsfromTokens(pSpotters), canvas.scene.id, pInfos);
			}
			else {
				await SpottingManager.SpotObjectsGM(pObjects, pSpotters, pInfos);
			}
		}
		else {
			if (!game.paused) {
				await game.socket.emit("module." + cModuleName, {pFunction : "SpotObjectsRequest", pData : {pSceneID : canvas.scene.id, pObjectIDs : vObjectIDs, pSpotterIDs : PerceptiveUtils.IDsfromTokens(pSpotters), pInfos : pInfos}});
			}
			else {
				pSpotters.forEach(vSpotter => PerceptivePopups.TextPopUpID(vSpotter, "GamePaused")); //MESSAGE POPUP
			}
		}
	}

	static async SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {
		if (game.user.isGM) {
			if (["playersonly", "always"].includes(game.settings.get(cModuleName, "GMSpotconfirmDialogbehaviour")) || pInfos.forceConfirmDialog) {
				SpottingManager.openSpottingDialoge(pObjectIDs, pSpotterIDs, pSceneID, pInfos);
			}
			else {
				let vScene = game.scenes.get(pSceneID);
				let vObjects = PerceptiveUtils.WallsfromIDs(pObjectIDs.Walls, vScene).concat(PerceptiveUtils.TokensfromIDs(pObjectIDs.Tokens.concat(pObjectIDs.Tiles), vScene));
				
				await SpottingManager.SpotObjectsGM(vObjects, PerceptiveUtils.TokensfromIDs(pSpotterIDs, game.scenes.get(pSceneID)), pInfos);
			}
		}
	}

	static async PlayerMakeTempVisible(pPlayerID, pObjectIDs, pInfos = {}) {
		if (game.user.id == pPlayerID) {
			let vSpotables = VisionUtils.spotablesinVision();
			
			let vControlled = canvas.tokens.controlled.map(vtoken => vtoken.document);

			vSpotables = vSpotables.filter(vObject => pObjectIDs.includes(vObject.id));
			
			await SpottingManager.onNewlyVisible(vSpotables.filter(vObject => pInfos.overrideVFilter || (pInfos.GMspotting && game.user.isGM && !vObject?.object?.controlled) || !vControlled.find(vSpotter => PerceptiveFlags.isSpottedby(vObject, vSpotter)) || !((vObject?.object?.visible && (vObject.documentName == "Token" || vObject.documentName == "Tile")) || vObject?.object?.doorControl?.visible)), pInfos);
		
			VisionUtils.MaketempVisible(vSpotables);
		}
	}

	static async resetStealthData(pObjects, pInfos) {
		let vResetallStealthValues = true; //if all data should be reseted, otherwise only spotted by
		
		for (let i = 0; i < pObjects.length; i++) {
			if (pObjects[i]) {
				switch (pObjects[i].documentName) {
						case "Token":
							if (game.settings.get(cModuleName, "UsePf2eRules")) {
								let vEffectInfos = {};
								
								let vPreviousState = PerceptiveSystemUtils.StealthStatePf2e(pObjects[i], vEffectInfos);
								
								let vPreviousFormula = PerceptiveFlags.EffectInfos(vEffectInfos.sneakEffect)?.RollFormula;
								if ((vPreviousState == "sneak") && ((!pInfos.PassivSpot && pInfos.TokenSuccessDegrees[pObjects[i].id] == 1) || (pInfos.PassivSpot && pInfos.TokenSuccessDegrees[pObjects[i].id] == 0))) {
									//only normal failure/success, replace sneak with stealth
									vResetallStealthValues = false;
									
									await EffectManager.applyStealthEffects(pObjects[i], {Type : "hide", EffectInfos : {RollFormula : vPreviousFormula}});
								}
								else {
									//remove all effects
									await EffectManager.removeStealthEffects(pObjects[i]);
								}
							}
							else {
								await EffectManager.removeStealthEffects(pObjects[i]);
							}
							
							if (pObjects[i].hidden) {
								pObjects[i].update({hidden: false});
							}
							
							break;
						case "Tile":
							if (pObjects[i].hidden) {
								pObjects[i].update({hidden: false});
							}
							
							break;							
						case "Wall":
							if (pObjects[i].door == 2) {
								//is secret door
								pObjects[i].update({door : 1});
							}
							break;			
				}
		
				if (vResetallStealthValues && !pInfos.keepStealthValues) {
					PerceptiveFlags.resetStealth(pObjects[i]);
				}
				else {
					PerceptiveFlags.clearSpottedby(pObjects[i]);
				}
			}
		}
	}
	
	static RequestresetStealth(pObjects, pInfos) {
		let vObjectIDs = {};
		
		vObjectIDs.Tokens = pObjects.filter(vObject => vObject?.documentName == "Token").map(vToken => vToken.id);
		
		vObjectIDs.Walls = pObjects.filter(vObject => vObject?.documentName == "Wall").map(vWall => vWall.id);
		
		vObjectIDs.Tiles = pObjects.filter(vObject => vObject?.documentName == "Tile").map(vTile => vTile.id);
		
		if (game.user.isGM) {
			//SpottingManager.resetStealthData(pObjects, pInfos);
			SpottingManager.resetStealthRequest(vObjectIDs, canvas.scene.id, pInfos);
		}
		else {
			game.socket.emit("module." + cModuleName, {pFunction : "resetStealthRequest", pData : {pObjectIDs : vObjectIDs, pSceneID : canvas.scene.id, pInfos : pInfos}});
		}
	}
	
	static resetStealthRequest(pObjectIDs, pSceneID, pInfos) {
		if (game.user.isGM) {
			let vSettingPossible = game.settings.get(cModuleName, "MakeSpottedTokensVisible") == "always" || (pInfos.inCombat && game.settings.get(cModuleName, "MakeSpottedTokensVisible") == "incombatonly") || (!pInfos.inCombat && game.settings.get(cModuleName, "MakeSpottedTokensVisible") == "outcombatonly")

			let vObjects = [];
			
			vObjects = vObjects.concat(PerceptiveUtils.TokensfromIDs(pObjectIDs.Tokens.concat(pObjectIDs.Tiles), game.scenes.get(pSceneID)));
			
			vObjects = vObjects.concat(PerceptiveUtils.WallsfromIDs(pObjectIDs.Walls, game.scenes.get(pSceneID)));

			let vIndividualReveals = vObjects.filter(vObject => PerceptiveFlags.RevealwhenSpotted(vObject));

			if ((pInfos.Spotted && (vSettingPossible || vIndividualReveals.length > 0)) || (pInfos.DoorClicked)) {
				if (!vSettingPossible && !pInfos.DoorClicked) {
					vObjects = vIndividualReveals;
				}
				
				SpottingManager.resetStealthData(vObjects, pInfos);
			}
		}
	}

	static resetStealthDataSelected() {
		let vTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.isOwner);

		SpottingManager.resetStealthData(vTokens);
	}
	
	static toggleDoorState(pWalls, pInfos) {
		for (let vwall of pWalls) {
			vwall.update({ds : (vwall.ds + 1) % 2});
		}
	} 
	
	static RequestToggleDoorState(pWalls, pInfos) {
		if (game.user.isGM) {
			SpottingManager.toggleDoorState(pWalls, pInfos);
		}
		else {
			let vObjectIDs = {};
			
			game.socket.emit("module." + cModuleName, {pFunction : "toggleDoorState", pData : {pObjectIDs : pWalls.map(vwall => vwall.id), pSceneID : canvas.scene.id, pInfos : pInfos}});
		}
	}
	
	static toggleDoorStateRequest(pObjectID, pSceneID, pInfos) {
		if (game.user.isGM) {
			SpottingManager.resetStealthData(PerceptiveUtils.WallsfromIDs(pObjectIDs.Walls, game.scenes.get(pSceneID)), pInfos);
		}
	}
	
	static async isSpottedby(pObject, pSpotter, pChecks = {LOS : false, Range : true, Effects : true, Hidden : true, canbeSpotted : true}) {
		if (pObject && pSpotter && pSpotter.documentName == "Token") {
			if (!((pObject.parent.id == pSpotter.parent.id) || (pObject.wall.document.parent.id == pSpotter.parent.id))) {
				//different scenes
				return false;
			}
			
			if (pChecks.Effects) {
				if (!PerceptiveFlags.isPerceptiveStealthing(pObject) && !pObject.hidden && !pObject.actor?.effects.find(veffect => veffect.statuses.has("invisible")) && !(pChecks.Hidden && pObject.actor?.effects.find(veffect => veffect.statuses.has("hidden")))) {
					//no invisibility
					return true;
				}
			}
			
			if (pChecks.LOS) {
				if (!pSpotter.object?.los?.contains(pObject.center.x, pObject.center.y)) {
					//not in FOV
					return false;
				}
			}
			
			let vRangeInfo;
			let vRangeModifier = 0;
			
			if (pChecks.Range) {
				//check set vision range
				const cRangeFactor = (pSpotter.parent.dimensions.size)/(pSpotter.parent.dimensions.distance);
				
				let vRange;
				if (PerceptiveFlags.HasSpottingRange(pSpotter)) {
					vRange = PerceptiveFlags.SpottingRange(pSpotter)*cRangeFactor;
				}	
				else {
					vRange = game.settings.get(cModuleName, "SpottingRange")*cRangeFactor
				}
				
				if (vRange < 0) {
					vRange = Infinity;
				}
				
				let vSpotPoint = pObject.object.center;
				if (game.settings.get(cModuleName, "Range3DCalculation") && pObject.elevation != undefined) {
					vSpotPoint = {...vSpotPoint, elevation : pObject.elevation}
				}
				
				const cRangeDCModifier = Number(game.settings.get(cModuleName, "RangePDCModifier").split("/")[0]);
				const cRangeDCInterval = Number(game.settings.get(cModuleName, "RangePDCModifier").split("/")[1])*cRangeFactor;

				if (!VisionUtils.inVisionRange([pSpotter], vSpotPoint, vRange, game.settings.get(cModuleName, "SpottingConeRange")*cRangeFactor, pSpotter.rotation, 0, vRangeInfo)) {
					return false;
				}
				
				vRangeModifier = VisionUtils.RangeDCModifier(vRangeInfo, cRangeDCInterval, cRangeDCModifier);
			}
			
			//check illumination of pObject
			//await PerceptiveFlags.CheckLightLevel(pObject);
			
			//check if pObject can currently be spotted by pSpotter
			return Boolean(PerceptiveFlags.canbeSpottedwith(pObject, [pSpotter], VisionUtils.VisionLevel(pSpotter), await VisionUtils.PassivPerception(pSpotter), vRangeModifier, {CritMode : 0, TokenSuccessDegrees : {}, Pf2eRules : false, ignorecanbeSpotted : !pChecks.canbeSpotted}));
		}
		
		return false;
	}

	//ui
	static async addPerceptiveHUD(pHUD, pHTML, pToken) {
		let vToken = PerceptiveUtils.TokenfromID(pToken._id);
		
		//Illumination Indicator
		let vIlluminationPosition = game.settings.get(cModuleName, "IlluminationIconPosition");

		if (vIlluminationPosition != "none") {
			let vIlluminationIcon;

			if (vToken) await PerceptiveFlags.CheckLightLevel(vToken); //the given pToken is a bit of a dud, better recheck the real token
			
			switch (PerceptiveFlags.LightLevel(pToken)) {
				case cLightLevel.Dark:
					vIlluminationIcon = cIconDark;
					break;
				case cLightLevel.Dim:
					vIlluminationIcon = cIconDim;
					break;
				case cLightLevel.Bright:
					vIlluminationIcon = cIconBright;
					break;
			}

			let vButtonHTML = `<div class="control-icon" data-action="${cModuleName}-Illumination" title="${TranslateandReplace("Titles.SpottingInfos.LightLevel.name", {pLevel : Translate("Titles.SpottingInfos.LightLevel.value" + PerceptiveFlags.LightLevel(pToken))})}">
									<i class="${vIlluminationIcon}"></i>
							  </div>`;

			pHTML.find("div.col."+vIlluminationPosition).append(vButtonHTML);

			//vButton.click((pEvent) => {MountingManager.RequestToggleMount(RideableUtils.selectedTokens(), RideableUtils.TokenfromID(pToken._id))});
		}
		
		//Perceptive hidden "Effect"
		if (game.settings.get(cModuleName, "usePerceptiveStealthEffect")) {
			if (PerceptiveFlags.isPerceptiveStealthing(PerceptiveUtils.TokenfromID(pToken._id))) {
				pHTML.find(`div[class="status-effects"]`).append(`	<i class="${cStealthIcon} active" data-action="${cModuleName}-Stealth" title="${Translate("Titles.StopStealthing")}"></i>`);
			}
			else {
				pHTML.find(`div[class="status-effects"]`).append(`	<i class="${cnotStealthIcon}" data-action="${cModuleName}-Stealth" title="${Translate("Titles.StartStealthing")}"></i>`);
			}
			
			pHTML.find(`i[data-action="${cModuleName}-Stealth"]`).click(async (pEvent) => {	let vToken = PerceptiveUtils.TokenfromID(pToken._id);
																							await PerceptiveFlags.togglePerceptiveStealthing(vToken);
																							
																							if (game.settings.get(cModuleName, "syncEffectswithPerceptiveStealth")) {
																								if (PerceptiveFlags.isPerceptiveStealthing(vToken)) {
																									//EffectManager.applyStealthEffects(vToken);
																								}
																								else {
																									EffectManager.removeStealthEffects(vToken);
																								}
																							}
																							});
		}
		
		//lingering AP ui
		if (PerceptiveFlags.hasLingeringAP(pToken)) {
			//Perceptive lingering AP indicator
			let vLingeringAPPosition = game.settings.get(cModuleName, "LingeringAPIconPosition");

			if (vLingeringAPPosition != "none") {
				let vPositionDIV = pHTML[0].querySelector("div.col."+vLingeringAPPosition);
				
				let vLingeringDIV = document.createElement("div");
				vLingeringDIV.classList.add("control-icon");
				vLingeringDIV.setAttribute("data-action", `${cModuleName}-LingeringAP`);
				vLingeringDIV.title = Translate("Titles.SpottingInfos.LingeringAP");
				
				let vLingeringInput = document.createElement("input");
				vLingeringInput.type = "number";
				vLingeringInput.value = PerceptiveFlags.LingeringAP(pToken)[0][0];
				vLingeringInput.onchange = (pEvent) => {PerceptiveFlags.setPrimaryLingeringAP(vToken, Number(vLingeringInput.value))};
				vLingeringInput.style.color = "white";
				vLingeringInput.style.border = "0px";
				vLingeringInput.title = vLingeringDIV.title;

				vLingeringDIV.appendChild(vLingeringInput);

				vPositionDIV.appendChild(vLingeringDIV);

				if (vToken.isOwner) {
					vLingeringDIV.oncontextmenu = (pEvent) => {SpottingManager.RemoveLingeringAP([vToken])};
				}
			}
		}
		
		if (PerceptiveFlags.canbeSpotted(vToken)) {
			let vDCPosition = game.settings.get(cModuleName, "PDCInputPosition");
			
			if (vDCPosition != "none") {
				let vPositionDIV = pHTML[0].querySelector("div.col."+vDCPosition);
				
				let vPerceptionDCDIV = document.createElement("div");
				vPerceptionDCDIV.classList.add("control-icon");
				vPerceptionDCDIV.setAttribute("data-action", `${cModuleName}-PassiveDC`);
				
				let vDCPassiveInput = document.createElement("input");
				vDCPassiveInput.type = "number";
				vDCPassiveInput.value = PerceptiveFlags.getPPDC(vToken, true);
				vDCPassiveInput.onchange = (pEvent) => {PerceptiveFlags.setSpottingDCs(vToken, {PPDC : Number(vDCPassiveInput.value)})};
				vDCPassiveInput.style.color = "white";
				vDCPassiveInput.style.border = "0px";
				vDCPassiveInput.title = Translate("Titles.SpottingInfos.PassiveDC");
				
				let vDCActiveInput;
				if (!["", null, undefined].includes(PerceptiveFlags.getAPDC(vToken, true))) {
					vDCActiveInput = document.createElement("input");
					vDCActiveInput.type = "number";
					vDCActiveInput.value = PerceptiveFlags.getAPDC(vToken, true);
					vDCActiveInput.onchange = (pEvent) => {PerceptiveFlags.setSpottingDCs(vToken, {APDC : Number(vDCActiveInput.value)})};
					vDCActiveInput.style.color = "white";
					vDCActiveInput.style.border = "0px";
					vDCActiveInput.title = Translate("Titles.SpottingInfos.ActiveDC");
				}
				
				vPerceptionDCDIV.appendChild(vDCPassiveInput);
				if (vDCActiveInput) vPerceptionDCDIV.appendChild(vDCActiveInput);
				
				vPositionDIV.appendChild(vPerceptionDCDIV);
				
				/*
				vPositionDIV = ;
				switch (vDCPosition) {
					case "left":
					case "right":
						vPositionDIV = pHTML.find("div.col."+vDCPosition);
						break;
					case "top":
					case "bottom":
						vPositionDIV = pHTML.find("div.col."+"middle");
						switch (vDCPosition) {
							case "top":
								
								break;
							case "bottom":
								break;
						}
						break;
				}
				*/
			}
		}
	}

	static openSpottingDialoge(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {
		if ((pObjectIDs.Walls?.length > 0) || (pObjectIDs.Tokens?.length > 0) || (pObjectIDs.Tiles?.length > 0)) {
			let vContent;
			
			let vSkillName = pInfos.RolledSkill;
			
			if (!(pInfos.RolledSkill?.length > 0)) {
				vSkillName = Translate("Titles.SpottingConfirm.defaultSkill");
			}
			
			let vData = {pPlayer : game.users.get(pInfos.sendingPlayer)?.name,
						pSkillName : vSkillName,
						pSpotters : PerceptiveUtils.TokenNamesfromIDs(pSpotterIDs, game.scenes.get(pSceneID)),
						pScene : game.scenes.get(pSceneID)?.name,
						pDoors : pObjectIDs.Walls?.length,
					    };
						
			if (pInfos.APerceptionResult) {
				vData.pResult = pInfos.APerceptionResult[0];
			}
						
			if (pInfos.forceConfirmDialog) {
				vContent =  TranslateandReplace("Titles.SpottingConfirm.forcecontent", vData);				
			}
			else {
				vContent =  TranslateandReplace("Titles.SpottingConfirm.content", vData);
			}

			let vTokens = PerceptiveUtils.TokensfromIDs(pObjectIDs.Tokens.concat(pObjectIDs.Tiles), game.scenes.get(pSceneID));

			let vChecked;
			
			if (vTokens.length > 0) {
				for (let i = 0; i < vTokens.length; i++) {
					if (pInfos.TokenSpotted[vTokens[i].id]) {
						vChecked = "checked";
					}
					else {
						vChecked = "";
					}
					
					vContent = vContent + `<div class="form-group" style="display:flex;flex-direction:row;align-items:center;gap:1em">
												<input type="checkbox" id=${vTokens[i].id} ${vChecked}>
												<p>${PerceptiveFlags.PerceptiveName(vTokens[i])}</p>
												<img src="${vTokens[i].texture.src}" style = "height: 2em;">`
				
					if (!pInfos.forceConfirmDialog && vTokens[i].documentName == "Token" && (game.settings.get(cModuleName, "useLightAdvantageSystem") || (pInfos.SourceRollBehaviour != 0))) {
						vContent = vContent + `<p>${TranslateandReplace("Titles.SpottingConfirm.Behaviour", {pBehaviour : pInfos.RollBehaviours[vTokens[i].id], pResult : + PerceptiveUtils.ApplyrollBehaviour(pInfos.RollBehaviours[vTokens[i].id], pInfos.APerceptionResult, pInfos.SecondResult)[0]})}</p>`;
					}							
											
					vContent = vContent + `</div>`;
				}
			}
			else {
				vContent = vContent + "-";// + "- <br>";
			}

			//vContent = vContent + "<br>"

			Dialog.confirm({
				title: Translate("Titles.SpottingConfirm.name"),
				content: vContent,
				yes: (pHTML) => {
								/*
								for (let i = 0; i < pObjectIDs.Tokens.length; i++) {
									pInfos.TokenSpotted[pObjectIDs.Tokens[i]] = pHTML.find(`input[id=${pObjectIDs.Tokens[i]}]`).prop("checked");
								}
								*/
								
								for (let vID of pObjectIDs.Tokens.concat(pObjectIDs.Tiles)) {
									pInfos.TokenSpotted[vID] = pHTML.find(`input[id=${vID}]`).prop("checked");
								};
					
								//let vCheckedTokens = pObjectIDs.Tokens.filter(vID => pHTML.find(`input[id=${vID}]`).prop("checked"));
								
								SpottingManager.SpotObjectsGM(PerceptiveUtils.WallsfromIDs(pObjectIDs.Walls, game.scenes.get(pSceneID)).concat(PerceptiveUtils.TokensfromIDs(pObjectIDs.Tokens.concat(pObjectIDs.Tiles), game.scenes.get(pSceneID))), PerceptiveUtils.TokensfromIDs(pSpotterIDs, game.scenes.get(pSceneID)), pInfos)
								},
				no: () => {},
				defaultYes: false
			});
		}
	}

	//ons
	static async onTokenupdate(pToken, pchanges, pInfos, pUserID) {
		
		if (pToken.isOwner && pToken.parent == canvas.scene) {
			VisionUtils.PrepareSpotables();

			SpottingManager.updateVisionValues();
		}

		let vxyChange = pchanges.hasOwnProperty("x") || pchanges.hasOwnProperty("y");
		
		let vrotChange = pchanges.hasOwnProperty("rotation");
		
		let velevationChange = pchanges.hasOwnProperty("elevation");
		
		let vmovementChange = vxyChange || vrotChange || velevationChange;
			
		if (game.user.isGM) {	
			if (vxyChange) {
				if (PerceptiveFlags.canbeSpotted(pToken) && PerceptiveFlags.resetSpottedbyMove(pToken)) {
					PerceptiveFlags.clearSpottedby(pToken);
				}
			}
			
			if (vxyChange || vrotChange && game.settings.get(cModuleName, "useSpottingLightLevels")) {
				//recheck illumination level of spotables if a token with light moves
				if ((pToken.light.dim > 0) || (pToken.light.bright > 0)) {
					let vSpottable = pToken.parent.tokens.filter(vToken => PerceptiveFlags.canbeSpotted(vToken));
					
					for (let i = 0; i < vSpottable.length; i++) {
						PerceptiveFlags.CheckLightLevel(vSpottable[i]);
					}
				}
			}
			
			if (game.settings.get(cModuleName, "UsePf2eRules")) {
				let vNewDCs = {};
				
				//PPDC
				if (game.settings.get(cModuleName, "AutoRerollPPDConMove") && !PerceptiveFlags.PPDCLocked(pToken)) {
					if (vxyChange || velevationChange) {
						let vInfos = {};
						
						let vFormula;
						
						if (PerceptiveSystemUtils.StealthStatePf2e(pToken, vInfos) == "sneak") {
							if (vInfos.hasOwnProperty("sneakEffect")) {
								vFormula = PerceptiveFlags.EffectInfos(vInfos.sneakEffect)?.RollFormula;
								
								if (vFormula) {
									let vRoll = new Roll(vFormula);
									
									await vRoll.evaluate();
									
									vNewDCs.PPDC = vRoll.total;
									vNewDCs.PPDice = vRoll.dice[0].total;
								}
							}
						}
					}
				}
				
				//APDC
				if (cPf2eAPDCautomationTypes.includes(pToken.actor?.type)) {
					vNewDCs.APDC = PerceptiveSystemUtils.StealthDCPf2e(pToken.actor);
				}
				
				PerceptiveFlags.setSpottingDCs(pToken, vNewDCs);
			}
		}
		
		
		if (PerceptiveFlags.hasLingeringAP(pToken)) {
			//lingering APDC
			if (vmovementChange && (pToken.object?.controlled || game.user.isGM)){
				let vInfos = PerceptiveFlags.LingeringAPInfo(pToken);
				
				if (CONFIG.debug.perceptive.SpottingScript) {//DEBUG
					console.log("perceptive: Lingering AP:", vInfos);
				}
				
				if (pToken.inCombat && (game.settings.get(cModuleName, "LingeringAP") == "outofcombatonly")) {
					if (game.user.isGM) {
						SpottingManager.RemoveLingeringAP([pToken]);
					}
				}
				else {
					if (game.settings.get(cModuleName, "LingeringAPRadius") > 0 && vInfos.RollPosition && (GeometricUtils.DistanceXY(vInfos.RollPosition, pToken)/(canvas.scene.dimensions.size)*(canvas.scene.dimensions.distance)) > game.settings.get(cModuleName, "LingeringAPRadius")) {
						if (game.user.isGM) {
							SpottingManager.RemoveLingeringAP([pToken]);
						}
					}
					else {
						if (game.user.id == vInfos.UserSource) {
							vInfos.isLingeringAP = true;
							
							SpottingManager.CheckAPerception([pToken], PerceptiveFlags.LingeringAP(pToken), vInfos);
						}
					}
				}
			}
		}
		
		//if update was caused by perceptive vision update
		if (pInfos.PerceptiveVisionupdate && pToken.parent == canvas.scene) {
			VisionUtils.PreapreSpotableToken(pToken.object);
			
			let vControlledTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.sight.enabled);
			
			for (let i = 0; i < vControlledTokens.length; i++) {
				if (vControlledTokens[i].object.updateVisionSource) vControlledTokens[i].object.updateVisionSource();
			}
		}
	}
	
	static oncreateCombatant(pCombatant, pInfos, pUserID) {
		if (game.user.isGM) {
			let vToken = game.scenes.get(pCombatant.sceneId)?.tokens.get(pCombatant.tokenId);
			
			if (vToken) {
				if (game.settings.get(cModuleName, "LingeringAP") == "outofcombatonly") {
					SpottingManager.RemoveLingeringAP([vToken]);
				}
			}
		}
	}
	
	static onTokenpreupdate(pToken, pchanges, pInfos) {
		if (pchanges.hasOwnProperty("x") || pchanges.hasOwnProperty("y")) {
			if (pToken.isOwner) {
			}
		}
	}

	static async onPerceptionRoll(pActor, pRoll, pUserID, pReplaceSkill = "") {
		let vRelevantTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.actorId == pActor);

		/*
		let vPerceptionResult = [pRoll.total, pRoll.dice[0].total];
		
		//second roll for adv/disadv
		let vSecondRoll = new Roll(pRoll.formula);
		
		await vSecondRoll.evaluate();
		
		let vSecondResult = [vSecondRoll.total, vSecondRoll.dice[0].total];
		*/
		let vInfos = {Skill : pReplaceSkill};
		
		let vResults = await PerceptiveUtils.twoRoll(pRoll, vInfos);
		
		//execute spott
		SpottingManager.CheckAPerception(vRelevantTokens, vResults, vInfos);
	}

	static onNewlyVisible(pObjects, pInfos = {PassivSpot : false}, pSpotters = canvas.tokens.controlled.map(vToken => vToken.document)) {	
		let vTokens = pObjects.filter(vObject => vObject?.documentName == "Token" || vObject?.documentName == "Tile");
		let vDoors = pObjects.filter(vObject => vObject?.documentName == "Wall");
		
		//ping
		if ((vPingIgnoreVisionCycles <= 0) || (!pInfos.PassivSpot)) {
			if (game.settings.get(cModuleName, "SpottingPingDuration") > 0) {
				for (let i = 0; i < pObjects.length; i++) {
					if (pObjects[i]?.object?.center && (!pObjects[i].isOwner || game.user.isGM)) {
						canvas.ping(pObjects[i].object.center, {color : game.user.color, duration : game.settings.get(cModuleName, "SpottingPingDuration") * 1000});
					}
				}
			}
		}
		
		//chat message
		let vUserWhisperResult = game.settings.get(cModuleName, "WhisperPerceptionResult");
		
		let vGMWhisperResult = game.settings.get(cModuleName, "GMReciveInformationWhisper");
		
		if ((pObjects.length > 0) && !pInfos.PassivSpot && (vUserWhisperResult || vGMWhisperResult)) {
			let vContent = TranslateandReplace("ChatMessage.SpottingReport.content", {pDoors : vDoors.length});
			
			if (vTokens.length > 0) {
				for (let i = 0; i < vTokens.length; i++) {
					vContent = vContent + 	`<div class="form-group" style="display:flex;flex-direction:row;align-items:center;gap:1em"> `
					
					if (vTokens[i].isOwner || (cVisibleNameModes.includes(vTokens[i].displayName)) || vTokens[i].documentName == "Tile") {
						vContent = vContent + 	`<p>${PerceptiveFlags.PerceptiveName(vTokens[i])}</p>`;
					}	
					else {
						vContent = vContent + 	`<p>${Translate("ChatMessage.SpottingReport.unknown")}</p>`;
					}
												
					vContent = vContent	+   	`<img src="${vTokens[i].texture.src}" style = "height: 2em;">
											 </div>`;
				}
			}
			else {
				vContent = vContent + "-";// + "- <br>";
			}
			
			let vWhisperTargets = [];
			
			if (vUserWhisperResult) {
				vWhisperTargets = vWhisperTargets.concat([game.user.id]);
			}
			
			if (vGMWhisperResult) {
				vWhisperTargets = vWhisperTargets.concat(PerceptiveUtils.GMUserIDs());
			}
			
			ChatMessage.create({user: game.user.id, 
								content : vContent,
								whisper : vWhisperTargets});
		}
		
		//effect resets
		if (game.settings.get(cModuleName, "MakeSpottedTokensVisible") != "never" || pObjects.find(vObject => PerceptiveFlags.RevealwhenSpotted(vObject))) {
			pInfos.Spotted = true;
			pInfos.inCombat = pSpotters.find(vToken => vToken.inCombat);
			
			let vUnstealthObjects = pObjects;
			let vSettingPossible = game.settings.get(cModuleName, "RevealAllies") == "always" || (pInfos.inCombat && game.settings.get(cModuleName, "RevealAllies") == "incombatonly") || (!pInfos.inCombat && game.settings.get(cModuleName, "RevealAllies") == "outcombatonly")
			if (!vSettingPossible) {
				vUnstealthObjects = vUnstealthObjects.filter(vObject => vObject.disposition != vLocalVisionData.vlastDisposition)
			}
			
			SpottingManager.RequestresetStealth(vUnstealthObjects, pInfos);
		}
		
		//sound
		if (vPingIgnoreVisionCycles <= 0) {
			PerceptiveSound.PlaySpottedSound(pObjects.filter(vObject => vObject.documentName == "Token"));
		}
		
		//image popup
		if (game.settings.get(cModuleName, "SpotterImagePing").length > 0 && pObjects.length > 0) {
			if (vPingIgnoreVisionCycles <= 0) {
				for (let i = 0; i < pSpotters.length; i++) {
					canvas.ping(pSpotters[i].object?.center, {style : "CustomPing", duration :  1000 * game.settings.get(cModuleName, "SpotterImagePingDuration"), Image : game.settings.get(cModuleName, "SpotterImagePing")});
				}
			}
		}
		
		//chat message
		if (vPingIgnoreVisionCycles <= 0) {
			for (let i = 0; i < pObjects.length; i++) {
				if (PerceptiveFlags.hasSpottingMessage(pObjects[i])) {
					ChatMessage.create({user: game.user.id, flavor : PerceptiveFlags.SpottingMessage(pObjects[i]), type : 5, whisper : [game.user.id]}); //CHAT MESSAGE
				}
			}
		}
		
		Hooks.call(cModuleName + ".NewlyVisible", pObjects, pInfos, pSpotters);
		
		if (CONFIG.debug.perceptive.SpottingScript) {//DEBUG
			console.log("perceptive: Newly visible:", pInfos);
		}
	}
	
	static onPerceptiveEffectdeletion(pEffect, pInfos, pUserID, pActor) {
		if (!pInfos[cModuleName + "delete"]) {
			if (game.user.isGM) {
				EffectManager.removeStealthEffects(pActor.prototypeToken, true);
				/*
				if (game.settings.get(cModuleName, "syncEffectswithPerceptiveStealth")) {
					let vActiveScenes = game.scenes.filter(vScene => vScene.active);
					
					for (let i = 0; i < vActiveScenes.length; i++) {
						let vrelevantTokens = vActiveScenes[i].tokens.filter(vToken => vToken.actorId == pActor.id);
						
						for (let j = 0; j < vrelevantTokens.length; j++) {	
							PerceptiveFlags.setPerceptiveStealthing(vrelevantTokens[j], false);
						}
					}			
				}
				*/
			}
		}
	}


	static async onStealthRoll(pActor, pRoll) {
		let vRelevantTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.actorId == pActor);

		let vNewDCs = {};

		let vStealthResult = pRoll.total;
		
		for (let i = 0; i < vRelevantTokens.length; i++) {
			//await PerceptiveFlags.resetStealth(vRelevantTokens[i]);
			await PerceptiveFlags.clearSpottedby(vRelevantTokens[i]);
			
			await PerceptiveFlags.MakeSpottable(vRelevantTokens[i]);

			EffectManager.applyStealthEffects(vRelevantTokens[i]);
		}

		if (game.settings.get(cModuleName, "AutoStealthDCbehaviour") != "off") {
			switch(game.settings.get(cModuleName, "AutoStealthDCbehaviour")) {
				case "both":
					vNewDCs.PPDC = Math.max(0, vStealthResult);
					vNewDCs.PPDice = pRoll.dice[0].total;
					break;
			}

			switch(game.settings.get(cModuleName, "AutoStealthDCbehaviour")) {
				case "both":
				case "activeonly":
					vNewDCs.APDC = Math.max(0, vStealthResult);
					break;
			}

			for (let i = 0; i < vRelevantTokens.length; i++) {
				PerceptiveFlags.setSpottingDCs(vRelevantTokens[i], vNewDCs);
			}
		}
	}
	
	static async onStealthRollPf2e(pActor, pRoll, pType) {
		let vRelevantTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.actorId == pActor);

		let vNewDCs = {};

		let vStealthResult = pRoll.total;
		
		for (let i = 0; i < vRelevantTokens.length; i++) {
			//await PerceptiveFlags.resetStealth(vRelevantTokens[i]);
			await PerceptiveFlags.clearSpottedby(vRelevantTokens[i]);
			
			await PerceptiveFlags.MakeSpottable(vRelevantTokens[i]);

			EffectManager.applyStealthEffects(vRelevantTokens[i], {Type : pType, EffectInfos : {RollFormula : pRoll.formula}});
		}

		vNewDCs.PPDC = Math.max(vStealthResult, 0);
		vNewDCs.PPDice = pRoll.dice[0].total;
		vNewDCs.APDC = PerceptiveSystemUtils.StealthDCPf2e(vRelevantTokens[0].actor); //al tokens should have the same actor
		
		for (let i = 0; i < vRelevantTokens.length; i++) {
			PerceptiveFlags.setSpottingDCs(vRelevantTokens[i], vNewDCs);
		}
	}

	static onWallUpdate(pWall, pChanges, pInfos, pSender) {
		/*
		if (game.user.isGM) {
			if (!game.users.get(pSender).isGM) {
				if (pWall.door == 2 && pChanges.hasOwnProperty("ds")) {
					//is secret door
					pWall.update({door : 1});
				}
			}
		}
		*/
	}

	static onrefreshToken(pToken, pInfos) {	
		if (PerceptiveFlags.canbeSpotted(pToken.document)) {
			VisionUtils.PreapreSpotableToken(pToken);

			if (pToken.isOwner) {
				if ((game.settings.get(cModuleName, "useSpottingLightLevels") || game.settings.get(cModuleName, "useLightAdvantageSystem")) && !pToken.isPreview) {
					PerceptiveFlags.CheckLightLevel(pToken.document, true);
				}
			}
		}
		
		if (pToken.controlled && game.release.generation < 12) {
			SpottingManager.CheckTilesSpottingVisible();
		}
	}
	
	static onsightRefresh() {
		vPingIgnoreVisionCycles = vPingIgnoreVisionCycles - 1;
	}

	static onDoorLClick(pWall, pKeyInfo) {
		if (!(PerceptiveFlags.canbeSpotted(pWall) && pWall.door == 2)) {
			//door is not secret or not spottable, spotting has no business in handling this
			return true;
		}
		
		if (game.settings.get(cModuleName, "RevealSpottedDooronClick")) {
			if (!game.user.isGM) {
				SpottingManager.RequestresetStealth([pWall], {DoorClicked : true});
			}
		}
		else {
			//SpottingManager.RequestToggleDoorState([pWall], {DoorClicked : true});
		}
		return false;
	}

	static onCanvasReady(pCanvas) {
		VisionUtils.PrepareSpotables();

		SpottingManager.updateVisionValues();
	}

	static async initializeVisionSources(pData) {
		if (vLocalVisionData.vGMVision) return; //let core foundry or walls height take care
		
		VisionUtils.PrepareSpotables();

		vPingIgnoreVisionCycles = 1;
		
		await SpottingManager.updateVisionValues(true);
		
		let vSpottables = VisionUtils.spotablesinVision();
		
		//let vPrevVisible = vSpottables.map(vDocument => vDocument.object.visible);
		
		let vSpotPoint;
		
		vSpottables = vSpottables.filter(vObject => {
			let vTolerance;
				
			if (vLocalVisionData.vUseRangeTollerance) {
				switch (vObject.documentName) {
					case "Token":
						vTolerance = {PointTolerance : Math.max(vObject.object.width, vObject.object.height)/2};
						break;
					case "Tile":
						if (vObject.object.mesh) {
							vTolerance = {PointTolerance : Math.max(vObject.object.mesh.width, vObject.object.mesh.height)/2};
						}
						else {
							vTolerance = {PointTolerance : Math.max(vObject.object.width, vObject.object.height)/2};
						}
					default:
						vTolerance = {PointTolerance : 0};
				}
			}
			
			let vCustomRange;
			
			if (PerceptiveFlags.HasSpottingRange(vObject)) {
				vCustomRange = {Range : PerceptiveFlags.SpottingRange(vObject)};
			}	

			let vRangeInfo = {};			
			
			vSpotPoint = vObject.object.center;
			
			if (vLocalVisionData.v3DRange) {
				vSpotPoint = {...vSpotPoint, elevation : VisionUtils.objectelevation(vObject)}
			}
				
			if ((vLocalVisionData.vRangeDCModifier || vLocalVisionData.vPassiveRange || vCustomRange) && !SpottingManager.inCurrentVisionRange(PerceptiveUtils.selectedTokens(), vSpotPoint, {Tolerance : vTolerance, RangeReplacement : vCustomRange}, vRangeInfo)) {
				//performance reason (vLocalVisionData.vRangeDCModifier)
				if ((vLocalVisionData.vPassiveRange || vCustomRange)) {
					return false;
				}
			}
			
			let vRangeDCModifier = VisionUtils.RangeDCModifier(vRangeInfo, vLocalVisionData.vRangeDCInterval, vLocalVisionData.vRangeDCModifier);
			
			return PerceptiveFlags.canbeSpottedwith(vObject, PerceptiveUtils.selectedTokens(), vLocalVisionData.vlastVisionLevel, vLocalVisionData.vlastPPvalue + vLocalVisionData.vPPModifiers[vObject.documentName], vRangeDCModifier);
		});
		
		//vPingIgnoreVisionCycles = 1;
		
		//if bug, search here
		//SpottingManager.onNewlyVisible(vSpottables, {PassivSpot : true});
		VisionUtils.MaketempVisible(vSpottables);
	}
	
	//support
	static inCurrentVisionRange(pSpotters, pPosition, pSettings = {RangeReplacement : undefined, Tolerance : undefined}, pInfos = undefined) {
		let vRange = {Range : vLocalVisionData.vSpottingRange, ConeRange : vLocalVisionData.vSpottingConeRange, ConeRotation : vLocalVisionData.vSpottingConeRotation};
		
		if (pSettings.RangeReplacement) {
			if (pSettings.RangeReplacement.hasOwnProperty("Range")) {
				vRange.Range = pSettings.RangeReplacement.Range*(canvas.scene.dimensions.size)/(canvas.scene.dimensions.distance);
			}
			
			if (pSettings.RangeReplacement.hasOwnProperty("ConeRange")) {
				vRange.ConeRange = pSettings.RangeReplacement.ConeRange*(canvas.scene.dimensions.size)/(canvas.scene.dimensions.distance);
			}
			
			if (pSettings.RangeReplacement.hasOwnProperty("ConeRotation")) {
				vRange.ConeRotation = pSettings.RangeReplacement.ConeRotation;
			}
		}
		
		let vinRange =  VisionUtils.inVisionRange(pSpotters, pPosition, vRange.Range, vRange.ConeRange, vRange.ConeRotation, pSettings.Tolerance, pInfos);
		
		return vinRange;
	}
}

//Hooks
Hooks.once("ready", function() {
	if (!CONFIG.debug.hasOwnProperty(cModuleName)) {
		CONFIG.debug[cModuleName] = {};
	}
	
	CONFIG.debug.perceptive.SpottingScript = false;
	
	if (game.settings.get(cModuleName, "ActivateSpotting")) {
		//replace control visible to allow controls of spotted doors to be visible
		vDCVisionFunctions.push(function(pObject) {
			if (game.release.generation >= 12) {
				if ( !canvas.visibility.tokenVision ) return;
			}
			else {
				if ( !canvas.effects.visibility.tokenVision ) return;
			}
			
			if (vLocalVisionData.vGMVision) return; //let core foundry/wall height handle this
			
			let vPrevVisible = pObject.visible;
			
			if (SpottingManager.DControlSpottingVisible(pObject)){
				
				if (!vPrevVisible) {
					SpottingManager.onNewlyVisible([pObject.wall.document], {PassivSpot : true});
				}
				
				return true;
			}
			else {
				if (game.user.isGM && (pObject.wall.document.door == 2) && vLocalVisionData.vSimulatePlayerVision && canvas.tokens.controlled.find(vToken => vToken.hasSight)) {
					return false;
				}
			}
		});
		
		vTokenVisionFunctions.push(function(pObject) {
			if (game.release.generation >= 12) {
				if ( !canvas.visibility.tokenVision ) return;
			}
			else {
				if ( !canvas.effects.visibility.tokenVision ) return;
			}
			if (vLocalVisionData.vGMVision) return; //let core foundry/wall height handle this
			
			let vPrevVisible = pObject.visible;
																															
			let vInfos = {PassivSpot : true, TokenSuccessDegrees : {}};

			if (SpottingManager.TokenSpottingVisible(pObject, vInfos)){		
				if (!vPrevVisible) {
					SpottingManager.onNewlyVisible([pObject.document], vInfos);
				}
				return true;
			}
			else {
				if (PerceptiveFlags.isPerceptiveStealthing(pObject.document)) {
					if((!pObject.isOwner || (game.user.isGM && canvas.tokens.controlled.find(vToken => vToken.hasSight) && vLocalVisionData.vSimulatePlayerVision)) && !((pObject.document.disposition == 1) && (vLocalVisionData.vlastDisposition == 1) && game.settings.get(cModuleName, "PerceptiveStealthFriendliesvisible"))) { //long long man
						return false;
					}
				}
			}
		});
		
		if (game.release.generation >= 12) {
			vTileVisionFunctions.push(function(pObject) {
				if ( !canvas.visibility.tokenVision ) return;
				//if (!PerceptiveFlags.canbeSpotted(pObject.document)) return;
				
				if (vLocalVisionData.vGMVision) return; //let core foundry/wall height handle this
				
				let vPrevVisible = pObject.visible;
																																
				let vInfos = {PassivSpot : true};
				
				if (SpottingManager.TileSpottingVisible(pObject, vInfos)){																															
					if (!vPrevVisible) {
						SpottingManager.onNewlyVisible([pObject.document], vInfos);
					}
					return true;
				}
				else {
					if (game.user.isGM && canvas.tokens.controlled.find(vToken => vToken.hasSight) && vLocalVisionData.vSimulatePlayerVision && pObject.document.hidden){
						return false;
					}
				}
				/*
				else {
					if (canvas,tokens.selected.length <= 0) {
						vTiles[i].object.visible = game.user.isGM;
					}
				}
				*/
			});
		}

		//More hooks than the average fisher convention
		Hooks.on("updateToken", (...args) => {SpottingManager.onTokenupdate(...args)});
		
		Hooks.on("createCombatant", (...args) => {SpottingManager.oncreateCombatant(...args)});
		
		Hooks.on("preUpdateToken", (...args) => {SpottingManager.onTokenpreupdate(...args)});

		Hooks.on(cModuleName + ".PerceptionRoll", (pActorID, pRoll, pUserID, pReplaceSkill = "") => {SpottingManager.onPerceptionRoll(pActorID, pRoll, pUserID, pReplaceSkill)});
		
		Hooks.on(cModuleName + ".StealthRoll", (pActorID, pRoll) => {SpottingManager.onStealthRoll(pActorID, pRoll)});
		
		Hooks.on(cModuleName + ".StealthRollPf2e", (pActorID, pRoll, pType) => {SpottingManager.onStealthRollPf2e(pActorID, pRoll, pType)});

		Hooks.on("updateWall", (pWall, pChanges, pInfos, pSender) => {SpottingManager.onWallUpdate(pWall, pChanges, pInfos, pSender)});

		Hooks.on("refreshToken", (pToken, pInfos) => {SpottingManager.onrefreshToken(pToken, pInfos)});
		
		Hooks.on("sightRefresh", (pToken, pInfos) => {SpottingManager.onsightRefresh()});
		
		Hooks.on(cModuleName + "." + "DoorLClick", (pWall, pKeyInfo) => {return SpottingManager.onDoorLClick(pWall, pKeyInfo)});

		Hooks.on("canvasReady", (pCanvas) => {SpottingManager.onCanvasReady(pCanvas)});

		Hooks.on("initializeVisionSources", (...args) => {SpottingManager.initializeVisionSources(args)});

		Hooks.on("renderTokenHUD", (...args) => SpottingManager.addPerceptiveHUD(...args));

		Hooks.on(cModuleName + ".PerceptiveEffectdeletion", (pEffect, pInfos, pUserID, pActor) => SpottingManager.onPerceptiveEffectdeletion(pEffect, pInfos, pUserID, pActor));
	}
});

export {SpottingManager}

//socket exports
export function SpotObjectsRequest({pObjectIDs, pSpotterIDs, pSceneID, pInfos} = {}) {return SpottingManager.SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos)};

export function resetStealthRequest({pObjectIDs, pSceneID, pInfos} = {}) {return SpottingManager.resetStealthRequest(pObjectIDs, pSceneID, pInfos)};

export function toggleDoorStateRequest({pObjectIDs, pSceneID, pInfos} = {}) {return SpottingManager.toggleDoorStateRequest(pObjectIDs, pSceneID, pInfos)};

export function PlayerMakeTempVisible({pPlayerID, pObjectIDs, pInfos} = {}) {return SpottingManager.PlayerMakeTempVisible(pPlayerID, pObjectIDs, pInfos)};

export function resetStealthDataSelected() {SpottingManager.resetStealthDataSelected()};

//API and Macros
export function isSpottedby(pObject, pSpotter,  pChecks = {LOS : false, Range : true, Effects : true, Hidden : true, canbeSpotted : true}) {return SpottingManager.isSpottedby(pObject, pSpotter, pChecks)}

export function CheckAPerception(pSpotters, pResults, pInfos = {isLingeringAP : false}) {return SpottingManager.CheckAPerception(pSpotters, pResults, pInfos)}

export function SpotObjectsinVision(pCategory = {Walls : false, Tokens : false}) {return SpottingManager.SpotObjectsinVision(pCategory)}

export function RemoveLingeringAP(pTokens, pPopup = true) {return SpottingManager.RemoveLingeringAP(pTokens, pPopup)};