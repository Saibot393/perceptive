import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {WallUtils} from "./utils/WallUtils.js";
import {PerceptiveFlags, cDoorMoveTypes} from "./helpers/PerceptiveFlags.js";

const cDoorMovement = "Slide";
const cSwingSpeed = 20;//in degrees
const cSlideSpeed = 0.2; //in percent

const cMoveControl = true;

class DoorMovingManager {
	//DECLARATION
	static async DoorMoveGM(pDoor, pDirectionInfo) {} //slide or swing a pDoor open in direction pDirectionInfo
	
	static async RequestDoorMove(pDoor, pDirectionInfo) {} //starts a request to move door
	
	static async DoorMoveRequest(pDoorID, pSceneID, pDirectionInfo) {} //answers a door move request
	
	static async updateDoorMovementWall(pDoor) {} //updates the position of the movement wall belonging to pDoor
	
	//ons
	static onDoorOpen(pDoor) {} //called when a door opened external
	
	static async onDoorClose(pDoor) {} //called when a door closed external
	
	static onDeleteWall(pWall) {} //called when a wall is deleted
	
	//IMPLEMENTATIONS
	static async DoorMoveGM(pDoor, pDirectionInfo) {
		if (!WallUtils.isLocked(pDoor) && PerceptiveFlags.Doorcanbemoved(pDoor)) {
			await PerceptiveFlags.createMovingWall(pDoor); //to prevent bugs
			
			let vDirection = Math.sign(pDirectionInfo.y);
			
			if (!WallUtils.isOpened(pDoor)) {	
				await WallUtils.openDoor(pDoor);
			}
			
			switch (PerceptiveFlags.DoorMovementType(pDoor)) {
				case "swing":
						await PerceptiveFlags.changeDoorSwingState(pDoor, vDirection * PerceptiveFlags.getDoorSwingSpeed(pDoor));
					break;
					
				case "slide":
						await PerceptiveFlags.changeDoorSlideState(pDoor, vDirection * PerceptiveFlags.getDoorSlideSpeed(pDoor));
					break;
			}
						
			if (PerceptiveFlags.DoorStateisClosed(pDoor)) {
				await WallUtils.closeDoor(pDoor); //close door if it has swing/slided  to an appropiate position
			}
			
			await DoorMovingManager.updateDoorMovementWall(pDoor);
		}
	}
	
	static async RequestDoorMove(pDoor, pDirectionInfo) {
		if (pDoor) {
			if (game.user.isGM) {
				DoorMovingManager.DoorMoveGM(pDoor, pDirectionInfo);
			}
			else {
				if (PerceptiveUtils.selectedTokens().concat(PerceptiveUtils.PrimaryCharacter()).find(vToken => WallUtils.isWithinRange(vToken, pDoor))) {
					game.socket.emit("module." + cModuleName, {pFunction : "DoorMoveRequest", pData : {pSceneID : canvas.scene.id, pDoorID : pDoor.id, pDirectionInfo : pDirectionInfo}});
				}
			}
		}
	}
	
	static async DoorMoveRequest(pDoorID, pSceneID, pDirectionInfo) {
		if (game.user.isGM) {
			DoorMovingManager.DoorMoveGM(PerceptiveUtils.WallfromID(pDoorID, game.scenes.get(pSceneID)), pDirectionInfo)
		}
	}
	
	static async updateDoorMovementWall(pDoor) {
		if (PerceptiveFlags.Doorcanbemoved(pDoor)) {
			let vreplacementWall = PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent);
			
			if (!vreplacementWall) {
				await PerceptiveFlags.createMovingWall(pDoor);
				
				vreplacementWall = PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent);
			}
			
			if (vreplacementWall) {
				await WallUtils.syncWallfromDoor(pDoor, vreplacementWall, false);
				
				switch (PerceptiveFlags.DoorMovementType(pDoor)) {
					case "swing":
							await vreplacementWall.update({c : WallUtils.calculateSwing(pDoor.c, PerceptiveFlags.getDoorSwingState(pDoor), PerceptiveFlags.DoorHingePosition(pDoor)).map(vvalue => Math.round(vvalue))});
						break;
						
					case "slide":
							await vreplacementWall.update({c : WallUtils.calculateSlide(pDoor.c, PerceptiveFlags.getDoorSlideState(pDoor), PerceptiveFlags.DoorHingePosition(pDoor)).map(vvalue => Math.round(vvalue))});
						break;
					default:
						await WallUtils.deletewall(vreplacementWall);
				}
				
				if (PerceptiveFlags.DoorStateisClosed(pDoor)) {
					WallUtils.hidewall(vreplacementWall);
				}
				
				if (cMoveControl) {
					/*console.log(pDoor);
					canvas.walls.doors[0].doorControl.position.x = 1000*/
				}
			}	
		}
		else {
			PerceptiveFlags.deleteMovingWall(pDoor);
		}
	}
	
	//ons
	static onDoorOpen(pDoor) {
		let vreplacementWall = PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent);
		
		if (vreplacementWall) {
			WallUtils.hidewall(vreplacementWall);
		}
	}
	
	static async onDoorClose(pDoor) {
		await PerceptiveFlags.resetDoorMovement(pDoor);
		
		DoorMovingManager.updateDoorMovementWall(pDoor);
	}
	
	static onDeleteWall(pWall) {
		PerceptiveFlags.deleteMovingWall(pWall, true);
	}
}

//hooks
Hooks.on(cModuleName + "." + "DoorWheel", (pWall, pKeyInfos, pScrollInfos) => {
	DoorMovingManager.RequestDoorMove(pWall, pScrollInfos);
}); 

Hooks.on("updateWall", async (pWall, pchanges, pinfos) => {
	if (game.user.isGM) {
		if (!pinfos.PerceptiveChange) {		
			await DoorMovingManager.updateDoorMovementWall(pWall);
			
			if (pchanges.hasOwnProperty("ds")) {
				if (WallUtils.isOpened(pWall)) {
					DoorMovingManager.onDoorOpen(pWall);
				}
				else {
					DoorMovingManager.onDoorClose(pWall);
				}
			}
		}
	}
});

Hooks.on("deleteWall", (pWall, pchanges, pinfos) => {
	if (game.user.isGM) {
		DoorMovingManager.onDeleteWall(pWall);
	}
});

//socket exports
export function DoorMoveRequest({pDoorID, pSceneID, pDirectionInfo} = {}) {return DoorMovingManager.DoorMoveRequest(pDoorID, pSceneID, pDirectionInfo)};

//exports
export function MoveHoveredDoor(pDirection) {DoorMovingManager.RequestDoorMove(PerceptiveUtils.hoveredWall(), {y : pDirection})};