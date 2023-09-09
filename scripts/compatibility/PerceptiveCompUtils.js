import { cModuleName } from "../utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "../helpers/PerceptiveFlags.js";
import { GeometricUtils } from "../utils/GeometricUtils.js";

//Module Names
const cLibWrapper = "lib-wrapper";
const cArmReach = "foundryvtt-arms-reach";
const cArmReachold = "arms-reach";
const cLocknKey = "LocknKey";
const cWallHeight = "wall-height";

export { cLibWrapper, cArmReach, cArmReachold, cLocknKey, cWallHeight}

//const
const cLockTypeDoor = "LTDoor"; //type for door locks

export { cLockTypeDoor }

class PerceptiveCompUtils {
	//DECLARATIONS
	//basic
	static isactiveModule(pModule) {} //determines if module with id pModule is active
	
	//specific: Foundry ArmsReach, ArmsReach
	static ARReachDistance() {} //[ArmReach] retunrs the set interactions distance of armsreach
	
	static ARWithinDistance(pCharacter, pObject) {} //[ArmReach] returns if pCharacter is close enought to pLock to interact
	
	
	//IMPLEMENTATIONS
	//basic
	static isactiveModule(pModule) {
		if (game.modules.find(vModule => vModule.id == pModule)) {
			return game.modules.find(vModule => vModule.id == pModule).active;
		}
		
		return false;
	};
	
	//specific: Foundry ArmsReach
	static ARReachDistance() {
		if (PerceptiveCompUtils.isactiveModule(cArmReach)) {
			return game.settings.get(cArmReach, "globalInteractionMeasurement");
		}
		
		if (PerceptiveCompUtils.isactiveModule(cArmReachold)) {
			return game.settings.get(cArmReachold, "globalInteractionDistance");
		}
	}
	
	static ARWithinDistance(pCharacter, pObject) {
		if (PerceptiveCompUtils.isactiveModule(cArmReach)) {
			if (game.modules.get(cArmReach).api) {
				return game.modules.get(cArmReach).api.isReachable(pCharacter.object, pObject.object);
			}
		}		
		
		if (PerceptiveCompUtils.isactiveModule(cArmReachold)) {
			if (game.modules.get(cArmReachold).api) {
				return game.modules.get(cArmReachold).api.isReachable(pCharacter, pObject);
			}
		}	
		
		return true;//if anything fails
	}
}

export { PerceptiveCompUtils };