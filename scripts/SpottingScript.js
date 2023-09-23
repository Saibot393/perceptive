import {PerceptiveUtils, cModuleName, Translate, TranslateandReplace} from "./utils/PerceptiveUtils.js";
import {VisionUtils, cLightLevel} from "./utils/VisionUtils.js";
import {PerceptiveSystemUtils} from "./utils/PerceptiveSystemUtils.js";
import {GeometricUtils } from "./utils/GeometricUtils.js";
import {PerceptiveFlags } from "./helpers/PerceptiveFlags.js";
import {EffectManager } from "./helpers/EffectManager.js";
import {PerceptiveCompUtils, cLibWrapper } from "./compatibility/PerceptiveCompUtils.js";

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
	vSpottingRange : Infinity
}

var vPingIgnoreVisionCycles = 2;

const cVisibleNameModes = [30, 50];

class SpottingManager {
	//DECLARATIONS
	static DControlSpottingVisible(pDoorControl) {} //returns wether this pDoorControl is visible through spotting

	static TokenSpottingVisible(pToken) {} //returns wether this pWall is visible though spotting

	static async updateVisionValues() {} //retruns the passive perception value of pToken

	static lastPPvalue() {} //returns the last updated passiveperception value

	static async SpotObjectsGM(pObjects, pSpotters, pInfos) {} //sets pObjects to be spotted by pSpotters

	static async RequestSpotObjects(pObjects, pSpotters, pInfos) {} //starts a request for pSpotters to spot pObjects

	static async SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {} //handles a request for pSpotterIDs to spot pObjectIDs in pSceneID

	static async PlayerMakeTempVisible(pPlayerID, pObjectIDs, pGMspotting = false) {} //call to let Player make the Objects temp visible

	static async resetStealthData(pObjects) {} //resets the stealth data of pObject, including removing effects
	
	static RequestresetStealth(pObjects, pInfos) {} //starts a request to reset stealth of pObject
	
	static resetStealthRequest(pObjectID, pSceneID, pInfos) {} //answers a request to reset stealth

	static resetStealthDataSelected() {} //resets the stealth data of selected tokens (if owned)

	//ui
	static async addPerceptiveHUD(pHUD, pHTML, pToken) {} //adds a illumination state icon to the HUd of pToken

	static openSpottingDialoge(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {} //opens a spotting dialoge for the GM to accept spotting of certain spottables

	//ons
	static async onTokenupdate(pToken, pchanges, pInfos) {}//called when a token is updated
	
	static onTokenpreupdate(pToken, pchanges, pInfos) {}//called pre update token

	static async onChatMessage(pMessage, pInfos, pSenderID) {} //called when a chat message is send

	static async onPerceptionRoll(pActor, pRoll) {} //called when a perception roll is rolled

	static onNewlyVisible(pObjects, pPassivSpot = false) {} //called when a new object is revealed
	
	static onPerceptiveEffectdeletion(pEffect, pInfos, pUserID, pActor) {} //called when an effect marked as perceptive effect is deleted

	static async onStealthRoll(pActor, pRoll) {} //called when a stealth roll is rolled
	
	static async onStealthRollPf2e(pActor, pRoll, pType) {} //called when a pf2e stealth roll is rolled

	static onWallUpdate(pWall, pChanges, pInfos, pSender) {} //called when a wall is updates

	static onrefreshToken(pToken, pInfos) {} //called when a token is refreshed
	
	static onsightRefresh() {} //called when sight is refreshed

	static onDoorLClick(pWall, pKeyInfo) {} //called when a door control is left clicked

	static onCanvasReady(pCanvas) {} //called when a canvas is ready

	static async initializeVisionSources(pData) {} //called when new vision sources are initialized

	//IMPLEMENTATIONS
	static DControlSpottingVisible(pDoorControl) { //modified from foundry.js
		if ( !canvas.effects.visibility.tokenVision ) return true;

		if (PerceptiveFlags.canbeSpottedwith(pDoorControl.wall.document, PerceptiveUtils.selectedTokens(), vLocalVisionData.vlastVisionLevel, SpottingManager.lastPPvalue())) {
			// Hide secret doors from players
			let vWallObject = pDoorControl.wall;

			if (vWallObject) {
				const w = vWallObject;
				//if ( (w.document.door === CONST.WALL_DOOR_TYPES.SECRET) && !game.user.isGM ) return false;
				if (vLocalVisionData.vSpottingRange < Infinity) { //test for spotting range
					if (!PerceptiveUtils.selectedTokens().find(vSpotter => GeometricUtils.DistanceXY(vSpotter.center, pDoorControl.center) <= vLocalVisionData.vSpottingRange)) {
						//no token in spotting range
						return false;
					}
				}

				// Test two points which are perpendicular to the door midpoint
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
			}
		}

		return false;
	}

	static TokenSpottingVisible(pToken) { //modified from foundry.js
		// Clear the detection filter
		pToken.detectionFilter = undefined;

		// Some tokens are always visible
		if ( !canvas.effects.visibility.tokenVision ) return true;
		if ( pToken.controlled ) return true;

		if ( PerceptiveFlags.canbeSpottedwith(pToken.document, PerceptiveUtils.selectedTokens(), vLocalVisionData.vlastVisionLevel, SpottingManager.lastPPvalue()) ) {
			// Otherwise, test visibility against current sight polygons
			
			if (vLocalVisionData.vSpottingRange < Infinity) { //test for spotting range
				if (!PerceptiveUtils.selectedTokens().find(vSpotter => GeometricUtils.DistanceXY(vSpotter.center, pToken.center) <= vLocalVisionData.vSpottingRange)) {
					//no token in spotting range
					return false;
				}
			}
				
			if ( canvas.effects.visionSources.get(pToken.sourceId)?.active ) return true;
			const tolerance = Math.min(pToken.w, pToken.h) / 4;
			//return canvas.effects.visibility.testVisibility(pToken.center, {tolerance, object: pToken});
			return VisionUtils.simpletestVisibility(pToken.center, {tolerance, object: pToken});
		}

		return false;
	}

	static async updateVisionValues() {
		if (!game.user.isGM || game.settings.get(cModuleName, "SimulatePlayerVision")) {
			let vTokens = PerceptiveUtils.selectedTokens();

			let vBuffer;

			vLocalVisionData.vlastPPvalue = 0;

			for (let i = 0; i < vTokens.length; i++) {
				vBuffer = await VisionUtils.PassivPerception(vTokens[i]);

				if (vBuffer > vLocalVisionData.vlastPPvalue) {
					vLocalVisionData.vlastPPvalue = vBuffer;
				}
			}

			vLocalVisionData.vlastVisionLevel = Math.max(vTokens.map(vToken => VisionUtils.VisionLevel(vToken)));
			vLocalVisionData.vlastDisposition = Math.max(vTokens.map(vToken => vToken.disposition));
			
			if (game.user.isGM) {
				vLocalVisionData.vSimulatePlayerVision = true;
			}
			
			if (game.settings.get(cModuleName, "SpottingRange") < 0) {
				vLocalVisionData.vSpottingRange = Infinity;
			}
			else {
				vLocalVisionData.vSpottingRange = game.settings.get(cModuleName, "SpottingRange")*(canvas.scene.dimensions.size)/(canvas.scene.dimensions.distance);
			}
		}
		else {
			vLocalVisionData.vlastPPvalue = Infinity;

			vLocalVisionData.vlastVisionLevel = 3;
		}
	}

	static lastPPvalue() {
		return vLocalVisionData.vlastPPvalue;
	}

	static async SpotObjectsGM(pObjects, pSpotters, pInfos) {
		let vSpottables = pObjects.filter(vObject => PerceptiveFlags.canbeSpotted(vObject) && PerceptiveFlags.getAPDCModified(vObject, pInfos.VisionLevel) <= Math.max(pInfos.APerceptionResult, pInfos.SecondResult));

		if (pInfos.sendingPlayer == game.user.id) {
			SpottingManager.PlayerMakeTempVisible(game.user.id, vSpottables.map(vObject => vObject.id), true);
		}
		else {
			game.socket.emit("module." + cModuleName, {pFunction : "PlayerMakeTempVisible", pData : {pPlayerID : pInfos.sendingPlayer, pObjectIDs : vSpottables.map(vObject => vObject.id)}})
		}

		for (let i = 0; i < pSpotters.length; i++) {
			for(let j = 0; j < vSpottables.length; j++) {
				await PerceptiveFlags.addSpottedby(vSpottables[j], pSpotters[i]);
			}
		}
	}

	static async RequestSpotObjects(pObjects, pSpotters, pInfos) {
		if (game.user.isGM) {
			await SpottingManager.SpotObjectsGM(pObjects, pSpotters, pInfos);
		}
		else {
			if (!game.paused) {
				await game.socket.emit("module." + cModuleName, {pFunction : "SpotObjectsRequest", pData : {pSceneID : canvas.scene.id, pObjectIDs : {Walls : PerceptiveUtils.IDsfromWalls(pObjects.filter(vObject => vObject.documentName == "Wall")), Tokens : PerceptiveUtils.IDsfromWalls(pObjects.filter(vObject => vObject.documentName == "Token"))}, pSpotterIDs : PerceptiveUtils.IDsfromTokens(pSpotters), pInfos : pInfos}});
			}
		}
	}

	static async SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {
		if (game.user.isGM) {
			if (game.settings.get(cModuleName, "GMSpotconfirmDialog")) {
				SpottingManager.openSpottingDialoge(pObjectIDs, pSpotterIDs, pSceneID, pInfos);
			}
			else {
				await SpottingManager.SpotObjectsGM(PerceptiveUtils.WallsfromIDs(pObjectIDs.Walls, game.scenes.get(pSceneID)).concat(PerceptiveUtils.TokensfromIDs(pObjectIDs.Tokens, game.scenes.get(pSceneID))), PerceptiveUtils.TokensfromIDs(pSpotterIDs, game.scenes.get(pSceneID)), pInfos);
			}
		}
	}

	static async PlayerMakeTempVisible(pPlayerID, pObjectIDs, pGMspotting = false) {
		if (game.user.id == pPlayerID) {
			let vSpotables = VisionUtils.spotablesinVision();

			vSpotables = vSpotables.filter(vObject => pObjectIDs.includes(vObject.id));
			
			await SpottingManager.onNewlyVisible(vSpotables.filter(vObject => (pGMspotting && game.user.isGM && !vObject?.object?.controlled) || !(vObject?.object?.visible || vObject?.object?.doorControl?.visible)));

			VisionUtils.MaketempVisible(vSpotables);
		}
	}

	static async resetStealthData(pObjects) {
		for (let i = 0; i < pObjects.length; i++) {
			if (pObjects[i]) {
				switch (pObjects[i].documentName) {
						case "Token":
							await EffectManager.removeStealthEffects(pObjects[i]);
							break;
						case "Wall":
							if (pObjects[i].door == 2) {
								//is secret door
								pObjects[i].update({door : 1});
							}
							break;			
				}

				PerceptiveFlags.resetStealth(pObjects[i]);
			}
		}
	}
	
	static RequestresetStealth(pObjects, pInfos) {
		if (game.user.isGM) {
			SpottingManager.resetStealthData(pObjects);
		}
		else {
			let vObjectIDs = {};
			
			vObjectIDs.Tokens = pObjects.filter(vObject => vObject?.documentName == "Token").map(vToken => vToken.id);
			
			vObjectIDs.Walls = pObjects.filter(vObject => vObject?.documentName == "Wall").map(vWall => vWall.id);
			
			game.socket.emit("module." + cModuleName, {pFunction : "resetStealthRequest", pData : {pObjectIDs : vObjectIDs, pSceneID : canvas.scene.id, pInfos : pInfos}});
		}
	}
	
	static resetStealthRequest(pObjectIDs, pSceneID, pInfos) {
		if (game.user.isGM) {
			if ((pInfos.Spotted && game.settings.get(cModuleName, "MakeSpottedTokensVisible")) || (pInfos.DoorClicked)) {
				let vObjects = [];
				
				vObjects = vObjects.concat(PerceptiveUtils.TokensfromIDs(pObjectIDs.Tokens, game.scenes.get(pSceneID)));
				
				vObjects = vObjects.concat(PerceptiveUtils.WallsfromIDs(pObjectIDs.Walls, game.scenes.get(pSceneID)));
				
				SpottingManager.resetStealthData(vObjects);
			}
		}
	}

	static resetStealthDataSelected() {
		let vTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.isOwner);

		SpottingManager.resetStealthData(vTokens);
	}

	//ui
	static async addPerceptiveHUD(pHUD, pHTML, pToken) {
		//Illumination Indicator
		let vButtonPosition = game.settings.get(cModuleName, "IlluminationIconPosition");

		if (vButtonPosition != "none") {
			let vIlluminationIcon;

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

			await PerceptiveFlags.CheckLightLevel(PerceptiveUtils.TokenfromID(pToken._id)); //the given pToken is a bit of a dud, better recheck the real token

			let vButtonHTML = `<div class="control-icon" data-action="${cModuleName}-Illumination" title="${Translate("Titles.SpottingInfos.LightLevel.name") + " " + Translate("Titles.SpottingInfos.LightLevel.value" + PerceptiveFlags.LightLevel(pToken))}">
									<i class="${vIlluminationIcon}"></i>
							  </div>`;

			pHTML.find("div.col."+vButtonPosition).append(vButtonHTML);

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
	}

	static openSpottingDialoge(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {
		let vContent =  TranslateandReplace("Titles.SpottingConfirm.content", {pPlayer : game.users.get(pInfos.sendingPlayer)?.name,
																				pResult : pInfos.APerceptionResult,
																				pSpotters : PerceptiveUtils.TokenNamesfromIDs(pSpotterIDs, game.scenes.get(pSceneID)),
																				pScene : game.scenes.get(pSceneID)?.name,
																				pDoors : pObjectIDs.Walls?.length,
																			   });

		let vTokens = PerceptiveUtils.TokensfromIDs(pObjectIDs.Tokens, game.scenes.get(pSceneID));

		if (vTokens.length > 0) {
			for (let i = 0; i < vTokens.length; i++) {
				vContent = vContent + `<div class="form-group" style="display:flex;flex-direction:row;align-items:center;gap:1em">
											<input type="checkbox" id=${vTokens[i].id} checked>
											<p>${vTokens[i].name}</p>
											<img src="${vTokens[i].texture.src}" style = "height: 2em;">
											<p>${TranslateandReplace("Titles.SpottingConfirm.Behaviour", {pBehaviour : pInfos.RollBehaviours[i], pResult : + PerceptiveUtils.ApplyrollBehaviour(pInfos.RollBehaviours[i], pInfos.APerceptionResult, pInfos.SecondResult)})}</p>
										</div>`;
			}
		}
		else {
			vContent = vContent + "-";// + "- <br>";
		}

		//vContent = vContent + "<br>"

		Dialog.confirm({
			title: Translate("Titles.SpottingConfirm.name"),
			content: vContent,
			yes: (pHTML) => {let vCheckedTokens = pObjectIDs.Tokens.filter(vID => pHTML.find(`input[id=${vID}]`).prop("checked"));
							SpottingManager.SpotObjectsGM(PerceptiveUtils.WallsfromIDs(pObjectIDs.Walls, game.scenes.get(pSceneID)).concat(PerceptiveUtils.TokensfromIDs(vCheckedTokens, game.scenes.get(pSceneID))), PerceptiveUtils.TokensfromIDs(pSpotterIDs, game.scenes.get(pSceneID)), pInfos)
							},
			no: () => {},
			defaultYes: false
		});
	}

	//ons
	static async onTokenupdate(pToken, pchanges, pInfos) {
		if (pToken.isOwner && pToken.parent == canvas.scene) {
			VisionUtils.PrepareSpotables();

			SpottingManager.updateVisionValues();
		}

		if (game.user.isGM) {
			let vxyChange = pchanges.hasOwnProperty("x") || pchanges.hasOwnProperty("y");
			
			let vrotChange = pchanges.hasOwnProperty("rotation");
			
			let velevationChange = pchanges.hasOwnProperty("elevation");
			
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
			
			if (game.settings.get(cModuleName, "UsePf2eRules") && game.settings.get(cModuleName, "AutoRerollPPDConMove") && !PerceptiveFlags.PPDCLocked(pToken)) {
				if (vxyChange || velevationChange) {
					let vInfos = {};
					
					let vFormula;
					
					if (PerceptiveSystemUtils.StealthStatePf2e(pToken, vInfos) == "sneak") {
						if (vInfos.hasOwnProperty("sneakEffect")) {
							vFormula = PerceptiveFlags.EffectInfos(vInfos.sneakEffect)?.RollFormula;
							
							if (vFormula) {
								let vRoll = new Roll(vFormula);
								
								await vRoll.evaluate();
								
								PerceptiveFlags.setSpottingDCs(pToken, {PPDC: vRoll.total});
							}
						}
					}
				}
			}
		}
		
		if (pInfos.PerceptiveVisionupdate && pToken.parent == canvas.scene) {
			VisionUtils.PreapreSpotableToken(pToken.object);
			
			let vControlledTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.sight.enabled);
			
			for (let i = 0; i < vControlledTokens.length; i++) {
				vControlledTokens[i].object.updateVisionSource();
			}
		}
	}
	
	static onTokenpreupdate(pToken, pchanges, pInfos) {
		if (pchanges.hasOwnProperty("x") || pchanges.hasOwnProperty("y")) {
			if (pToken.isOwner) {
			}
		}
	}

	static async onPerceptionRoll(pActor, pRoll) {
		let vRelevantTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.actorId == pActor);

		let vSpotables = VisionUtils.spotablesinVision();

		let vPerceptionResult = pRoll.total;
		
		//second roll for adv/disadv
		let vSecondRoll = new Roll(pRoll.formula);
		
		await vSecondRoll.evaluate();
		
		let vSecondResult = vSecondRoll.total;
		
		//prepare data
		let vSpotted = [];
		
		let vRollBehaviours = [];
		
		let vCurrentRollbehaviour;
		
		let vResultBuffer;
		
		let vDC;
		
		for (let i = 0; i < vSpotables.length; i++) {
			vCurrentRollbehaviour = PerceptiveFlags.getAPRollBehaviour(vSpotables[i]);
			
			vResultBuffer = PerceptiveUtils.ApplyrollBehaviour(vCurrentRollbehaviour, vPerceptionResult, vSecondResult);
			
			if (PerceptiveFlags.getAPDCModified(vSpotables[i], vLocalVisionData.vlastVisionLevel) <= vResultBuffer) {
				if ((vLocalVisionData.vSpottingRange >= Infinity) || vRelevantTokens.find(vSpotter => GeometricUtils.DistanceXY(vSpotter.center, vSpotables[i]) <= vLocalVisionData.vSpottingRange)) {			
					vSpotted.push(vSpotables[i]);
					
					if (vSpotables[i].documentName == "Token"){
						vRollBehaviours.push(vCurrentRollbehaviour);
					}
				}
			}
		}

		//vSpotables = vSpotables.filter(vObject => PerceptiveFlags.getAPDCModified(vObject, vLocalVisionData.vlastVisionLevel) <= vPerceptionResult);

		//vSpotables = vSpotables.filter(vObject => (!vObject?.object?.visible || !vObject?.object?.doorControl?.visible));

		//VisionUtils.MaketempVisible(vSpotables);

		await SpottingManager.RequestSpotObjects(vSpotted, vRelevantTokens, {APerceptionResult : vPerceptionResult, SecondResult : vSecondResult, RollBehaviours : vRollBehaviours, VisionLevel : vLocalVisionData.vlastVisionLevel, sendingPlayer : game.user.id});
	}

	static onNewlyVisible(pObjects, pPassivSpot = false) {
		let vTokens = pObjects.filter(vObject => vObject?.documentName == "Token");
		let vDoors = pObjects.filter(vObject => vObject?.documentName == "Wall");
		
		if ((vPingIgnoreVisionCycles <= 0) || (!pPassivSpot)) {
			if (game.settings.get(cModuleName, "SpottingPingDuration") > 0) {
				for (let i = 0; i < pObjects.length; i++) {
					if (pObjects[i]?.object?.center && (!pObjects[i].isOwner || game.user.isGM)) {
						canvas.ping(pObjects[i].object.center, {color : game.user.color, duration : game.settings.get(cModuleName, "SpottingPingDuration") * 1000});
					}
				}
			}
		}
		
		if (game.settings.get(cModuleName, "MakeSpottedTokensVisible")) {
			SpottingManager.RequestresetStealth(pObjects, {Spotted : true});
		}
		
		if (!pPassivSpot && game.settings.get(cModuleName, "WhisperPerceptionResult")) {
			let vContent = TranslateandReplace("ChatMessage.SpottingReport.content", {pDoors : vDoors.length});
			
			if (vTokens.length > 0) {
			for (let i = 0; i < vTokens.length; i++) {
				vContent = vContent + 	`<div class="form-group" style="display:flex;flex-direction:row;align-items:center;gap:1em"> `
				
				if (vTokens[i].isOwner || (cVisibleNameModes.includes(vTokens[i].displayName))) {
					vContent = vContent + 	`<p>${vTokens[i].name}</p>`;
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
		
			ChatMessage.create({user: game.user.id, 
								content : vContent,
								whisper : [game.user.id]});
		}
		
		Hooks.call(cModuleName + ".NewlyVisible", pObjects, pPassivSpot)
	}
	
	static onPerceptiveEffectdeletion(pEffect, pInfos, pUserID, pActor) {
		if (game.settings.get(cModuleName, "syncEffectswithPerceptiveStealth")) {
			let vActiveScenes = game.scenes.filter(vScene => vScene.active);
			
			for (let i = 0; i < vActiveScenes.length; i++) {
				let vrelevantTokens = vActiveScenes[i].tokens.filter(vToken => vToken.actorId == pActor.id);
				
				for (let j = 0; j < vrelevantTokens.length; j++) {				
					PerceptiveFlags.setPerceptiveStealthing(vrelevantTokens[j], false);
				}
			}			
		}
	}

	static async onStealthRoll(pActor, pRoll) {
		let vRelevantTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.actorId == pActor);

		let vNewDCs = {};

		let vStealthResult = pRoll.total;
		
		for (let i = 0; i < vRelevantTokens.length; i++) {
			await PerceptiveFlags.resetStealth(vRelevantTokens[i]);
			
			await PerceptiveFlags.MakeSpottable(vRelevantTokens[i]);

			EffectManager.applyStealthEffects(vRelevantTokens[i]);
		}

		if (game.settings.get(cModuleName, "AutoStealthDCbehaviour") != "off") {
			switch(game.settings.get(cModuleName, "AutoStealthDCbehaviour")) {
				case "both":
					vNewDCs.PPDC = vStealthResult;
					break;
			}

			switch(game.settings.get(cModuleName, "AutoStealthDCbehaviour")) {
				case "both":
				case "activeonly":
					vNewDCs.APDC = vStealthResult;
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
			await PerceptiveFlags.resetStealth(vRelevantTokens[i]);
			
			await PerceptiveFlags.MakeSpottable(vRelevantTokens[i]);

			EffectManager.applyStealthEffects(vRelevantTokens[i], {Type : pType, EffectInfos : {RollFormula : pRoll.formula}});
		}

		vNewDCs.PPDC = vStealthResult;
		vNewDCs.APDC = PerceptiveSystemUtils.StealthDCPf2e(vRelevantTokens[0].actor); //al tokens should have the same actor
		
		console.log(vNewDCs);
		
		for (let i = 0; i < vRelevantTokens.length; i++) {
			PerceptiveFlags.setSpottingDCs(vRelevantTokens[i], vNewDCs);
		}
	}

	static onWallUpdate(pWall, pChanges, pInfos, pSender) {
		if (game.user.isGM) {
			if (!game.users.get(pSender).isGM) {
				if (pWall.door == 2 && pChanges.hasOwnProperty("ds")) {
					//is secret door
					pWall.update({door : 1});
				}
			}
		}
	}

	static onrefreshToken(pToken, pInfos) {	
		if (PerceptiveFlags.canbeSpotted(pToken.document)) {
			VisionUtils.PreapreSpotableToken(pToken);

			if (pToken.isOwner) {	
				if (game.settings.get(cModuleName, "useSpottingLightLevels") && !pToken.isPreview) {
					PerceptiveFlags.CheckLightLevel(pToken.document, true);
				}
			}
		}
	}
	
	static onsightRefresh() {
		vPingIgnoreVisionCycles = vPingIgnoreVisionCycles - 1;
	}

	static onDoorLClick(pWall, pKeyInfo) {
		if (!game.user.isGM) {
			SpottingManager.RequestresetStealth([pWall], {DoorClicked : true});
		}
	}

	static onCanvasReady(pCanvas) {
		VisionUtils.PrepareSpotables();

		SpottingManager.updateVisionValues();
	}

	static async initializeVisionSources(pData) {
		VisionUtils.PrepareSpotables();

		await SpottingManager.updateVisionValues();
		
		let vSpottables = VisionUtils.spotablesinVision();
		
		vSpottables = vSpottables.filter(vObject => PerceptiveFlags.canbeSpottedwith(vObject, PerceptiveUtils.selectedTokens(), vLocalVisionData.vlastVisionLevel, SpottingManager.lastPPvalue()));
		
		VisionUtils.MaketempVisible(vSpottables);
		
		vPingIgnoreVisionCycles = 1;
	}
}

//Hooks
Hooks.once("ready", function() {
	if (game.settings.get(cModuleName, "ActivateSpotting")) {
		//replace control visible to allow controls of spotted doors to be visible
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "DoorControl.prototype.isVisible", function(vWrapped, ...args) {
																											let vPrevVisible = this.visible;
																											
																											if (SpottingManager.DControlSpottingVisible(this)){
																												if (!vPrevVisible) {
																													SpottingManager.onNewlyVisible([this.wall.document], true);
																												}
																												
																												return true;
																											}
																											else {
																												if (game.user.isGM && (this.wall.document.door == 2) && vLocalVisionData.vSimulatePlayerVision && canvas.tokens.controlled.length) {
																													return false;
																												}
																											}
																											
																											return vWrapped(args)}, "MIXED");
		}
		else {
			const vOldDControlCall = DoorControl.prototype.__lookupGetter__("isVisible");

			DoorControl.prototype.__defineGetter__("isVisible", function () {
				let vPrevVisible = this.visible;
				
				if (SpottingManager.DControlSpottingVisible(this)) {
					if (!vPrevVisible) {
						SpottingManager.onNewlyVisible([this.wall.document], true);
					}
																																
					return true;
				}
				else {
					if (game.user.isGM && (this.wall.document.door == 2) && vLocalVisionData.vSimulatePlayerVision && canvas.tokens.controlled.length) {
						return false;
					}
				}

				let vDControlCallBuffer = vOldDControlCall.bind(this);

				return vDControlCallBuffer();
			});
		}

		//allow tokens to be spotted
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "CONFIG.Token.objectClass.prototype.isVisible", function(vWrapped, ...args) {
																															let vPrevVisible = this.visible;
																															
																															if (SpottingManager.TokenSpottingVisible(this)){																															
																																if (!vPrevVisible) {
																																	SpottingManager.onNewlyVisible([this.document], true);
																																}
																																
																																return true;
																															}
																															else {
																																if (PerceptiveFlags.isPerceptiveStealthing(this.document)) {
																																	if((!this.isOwner || (game.user.isGM && canvas.tokens.controlled.length && vLocalVisionData.vSimulatePlayerVision)) && !((this.document.disposition == 1) && (vLocalVisionData.vlastDisposition == 1) && game.settings.get(cModuleName, "PerceptiveStealthFriendliesvisible"))) { //long long man
																																		return false;
																																	}
																																}
																															}
					
																															return vWrapped(args)}, "MIXED");
		}
		else {
			const vOldTokenCall = CONFIG.Token.objectClass.prototype.__lookupGetter__("isVisible");

			CONFIG.Token.objectClass.prototype.__defineGetter__("isVisible", function () {
				let vPrevVisible = this.visible;

				if (SpottingManager.TokenSpottingVisible(this)) {
					if (!vPrevVisible) {
						SpottingManager.onNewlyVisible([this.document], true);
					}
					
					return true;
				}
				else {
					if (PerceptiveFlags.isPerceptiveStealthing(this.document)) {
						if((!this.isOwner || (game.user.isGM && canvas.tokens.controlled.length && vLocalVisionData.vSimulatePlayerVision)) && !((this.document.disposition == 1) && (vLocalVisionData.vlastDisposition == 1) && game.settings.get(cModuleName, "PerceptiveStealthFriendliesvisible"))) {
							return false;
						}
					}
				}

				let vTokenCallBuffer = vOldTokenCall.bind(this);

				return vTokenCallBuffer();
			});
		}

		Hooks.on("updateToken", (...args) => {SpottingManager.onTokenupdate(...args)});
		
		Hooks.on("preUpdateToken", (...args) => {SpottingManager.onTokenpreupdate(...args)});

		Hooks.on(cModuleName + ".PerceptionRoll", (pActorID, pRoll) => {SpottingManager.onPerceptionRoll(pActorID, pRoll)});
		
		Hooks.on(cModuleName + ".StealthRoll", (pActorID, pRoll) => {SpottingManager.onStealthRoll(pActorID, pRoll)});
		
		Hooks.on(cModuleName + ".StealthRollPf2e", (pActorID, pRoll, pType) => {SpottingManager.onStealthRollPf2e(pActorID, pRoll, pType)});

		Hooks.on("updateWall", (pWall, pChanges, pInfos, pSender) => {SpottingManager.onWallUpdate(pWall, pChanges, pInfos, pSender)});

		Hooks.on("refreshToken", (pToken, pInfos) => {SpottingManager.onrefreshToken(pToken, pInfos)});
		
		Hooks.on("sightRefresh", (pToken, pInfos) => {SpottingManager.onsightRefresh()});
		
		Hooks.on(cModuleName + "." + "DoorLClick", (pWall, pKeyInfo) => {SpottingManager.onDoorLClick(pWall, pKeyInfo)});

		Hooks.on("canvasReady", (pCanvas) => {SpottingManager.onCanvasReady(pCanvas)});

		Hooks.on("initializeVisionSources", (...args) => {SpottingManager.initializeVisionSources(args)});

		Hooks.on("renderTokenHUD", (...args) => SpottingManager.addPerceptiveHUD(...args));

		Hooks.on(cModuleName + ".PerceptiveEffectdeletion", (pEffect, pInfos, pUserID, pActor) => SpottingManager.onPerceptiveEffectdeletion(pEffect, pInfos, pUserID, pActor))
	}
});

//socket exports
export function SpotObjectsRequest({pObjectIDs, pSpotterIDs, pSceneID, pInfos} = {}) {return SpottingManager.SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos)};

export function resetStealthRequest({pObjectIDs, pSceneID, pInfos} = {}) {return SpottingManager.resetStealthRequest(pObjectIDs, pSceneID, pInfos)};

export function PlayerMakeTempVisible({pPlayerID, pObjectIDs} = {}) {return SpottingManager.PlayerMakeTempVisible(pPlayerID, pObjectIDs)};

export function resetStealthDataSelected() {SpottingManager.resetStealthDataSelected()};