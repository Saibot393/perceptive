import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import {WallUtils} from "./utils/WallUtils.js";
import {PerceptiveFlags, cDoorMoveTypes} from "./helpers/PerceptiveFlags.js";
import { GeometricUtils } from "./utils/GeometricUtils.js";
import { PerceptiveCompUtils, cLibWrapper } from "./compatibility/PerceptiveCompUtils.js";

class DoorMovingManager {
	//DECLARATION
	static async DoorMoveGM(pDoor, pDirectionInfo) {} //slide or swing a pDoor open in direction pDirectionInfo
	
	static async RequestDoorMove(pDoor, pDirectionInfo) {} //starts a request to move door
	
	static async DoorMoveRequest(pDoorID, pSceneID, pDirectionInfo) {} //answers a door move request
	
	static async updateDoorMovementWall(pDoor) {} //updates the position of the movement wall belonging to pDoor
	
	static async placeDoorControl(pWall) {} //places the DoorControl of pWall
	
	static DControlProxyVisible(pDoorControl) {} //makes sure moving door controls are visible
	
	//ons
	static onDoorOpen(pDoor) {} //called when a door opened external
	
	static async onDoorClose(pDoor) {} //called when a door closed external
	
	static onDeleteWall(pWall) {} //called when a wall is deleted
	
	//IMPLEMENTATIONS
	static async DoorMoveGM(pDoor, pDirectionInfo) {
		if (!WallUtils.isLocked(pDoor) && PerceptiveFlags.Doorcanbemoved(pDoor)) {
			await PerceptiveFlags.createMovingWall(pDoor); //to prevent bugs
			
			let vDirection = Math.sign(pDirectionInfo.y);
			
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
			else {
				if (!WallUtils.isOpened(pDoor)) {	
					WallUtils.openDoor(pDoor);
				}				
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
				
				let vTargetPosition = PerceptiveFlags.getDoorPosition(pDoor);
				
				if (vTargetPosition.length == 0) {
					await WallUtils.deletewall(vreplacementWall);
				}
				else {
					await vreplacementWall.update({c : vTargetPosition});
				}
				
				//await DoorMovingManager.placeDoorControl(pDoor);
				
				if (!WallUtils.isOpened(pDoor)) {
					WallUtils.hidewall(vreplacementWall);
				}
			}	
		}
		else {
			PerceptiveFlags.deleteMovingWall(pDoor);
		}
	}
	
	static async placeDoorControl(pWall) {
		if (PerceptiveFlags.Doorcanbemoved(pWall)) {
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
	
	static DControlProxyVisible(pDoorControl) {
		//adapted from foundry.js get isVisible()
		
		if ( !canvas.effects.visibility.tokenVision ) return true;

		if (game.settings.get(cModuleName, "moveDoorControls") && PerceptiveFlags.Doorcanbemoved(pDoorControl.wall.document)) {
			// Hide secret doors from players
			let vreplacementWall = PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoorControl.wall.document), pDoorControl.wall.scene).object;
			
			const w = vreplacementWall;
			if ( (w.document.door === CONST.WALL_DOOR_TYPES.SECRET) && !game.user.isGM ) return false;

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
			return points.some(p => {
			  return canvas.effects.visibility.testVisibility(p, {object: pDoorControl, tolerance: 0});
			});
		}
		else {
			return false;
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

Hooks.on("init", function() {
	//replace control visible to allow moved door controls to be visible as long as the replacement is visible
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper) && false) {
		libWrapper.register(cModuleName, "ClockwiseSweepPolygon.prototype.isVisible", function(vWrapped, ...args) {if (DoorMovingManager.DControlProxyVisible(this)){return true} return vWrapped(args)}, "MIXED");
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
					await DoorMovingManager.onDoorClose(pWall);
				}
			}
		}
	}
	
	DoorMovingManager.placeDoorControl(pWall);
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