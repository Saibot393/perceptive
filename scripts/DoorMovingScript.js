import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {WallUtils} from "./utils/WallUtils.js";
import {PerceptiveFlags} from "./helpers/PerceptiveFlags.js";

const cDoorMovement = "Slide";
const cSwingSpeed = 20;//in degrees
const cSlideSpeed = 0.2; //in percent

class DoorMovingManager {
	//DECLARATION
	static async DoorMoveGM(pDoor, pDirectionInfo) {} //slide or swing a pDoor open in direction pDirectionInfo
	
	//IMPLEMENTATIONS
	static async DoorMoveGM(pDoor, pDirectionInfo) {
		if (!WallUtils.isLocked(pDoor)) {
			let vDirection = Math.sign(pDirectionInfo.y);
			
			let vreplacementWall; //wall that restricts sight instead of pDoor
			
			if (!WallUtils.isOpened(pDoor)) {
				await PerceptiveFlags.createMovingWall(pDoor);
				
				WallUtils.openDoor(pDoor);
			}
			
			vreplacementWall = PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent);
			
			if (vreplacementWall) {
				switch (cDoorMovement) {
					case "Swing":
							await PerceptiveFlags.changeDoorSwingState(pDoor, vDirection * cSwingSpeed);
							await vreplacementWall.update({c : WallUtils.calculateSwing(pDoor.c, PerceptiveFlags.getDoorSwingState(pDoor), 0).map(vvalue => Math.round(vvalue))});
						break;
						
					case "Slide":
					console.log(PerceptiveFlags.getDoorSlideState(pDoor));
							await PerceptiveFlags.changeDoorSlideState(pDoor, vDirection * cSlideSpeed);
							await vreplacementWall.update({c : WallUtils.calculateSlide(pDoor.c, PerceptiveFlags.getDoorSlideState(pDoor), 0).map(vvalue => Math.round(vvalue))});
						break;
				}
			}
		}
	}
}

Hooks.on(cModuleName + "." + "DoorWheel", (pWall, pKeyInfos, pScrollInfos) => {
	if (pKeyInfos.ctrlKey) {
		DoorMovingManager.DoorMoveGM(pWall, pScrollInfos);
	}
});