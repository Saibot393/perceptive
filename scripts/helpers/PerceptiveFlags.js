import {WallUtils, cisPerceptiveWall} from "../utils/WallUtils.js";
import {GeometricUtils} from "../utils/GeometricUtils.js";
import {cModuleName, PerceptiveUtils} from "../utils/PerceptiveUtils.js";

const cangleepsilon = 1; //epsilon around zero for angles

const cDoorMoveTypes = ["none", "swing", "slide"];
const cHingePositions = [0, 1, 2];

const cSwingSpeedRange = [-180, 180];
const cSlideSpeedRange = [-1, 1];

export {cDoorMoveTypes, cHingePositions, cSwingSpeedRange, cSlideSpeedRange}
//Flags
const cisPerceptiveWallF = cisPerceptiveWall; //if this wall was created by this module

const ccanbeLockpeekedF = "canbeLockpeekedFlag"; //Flag that signals, that this wall can be lock peeked
const cLockPeekingWallIDsF = "LockPeekingWallIDsFlag"; //Flag for ids of the Lockpeekingwalls belonging to this door
const cLockpeekedbyF = "LockpeekedbyFlag"; //Flag that stores ids of tokens lock peeking this wall
const cisLockPeekingWallF = "isLockpeekingWallFlag"; //Flag that signals, that this wall is a lock peeking wall
const cLockPeekSizeF = "LockPeekSizeFlag"; //Flag that stores the size of the LockPeek
const cLockPeekPositionF = "LockPeekPositionFlag"; //Flag that stores the position of the LockPeek
const cisLockpeekingF = "isLockpeekingFlag"; //Flag that signals, that this token is lock peeking

const cDoormovingWallIDF = "DoormovingWallIDFlag"; //Flag for id of the DoormovingWall belonging to this door
const cDoorMovementF = "DoorMovementFlag"; //Flag that contains the movement type of this door
const cDoorHingePositionF = "DoorHingePositionFlag"; //flag to contain the info where the hinge of this door is placed
const cDoorSwingSpeedF = "DoorSwingSpeedFlag"; //Flag to save the swing Speed of a door
const cDoorSlideSpeedF = "DoorSlideSpeedFlag"; //Flag to save the slide Speed of a door
const cDoorSwingStateF = "DoorSwingStateFlag"; //Flag to save the currrent swing state of a door
const cDoorSwingRangeF = "DoorSwingRangeFlag"; //Flag to save the maximum range of the swing state
const cDoorSlideStateF = "DoorSlideStateFlag"; //Flag to save the currrent slide state of a door

export {cisPerceptiveWallF, ccanbeLockpeekedF, cLockPeekingWallIDsF, cLockpeekedbyF, cisLockPeekingWallF, cLockPeekSizeF, cLockPeekPositionF, cDoormovingWallIDF, cDoorMovementF, cDoorHingePositionF, cDoorSwingSpeedF, cDoorSwingRangeF, cDoorSlideSpeedF}

//handels all reading and writing of flags (other scripts should not touch Rideable Flags (other than possible RiderCompUtils for special compatibilityflags)
class PerceptiveFlags {
	//DECLARATIONS
	//basics
	static isPerceptiveWall(pWall) {} //returns if this wall was created by this Module
	
	//peeking
	static canbeLockpeeked(pWall) {} //returns of pWall can be lock peeked
	
	static LockPeekingSize(pWall) {} //returns the LockPeekingSize of pWall
	
	static LockPeekingPosition(pWall) {} //returns the LockpeekingPosition of pWall
	
	static async createLockpeekingWalls(pDoor) {} //creates the appropiate perceptive walls of pDoor
	
	static async deleteLockpeekingWalls(pDoor, pSelfDelete = false) {} //creates the appropiate perceptive walls of pDoor
	
	static async setLockpeekedby(pWall, pIDs) {} //set the Lockppekedby Flag of pWall
	
	static isLockpeekedby(pWall, pID) {} //returns if this wall is Lockpeekedby id
	
	static async addLockpeekedby(pWall, pIDs) {} //add to the Lockppekedby Flag of pWall
	
	static async removeLockpeekedby(pWall, pIDs) {} //remove from the Lockppekedby Flag of pWall
	
	static async addremoveLockpeekedby(pWall, paddIDs, premoveIDs) {} //adds and removes the IDs from Lockppekedby
	
	static async removeallLockpeekedby(pWall) {} //remove all from the Lockppekedby Flag of pWall
	
	static isLockpeekingWall(pWall) {} //returns of this wall is a lockpeeking wall (and should normally be ignored)
	
	static getLockpeekingWallIDs(pDoor) {} //returns the IDs of the Lockpeeking walls of pDoor
	
	static isLockpeeking(pToken) {} //returns if pToken is lock peeking
	
	static async stopLockpeeking(pToken) {} //set pToken to no longer be lockpeeking
	
	static getLockpeekedWall(pToken) {} //returns the wall that is peeked by pToken (if any)
	
	//moving door
	static Doorcanbemoved(pDoor) {} //if pDoor is a moving door
	
	static DoorStateisClosed(pDoor) {} //returns if moving state of pDoor is closed
	
	static DoorMovementType(pDoor) {} //returns the movement type of pDoor
	
	static DoorHingePosition(pDoor) {} //returns the hinge position of pDoor
	
	static getmovingWallID(pDoor) {} //returns the id of the moving wall belonging to this door
	
	static async createMovingWall(pDoor) {} //creates a new moving wall for pDoor
	
	static async deleteMovingWall(pDoor, pSelfDelete = false) {} //creates a new moving wall for pDoor
	
	static async hideMovingWall(pDoor) {} //hides the moving wall of pDoor
	
	static async synchMovingWall(pDoor) {} //synchs the moving wall of pDoor
	
	static async setDoorSwingState(pDoor, pAngle) {} //sets the swing state of pDoor
	
	static async changeDoorSwingState(pDoor, pChange) {} //change the swing state of pDoor

	static getDoorSwingSpeed(pDoor) {} //gets the swing speed of pDoor
	
	static getDoorSlideSpeed(pDoor) {} //gets the Slide speed of pDoor
	
	static getDoorSwingState(pDoor) {} //gets the swing state of pDoor
	
	static getDoorSwingRange(pDoor) {} //gets the swing state of pDoor
	
	static getDoorSlideState(pDoor) {} //gets the Slide state of pDoor
	
	static async setDoorSlideState(pDoor, pSlide) {} //sets the Slide state of pDoor
	
	static async changeDoorSlideState(pDoor, pChange) {} //change the Slide state of pDoor
	
	static resetDoorMovement(pDoor) {} //resets data related to door movement
	
	static getDoorPosition(pDoor) {} //returns the calculated position of a moving door pDoor
	
	//support
	static DoorMinMax(pSlide) {} //returns pSlide cut at interval [0,1]
	
	static SwingRangecorrected(pRange) {} //returns a valid, corrected range based on pRange
	
	//IMPLEMENTATIONS
	
	//flags handling support
	
	static #PerceptiveFlags (pObject) {	
	//returns all Module Flags of pObject (if any)
		if (pObject) {
			if (pObject.flags.hasOwnProperty(cModuleName)) {
				return pObject.flags[cModuleName];
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
		
		return game.settings.get(cModuleName, "Peekablebydefault") && WallUtils.isDoor(pWall); //default if anything fails
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
				return vFlag.isLockpeekingWallFlag;
			}
		}
		
		return false; //default if anything fails
	}
	
	static #LockPeekSizeFlag (pWall) { 
	//returns content of isLockPeekingWallFlag of pWall (if any) (boolean)
		let vFlag = this.#PerceptiveFlags(pWall);

		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockPeekSizeF) && vFlag.LockPeekSizeFlag != null) {
				return vFlag.LockPeekSizeFlag;
			}
		}
		
		return game.settings.get(cModuleName, "LockpeekstandardSize"); //default if anything fails
	}
	
	static #LockPeekPositionFlag (pWall) { 
	//returns content of isLockPeekingWallFlag of pWall (if any) (boolean)
		let vFlag = this.#PerceptiveFlags(pWall);

		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockPeekSizeF) && vFlag.LockPeekPositionFlag != null) {
				return vFlag.LockPeekPositionFlag;
			}
		}
		
		return 0.5; //default if anything fails
	}
	
	static #isLockpeekingFlag (pToken) { 
	//returns content of isLockpeekingFlag of pWall (if any) (boolean)
		let vFlag = this.#PerceptiveFlags(pToken);

		if (vFlag) {
			if (vFlag.hasOwnProperty(cisLockpeekingF)) {
				return vFlag.isLockpeekingFlag;
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
		
		if (WallUtils.isDoor(pWall)) {
			return game.settings.get(cModuleName, "DoorstandardMove"); //default if anything fails
		}
		else {
			return cDoorMoveTypes[0];
		}
	} 
	
	static #DoorHingePositionFlag (pWall) { 
	//returns content of DoorHingePositionFlag of pWall (must be 0 or 1)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorHingePositionF)) {
				return vFlag.DoorHingePositionFlag;
			}
		}
		
		return game.settings.get(cModuleName, "DoorstandardHinge"); //default if anything fails
	} 
	
	static #DoorSwingSpeedFlag (pWall) { 
	//returns content of DoorSwingSpeedFlag of pWall (in degrees)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorSwingSpeedF) && vFlag.DoorSwingSpeedFlag != null) {
				return vFlag.DoorSwingSpeedFlag;
			}
		}
		
		return game.settings.get(cModuleName, "DoorstandardSwingSpeed"); //default if anything fails
	} 
	
	static #DoorSlideSpeedFlag (pWall) { 
	//returns content of DoorSlideSpeedFlag of pWall (in degrees)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorSlideSpeedF) && vFlag.DoorSlideSpeedFlag != null) {
				return vFlag.DoorSlideSpeedFlag;
			}
		}
		
		return game.settings.get(cModuleName, "DoorstandardSlideSpeed"); //default if anything fails
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
	
	static #DoorSwingRangeFlag (pWall) { 
	//returns content of DoorSwingRangeFlag of pWall (in degrees)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorSwingStateF)) {
				return vFlag.DoorSwingRangeFlag;
			}
		}
		
		return [-Infinity, Infinity]; //default if anything fails
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
		await pWall.update({
			flags: {
				[cModuleName]: {
					[cLockPeekingWallIDsF]: pContent
				}
			}
		}, {PerceptiveChange : true});
		
		return true;
	}
	
	static async #setLockpeekedby (pWall, pContent) {
	//sets content of DoormovingWallIDFlag (must be id)
		await pWall.update({
			flags: {
				[cModuleName]: {
					[cLockpeekedbyF]: pContent
				}
			}
		}, {PerceptiveChange : true});
		
		return true;
	}
	
	static async #setDoormovingWallIDFlag (pWall, pContent) {
	//sets content of DoormovingWallIDFlag (must be id)
		await pWall.update({
			flags: {
				[cModuleName]: {
					[cDoormovingWallIDF]: pContent
				}
			}
		}, {PerceptiveChange : true});
		
		return true;
	}
	
	static async #setDoorSwingStateFlag (pWall, pContent) {
	//sets content of DoorSwingStateFlag (must be boolean)
		await pWall.update({
			flags: {
				[cModuleName]: {
					[cDoorSwingStateF]: Number(pContent)
				}
			}
		}, {PerceptiveChange : true});
		
		return true;
	}
	
	static async #setDoorSlideStateFlag (pWall, pContent) {
	//sets content of DoorSlideStateFlag (must be boolean)
		await pWall.update({
			flags: {
				[cModuleName]: {
					[cDoorSlideStateF]: Number(pContent)
				}
			}
		}, {PerceptiveChange : true});
		
		return true;
	}
	
	static async #setisLockpeekingFlag (pToken, pContent) {
		//sets content of isLockpeekingFlag (must be boolean)
		if (pToken) {
			await pToken.setFlag(cModuleName, cisLockpeekingF, Boolean(pContent)); 
			
			return true;
		}
		return false;
	}
	
	//basics
	static isPerceptiveWall(pWall) {
		return Boolean(this.#isPerceptiveWallFlag(pWall));
	}
	
	//peeking
	static canbeLockpeeked(pWall) {
		return this.#canbeLockpeekedFlag(pWall) && !PerceptiveFlags.isLockpeekingWall(pWall);
	}
	
	static LockPeekingSize(pWall) {
		return PerceptiveFlags.DoorMinMax(this.#LockPeekSizeFlag(pWall));
	}
	
	static LockPeekingPosition(pWall) {
		return PerceptiveFlags.DoorMinMax(this.#LockPeekPositionFlag(pWall));
	}
	
	static async createLockpeekingWalls(pDoor) {
		if (!PerceptiveUtils.WallsfromIDs(PerceptiveFlags.getLockpeekingWallIDs(pDoor)).length) {
			
			let vWalls = [];

			vWalls[0] = await WallUtils.clonedoorasWall(pDoor); //vision block 1
			vWalls[1] = await WallUtils.clonedoorasWall(pDoor); //vision block 2
			vWalls[2] = await WallUtils.clonedoorasWall(pDoor); //movement block
			
			for (let i = 0; i < vWalls.length; i++) {
				vWalls[i].setFlag(cModuleName, cisLockPeekingWallF, true)
			}
			
			await this.#setLockPeekingWallIDs(pDoor, PerceptiveUtils.IDsfromWalls(vWalls));
		}
	}
	
	static async deleteLockpeekingWalls(pDoor, pSelfDelete = false) {
		let vIDs = PerceptiveFlags.getLockpeekingWallIDs(pDoor);
		
		for (let i = 0; i < vIDs.length; i++) {
			WallUtils.deletewall(PerceptiveUtils.WallfromID(vIDs[i]));
		}
		
		if (!pSelfDelete) {
			this.#setLockPeekingWallIDs(pDoor, []);
		}
	}
	
	static async setLockpeekedby(pWall, pIDs) {
		let vLockPeekingWallIDs = this.#LockPeekingWallIDsFlag(pWall);
		
		for (let i = 0; i < pIDs.length; i++) {
			this.#setisLockpeekingFlag(PerceptiveUtils.TokenfromID(pIDs[i], pWall.parent), true);
		}
		
		await this.#setLockpeekedby(pWall, pIDs)
		
		for (let i = 0; i < vLockPeekingWallIDs.length; i++) {
			
			let vWall = PerceptiveUtils.WallfromID(vLockPeekingWallIDs[i], pWall.parent);
			
			if (vWall) {
				await PerceptiveFlags.#setLockpeekedby(vWall, pIDs);
			}
		}
	}
	
	static isLockpeekedby(pWall, pID) {
		return this.#LockpeekedbyFlag(pWall).includes(pID);
	}
	
	static async addLockpeekedby(pWall, pIDs) {
		await PerceptiveFlags.setLockpeekedby(pWall, this.#LockpeekedbyFlag(pWall).concat(pIDs));
	}
	
	static async removeLockpeekedby(pWall, pIDs) {
		await PerceptiveFlags.setLockpeekedby(pWall, this.#LockpeekedbyFlag(pWall).filter(vID => !pIDs.includes(vID)));
	}
	
	static async addremoveLockpeekedby(pWall, paddIDs, premoveIDs) {
		await PerceptiveFlags.setLockpeekedby(pWall, this.#LockpeekedbyFlag(pWall).concat(paddIDs).filter(vID => !premoveIDs.includes(vID)));
	}
	
	static async removeallLockpeekedby(pWall) {
		for (let i = 0; i < this.#LockpeekedbyFlag(pWall).length; i++) {
			PerceptiveFlags.stopLockpeeking(pWall.parent.tokens.get(this.#LockpeekedbyFlag(pWall)[i]));
		}
		
		await PerceptiveFlags.setLockpeekedby(pWall, []);
	}
	
	static isLockpeekingWall(pWall) {
		return this.#isLockPeekingWallFlag(pWall);
	}
	
	static getLockpeekingWallIDs(pDoor) {
		return this.#LockPeekingWallIDsFlag(pDoor);
	}
	
	static isLockpeeking(pToken) {
		return this.#isLockpeekingFlag(pToken);
	}
	
	static async stopLockpeeking(pToken) {
		await this.#setisLockpeekingFlag(pToken, false);
	}
	
	static getLockpeekedWall(pToken) {
		return pToken.scene.walls.find(vWall => !PerceptiveFlags.isPerceptiveWall(vWall) && PerceptiveFlags.isLockpeekedby(vWall, pToken.id));
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
				return (Math.abs(PerceptiveFlags.getDoorSwingState(pDoor)) <= cangleepsilon) || (PerceptiveFlags.DoorHingePosition(pDoor) == 2 && Math.abs(PerceptiveFlags.getDoorSwingState(pDoor) % 180) <= cangleepsilon);
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
		if (!PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent)) {
			let vWall = await WallUtils.clonedoorasWall(pDoor);
			
			await this.#setDoormovingWallIDFlag(pDoor, vWall.id);
		}
	}
	
	static async deleteMovingWall(pDoor, pSelfDelete = false) {
		if (PerceptiveFlags.getmovingWallID(pDoor)) {
			WallUtils.deletewall(PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor)));
		}
		
		if (!pSelfDelete) {
			await this.#setDoormovingWallIDFlag(pDoor, "");
		}
	}
	
	static async hideMovingWall(pDoor) {
		if (PerceptiveFlags.getmovingWallID(pDoor)) {
			WallUtils.hidewall(PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent));
		}		
	}
	
	static async synchMovingWall(pDoor) {
		if (PerceptiveFlags.getmovingWallID(pDoor)) {
			WallUtils.syncWallfromDoor(pDoor, PerceptiveUtils.WallfromID(PerceptiveFlags.getmovingWallID(pDoor), pDoor.parent));
		}			
	}
	
	static async setDoorSwingState(pDoor, pAngle) {
		await this.#setDoorSwingStateFlag(pDoor, Math.max(PerceptiveFlags.getDoorSwingRange(pDoor)[0], Math.min(PerceptiveFlags.getDoorSwingRange(pDoor)[1], pAngle%360)));
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
	
	static getDoorSwingRange(pDoor) {
		return PerceptiveFlags.SwingRangecorrected(this.#DoorSwingRangeFlag(pDoor));
	}
	
	static getDoorSlideState(pDoor) {
		return PerceptiveFlags.DoorMinMax(this.#DoorSlideStateFlag(pDoor));
	}
	
	static async setDoorSlideState(pDoor, pSlide) {
		await this.#setDoorSlideStateFlag(pDoor, PerceptiveFlags.DoorMinMax(pSlide));
	}
	
	static async changeDoorSlideState(pDoor, pChange) {
		await PerceptiveFlags.setDoorSlideState(pDoor, PerceptiveFlags.getDoorSlideState(pDoor) + pChange)
	} 
	
	static resetDoorMovement(pDoor) {
		PerceptiveFlags.setDoorSwingState(pDoor, 0);
		PerceptiveFlags.setDoorSlideState(pDoor, 1);
	}
	
	static getDoorPosition(pDoor) {
		switch (PerceptiveFlags.DoorMovementType(pDoor)) {
			case "swing":
					return WallUtils.calculateSwing(pDoor.c, PerceptiveFlags.getDoorSwingState(pDoor), PerceptiveFlags.DoorHingePosition(pDoor)).map(vvalue => Math.round(vvalue));
				break;
				
			case "slide":
					return WallUtils.calculateSlide(pDoor.c, PerceptiveFlags.getDoorSlideState(pDoor), PerceptiveFlags.DoorHingePosition(pDoor)).map(vvalue => Math.round(vvalue));
				break;
		}
		
		return [];
	}
	
	//support
	static DoorMinMax(pSlide) {
		return Math.min(1, Math.max(0, pSlide));
	}

	static SwingRangecorrected(pRange) {
		let vRange = pRange;
		
		if (!vRange || vRange.length < 2) {
			vRange = [-Infinity, Infinity];
		}
		else {		
			if (vRange[0] > vRange[1]) {
				let vBuffer = vRange[0];
				
				vRange[0] = vRange[1];
				vRange[1] = vBuffer;
			}
			
			if (isNaN(vRange[0])) {
				vRange[0] = -Infinity;
			}
			
			if (isNaN(vRange[1])) {
				vRange[1] = Infinity;
			}
		}
		
		return vRange;
	}
	
}

//Export PerceptiveFlags Class
export{ PerceptiveFlags };
