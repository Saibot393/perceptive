import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {WallUtils} from "./utils/WallUtils.js";
import {PerceptiveFlags} from "./helpers/PerceptiveFlags.js";

class PeekingManager {
	//DECLARATION
	static IgnoreWall(pWall, pToken) {} //if pWall should be ignored by pToken
	
	static async updatePeekDoor(pWall) {} //start peeking pWall with all selected tokens
	
	//IMPLEMENTATIONS
	static IgnoreWall(pWall, pToken) {
		if (WallUtils.isDoor(pWall)) {
			return PerceptiveFlags.isLockpeekedby(pWall, pToken.id); //is a lock peeked door
		}
			
		if (PerceptiveFlags.isLockpeekingWall(pWall)) {
			return !PerceptiveFlags.isLockpeekedby(pWall, pToken.id); //is a wall to limit lockpeeking sight
		}
		
		return false;
	}
	
	static async updatePeekDoor(pWall) {
		let vTokens = PerceptiveUtils.selectedTokens();
		
		let vAdds = vTokens.filter(vToken => !PerceptiveFlags.isLockpeekedby(pWall, vToken.id));
		
		let vRemoves = vTokens.filter(vToken => !vAdds.includes(vToken));
		
		await PerceptiveFlags.addLockpeekedby(pWall, PerceptiveUtils.IDsfromTokens(vAdds));
		
		await PerceptiveFlags.removeLockpeekedby(pWall, PerceptiveUtils.IDsfromTokens(vRemoves));
		
		for (let i = 0; i < vTokens.length; i++) {
			vTokens[i].object.updateVisionSource();
		}
	}
}

/*
Hooks.on("init", function() {
	const vOldTokenCall = ClockwiseSweepPolygon.prototype._testWallInclusion;
	
	ClockwiseSweepPolygon.prototype._testWallInclusion = function test(wall, bounds) {
		if (PeekingManager.IgnoreWall(wall.document, this.config.source.object.document)) {
			return false
		}
		
		let vTokenCallBuffer = vOldTokenCall.bind(this);
		
		return vTokenCallBuffer(wall, bounds);
	}
});

Hooks.on(cModuleName + "." + "DoorLClick", (pWall, pKeyInfos) => {
	if (pKeyInfos.shiftKey) {
		PeekingManager.updatePeekDoor(pWall);
	}
});
*/