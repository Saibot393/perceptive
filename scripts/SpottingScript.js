import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {PerceptiveSystemUtils} from "./utils/PerceptiveSystemUtils.js";
import { GeometricUtils } from "./utils/GeometricUtils.js";
import {PerceptiveFlags } from "./helpers/PerceptiveFlags.js";
import { PerceptiveCompUtils, cLibWrapper } from "./compatibility/PerceptiveCompUtils.js";

var vlastPPvalue = 0;

class SpottingManager {
	//DECLARATIONS
	static DControlSpottingVisible(pDoorControl) {} //returns wether this pDoorControl is visible through spotting
	
	static async updatePPvalue() {} //retruns the passive perception value of pToken
	
	static lastPPvalue() {} //returns the last updated passiveperception value
	
	static async SpotObjectsGM(pObjects, pSpotters, pInfos) {} //sets pObjects to be spotted by pSpotters
	
	static async RequestSpotObjects(pObjects, pSpotters, pInfos) {} //starts a request for pSpotters to spot pObjects
	
	static async SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {} //handles a request for pSpotterIDs to spot pObjectIDs in pSceneID
	
	static async MakeDoorVisibleGM(pDoor) {} //makes pDoor visible to all
	
	static RequestDoorVisible(pDoor) {} //starts a request to make pDoor visible
	
	static DoorVisibleRequest(pDoor) {} //handels a request to make pDoor visible
	//ons
	static onTokenupdate(pToken, pchanges, pInfos) {};//called when a token is updated
	
	static async onChatMessage(pMessage, pInfos, pSenderID) {} //called when a chat message is send 
	
	static onWallUpdate(pWall, pChanges, pInfos, pSender) {} //called when a wall is updates
	
	static onDoorLClick(pWall, pKeyInfo) {} //called when a door control is left clicked
	
	//support
	static spotableDoorsinVision(pToken) {} //returns an array of walls that are spotable and within the vision of pToken
	
	static async PassivPerception(pToken) {} //returns the passive perception of pToken
	
	//IMPLEMENTATIONS
	static DControlSpottingVisible(pDoorControl) { //modified from foundry.js
		if ( !canvas.effects.visibility.tokenVision ) return true;

		if (PerceptiveFlags.canbeSpotted(pDoorControl.wall.document) && ((PerceptiveFlags.getPPDC(pDoorControl.wall.document) <= SpottingManager.lastPPvalue()) || PerceptiveFlags.isSpottedbyone(pDoorControl.wall.document, PerceptiveUtils.selectedTokens()))) {
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
	
	static async updatePPvalue() {
		if (!game.user.isGM) {
			let vTokens = PerceptiveUtils.selectedTokens();
			
			let vBuffer;
			
			vlastPPvalue = 0;
			
			for (let i = 0; i  < vTokens.length; i++) {
				vBuffer = await SpottingManager.PassivPerception(vTokens[i]);
				
				if (vBuffer > vlastPPvalue) {
					vlastPPvalue = vBuffer;
				}
			}
		}
		else {
			vlastPPvalue = Infinity;
		}
	}
	
	static lastPPvalue() {
		return vlastPPvalue;
	}
	
	static async SpotObjectsGM(pObjects, pSpotters, pInfos) {
		let vSpottables = pObjects.filter(vObject => PerceptiveFlags.canbeSpotted(vObject) && PerceptiveFlags.getAPDC(vObject) <= pInfos.APerceptionResult);
		
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
				await game.socket.emit("module." + cModuleName, {pFunction : "SpotObjectsRequest", pData : {pSceneID : canvas.scene.id, pObjectIDs : {Walls : PerceptiveUtils.IDsfromWalls(pObjects)}, pSpotterIDs : PerceptiveUtils.IDsfromTokens(pSpotters), pInfos : pInfos}});
			}
		}	
	}
	
	static async SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos) {
		if (game.user.isGM) {
			await SpottingManager.SpotObjectsGM(PerceptiveUtils.WallsfromIDs(pObjectIDs.Walls, game.scenes.get(pSceneID)), PerceptiveUtils.TokensfromIDs(pSpotterIDs, game.scenes.get(pSceneID)), pInfos);
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
	
	//ons
	static onTokenupdate(pToken, pchanges, pInfos) {
		if (pToken.isOwner && pToken.parent == canvas.scene) {
			let vDoors = canvas.walls.doors;
			//make sure all spotable doors have doorcontrols
			
			for (let i = 0; i < vDoors.length; i++) {
				if (!vDoors[i].doorControl && PerceptiveFlags.canbeSpotted(vDoors[i].document)) {
					vDoors[i].doorControl = canvas.controls.doors.addChild(new DoorControl(vDoors[i]));
					vDoors[i].doorControl.draw();
					//vDoors[i].doorControl.visible = false;
				}
			}
			
			SpottingManager.updatePPvalue();
		}
	}
	
	static async onChatMessage(pMessage, pInfos, pSenderID) {
		if (game.userId == pSenderID) {
			if (PerceptiveSystemUtils.isSystemPerceptionRoll(pMessage)) {
				let vActorID = "";
				
				if (pMessage.actor) {
					vActorID = pMessage.actor.id;
				}
				else {
					if (pMessage.speaker) {
						vActorID = pMessage.speaker.actor;
					}
				}
				
				if (vActorID.length > 0) {
					let vRelevantTokens = PerceptiveUtils.selectedTokens().filter(vToken => vToken.actorId == vActorID);
					
					let vSpottables = SpottingManager.spotableDoorsinVision();
					
					let vPerceptionResult = pMessage.roll.total;
					
					vSpottables = vSpottables.filter(vObject => PerceptiveFlags.getAPDC(vObject) <= vPerceptionResult);
					
					for (let i = 0; i < vSpottables.length; i++) {
						if (vSpottables[i]._object?.doorControl) {
							vSpottables[i]._object.doorControl.visible = true;
						}
					}
					
					await SpottingManager.RequestSpotObjects(vSpottables, vRelevantTokens, {APerceptionResult : vPerceptionResult})
				}
			}
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
	
	static onDoorLClick(pWall, pKeyInfo) {
		if (!game.user.isGM) {
			SpottingManager.RequestDoorVisible(pWall);
		}
	}
	
	//support
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
}

Hooks.on("ready", function() {
	if (game.settings.get(cModuleName, "ActivateSpotting")) {
		//replace control visible to allow controls of spotted doors to be visible
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper) && false) {
			libWrapper.register(cModuleName, "ClockwiseSweepPolygon.prototype.isVisible", function(vWrapped, ...args) {if (SpottingManager.DControlSpottingVisible(this)){return true} return vWrapped(args)}, "MIXED");
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
		
		Hooks.on("updateToken", (...args) => {SpottingManager.onTokenupdate(...args)});

		Hooks.on("createChatMessage", (pMessage, pInfos, pSenderID) => {SpottingManager.onChatMessage(pMessage, pInfos, pSenderID)});

		Hooks.on("updateWall", (pWall, pChanges, pInfos, pSender) => {SpottingManager.onWallUpdate(pWall, pChanges, pInfos, pSender)});

		Hooks.on(cModuleName + "." + "DoorLClick", (pWall, pKeyInfo) => {SpottingManager.onDoorLClick(pWall, pKeyInfo)});	
	}
});

//socket exports
export function SpotObjectsRequest({pObjectIDs, pSpotterIDs, pSceneID, pInfos} = {}) {return SpottingManager.SpotObjectsRequest(pObjectIDs, pSpotterIDs, pSceneID, pInfos)};

export function DoorVisibleRequest({pDoorID, pSceneID} = {}) {return SpottingManager.DoorVisibleRequest(pDoorID, pSceneID)};