import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {WallUtils} from "./utils/WallUtils.js";
import {PerceptiveFlags} from "./helpers/PerceptiveFlags.js";
import { PerceptiveCompUtils, cLibWrapper } from "./compatibility/PerceptiveCompUtils.js";

const cLockSize = 0.1; //size of locks

class PeekingManager {
	//DECLARATION
	static async PeekDoorGM(pDoor) {} //start peeking pWall with all selected tokens
	
	static async RequestPeekDoor(pDoor, pDirectionInfo) {} //starts a request to peek door
	
	static async PeekDoorRequest(pDoorID, pSceneID, pDirectionInfo) {} //answers a door peek request
	
	static async updateDoorPeekingWall(pDoor) {} //updates the peeking walls of pDoor
	
	static IgnoreWall(pWall, pToken) {} //if pWall should be ignored by pToken
	
	//ons
	static async onDeleteWall(pWall) {} //called when a wall is deleted
	
	static onDoorOpen(pDoor) {} //called when a door opened external
	
	static async onDoorClose(pDoor) {} //called when a door closed external
	
	//IMPLEMENTATIONS
	static async PeekDoorGM(pDoor, pTokens) {
		if (PerceptiveFlags.canbeLockpeeked(pDoor) && !WallUtils.isOpened(pDoor)) {		
			let vAdds = pTokens.filter(vToken => !PerceptiveFlags.isLockpeekedby(pDoor, vToken.id));
			
			let vRemoves = pTokens.filter(vToken => !vAdds.includes(vToken));
			
			await PerceptiveFlags.addremoveLockpeekedby(pDoor, PerceptiveUtils.IDsfromTokens(vAdds), PerceptiveUtils.IDsfromTokens(vRemoves));
			
			//await PerceptiveFlags.removeLockpeekedby(pDoor, PerceptiveUtils.IDsfromTokens(vRemoves));
			
			for (let i = 0; i < pTokens.length; i++) {
				pTokens[i].object.updateVisionSource();
			}
		}
	}
	
	static async RequestPeekDoor(pDoor, pTokens) {
		if (game.user.isGM) {
			PeekingManager.PeekDoorGM(pDoor, pTokens);
		}
		else {
			game.socket.emit("module." + cModuleName, {pFunction : "PeekDoorRequest", pData : {pSceneID : canvas.scene.id, pDoorID : pDoor.id, pTokenIDs : PerceptiveUtils.IDsfromTokens(pTokens)}});
		}		
	}
	
	static async PeekDoorRequest(pDoorID, pSceneID, pTokenIDs) {
		if (game.user.isGM) {
			PeekingManager.PeekDoorGM(PerceptiveUtils.WallfromID(pDoorID, game.scenes.get(pSceneID)), PerceptiveUtils.TokensfromIDs(pTokenIDs, game.scenes.get(pSceneID)))
		}		
	}
	
	static async updateDoorPeekingWall(pDoor) {
		if (PerceptiveFlags.canbeLockpeeked(pDoor)) {
			let vLockPeekingWalls = PerceptiveUtils.WallsfromIDs(PerceptiveFlags.getLockpeekingWallIDs(pDoor), pDoor.parent);
			
			if (!vLockPeekingWalls.length) {
				await PerceptiveFlags.createLockpeekingWalls(pDoor);
				
				vLockPeekingWalls = PerceptiveUtils.WallsfromIDs(PerceptiveFlags.getLockpeekingWallIDs(pDoor), pDoor.parent);
			}
			
			if (vLockPeekingWalls.length) {	
				for (let i = 0; i < vLockPeekingWalls.length; i++) {
					await WallUtils.syncWallfromDoor(pDoor, vLockPeekingWalls[i]);
					
					if (i >= 0 && i <= 1) {
						vLockPeekingWalls[i].update({c : WallUtils.calculateSlide(pDoor.c, (1-PerceptiveFlags.LockPeekingSize(pDoor))/2, i).map(vvalue => Math.round(vvalue))});
					}
					
					if (i > 1) {
						WallUtils.makewalltransparent(vLockPeekingWalls[i]);
					}
				}
			}	
		}
		else {
			/*
			let vLockPeekingWalls = PerceptiveUtils.WallsfromIDs(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent);
			
			if (vLockPeekingWalls) {
				WallUtils.deletewall(vLockPeekingWalls);
			}
			*/
			PerceptiveFlags.deleteLockpeekingWalls(pDoor);
		}
	}
	
	static IgnoreWall(pWall, pToken) {
		if (WallUtils.isDoor(pWall)) {
			return PerceptiveFlags.isLockpeekedby(pWall, pToken.id); //is a lock peeked door
		}
		
		if (PerceptiveFlags.isLockpeekingWall(pWall)) {
			return !PerceptiveFlags.isLockpeekedby(pWall, pToken.id); //is a wall to limit lockpeeking sight
		}
		
		return false;
	}
	
	//ons
	static onDoorOpen(pDoor) {
		PerceptiveFlags.removeallLockpeekedby(pDoor);
	}
	
	static async onDoorClose(pDoor) {
		
	}
	
	static async onDeleteWall(pWall) {
		await PerceptiveFlags.deleteLockpeekingWalls(pWall, true);
	}
}


//Hooks
Hooks.on("init", function() {
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper) && false) {
		libWrapper.register(cModuleName, "ClockwiseSweepPolygon.prototype._testWallInclusion", function(vWrapped, wall, bounds) {if (PeekingManager.IgnoreWall(wall.document, this.config.source.object.document)){return false} return}, "MIXED");
	}
	else {
		const vOldTokenCall = ClockwiseSweepPolygon.prototype._testWallInclusion;
		
		ClockwiseSweepPolygon.prototype._testWallInclusion = function (wall, bounds) {
			if (PeekingManager.IgnoreWall(wall.document, this.config.source.object.document)) {
				return false
			}
			
			let vTokenCallBuffer = vOldTokenCall.bind(this);
			
			return vTokenCallBuffer(wall, bounds);
		}
	}
});

Hooks.on("updateWall", (pWall, pchanges, pinfos) => {
	if (game.user.isGM) {	
		if (pchanges.hasOwnProperty("ds")) {
			if (WallUtils.isOpened(pWall)) {
				PeekingManager.onDoorOpen(pWall);
			}
			else {
				PeekingManager.onDoorClose(pWall);
			}
		}
		else {
			if (!pinfos.PerceptiveChange) {	
				PeekingManager.updateDoorPeekingWall(pWall);
			}
		}
	}
});

Hooks.on("deleteWall", (pWall, pchanges, pinfos) => {
	if (game.user.isGM) {
		PeekingManager.onDeleteWall(pWall);
	}
});

Hooks.on(cModuleName + "." + "DoorRClick", (pWall, pKeyInfos) => {
	if (pKeyInfos.ctrlKey) {
		PeekingManager.RequestPeekDoor(pWall, PerceptiveUtils.selectedTokens());
	}
});

//socket exports
export function PeekDoorRequest({pDoorID, pSceneID, pTokenIDs} = {}) {return PeekingManager.PeekDoorRequest(pDoorID, pSceneID, pTokenIDs)};