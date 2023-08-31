import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {WallUtils} from "./utils/WallUtils.js";
import {PerceptiveFlags} from "./helpers/PerceptiveFlags.js";
import { PerceptiveCompUtils, cLibWrapper } from "./compatibility/PerceptiveCompUtils.js";

class PeekingManager {
	//DECLARATIONS
	static async PeekDoorGM(pDoor) {} //start peeking pWall with all selected tokens
	
	static async RequestPeekDoor(pDoor, pTokens) {} //starts a request to peek door
	
	static async PeekDoorRequest(pDoorID, pSceneID, pDirectionInfo) {} //answers a door peek request
	
	static async updateDoorPeekingWall(pDoor) {} //updates the peeking walls of pDoor
	
	static async stopLockpeeking(pToken) {} //stops pToken from peeking
	
	static IgnoreWall(pWall, pToken) {} //if pWall should be ignored by pToken
	
	//ons
	static async onDeleteWall(pWall) {} //called when a wall is deleted
	
	static onDoorOpen(pDoor) {} //called when a door opened external
	
	static async onDoorClose(pDoor) {} //called when a door closed external
	
	static OnTokenupdate(pToken, pchanges, pInfos) {} //called when a token is updated
	
	//IMPLEMENTATIONS
	static async PeekDoorGM(pDoor, pTokens) {
		if (PerceptiveFlags.canbeLockpeeked(pDoor) && !WallUtils.isOpened(pDoor)) {		
			await PerceptiveFlags.createLockpeekingWalls(pDoor); //to prevent bugs
			
			let vAdds = pTokens.filter(vToken => !PerceptiveFlags.isLockpeekedby(pDoor, vToken.id) && !PerceptiveFlags.isLockpeeking(vToken));
			vAdds = vAdds.filter(vToken => WallUtils.isWithinRange(vToken, pDoor))
			
			let vRemoves = pTokens.filter(vToken => !vAdds.includes(vToken) && PerceptiveFlags.isLockpeekedby(pDoor, vToken.id) && PerceptiveFlags.isLockpeeking(vToken));
			
			await PerceptiveFlags.addremoveLockpeekedby(pDoor, PerceptiveUtils.IDsfromTokens(vAdds), PerceptiveUtils.IDsfromTokens(vRemoves));
			
			await PeekingManager.updateDoorPeekingWall(pDoor);
			
			for (let i = 0; i < pTokens.length; i++) {
				if (vRemoves.includes(pTokens[i])) {
					await PerceptiveFlags.stopLockpeeking(pTokens[i]);
				}
				
				if (pTokens[i].object) {
					pTokens[i].object.updateVisionSource();
				}
			}
		}
	}
	
	static async RequestPeekDoor(pDoor, pTokens) {
		if (pDoor) {
			if (game.user.isGM) {
				PeekingManager.PeekDoorGM(pDoor, pTokens);
			}
			else {
				if (!game.paused) {
					game.socket.emit("module." + cModuleName, {pFunction : "PeekDoorRequest", pData : {pSceneID : canvas.scene.id, pDoorID : pDoor.id, pTokenIDs : PerceptiveUtils.IDsfromTokens(pTokens)}});
				}
			}	
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
					if (WallUtils.isOpened(pDoor)) {
						WallUtils.hidewall(vLockPeekingWalls[i]);
					}
					else {
						await WallUtils.syncWallfromDoor(pDoor, vLockPeekingWalls[i]);
						
						if (i >= 0 && i <= 1) {
							vLockPeekingWalls[i].update({c : WallUtils.calculateSlide(pDoor.c, PerceptiveFlags.DoorMinMax(i+(1-2*i)*PerceptiveFlags.LockPeekingPosition(pDoor)-PerceptiveFlags.LockPeekingSize(pDoor)/2), i).map(vvalue => Math.round(vvalue))});
						}
						
						if (i > 1) {
							WallUtils.makewalltransparent(vLockPeekingWalls[i]);
						}
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
	
	static async stopLockpeeking(pToken) {
		if (PerceptiveFlags.isLockpeeking(pToken)) {
			let vPeekedWall = PerceptiveFlags.getLockpeekedWall(pToken);
			
			if (vPeekedWall) {
				await PerceptiveFlags.removeLockpeekedby(vPeekedWall, pToken.id);
			}
			
			await PerceptiveFlags.stopLockpeeking(pToken);
				
			pToken.object.updateVisionSource();
		}
	}
	
	static IgnoreWall(pWall, pToken) {
		if (WallUtils.isDoor(pWall)) {
			return PerceptiveFlags.isLockpeekedby(pWall, pToken.id) && PerceptiveFlags.isLockpeeking(pToken); //is a lock peeked door
		}
		
		if (PerceptiveFlags.isLockpeekingWall(pWall)) {
			return !(PerceptiveFlags.isLockpeekedby(pWall, pToken.id) && PerceptiveFlags.isLockpeeking(pToken)); //is a wall to limit lockpeeking sight
		}
		
		return false;
	}
	
	//ons
	static async onDeleteWall(pWall) {
		await PerceptiveFlags.deleteLockpeekingWalls(pWall, true);
	}
	
	static onDoorOpen(pDoor) {
		PerceptiveFlags.removeallLockpeekedby(pDoor);
		
		let vLockPeekingWalls = PerceptiveUtils.WallsfromIDs(PerceptiveFlags.getLockpeekingWallIDs(pDoor), pDoor.parent);
		
		for (let i = 0; i < vLockPeekingWalls.length; i++) {
			WallUtils.hidewall(vLockPeekingWalls[i]);
		}
	}
	
	static async onDoorClose(pDoor) {

	}
	
	static OnTokenupdate(pToken, pchanges, pInfos) {
		if (game.user.isGM) {
			if (PerceptiveFlags.isLockpeeking(pToken)) {
				if (pchanges.hasOwnProperty("x") || pchanges.hasOwnProperty("y")) {
					if (game.settings.get(cModuleName, "StopPeekonMove") || !WallUtils.isWithinRange(pToken, PerceptiveFlags.getLockpeekedWall(pToken))) {
						PeekingManager.stopLockpeeking(pToken);
					}
				}
			}
		}
	}
}

//Hooks
Hooks.on("init", function() {
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
		libWrapper.register(cModuleName, "ClockwiseSweepPolygon.prototype._testWallInclusion", function(vWrapped, vwall, vbounds) {if (PeekingManager.IgnoreWall(vwall.document, this.config.source.object.document)){return false} return vWrapped(vwall, vbounds)}, "MIXED");
	}
	else {
		const vOldTokenCall = ClockwiseSweepPolygon.prototype._testWallInclusion;
		
		ClockwiseSweepPolygon.prototype._testWallInclusion = function (wall, bounds) {
			if (wall && this.config.source.object && PeekingManager.IgnoreWall(wall.document, this.config.source.object.document)) {
				return false;
			}
			
			let vTokenCallBuffer = vOldTokenCall.bind(this);
			
			return vTokenCallBuffer(wall, bounds);
		}
	}
});

Hooks.on("updateWall", async (pWall, pchanges, pinfos) => {
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
				await PeekingManager.updateDoorPeekingWall(pWall);
			}
		}
	}
});

Hooks.on("updateToken", (...args) => PeekingManager.OnTokenupdate(...args));

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

//exports
export function RequestPeekDoor(pDoor, pTokens) {PeekingManager.RequestPeekDoor(pDoor, pTokens)} //to request a peek change of tokens for wall

export function SelectedPeekhoveredDoor() {PeekingManager.RequestPeekDoor(PerceptiveUtils.hoveredWall(), PerceptiveUtils.selectedTokens())}