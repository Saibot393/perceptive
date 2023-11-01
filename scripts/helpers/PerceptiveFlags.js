import {WallUtils, cisPerceptiveWall} from "../utils/WallUtils.js";
import {GeometricUtils} from "../utils/GeometricUtils.js";
import {cModuleName, PerceptiveUtils, Translate} from "../utils/PerceptiveUtils.js";
import {VisionUtils} from "../utils/VisionUtils.js";
import {PerceptiveSystemUtils} from "../utils/PerceptiveSystemUtils.js";
import { PerceptiveCompUtils} from "../compatibility/PerceptiveCompUtils.js";

const cangleepsilon = 1; //epsilon around zero for angles

const cDoorMoveTypes = ["none", "swing", "slide"];
const cHingePositions = [0, 1, 2];

const cSwingSpeedRange = [-180, 180];
const cSlideSpeedRange = [-1, 1];

const cDelimiter = ";";

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
const cPreventNormalOpenF = "PreventNormalOpenFlag"; //Flag to signal that normal foundry opens of this door should be prevented

const ccanbeSpottedF = "canbeSpottedFlag"; //returns if this object can be spotted
const cPPDCF = "PPDCFlag"; //Flag for the passive perception DC of this object
const cPPDiceF = "PPDiceFlag"; //Flag to store the dice rolled for the PPDC
const cAPDCF = "APDCFlag"; //Flag for the passive perception DC of this object
const cSpottedbyF = "SpottedbyFlag"; //Flag to save the ids of actors by which this object has been spotted
const cresetSpottedbyMoveF = "resetSpottedbyMoveFlag"; //Flag to reset the spooted by ids of this (Token) when it moves
const cLightLevelF = "LightLevelFlag"; //stores the current light level of an object
const cStealthEffectsF = "StealthEffectsFlag"; //Flag to to store custom stealth effects of this token
const cOverrideWorldSEffectsF = "OverrideWorldSEffectsFlag"; //Flag to override the world stealth effects
const cSceneBrightEndF = "SceneBrightEndFlag"; //flag that stores the scene darkness value after which a scene is no longer bright
const cSceneDimEndF = "SceneDimEndFlag"; //flag that stores the scene darkness value after which a scene is no longer dim
const cPerceptiveStealthingF = "PerceptiveStealthingFlag"; //Flag that stores if this token is perceptive stealthing
const cLockPPDCF = "LockPPDCFlag"; //Flag to lock the PPDC (only for Pf2e)
const cLingeringAPF = "LingeringAPFlag"; //FLag to store lingering AP
const cLingeringAPInfoF = "LingeringAPInfoFlag"; //Flag to store LingeringAPInfo
const cotherSkillADCsF = "otherSkillADCsFlag"; //Flag that stores other skill DCs for spotting
const cTilePerceptiveNameF = "TilePerceptiveNameFlag"; //Flag for the name of the perceptive tile

const cPerceptiveEffectF = "PerceptiveEffectFlag"; //Flag to signal that this effect was created by perceptive
const cEffectInfoF = "EffectInfoFlag"; //Flag to store additional infos in effects

export {cisPerceptiveWallF, ccanbeLockpeekedF, cLockPeekingWallIDsF, cLockpeekedbyF, cisLockPeekingWallF, cLockPeekSizeF, cLockPeekPositionF, cDoormovingWallIDF, cDoorMovementF, cDoorHingePositionF, cDoorSwingSpeedF, cDoorSwingRangeF, cPreventNormalOpenF, cDoorSlideSpeedF, ccanbeSpottedF, cPPDCF, cAPDCF, cresetSpottedbyMoveF, cStealthEffectsF, cOverrideWorldSEffectsF, cSceneBrightEndF, cSceneDimEndF, cPerceptiveStealthingF, cLockPPDCF, cotherSkillADCsF, cTilePerceptiveNameF}

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
	
	static PreventNormalOpen(pDoor, pRaw = false) {} //returns if this door should be normal openable
	
	//spotting
	static canbeSpotted(pObject) {} //returns if this object can be spotted by any means
	
	static async MakeSpottable(pObject) {} //makes pObject spottable
	
	static canbeSpottedwith(pObject, pTokens, pVisionLevel, pPPvalue, pInfos = {CritMode : 0, TokenSuccessDegrees : {}, Pf2eRules : false}) {} //returns wether this pObject can be spotted by pTokens with pPPvalue
		
	static canbeSpottedpassiv(pObject) {}//returns if this pObject can be spotted passively
	
	static canbeSpottedactive(pObject) {}//returns if this pObject can be spotted actively
	
	static getPPDC(pObject, praw = false) {} //returns the Passiv perception DC
	
	static getPPDice(pObject) {} //returns the dice rolled for the PPDC of pObject
	
	static getAPDC(pObject, praw = false) {} //returns the Active perception DC
	
	static getPPDCModified(pObject, pVisionMode = 0) {} //returns the Passiv perception DC
	
	static getAPDCModified(pObject, pVisionMode = 0, pSkill = "") {} //returns the Active perception DC
	
	static isSpottedby(pObject, pToken) {} //returns if pObject is spotted by pToken
	
	static isSpottedbyone(pObject, pTokens) {} //returns if pObject is spotted by one of pTokens
	
	static async addSpottedby(pObject, pToken) {} //adds pToken to the list of tokens that spotted pObject
	
	static SpottedbyNames(pObject) {} //returns the names of tokens this object is spotted by
	
	static async clearSpottedby(pObject) {} //clears the list of tokens that spotted pObject
	
	static async setSpottingDCs(pObject, pDCs) {} //sets the spotting dcs of pObject, pDCs can have attributed PPDC and APDC
	
	static resetSpottedbyMove(pToken) {} //returns if the spottedbys of this pToken should be reset on move
	
	static LightLevel(pObject) {} //returns the last calculated light level of pObject
	
	static async CheckLightLevel(pObject, pUsePosition = false) {} //updates the light level calculation of pObject
	
	static getLightLevelModifier(pObject, pVisionLevel = 0) {} //returns the current light level modifier of pObject
	
	static getAPRollBehaviour(pObject, pVisionLevel = 0) {} //returns the current APRoll behaviour of pObject
	
	static StealthEffects(pToken, pRaw = false) {} //returns the stealth effects of pToken
	
	static OverrideWorldSEffects(pToken) {} //returns if this pTokens effects override the worlds effect
	
	static async resetStealth(pToken) {} //resets the stealth related flags of pToken
	
	static SceneBrightEnd(pScene) {} //returns the Bright end value of pScene
	
	static SceneDimEnd(pScene) {} //returns the Bright end value of pScene
	
	static isPerceptiveStealthing(pToken) {} //returns of this token is perceptive stealthing
	
	static async togglePerceptiveStealthing(pToken) {} //returns of this token is perceptive stealthing
	
	static async setPerceptiveStealthing(pToken, pStealthing) {} //sets the perceptive stealthing of pToken
	
	static PPDCLocked(pToken) {} //returns if the PPDC if pToken is locked (only PF2e)
	
	static async setLingeringAP(pToken, pResults, pInfos = {}) {} //sets the lingering AP of pToken to pResults (array of array each containing total and dice result)
	
	static async resetLingeringAP(pToken) {} //resets the Lingering AP of pToken
	
	static LingeringAP(pToken) {} //returns the Lingering AP of pToken (undefined if not set)
	
	static LingeringAPInfo(pToken) {} //returns the Lingering AP info of pToken
	
	static hasLingeringAP(pToken) {} //returns if pToken has a lingering ap set
	
	static setotherSkillADCs(pObject, pADCs) {} //sets other ADCs of pObject
	
	static getotherSkillADC(pObject, pKey, pRaw = false) {} //gets the ADC of pObject belonging to pKey
	
	static PerceptiveName(pToken) {} //returns name of pToken, either token name or Tile rideable name
	
	static getPerceptionAEBonus(pToken, pObjectType, pCheckType) {} //returns pTokens bonus to spot a pObjectType[Wall,Token,Tile] with pCheckType[passive, active ("" will fall back to this), other skills]
	
	static getPerceptionAEBehaviour(pToken, pObjectType, pCheckType) {} //returns pTokens roll behaviour to spot a pObjectType[Wall,Token,Tile] with pCheckType[active ("" will fall back to this), other skills]
		
	//effects
	static async MarkasPerceptiveEffect(pEffect, pInfos = {}) {} //marks pEffect as perceptive Effects
	
	static isPerceptiveEffect(pEffect) {} //returns if pEffect is perceptive effect
	
	static EffectInfos(pEffect) {} //returns the content of the pEffect info flag
	
	//support
	static DoorMinMax(pSlide) {} //returns pSlide cut at interval [0,1]
	
	static SwingRangecorrected(pRange) {} //returns a valid, corrected range based on pRange
	
	static StringtoRange(pString, pDelimiter = ":") {} //get a range from a given string, default is [-Infinity, Infinity]
	
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
		
		return game.settings.get(cModuleName, "LockpeekstandardPosition"); //default if anything fails
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
		
		return -1; //default if anything fails
	} 
	
	static #DoorSwingRangeFlag (pWall) { 
	//returns content of DoorSwingRangeFlag of pWall (in degrees)
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cDoorSwingRangeF)) {
				return vFlag.DoorSwingRangeFlag;
			}
		}
		
		return PerceptiveFlags.StringtoRange(game.settings.get(cModuleName, "DoorStandardSwingRange"));//[-Infinity, Infinity]; //default if anything fails
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
	
	static #PreventNormalOpenFlag (pWall) { 
	//returns content of PreventNormalOpenFlag of pWall
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cPreventNormalOpenF)) {
				return vFlag.PreventNormalOpenFlag;
			}
		}
		
		return game.settings.get(cModuleName, "PreventNormalOpenbydefault"); //default if anything fails
	}
	
	static #canbeSpottedFlag (pWall) { 
	//returns content of PreventNormalOpenFlag of pWall
		let vFlag = this.#PerceptiveFlags(pWall);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(ccanbeSpottedF)) {
				return vFlag.canbeSpottedFlag;
			}
		}
		
		return false; //default if anything fails
	}
	
	static #PPDCFlag (pObject) { 
	//returns content of PPDCFlag of object (number)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cPPDCF)) {
				return vFlag.PPDCFlag;
			}
		}
		
		return -1; //default if anything fails
	}
	
	static #PPDiceFlag (pObject) { 
	//returns content of PPDiceFlag of object (number)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cPPDiceF)) {
				return vFlag.PPDiceFlag;
			}
		}
		
		return -1; //default if anything fails
	}
	
	static #APDCFlag (pObject) { 
	//returns content of PPDCFlag of object (number)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cAPDCF)) {
				return vFlag.APDCFlag;
			}
		}
		
		return null; //default if anything fails
	}	
	
	static #SpottedbyFlag (pObject) { 
	//returns content of PPDCFlag of object (number)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cSpottedbyF)) {
				return vFlag.SpottedbyFlag;
			}
		}
		
		return []; //default if anything fails
	}
	
	static #LightLevelFlag (pObject) { 
	//returns content of LightLevelFlag of object (number)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLightLevelF)) {
				return vFlag.LightLevelFlag;
			}
		}
		
		return 0; //default if anything fails
	}
	
	static #StealthEffectsFlag (pObject) { 
	//returns content of StealthEffectsFlag of object (string)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cStealthEffectsF)) {
				return vFlag.StealthEffectsFlag;
			}
		}
		
		return ""; //default if anything fails
	}
	
	static #OverrideWorldSEffectsFlag (pObject) { 
	//returns content of CustomStealthEffectsFlag of object (string)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cOverrideWorldSEffectsF)) {
				return vFlag.OverrideWorldSEffectsFlag;
			}
		}
		
		return false; //default if anything fails
	}
	
	static #SceneBrightEndFlag (pObject) { 
	//returns content of SceneBrightEndFlag of object (number)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cSceneBrightEndF)) {
				return vFlag.SceneBrightEndFlag;
			}
		}
		
		return 0.25; //default if anything fails
	}
	
	static #SceneDimEndFlag (pObject) { 
	//returns content of SceneDimEndFlag of object (number)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cSceneDimEndF)) {
				return vFlag.SceneDimEndFlag;
			}
		}
		
		return 0.75; //default if anything fails
	}
	
	static #PerceptiveStealthingFlag (pObject) { 
	//returns content of PerceptiveStealthingFlag of object (boolean)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cPerceptiveStealthingF)) {
				return vFlag.PerceptiveStealthingFlag;
			}
		}
		
		return false; //default if anything fails
	}
	
	static #LockPPDCFlag (pObject) { 
	//returns content of LockPPDCFlag of object (boolean)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockPPDCF)) {
				return vFlag.LockPPDCFlag;
			}
		}
		
		return false; //default if anything fails
	}
	
	static #LingeringAPFlag (pObject) { 
	//returns content of LingeringAPFlag of object (array os results)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLingeringAPF)) {
				return vFlag.LingeringAPFlag;
			}
		}
		
		return []; //default if anything fails
	}
	
	static #LingeringAPInfoFlag (pObject) { 
	//returns content of LingeringAPInfoFlag of object (object)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLingeringAPInfoF)) {
				return vFlag.LingeringAPInfoFlag;
			}
		}
		
		return {}; //default if anything fails
	}
	
	static #otherSkillADCsFlag (pObject) { 
	//returns content of otherSkillADCsFlag of object (object)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cotherSkillADCsF)) {
				return vFlag.otherSkillADCsFlag;
			}
		}
		
		return {}; //default if anything fails
	}	
	
	static #TilePerceptiveNameFlag (pToken) { 
	//returns content of TilePerceptiveNameFlag of pToken (if any) (string)
		let vFlag = this.#PerceptiveFlags(pToken);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cTilePerceptiveNameF)) {
				return vFlag.TilePerceptiveNameFlag;
			}
		}
		
		return Translate("Titles.Tile"); //default if anything fails
	} 
	
	static #resetSpottedbyMoveFlag (pObject) { 
	//returns content of resetSpottedbyMoveFlag of object (boolean)
		let vFlag = this.#PerceptiveFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cresetSpottedbyMoveF)) {
				return vFlag.resetSpottedbyMoveFlag;
			}
		}
		
		return game.settings.get(cModuleName, "resetSpottedbyMovedefault"); //default if anything fails
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
	
	static async #setSpottedby (pObject, pContent) {
		//sets content of isSpottedbyFlag (array of IDs)
		if (pObject) {
			await pObject.setFlag(cModuleName, cSpottedbyF, pContent); 
			
			return true;
		}
		return false;		
	}
	
	static async #setPPDC (pObject, pContent) {
		//sets content of PPDCFlag (number)
		if (pObject && !isNaN(pContent)) {
			await pObject.setFlag(cModuleName, cPPDCF, pContent); 
			
			return true;
		}
		return false;					
	}
	
	static async #setPPDice (pObject, pContent) {
		//sets content of PPDiceFlag (number)
		if (pObject && !isNaN(pContent)) {
			await pObject.setFlag(cModuleName, cPPDiceF, pContent); 
			
			return true;
		}
		return false;					
	}
	
	static async #setAPDC (pObject, pContent) {
		//sets content of APDCFlag (number)
		if (pObject && !isNaN(pContent)) {
			await pObject.setFlag(cModuleName, cAPDCF, pContent); 
			
			return true;
		}
		return false;					
	}
	
	static async #setLightLevel (pObject, pContent) {
		//sets content of APDCFlag (number)
		if (pObject && !isNaN(pContent)) {
			await pObject.setFlag(cModuleName, cLightLevelF, pContent); 
			
			return true;
		}
		return false;					
	}
	
	static async #setPerceptiveStealthing (pToken, pContent) {
		//sets content of PerceptiveStealthingFlag (must be boolean)
		if (pToken) {
			await pToken.update({
				flags: {
					[cModuleName]: {
						[cPerceptiveStealthingF]: Boolean(pContent)
					}
				}
			}, {PerceptiveVisionupdate : true});
			//await pToken.setFlag(cModuleName, cPerceptiveStealthingF, Boolean(pContent), {PerceptiveVisionupdate : true}); 
			
			return true;
		}
		return false;
	}
	
	static async #setcanbeSpotted (pObject, pContent) {
		//sets content of canbeSpottedFlag (Boolean)
		if (pObject) {
			await pObject.setFlag(cModuleName, ccanbeSpottedF, Boolean(pContent)); 
			
			return true;
		}
		return false;					
	}
	
	static async #setLingeringAP (pObject, pContent) {
		//sets content of LingeringAPFlag (array of results)
		if (pObject) {
			await pObject.setFlag(cModuleName, cLingeringAPF, pContent); 
			
			return true;
		}
		return false;					
	}
	
	static async #setLingeringAPInfo (pObject, pContent) {
		//sets content of LingeringAPInfoFlag (object)
		if (pObject) {
			await pObject.setFlag(cModuleName, cLingeringAPInfoF, pContent); 
			
			return true;
		}
		return false;					
	}
	
	static async #setotherSkillADCs (pObject, pContent) {
		//sets content of otherSkillADCsFlag (object)
		if (pObject) {
			await pObject.setFlag(cModuleName, cotherSkillADCsF, pContent); 
			
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
		
		await this.#setLockpeekedby(pWall, pIDs.filter(vID => PerceptiveFlags.#LockpeekedbyFlag(pWall).includes(vID)));
		
		for (let i = 0; i < vLockPeekingWallIDs.length; i++) {
			
			let vWall = PerceptiveUtils.WallfromID(vLockPeekingWallIDs[i], pWall.parent);
			
			if (vWall) {
				await PerceptiveFlags.#setLockpeekedby(vWall, pIDs);
			}
		}
		
		await this.#setLockpeekedby(pWall, pIDs);
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
		return pToken.object.scene.walls.find(vWall => !PerceptiveFlags.isPerceptiveWall(vWall) && PerceptiveFlags.isLockpeekedby(vWall, pToken.id));
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

	static PreventNormalOpen(pDoor, pRaw = false) {
		return this.#PreventNormalOpenFlag(pDoor) && (pRaw || PerceptiveFlags.Doorcanbemoved(pDoor));
	}
	
	//spotting
	static canbeSpotted(pObject) {
		return PerceptiveFlags.#canbeSpottedFlag(pObject);
	}
	
	static async MakeSpottable(pObject) {
		this.#setcanbeSpotted(pObject, true);
	}
	
	static canbeSpottedwith(pObject, pTokens, pVisionLevel, pPPvalue, pInfos = {CritMode : 0, TokenSuccessDegrees : {}, Pf2eRules : false}) {
		if (pInfos.Pf2eRules) {
			//only Pf2e
			if (PerceptiveFlags.canbeSpotted(pObject)) {
				let vSuccessDegree = 0;
				
				
				if (PerceptiveFlags.canbeSpotted(pObject)) {
					vSuccessDegree = PerceptiveUtils.successDegree([PerceptiveFlags.getPPDCModified(pObject, pVisionLevel), PerceptiveFlags.getPPDice(pObject)], pPPvalue, pInfos.CritMode);
					
					if (vSuccessDegree > 0 && PerceptiveFlags.isSpottedbyone(pObject, pTokens)) {
						return true;
					}
				}
				
				pInfos.TokenSuccessDegrees[pObject.id] = vSuccessDegree; //normal success if no other conditions are met
				
				return vSuccessDegree <= 0;
			}
			
			return false;
		}
		
		return PerceptiveFlags.canbeSpotted(pObject) && ((PerceptiveFlags.getPPDCModified(pObject, pVisionLevel) <= pPPvalue) || PerceptiveFlags.isSpottedbyone(pObject, pTokens))
	}
	
	static canbeSpottedpassiv(pObject) {
		return this.#PPDCFlag(pObject) >= 0; //for speed
	}
	
	static canbeSpottedactive(pObject) {
		return PerceptiveFlags.getAPDC(pObject) < Infinity;
	}
	
	static getPPDC(pObject, praw = false) {
		let vDC = this.#PPDCFlag(pObject);
		
		if ((vDC <= 0) && !praw) {
			return Infinity;
		}
		else {
			return vDC;
		}
	}
	
	static getPPDice(pObject) {
		return this.#PPDiceFlag(pObject);
	}
	
	static getAPDC(pObject, praw = false) {
		let vDC = this.#APDCFlag(pObject);
		
		if ((vDC == null) && !praw) {
			return PerceptiveFlags.getPPDC(pObject);
		}
		else {
			return vDC;
		}		
	}
	
	static getPPDCModified(pObject, pVisionMode = 0) {
		return PerceptiveFlags.getPPDC(pObject) + PerceptiveFlags.getLightLevelModifier(pObject, pVisionMode);
	}
	
	static getAPDCModified(pObject, pVisionMode = 0, pSkill = "") {
		let vSkillValue;
		
		if (!(pSkill?.length > 0)) {
			vSkillValue = PerceptiveFlags.getAPDC(pObject);
		}
		else {
			vSkillValue = PerceptiveFlags.getotherSkillADC(pObject, pSkill);
		}
		
		if (game.settings.get(cModuleName, "UseIlluminationPDCModifierforAP")) {
			return vSkillValue + PerceptiveFlags.getLightLevelModifier(pObject, pVisionMode);	
		}
		else {
			return vSkillValue;
		}
	}
	
	static isSpottedby(pObject, pToken) {
		return this.#SpottedbyFlag(pObject).includes(pToken.id);
	}
	
	static isSpottedbyone(pObject, pTokens) {
		return pTokens.find(vToken => PerceptiveFlags.isSpottedby(pObject, vToken));
	}
	
	static async addSpottedby(pObject, pToken) {
		if (!PerceptiveFlags.isSpottedby(pObject, pToken)) {
			await this.#setSpottedby(pObject, this.#SpottedbyFlag(pObject).concat([pToken.id]));
		}
	}
	
	static SpottedbyNames(pObject) {
		return PerceptiveUtils.TokenNamesfromIDs(this.#SpottedbyFlag(pObject), pObject.parent);
	}
	
	static async clearSpottedby(pObject) {
		await this.#setSpottedby(pObject, []);
	}
	
	static async setSpottingDCs(pObject, pDCs) {
		if (pDCs.hasOwnProperty("PPDC")) {
			await PerceptiveFlags.#setPPDC(pObject, pDCs.PPDC)
		}
		
		if (pDCs.hasOwnProperty("APDC")) {
			await PerceptiveFlags.#setAPDC(pObject, pDCs.APDC)
		}
		
		if (pDCs.hasOwnProperty("PPDice")) {
			await PerceptiveFlags.#setPPDice(pObject, pDCs.PPDice)
		}
	}
	
	static resetSpottedbyMove(pToken) {
		return this.#resetSpottedbyMoveFlag(pToken);
	}
	
	static LightLevel(pObject) {
		return this.#LightLevelFlag(pObject);
	}
	
	static async CheckLightLevel(pObject, pUsePosition = false) {
		if (pUsePosition) {
			await this.#setLightLevel(pObject, VisionUtils.LightingLevel(GeometricUtils.CenterPositionXY(pObject.object), pObject.parent));
		}
		else {
			if (pObject.center) {
				await this.#setLightLevel(pObject, VisionUtils.LightingLevel(pObject.center, pObject.parent));
			}
			else {
				await this.#setLightLevel(pObject, VisionUtils.LightingLevel(GeometricUtils.insceneCenter(pObject), pObject.parent));
			}
		}
	}
	
	static getLightLevelModifier(pObject, pVisionLevel = 0) {
		if (pObject.documentName == "Wall" || pObject.documentName == "Tile") {
			return 0;
		}
		
		if (pVisionLevel < 0 || !game.settings.get(cModuleName, "useSpottingLightLevels")) {
			return 0;
		}
		else {
			let vIlluminationLevel = VisionUtils.correctedLightLevel(PerceptiveFlags.LightLevel(pObject), pVisionLevel);
			
			let vModifier = pObject.actor?.flags?.perceptive?.Modifiers?.PDC?.Illumination; //AE effects source
			
			if (vModifier) {
				vModifier = vModifier[vIlluminationLevel];
			}
			
			if (isNaN(vModifier)) {
				vModifier = 0; //if something went wrong
			}
			
			return VisionUtils.LightingPDCModifier(vIlluminationLevel) + vModifier;
		}
	}
	
	static getAPRollBehaviour(pObject, pVisionLevel = 0) {
		if (pObject.documentName == "Wall" || pObject.documentName == "Tile") {
			return "=";
		}
		
		return VisionUtils.LightingAPDCBehaviour(VisionUtils.correctedLightLevel(PerceptiveFlags.LightLevel(pObject), pVisionLevel));
	}
	
	static StealthEffects(pToken, pRaw = false) {
		if (pRaw) {
			return this.#StealthEffectsFlag(pToken);
		}
		else {
			return this.#StealthEffectsFlag(pToken).split(cDelimiter);
		}
	}
	
	static OverrideWorldSEffects(pToken) {
		return this.#OverrideWorldSEffectsFlag(pToken);
	}
	
	static async resetStealth(pToken) {
		await PerceptiveFlags.clearSpottedby(pToken);
		
		await PerceptiveFlags.#setPPDC(pToken, -1);
		
		if (game.settings.get(cModuleName, "AutomateTokenSpottable")) {
			await this.#setcanbeSpotted(pToken, false);
		}
	}
	
	static SceneBrightEnd(pScene) {
		return this.#SceneBrightEndFlag(pScene);
	}
	
	static SceneDimEnd(pScene) {
		return this.#SceneDimEndFlag(pScene);
	}
	
	static isPerceptiveStealthing(pToken) {
		return this.#PerceptiveStealthingFlag(pToken);
	}
	
	static async togglePerceptiveStealthing(pToken) {
		await PerceptiveFlags.setPerceptiveStealthing(pToken, !this.#PerceptiveStealthingFlag(pToken));
	}
	
	static async setPerceptiveStealthing(pToken, pStealthing) {
		await this.#setPerceptiveStealthing(pToken, pStealthing);
		
		if (game.settings.get(cModuleName, "AutomateTokenSpottable")) {
			await this.#setcanbeSpotted(pToken, pStealthing);
		}
	}
	
	static PPDCLocked(pToken) {
		return this.#LockPPDCFlag(pToken);
	}
	
	static async setLingeringAP(pToken, pResults, pInfos = {}) {
		await this.#setLingeringAP(pToken, pResults);
		
		await this.#setLingeringAPInfo(pToken, pInfos);
	}
	
	static async resetLingeringAP(pToken) {
		await this.#setLingeringAP(pToken, []);
	}
	
	static LingeringAP(pToken) {
		return this.#LingeringAPFlag(pToken);
	}
	
	static LingeringAPInfo(pToken) {
		return this.#LingeringAPInfoFlag(pToken);
	} 
	
	static hasLingeringAP(pToken) {
		return (this.#LingeringAPFlag(pToken)?.length > 0);
	}
	
	static setotherSkillADCs(pObject, pADCs) {
		this.#setotherSkillADCs(pObject, pADCs);
	}
	
	static getotherSkillADC(pObject, pKey, pRaw = false) {
		let vADCs = this.#otherSkillADCsFlag(pObject);
		
		let vDC;
		
		if (vADCs.hasOwnProperty(pKey)) {
			vDC = vADCs[pKey];
			
			if (vDC >= 0) {
				return vDC;
			}
		}
		
		if (pRaw) {
			return -1;
		}
		
		return Infinity;
	}
	
	static PerceptiveName(pToken) {
		switch (pToken.documentName) {
			case "Token":
				return pToken.name;
				break;
			case "Tile":
				/*
				if (PerceptiveCompUtils.compatibilityName(pToken)) {
					return PerceptiveCompUtils.compatibilityName(pToken);
				}
				*/
			
				return PerceptiveFlags.#TilePerceptiveNameFlag(pToken);
				break;
		}
		
		return "";		
	}
	
	static getPerceptionAEBonus(pToken, pObjectType, pCheckType) {
		let vType = pCheckType;
		
		if (vType == "") {
			vType = "active";
		}
		
		let vModifier = pToken.actor?.flags?.perceptive?.Modifiers?.perception?.MOD; //AE effects source
		
		if (vModifier) {
			vModifier = vModifier[pObjectType];
			
			if (vModifier) {
				vModifier = vModifier[vType];
				
				if (vModifier) {
					return vModifier;
				}
			}
		}

		return 0; //if anything fails
	}
	
	static getPerceptionAEBehaviour(pToken, pObjectType, pCheckType) {
		let vType = pCheckType;
		
		if (vType == "") {
			vType = "active";
		}
		
		let vBehaviour = pToken.actor?.flags?.perceptive?.Modifiers?.perception?.BEH; //AE effects source
		
		if (vBehaviour) {
			vBehaviour = vBehaviour[pObjectType];
			
			if (vBehaviour) {
				vBehaviour = vBehaviour[vType];
				
				if (vBehaviour) {
					return vBehaviour;
				}
			}
		}

		return 0; //if anything fails		
	}
	
	//effects
	static async MarkasPerceptiveEffect(pEffect, pInfos = {}) {
		if (pEffect) {
			pEffect.setFlag(cModuleName, cPerceptiveEffectF, true);
			
			pEffect.setFlag(cModuleName, cEffectInfoF, pInfos);
		}
	}
	
	static isPerceptiveEffect(pEffect) {
		let vFlag = this.#PerceptiveFlags(pEffect);
		
		if (vFlag) {
			return (vFlag.hasOwnProperty(cPerceptiveEffectF) && vFlag.PerceptiveEffectFlag);
		}
		
		return false;
	}
	
	static EffectInfos(pEffect) {
		let vFlag = this.#PerceptiveFlags(pEffect);
		
		if (vFlag?.hasOwnProperty(cEffectInfoF)) {
			return vFlag[cEffectInfoF];
		}
		
		return {};
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
			
			if (isNaN(vRange[0]) || vRange[0] == null) {
				vRange[0] = -Infinity;
			}
			
			if (isNaN(vRange[1]) || vRange[1] == null) {
				vRange[1] = Infinity;
			}
		}
		
		return vRange;
	}
	
	static StringtoRange(pString, pDelimiter = ":") {
		let vRange = [-Infinity, Infinity];
		
		let vParts = pString.split(pDelimiter);
		
		if (vParts.length == 2) {
			for (let i = 0; i < vParts.length; i++) {
				if (!(vParts[i] == "" || isNaN(Number(vParts[i])))) {
					vRange[i] = Number(vParts[i]);
				}
			}
		}
		
		return vRange;
	}
	
}

//Export PerceptiveFlags Class
export{ PerceptiveFlags };
