import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {WallUtils} from "./utils/WallUtils.js";
import {PerceptiveFlags} from "./helpers/PerceptiveFlags.js";
import { PerceptiveCompUtils, cLibWrapper } from "./compatibility/PerceptiveCompUtils.js";

const cLockSize = 0.1; //size of locks

class PeekingManager {
	//DECLARATION
	static IgnoreWall(pWall, pToken) {} //if pWall should be ignored by pToken
	
	static async updatePeekDoor(pDoor) {} //start peeking pWall with all selected tokens
	
	static async updateDoorPeekingWall(pDoor) {} //updates the peeking walls of pDoor
	
	//ons
	static async onDeleteWall(pWall) {} //called when a wall is deleted
	
	static onDoorOpen(pDoor) {} //called when a door opened external
	
	static async onDoorClose(pDoor) {} //called when a door closed external
	
	//IMPLEMENTATIONS
	static IgnoreWall(pWall, pToken) {
		if (WallUtils.isDoor(pWall)) {
			console.log(PerceptiveFlags.isLockpeekedby(pWall, pToken.id));
			return PerceptiveFlags.isLockpeekedby(pWall, pToken.id); //is a lock peeked door
		}
		
		if (PerceptiveFlags.isLockpeekingWall(pWall)) {
			console.log(!PerceptiveFlags.isLockpeekedby(pWall, pToken.id));
			return !PerceptiveFlags.isLockpeekedby(pWall, pToken.id); //is a wall to limit lockpeeking sight
		}
		
		return false;
	}
	
	static async updatePeekDoor(pDoor) {
		if (PerceptiveFlags.canbeLockpeeked(pDoor) && !WallUtils.isOpened(pDoor)) {
			let vTokens = PerceptiveUtils.selectedTokens();
			
			let vAdds = vTokens.filter(vToken => !PerceptiveFlags.isLockpeekedby(pDoor, vToken.id));
			
			let vRemoves = vTokens.filter(vToken => !vAdds.includes(vToken));
			
			console.log(vAdds, vRemoves);
			
			await PerceptiveFlags.addremoveLockpeekedby(pDoor, PerceptiveUtils.IDsfromTokens(vAdds), PerceptiveUtils.IDsfromTokens(vRemoves));
			
			//await PerceptiveFlags.removeLockpeekedby(pDoor, PerceptiveUtils.IDsfromTokens(vRemoves));
			
			for (let i = 0; i < vTokens.length; i++) {
				vTokens[i].object.updateVisionSource();
			}
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
					WallUtils.syncWallfromDoor(pDoor, vLockPeekingWalls[i]);
					
					if (i >= 0 && i <= 1) {
						vLockPeekingWalls[i].update({c : WallUtils.calculateSlide(pDoor.c, (1-cLockSize)/2, i).map(vvalue => Math.round(vvalue))});
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
		if (!pinfos.PerceptiveChange) {		
			
			if (pchanges.hasOwnProperty("ds")) {
				if (WallUtils.isOpened(pWall)) {
					PeekingManager.onDoorOpen(pWall);
				}
				else {
					PeekingManager.onDoorClose(pWall);
				}
			}
			else {
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
		PeekingManager.updatePeekDoor(pWall);
	}
});
