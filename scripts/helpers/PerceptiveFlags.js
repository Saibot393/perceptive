import {WallUtils, cisPerceptiveWall} from "../utils/WallUtils.js";
import {GeometricUtils} from "../utils/GeometricUtils.js";
import {cModuleName, PerceptiveUtils} from "../utils/PerceptiveUtils.js";

const cangleepsilon = 1; //epsilon around zero for angles

const cLockSize = 0.01; //size of locks

const ccanbeLockpeekedbyStandard = true;

const cDoorMoveTypes = ["none", "slide", "swing"];
const cHingePositions = [0, 1];

export {cDoorMoveTypes, cHingePositions}
//Flags
const cisPerceptiveWallF = cisPerceptiveWall; //if this wall was created by this module
const ccanbeLockpeekedF = "canbeLockpeekedFlag"; //Flag that signals, that this wall can be lock peeked
const cLockPeekingWallIDsF = "LockPeekingWallIDsFlag"; //Flag for ids of the Lockpeekingwalls belonging to this door
const cLockpeekedbyF = "LockpeekedbyFlag"; //Flag that stores ids of tokens lock peeking this wall
const cisLockPeekingWallF = "isLockpeekingWallFlag"; //Flag that signals, that this wall is a lock peeking wall
const cDoormovingWallIDF = "DoormovingWallIDFlag"; //Flag for id of the DoormovingWall belonging to this door
const cDoorMovementF = "DoorMovementFlag"; //Flag that contains the movement type of this door
const cDoorHingePositionF = "DoorHingePositionFlag"; //flag to contain the info where the hinge of this door is placed
const cDoorSwingSpeedF = "DoorSwingSpeedFlag"; //Flag to save the swing Speed of a door
const cDoorSlideSpeedF = "DoorSlideSpeedFlag"; //Flag to save the slide Speed of a door
const cDoorSwingStateF = "DoorSwingStateFlag"; //Flag to save the currrent swing state of a door
const cDoorSlideStateF = "DoorSlideStateFlag"; //Flag to save the currrent slide state of a door

export {cisPerceptiveWallF, ccanbeLockpeekedF, cLockPeekingWallIDsF, cLockpeekedbyF, cisLockPeekingWallF, cDoormovingWallIDF, cDoorMovementF, cDoorHingePositionF, cDoorSwingSpeedF, cDoorSlideSpeedF}

//handels all reading and writing of flags (other scripts should not touch Rideable Flags (other than possible RiderCompUtils for special compatibilityflags)
class PerceptiveFlags {
	//DECLARATIONS
	//basics
	static isPerceptiveWall(pWall) {} //returns if this wall was created by this Module
	
	//peeking
	static async synchLockpeekingWalls(pWall) {} //checks if pWall can be lock peeked and creates or deletes the appropiate perceptive walls
	
	static canbeLockpeeked(pWall) {} //returns of pWall can be lock peeked
	
	static async setLockpeekedby(pWall, pIDs) {} //set the Lockppekedby Flag of pWall
	
	static isLockpeekedby(pWall, pID) {} //returns if this wall is Lockpeekedby id
	
	static addLockpeekedby(pWall, pIDs) {} //add to the Lockppekedby Flag of pWall
	
	static removeLockpeekedby(pWall, pIDs) {} //remove from the Lockppekedby Flag of pWall
	
	static isLockpeekingWall(pWall) {} //returns of this wall is a lockpeeking wall (and should normally be ignored)
	
	//moving door
	static Doorcanbemoved(pDoor) {} //if pDoor is a moving door
	
	static DoorStateisClosed(pDoor) {} //returns if moving state of pDoor is closed
	
	static DoorMovementType(pDoor) {} //returns the movement type of pDoor
	
	static DoorHingePosition(pDoor) {} //returns the hinge position of pDoor
	
	static getmovingWallID(pDoor) {} //returns the id of the moving wall belonging to this door
	
	static async createMovingWall(pDoor) {} //creates a new moving wall for pDoor
	
	static async deleteMovingWall(pDoor) {} //creates a new moving wall for pDoor
	
	static async hideMovingWall(pDoor) {} //hides the moving wall of pDoor
	
	static async synchMovingWall(pDoor) {} //synchs the moving wall of pDoor
	
	static async setDoorSwingState(pDoor, pAngle) {} //sets the swing state of pDoor
	
	static async changeDoorSwingState(pDoor, pChange) {} //change the swing state of pDoor

	static getDoorSwingSpeed(pDoor) {} //gets the swing speed of pDoor
	
	static getDoorSlideSpeed(pDoor) {} //gets the Slide speed of pDoor
	
	static getDoorSwingState(pDoor) {} //gets the swing state of pDoor
	
	static getDoorSlideState(pDoor) {} //gets the Slide state of pDoor
	
	static async setDoorSlideState(pDoor, pSlide) {} //sets the Slide state of pDoor
	
	static async changeDoorSlideState(pDoor, pChange) {} //change the Slide state of pDoor
	
	static resetDoorMovement(pDoor) {} //resets data related to door movement
	
	//support
	static slideMinMax(pSlide) {} //returns a slide with both values within [0,1]
	
	//IMPLEMENTATIONS
	
	//flags handling support
	
	static #PerceptiveFlags (pObject) {	
	//returns all Module Flags of pObject (if any)
		if (pObject) {
			if (pObject.flags.hasOwnProperty(cModuleName)) {
				return pObject.flags.perceptive;
			}
		}
		
		return; //if anything fails
	} 
	
	static #isPerceptiveWallFlag (pWall) { 
	//returns content of isPerceptiveWallFlag of pWall (if any) (true or false)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cisPerceptiveWallF)) {
				return vFlag.isPerceptiveWallFlag;
			}
		}
		
		return false; //default if anything fails
	} 
	
	static #LockPeekingWallIDsFlag (pWall) { 
	//returns content of LockPeekingWallIDsFlag of pWall (if any) (2 ids)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockPeekingWallIDsF)) {
				return vFlag.LockPeekingWallIDsFlag;
			}
		}
		
		return []; //default if anything fails
	} 
	
	static #canbeLockpeekedFlag (pWall) { 
	//returns content of canbeLockpeekedFlag of pWall (if any) (boolean)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(ccanbeLockpeekedF)) {
				return vFlag.canbeLockpeekedFlag;
			}
		}
		
		return ccanbeLockpeekedbyStandard; //default if anything fails
	}
	
	static #LockpeekedbyFlag (pWall) { 
	//returns content of LockpeekedbyFlag of pWall (if any) (array of IDs)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockpeekedbyF)) {
				return vFlag.LockpeekedbyFlag;
			}
		}
		
		return []; //default if anything fails
	} 
	
	static #isLockPeekingWallFlag (pWall) { 
	//returns content of isLockPeekingWallFlag of pWall (if any) (boolean)
		let vFlag = this.#PerceptiveFlags(pWall);

		if (vFlag) {
			if (vFlag.hasOwnProperty(cisLockPeekingWallF)) {
				return vFlag.isLockPeekingWallFlag;
			}
		}
		
		return false; //default if anything fails
	}
	
	static #DoormovingWallIDFlag (pWall) { 
	//returns content of DoormovingWallIDFlag of pWall (if any) (1 id)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoormovingWallIDF)) {
				return vFlag.DoormovingWallIDFlag;
			}
		}
		
		return ""; //default if anything fails
	} 

	static #DoorMovementFlag (pWall) { 
	//returns content of DoorMovementFlag of pWall (must be Doormovement type)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorMovementF)) {
				return vFlag.DoorMovementFlag;
			}
		}
		
		return cDoorMoveTypes[0]; //default if anything fails
	} 
	
	static #DoorHingePositionFlag (pWall) { 
	//returns content of DoorHingePositionFlag of pWall (must be 0 or 1)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorHingePositionF)) {
				return vFlag.DoorHingePositionFlag;
			}
		}
		
		return 0; //default if anything fails
	} 
	
	static #DoorSwingSpeedFlag (pWall) { 
	//returns content of DoorSwingSpeedFlag of pWall (in degrees)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorSwingSpeedF)) {
				return vFlag.DoorSwingSpeedFlag;
			}
		}
		
		return 5; //default if anything fails
	} 
	
	static #DoorSlideSpeedFlag (pWall) { 
	//returns content of DoorSlideSpeedFlag of pWall (in degrees)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorSlideSpeedF)) {
				return vFlag.DoorSlideSpeedFlag;
			}
		}
		
		return 0.05; //default if anything fails
	} 
	
	static #DoorSwingStateFlag (pWall) { 
	//returns content of DoorSwingStateFlag of pWall (in degrees)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorSwingStateF)) {
				return vFlag.DoorSwingStateFlag;
			}
		}
		
		return 0; //default if anything fails
	} 
	
	static #DoorSlideStateFlag (pWall) { 
	//returns content of DoorSlideStateFlag of pWall (in degrees)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorSlideStateF)) {
				return vFlag.DoorSlideStateFlag;
			}
		}
		
		return 1; //default if anything fails
	} 
	
	static async #setLockPeekingWallIDs (pWall, pContent) {
	//sets content of LockPeekingWallIDsFlag (must be array of id)
		if (pWall) {
			await pWall.setFlag(cModuleName, cLockPeekingWallIDsF, pContent);
			
			return true;
		}
		return false;
	}
	
	static async #setLockpeekedby (pWall, pContent) {
	//sets content of DoormovingWallIDFlag (must be id)
		if (pWall) {
			await pWall.setFlag(cModuleName, cLockpeekedbyF, pContent);
			
			return true;
		}
		return false;
	}
	
	static async #setDoormovingWallIDFlag (pWall, pContent) {
	//sets content of DoormovingWallIDFlag (must be id)
		if (pWall && typeof(pContent) == "string") {
			await pWall.setFlag(cModuleName, cDoormovingWallIDF, pContent);
			
			return true;
		}
		return false;
	}
	
	static async #setDoorSwingStateFlag (pWall, pContent) {
	//sets content of DoorSwingStateFlag (must be boolean)
		if (pWall) {
			await pWall.setFlag(cModuleName, cDoorSwingStateF, Number(pContent));
			
			return true;
		}
		return false;
	}
	
	static async #setDoorSlideStateFlag (pWall, pContent) {
	//sets content of DoorSlideStateFlag (must be boolean)
		if (pWall) {
			await pWall.setFlag(cModuleName, cDoorSlideStateF, Number(pContent));
			
			return true;
		}
		return false;
	}
	
	//basics
	static isPerceptiveWall(pWall) {
		return Boolean(this.#isPerceptiveWallFlag(pWall));
	}
	
	//peeking
	static async synchLockpeekingWalls(pWall) {
		if (pWall.id) {
			//only synch already created walls
			let vLockPeekingWalls = [];
			
			if (WallUtils.isDoor(pWall)) {
				//only relevant for doors
				
				if (PerceptiveFlags.canbeLockpeeked(pWall)) {			
					if (!PerceptiveFlags.#LockPeekingWallIDsFlag(pWall).length) {
						//create two lock peeking sight block walls				
						vLockPeekingWalls[0] = await WallUtils.clonedoorasWall(pWall, false);
						vLockPeekingWalls[1] = await WallUtils.clonedoorasWall(pWall, false);
						
						await PerceptiveFlags.#setLockPeekingWallIDs(pWall, vLockPeekingWalls.map(vWall => vWall.id));
					}
					
					vLockPeekingWalls = PerceptiveUtils.WallsfromIDs(PerceptiveFlags.#LockPeekingWallIDsFlag(pWall));
					
					for (let i = 0; i < vLockPeekingWalls.length; i++) {
						WallUtils.syncWallfromDoor(pWall, vLockPeekingWalls[i]);
						
						vLockPeekingWalls[i].update({c : WallUtils.calculateSlide(pWall.c, (1-cLockSize)/2, i).map(vvalue => Math.round(vvalue))});
					}
				}	
			}
			
			if (!PerceptiveFlags.canbeLockpeeked(pWall) && PerceptiveFlags.#LockPeekingWallIDsFlag(pWall).length) {
				//delete lock peeking sight block walls
				vLockPeekingWalls = PerceptiveUtils.WallsfromIDs(PerceptiveFlags.#LockPeekingWallIDsFlag(pWall), pWall.parent);
				
				for (let i = 0; i < vLockPeekingWalls.length; i++) {
					WallUtils.deletewall(vLockPeekingWalls[i]);
				}				
			}	
		}
	}
	
	static canbeLockpeeked(pWall) {
		return this.#canbeLockpeekedFlag(pWall) && !PerceptiveFlags.isLockpeekingWall(pWall);
	}
	
	static async setLockpeekedby(pWall, pIDs) {
		let vLockPeekingWallIDs = this.#LockPeekingWallIDsFlag(pWall);
		
		await this.#setLockpeekedby(pWall, pIDs)
		
		for (let vID in vLockPeekingWallIDs) {
			let vWall = PerceptiveUtils.WallfromID(vID);
			
			if (vWall) {
				await PerceptiveFlags.setLockpeekedby(vWall, pIDs);
			}
		}
	}
	
	static isLockpeekedby(pWall, pID) {
		return this.#LockpeekedbyFlag(pWall).includes(pID)
	}
	
	static async addLockpeekedby(pWall, pIDs) {
		await PerceptiveFlags.setLockpeekedby(pWall, this.#LockpeekedbyFlag(pWall).concat(pIDs));
	}
	
	static async removeLockpeekedby(pWall, pIDs) {
		await PerceptiveFlags.setLockpeekedby(pWall, this.#LockpeekedbyFlag(pWall).filter(vID => !pIDs.includes(vID)));
	}
	
	static isLockpeekingWall(pWall) {
		return this.#isLockPeekingWallFlag(pWall);
	}
	
	//moving door
	static Doorcanbemoved(pDoor) {
		return this.#DoorMovementFlag(pDoor) != cDoorMoveTypes[0];
	}
	
	static DoorStateisClosed(pDoor) {
		switch (PerceptiveFlags.DoorMovementType(pDoor)) {
			case "none":
				return !WallUtils.isOpened(pDoor);
				break;
			case "slide":
				return PerceptiveFlags.getDoorSlideState(pDoor) >= 1;
				break;
			case "swing":
				return Math.abs(PerceptiveFlags.getDoorSwingState(pDoor)) <= cangleepsilon;
				break;
			default :
				true;
		}
	}
	
	static DoorMovementType(pDoor) {
		return this.#DoorMovementFlag(pDoor);
	}
	
	static DoorHingePosition(pDoor) {
		return this.#DoorHingePositionFlag(pDoor);
	}
	
	static getmovingWallID(pDoor) {
		return this.#DoormovingWallIDFlag(pDoor);
	}
	
	static async createMovingWall(pDoor) {
		if (!PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor))) {
			let vWall = await WallUtils.clonedoorasWall(pDoor);
			
			await this.#setDoormovingWallIDFlag(pDoor, vWall.id);
		}
	}
	
	static async deleteMovingWall(pDoor) {
		if (PerceptiveFlags.getmovingWallID(pDoor)) {
			WallUtils.deletewall(PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor)));
			
			await this.#setDoormovingWallIDFlag(pDoor, "");
		}
	}
	
	static async hideMovingWall(pDoor) {
		if (PerceptiveFlags.getmovingWallID(pDoor)) {
			WallUtils.hidewall(PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor)));
		}		
	}
	
	static async synchMovingWall(pDoor) {
		if (PerceptiveFlags.getmovingWallID(pDoor)) {
			WallUtils.syncWallfromDoor(pDoor, PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor)));
		}			
	}
	
	static async setDoorSwingState(pDoor, pAngle) {
		await this.#setDoorSwingStateFlag(pDoor, pAngle%360);
	}
	
	static async changeDoorSwingState(pDoor, pChange) {
		await PerceptiveFlags.setDoorSwingState(pDoor, PerceptiveFlags.getDoorSwingState(pDoor) + pChange)
	} 
	
	static getDoorSwingSpeed(pDoor) {
		return this.#DoorSwingSpeedFlag(pDoor)%360;
	}
	
	static getDoorSlideSpeed(pDoor) {
		return this.#DoorSlideSpeedFlag(pDoor);
	}
	
	static getDoorSwingState(pDoor) {
		return this.#DoorSwingStateFlag(pDoor)%360;
	}
	
	static getDoorSlideState(pDoor) {
		return PerceptiveFlags.slideMinMax(this.#DoorSlideStateFlag(pDoor));
	}
	
	static async setDoorSlideState(pDoor, pSlide) {
		await this.#setDoorSlideStateFlag(pDoor, PerceptiveFlags.slideMinMax(pSlide));
	}
	
	static async changeDoorSlideState(pDoor, pChange) {
		await PerceptiveFlags.setDoorSlideState(pDoor, PerceptiveFlags.getDoorSlideState(pDoor) + pChange)
	} 
	
	static resetDoorMovement(pDoor) {
		PerceptiveFlags.setDoorSwingState(pDoor, 0);
		PerceptiveFlags.setDoorSlideState(pDoor, 1);
	}
	
	//support
	static slideMinMax(pSlide) {
		return Math.min(1, Math.max(0, pSlide));
	}

}

//Hooks.on("refreshWall", (pWall) => {PerceptiveFlags.synchLockpeekingWalls(pWall.document)});

//Export PerceptiveFlags Class
export{ PerceptiveFlags };
