import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {VisionUtils} from "./utils/VisionUtils.js";
import {PerceptiveSystemUtils} from "./utils/PerceptiveSystemUtils.js";
import { GeometricUtils } from "./utils/GeometricUtils.js";
import {PerceptiveFlags } from "./helpers/PerceptiveFlags.js";
import {EffectManager } from "./helpers/EffectManager.js";
import { PerceptiveCompUtils, cLibWrapper } from "./compatibility/PerceptiveCompUtils.js";

var vlastPPvalue = 0;

var vlastVisionLevel = 0;

class SpottingManager {
	//DECLARATIONS
	static DControlSpottingVisible(pDoorControl) {} //returns wether this pDoorControl is visible through spotting
	
	static TokenSpottingVisible(pToken) {} //returns wether this pWall is visible though spotting
	
	static async updateVisionValues() {} //retruns the passive perception value of pToken
	
	static lastPPvalue() {} //returns the last updated passiveperception value
	
	static async SpotObjectsGM(pObjects, pSpotters, pInfos) {} //sets pObjects to be spotted by pSpotters
	
	static async RequestSpotObjects(pObjects, pSpotters, pInfos) {} //starts a request for pSpotters to spot pObjects
	
	static async SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {} //handles a request for pSpotterIDs to spot pObjectIDs in pSceneID
	
	static async MakeDoorVisibleGM(pDoor) {} //makes pDoor visible to all
	
	static RequestDoorVisible(pDoor) {} //starts a request to make pDoor visible
	
	static DoorVisibleRequest(pDoor) {} //handels a request to make pDoor visible
	
	static TestSpottedHovered() {} //test if one of the sellected tokens can spot the hovered token
	
	static PlayerMakeTempVisible(pPlayerID, pObjectIDs) {} //call to let Player make the Objects temp visible
	
	//ons
	static onTokenupdate(pToken, pchanges, pInfos) {};//called when a token is updated
	
	static async onChatMessage(pMessage, pInfos, pSenderID) {} //called when a chat message is send 
	
	static async onPerceptionRoll(pActor, pRoll) {} //called when a perception roll is rolled
	
	static async onStealthRoll(pActor, pRoll) {} //called when a stealth roll is rolled
	
	static onWallUpdate(pWall, pChanges, pInfos, pSender) {} //called when a wall is updates
	
	static onrefreshToken(pToken, pInfos) {} //called when a token is refreshed
	
	static onDoorLClick(pWall, pKeyInfo) {} //called when a door control is left clicked
	
	static onCanvasReady(pCanvas) {} //called when a canvas is ready
	
	static initializeVisionSources(pData) {} //called when new vision sources are initialized
	
	//IMPLEMENTATIONS
	static DControlSpottingVisible(pDoorControl) { //modified from foundry.js
		if ( !canvas.effects.visibility.tokenVision ) return true;

		if (PerceptiveFlags.canbeSpottedwith(pDoorControl.wall.document, PerceptiveUtils.selectedTokens(), vlastVisionLevel, SpottingManager.lastPPvalue())) {
			// Hide secret doors from players
			let vWallObject = pDoorControl.wall;
			
			if (vWallObject) {	
				const w = vWallObject;
				//if ( (w.document.door === CONST.WALL_DOOR_TYPES.SECRET) && !game.user.isGM ) return false;

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
		
		if ( PerceptiveFlags.canbeSpottedwith(pToken.document, PerceptiveUtils.selectedTokens(), vlastVisionLevel, SpottingManager.lastPPvalue()) ) {
			// Otherwise, test visibility against current sight polygons
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
			
			vlastPPvalue = 0;
			
			for (let i = 0; i < vTokens.length; i++) {
				vBuffer = await VisionUtils.PassivPerception(vTokens[i]);
				
				if (vBuffer > vlastPPvalue) {
					vlastPPvalue = vBuffer;
				}
			}
			
			vlastVisionLevel = Math.max(vTokens.map(vToken => VisionUtils.VisionLevel(vToken)));
		}
		else {
			vlastPPvalue = Infinity;
			
			vlastVisionLevel = 3;
		}
	}
	
	static lastPPvalue() {
		return vlastPPvalue;
	}
	
	static async SpotObjectsGM(pObjects, pSpotters, pInfos) {
		let vSpottables = pObjects.filter(vObject => PerceptiveFlags.canbeSpotted(vObject) && PerceptiveFlags.getAPDCModified(vObject, pInfos.VisionLevel) <= pInfos.APerceptionResult);
		
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
			await SpottingManager.SpotObjectsGM(PerceptiveUtils.WallsfromIDs(pObjectIDs.Walls, game.scenes.get(pSceneID)).concat(PerceptiveUtils.TokensfromIDs(pObjectIDs.Tokens, game.scenes.get(pSceneID))), PerceptiveUtils.TokensfromIDs(pSpotterIDs, game.scenes.get(pSceneID)), pInfos);
		}
	}
	
	static async MakeDoorVisibleGM(pDoor) {
		if (pDoor && pDoor.door == 2) {
			//is secret door
			pDoor.update({door : 1});
		}		
	}
	
	static RequestDoorVisible(pDoor) {
		if (game.user.isGM) {
			SpottingManager.MakeDoorVisibleGM(pDoor);
		}
		else {
			if (!game.paused) {
				game.socket.emit("module." + cModuleName, {pFunction : "DoorVisibleRequest", pData : {pSceneID : canvas.scene.id, pDoorID : pDoor.id}});
			}
		}
	}
	
	static DoorVisibleRequest(pDoorID, pSceneID) {
		if (game.user.isGM) {
			SpottingManager.MakeDoorVisibleGM(PerceptiveUtils.WallfromID(pDoorID, game.scenes.get(pSceneID)));
		}
	}
	
	static TestSpottedHovered() {
		console.log(PerceptiveFlags.canbeSpottedwith(PerceptiveUtils.hoveredToken(), PerceptiveUtils.selectedTokens(), vlastVisionLevel, Math.max(PerceptiveUtils.selectedTokens().map(vToken => VisionUtils.PassivPerception(vToken)))));
	}
	
	static PlayerMakeTempVisible(pPlayerID, pObjectIDs) {
		if (game.user.id == pPlayerID) {
			let vSpotables = VisionUtils.spotablesinVision();
			
			vSpotables = vSpotables.filter(vObject => pObjectIDs.includes(vObject.id));
			
			VisionUtils.MaketempVisible(vSpotables);
		}
	}
	
	//ons
	static onTokenupdate(pToken, pchanges, pInfos) {
		if (pToken.isOwner && pToken.parent == canvas.scene) {	
			VisionUtils.PrepareSpotables();
			
			SpottingManager.updateVisionValues();
		}
		
		if (game.user.isGM) {
			if (pchanges.hasOwnProperty("x") || pchanges.hasOwnProperty("y")) {
				if (PerceptiveFlags.canbeSpotted(pToken) && PerceptiveFlags.resetSpottedbyMove(pToken)) {
					PerceptiveFlags.clearSpottedby(pToken);
				}
			}
		}
	}
	
	static async onChatMessage(pMessage, pInfos, pSenderID) {
		if (game.userId == pSenderID) {
			let vActorID = "";
				
			if (pMessage.actor) {
				vActorID = pMessage.actor.id;
			}
			else {
				if (pMessage.speaker) {
					vActorID = pMessage.speaker.actor;
				}
			}
			
			if ((!keyboard.downKeys.has(game.keybindings.get(cModuleName, "IgnoreRoll")[0].key)) ^ (game.settings.get(cModuleName, "InvertIgnoreRollKey") || game.settings.get(cModuleName, "ForceInvertIgnoreRollKey"))) {
				if (PerceptiveSystemUtils.isSystemPerceptionRoll(pMessage)) {
					SpottingManager.onPerceptionRoll(vActorID, pMessage.roll);
				}
				
				if (PerceptiveSystemUtils.isSystemStealthRoll(pMessage)) {
					SpottingManager.onStealthRoll(vActorID, pMessage.roll);
				}
			}
		}
	}
	
	static async onPerceptionRoll(pActor, pRoll) {
		let vRelevantTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.actorId == pActor);
		
		let vSpotables = VisionUtils.spotablesinVision();
		
		let vPerceptionResult = pRoll.total;
		
		vSpotables = vSpotables.filter(vObject => PerceptiveFlags.getAPDCModified(vObject, vlastVisionLevel) <= vPerceptionResult);
		
		VisionUtils.MaketempVisible(vSpotables);
		
		await SpottingManager.RequestSpotObjects(vSpotables, vRelevantTokens, {APerceptionResult : vPerceptionResult, VisionLevel : vlastVisionLevel});
	}
	
	static async onStealthRoll(pActor, pRoll) {
		let vRelevantTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.actorId == pActor);
		
		let vNewDCs = {};
		
		let vStealthResult = pRoll.total;
		
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

		for (let i = 0; i < vRelevantTokens.length; i++) {
			EffectManager.applyStealthEffects(vRelevantTokens[i]);
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
	
	static onDoorLClick(pWall, pKeyInfo) {
		if (!game.user.isGM) {
			SpottingManager.RequestDoorVisible(pWall);
		}
	}
	
	static onCanvasReady(pCanvas) {
		VisionUtils.PrepareSpotables();
			
		SpottingManager.updateVisionValues();		
	}
	
	static initializeVisionSources(pData) {
		VisionUtils.PrepareSpotables();
		
		SpottingManager.updateVisionValues();	
	}
}

//Hooks
Hooks.on("ready", function() {
	if (game.settings.get(cModuleName, "ActivateSpotting")) {
		//replace control visible to allow controls of spotted doors to be visible
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "DoorControl.prototype.isVisible", function(vWrapped, ...args) {if (SpottingManager.DControlSpottingVisible(this)){return true} return vWrapped(args)}, "MIXED");
		}
		else {
			const vOldDControlCall = DoorControl.prototype.__lookupGetter__("isVisible");
			
			DoorControl.prototype.__defineGetter__("isVisible", function () {
				if (SpottingManager.DControlSpottingVisible(this)) {
					return true;
				}
				
				let vDControlCallBuffer = vOldDControlCall.bind(this);
				
				return vDControlCallBuffer();
			});
		}
		
		//allow tokens to be spotted
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "CONFIG.Token.objectClass.prototype.isVisible", function(vWrapped, ...args) {if (SpottingManager.TokenSpottingVisible(this)){return true} return vWrapped(args)}, "MIXED");
		}
		else {
			const vOldTokenCall = CONFIG.Token.objectClass.prototype.__lookupGetter__("isVisible");
			
			CONFIG.Token.objectClass.prototype.__defineGetter__("isVisible", function () {
				if (SpottingManager.TokenSpottingVisible(this)) {
					return true;
				}
				
				let vTokenCallBuffer = vOldTokenCall.bind(this);
				
				return vTokenCallBuffer();
			});
		}
		
		Hooks.on("updateToken", (...args) => {SpottingManager.onTokenupdate(...args)});

		Hooks.on("createChatMessage", (pMessage, pInfos, pSenderID) => {SpottingManager.onChatMessage(pMessage, pInfos, pSenderID)});

		Hooks.on("updateWall", (pWall, pChanges, pInfos, pSender) => {SpottingManager.onWallUpdate(pWall, pChanges, pInfos, pSender)});
		
		Hooks.on("refreshToken", (pToken, pInfos) => {SpottingManager.onrefreshToken(pToken, pInfos)});

		Hooks.on(cModuleName + "." + "DoorLClick", (pWall, pKeyInfo) => {SpottingManager.onDoorLClick(pWall, pKeyInfo)}); 
		
		Hooks.on("canvasReady", (pCanvas) => {SpottingManager.onCanvasReady(pCanvas)});
		
		Hooks.on("initializeVisionSources", (...args) => {SpottingManager.initializeVisionSources(args)})
	}
});

//socket exports
export function SpotObjectsRequest({pObjectIDs, pSpotterIDs, pSceneID, pInfos} = {}) {return SpottingManager.SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos)};

export function DoorVisibleRequest({pDoorID, pSceneID} = {}) {return SpottingManager.DoorVisibleRequest(pDoorID, pSceneID)};

export function TestSpottedHovered() {return SpottingManager.TestSpottedHovered()};

export function PlayerMakeTempVisible({pPlayerID, pObjectIDs} = {}) {return SpottingManager.PlayerMakeTempVisible(pPlayerID, pObjectIDs)};