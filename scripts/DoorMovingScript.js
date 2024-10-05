import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {WallUtils} from "./utils/WallUtils.js";
import {PerceptiveFlags, cDoorMoveTypes} from "./helpers/PerceptiveFlags.js";
import { GeometricUtils } from "./utils/GeometricUtils.js";
import { PerceptiveCompUtils, cLibWrapper } from "./compatibility/PerceptiveCompUtils.js";
import {PerceptivePopups} from "./helpers/PerceptivePopups.js";

const cMovingDoors = new Set();

class DoorMovingManager {
	//DECLARATION
	static async DoorMoveGM(pDoor, pDirectionInfo, pSpeed = 1) {} //slide or swing a pDoor open in direction pDirectionInfo
	
	static async RequestDoorMove(pDoor, pDirectionInfo, pSpeed = 1) {} //starts a request to move door
	
	static async DoorMoveRequest(pDoorID, pSceneID, pDirectionInfo, pSpeed = 1) {} //answers a door move request
	
	static async updateDoorMovementWall(pDoor, pDoorisOpened = false) {} //updates the position of the movement wall belonging to pDoor
	
	static async placeDoorControl(pWall) {} //places the DoorControl of pWall
	
	static DControlProxyVisible(pDoorControl) {} //makes sure moving door controls are visible
	
	//ons
	static onDoorOpen(pDoor) {} //called when a door opened external
	
	static async onDoorClose(pDoor) {} //called when a door closed external
	
	static onPreupdateWall(pWall, pchanges, pinfos) {} //called before a wall is updated
	
	static onDeleteWall(pWall) {} //called when a wall is deleted
	
	//IMPLEMENTATIONS
	static async DoorMoveGM(pDoor, pDirection, pSpeed = 1) {
		if (!WallUtils.isLocked(pDoor)) {
			if (PerceptiveFlags.Doorcanbemoved(pDoor)) {
				if (!cMovingDoors.has(pDoor.id)) { //prevent problems caused by movement being ordered during movement
					cMovingDoors.add(pDoor.id);
					
					await PerceptiveFlags.createMovingWall(pDoor); //to prevent bugs
					
					let vDirection = Math.sign(pDirection);
					
					switch (PerceptiveFlags.DoorMovementType(pDoor)) {
						case "swing":
								await PerceptiveFlags.changeDoorSwingState(pDoor, vDirection * PerceptiveFlags.getDoorSwingSpeed(pDoor) * pSpeed);
							break;
							
						case "slide":
								await PerceptiveFlags.changeDoorSlideState(pDoor, vDirection * PerceptiveFlags.getDoorSlideSpeed(pDoor) * pSpeed);
							break;
					}
								
					if (PerceptiveFlags.DoorStateisClosed(pDoor)) {
						await WallUtils.closeDoor(pDoor); //close door if it has swing/slided  to an appropiate position
						
						DoorMovingManager.onDoorClose(pDoor);
					}
					else {
						await DoorMovingManager.updateDoorMovementWall(pDoor, true);
					
						if (!WallUtils.isOpened(pDoor)) {	
							WallUtils.openDoor(pDoor);
						}				
					}
					
					cMovingDoors.delete(pDoor.id);
				}
			}
			else {
				PerceptivePopups.TextPopUpID(pDoor, "CantbeMoved") //MESSAGE POPUP
			}
		}
		else {
			PerceptivePopups.TextPopUpID(pDoor, "DoorisLocked") //MESSAGE POPUP
		}
	}
	
	static async RequestDoorMove(pDoor, pDirection, pSpeed = 1) {
		if (pDoor) {
			if (game.user.isGM) {
				await DoorMovingManager.DoorMoveGM(pDoor, pDirection, pSpeed);
			}
			else {
				if (!game.paused) {
					if (PerceptiveUtils.selectedTokens().concat(PerceptiveUtils.PrimaryCharacter()).find(vToken => WallUtils.isWithinRange(vToken, pDoor, "DoorMove"))) {
						game.socket.emit("module." + cModuleName, {pFunction : "DoorMoveRequest", pData : {pSceneID : canvas.scene.id, pDoorID : pDoor.id, pDirection : pDirection, pSpeed : pSpeed}});
					}
					else {
						PerceptivePopups.TextPopUpID(pDoor, "OutofRange") //MESSAGE POPUP
					}
				}
				else {
					PerceptivePopups.TextPopUpID(pDoor, "GamePaused") //MESSAGE POPUP
				}
			}
		}
	}
	
	static async DoorMoveRequest(pDoorID, pSceneID, pDirection, pSpeed = 1) {
		if (game.user.isGM) {
			await DoorMovingManager.DoorMoveGM(PerceptiveUtils.WallfromID(pDoorID, game.scenes.get(pSceneID)), pDirection, pSpeed)
		}
	}
	
	static async updateDoorMovementWall(pDoor, pDoorisOpened = false) {
		if (PerceptiveFlags.Doorcanbemoved(pDoor)) {
			let vreplacementWall = PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent);
			
			if (!vreplacementWall) {
				await PerceptiveFlags.createMovingWall(pDoor);
				
				vreplacementWall = PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent);
			}
			
			if (vreplacementWall) {
				let vTargetPosition = PerceptiveFlags.getDoorPosition(pDoor);
				if (vTargetPosition.length == 0) {
					WallUtils.hidewall(vreplacementWall);
				}
				else {
					await WallUtils.syncWallfromDoor(pDoor, vreplacementWall, false);
					await vreplacementWall.update({c : vTargetPosition});
					
					if (pDoor.ds == 0 && !pDoorisOpened) {
						WallUtils.hidewall(vreplacementWall);
					}
				}
			}	
		}
		else {
			PerceptiveFlags.deleteMovingWall(pDoor);
		}
	}
	
	static async placeDoorControl(pWall) {
		if (PerceptiveFlags.Doorcanbemoved(pWall) && pWall.object && pWall.object.doorControl) {
			if (game.settings.get(cModuleName, "moveDoorControls")) {
				if (pWall.object.doorControl) {
					let vCenterPosition = GeometricUtils.CenterPositionWall({c : PerceptiveFlags.getDoorPosition(pWall)});
					
					let vDoorControl = pWall.object.doorControl;
					
					vDoorControl.position.x = Math.round(vCenterPosition[0] - vDoorControl.width/2);
					vDoorControl.position.y = Math.round(vCenterPosition[1] - vDoorControl.height/2);
				}
			}
		}
	}
	
	static DControlProxyVisible(pDoorControl) {//modified from foundry.js
		//adapted from foundry.js get isVisible()
		
		if (game.release.generation >= 12) {
			if ( !canvas.visibility.tokenVision ) return true;
		}
		else {
			if ( !canvas.effects.visibility.tokenVision ) return true;
		}

		if (PerceptiveFlags.Doorcanbemoved(pDoorControl.wall.document)) {
			// Hide secret doors from players
			let vreplacementWall = PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoorControl.wall.document), pDoorControl.wall.scene);
			
			if (vreplacementWall && vreplacementWall.object) {
				vreplacementWall = vreplacementWall.object;
				
				const w = vreplacementWall;
				if ( (pDoorControl.wall.document.door === CONST.WALL_DOOR_TYPES.SECRET) && !game.user.isGM ) return false;

				// Test two points which are perpendicular to the door midpoint
				const ray = vreplacementWall.toRay();
				const [x, y] = w.midpoint;
				const [dx, dy] = [-ray.dy, ray.dx];
				const t = 3 / (Math.abs(dx) + Math.abs(dy)); // Approximate with Manhattan distance for speed
				const points = [
				  {x: x + (t * dx), y: y + (t * dy)},
				  {x: x - (t * dx), y: y - (t * dy)}
				];

				// Test each point for visibility
				if (game.release.generation >= 12) {
					return points.some(p => {
					  return canvas.visibility.testVisibility(p, {object: pDoorControl, tolerance: 0});
					});
				}
				else {
					return points.some(p => {
					  return canvas.effects.visibility.testVisibility(p, {object: pDoorControl, tolerance: 0});
					});
				}
			}
		}
		
		return false;
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
		
		let vreplacementWall = PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent);
		
		if (vreplacementWall) {
			WallUtils.hidewall(vreplacementWall);
		}
	}
	
	static onPreupdateWall(pWall, pchanges, pinfos) {
		if (!game.user.isGM && WallUtils.isOpened(pchanges) && PerceptiveFlags.PreventNormalOpen(pWall)) {
			delete pchanges.ds;
		}
	}
	
	static onDeleteWall(pWall) {
		PerceptiveFlags.deleteMovingWall(pWall, true);
	}
}

//hooks

Hooks.once("init", function() {
	//replace control visible to allow moved door controls to be visible as long as the replacement is visible
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper) && false) {
		libWrapper.register(cModuleName, "DoorControl.prototype.isVisible", function(vWrapped, ...args) {if (DoorMovingManager.DControlProxyVisible(this)){return true} return vWrapped(args)}, "MIXED");
	}
	else {
		const vOldDControlCall = DoorControl.prototype.__lookupGetter__("isVisible");
		
		DoorControl.prototype.__defineGetter__("isVisible", function () {
			if (DoorMovingManager.DControlProxyVisible(this)) {
				return true;
			}
			
			let vDControlCallBuffer = vOldDControlCall.bind(this);
			
			return vDControlCallBuffer();
		});
	}
});

Hooks.on(cModuleName + "." + "DoorWheel", (pWall, pKeyInfos, pScrollInfos) => {
	if (PerceptiveUtils.KeyisDown("MouseMoveDoorFast")) {
		DoorMovingManager.RequestDoorMove(pWall, pScrollInfos.y, game.settings.get(cModuleName, "SpeedDoorMovefactor"));
	}
	else {
		if (PerceptiveUtils.KeyisDown("MouseMoveDoor", true)) {
			DoorMovingManager.RequestDoorMove(pWall, pScrollInfos.y);
		}
	}
}); 

Hooks.on("updateWall", async (pWall, pchanges, pinfos) => {
	if (game.user.isGM) {
		if (!pinfos.PerceptiveChange) {		
			if (pchanges.hasOwnProperty("ds")) {
				if (WallUtils.isOpened(pWall)) {
					DoorMovingManager.onDoorOpen(pWall);
				}
				else {
					await DoorMovingManager.onDoorClose(pWall);
				}
			}
			else {
				await DoorMovingManager.updateDoorMovementWall(pWall);
			}
		}
	}
	
	DoorMovingManager.placeDoorControl(pWall);
});

Hooks.on("preUpdateWall", async (pWall, pchanges, pinfos) => {
	DoorMovingManager.onPreupdateWall(pWall, pchanges, pinfos)
});

Hooks.on("deleteWall", (pWall, pchanges, pinfos) => {
	if (game.user.isGM) {
		DoorMovingManager.onDeleteWall(pWall);
	}
});

//socket exports
export function DoorMoveRequest({pDoorID, pSceneID, pDirection, pSpeed} = {}) {return DoorMovingManager.DoorMoveRequest(pDoorID, pSceneID, pDirection, pSpeed)};

//exports
export function MoveHoveredDoor(pDirection) {DoorMovingManager.RequestDoorMove(PerceptiveUtils.hoveredWall(), {y : pDirection})};