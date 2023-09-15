import { cModuleName } from "../utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "../helpers/PerceptiveFlags.js";
import { GeometricUtils } from "../utils/GeometricUtils.js";

//Module Names
const cLibWrapper = "lib-wrapper";
const cArmReach = "foundryvtt-arms-reach";
const cArmReachold = "arms-reach";
const cLocknKey = "LocknKey";
const cWallHeight = "wall-height";
const cDfredCE = "dfreds-convenient-effects";
const cVision5e = "vision-5e";

//special words
const cLockTypeDoor = "LTDoor"; //type for door locks

export { cLockTypeDoor }

export { cLibWrapper, cArmReach, cArmReachold, cLocknKey, cWallHeight, cDfredCE, cVision5e}

class PerceptiveCompUtils {
	//DECLARATIONS
	//basic
	static isactiveModule(pModule) {} //determines if module with id pModule is active
	
	//specific: Foundry ArmsReach, ArmsReach
	static ARReachDistance() {} //[ArmReach] retunrs the set interactions distance of armsreach
	
	static ARWithinDistance(pCharacter, pObject) {} //[ArmReach] returns if pCharacter is close enought to pLock to interact
	
	//specific: dfreds-convenient-effects
	static async AddDfredEffect(pEffects, pToken) {} //uses dfreds api to add effects with pEffectNames to pToken
	
	static async RemovePerceptiveDfredEffect(pEffects, pToken) {} //uses dfreds api to remove effects with pEffectNames to pToken
	
	static FilterDFEffects(pNameIDs) {} //returns an array of effects fitting the ids or names in pNameIDs
	
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
				return game.modules.get(cArmReachold).api.isReachable(pCharacter.object, pObject.object);
			}
		}	
		
		return true;//if anything fails
	}
	
	//specific: dfreds-convenient-effects
	static async AddDfredEffect(pEffects, pToken) {
		for (let i = 0; i < pEffects.length; i++) {
			await game.dfreds.effectInterface._socket.executeAsGM('addEffect', {
			  effect: pEffects[i].toObject(),
			  uuid : pToken.actor.uuid,
			  origin : cModuleName
			});
			/*
			game.dfreds.effectInterface.addEffect({effectName : pEffectNames[i], uuid : pToken.actor.uuid, origin : cModuleName})
			*/
		}
	}
	
	static async RemovePerceptiveDfredEffect(pEffects, pToken) {
		for (let i = 0; i < pEffects.length; i++) {
			let vName = pEffects[i].name;
			
			if (!vName) {
				vName = pEffects[i].label;
			}
			
			await game.dfreds.effectInterface._socket.executeAsGM('removeEffect', {
			  effectName: vName,
			  uuid : pToken.actor.uuid,
			  origin : cModuleName
			});
			//game.dfreds.effectInterface.removeEffect({effectName : pEffectNames[i], uuid : pToken.actor.uuid, origin : cModuleName})
		}		
	}
	
	static FilterDFEffects(pNameIDs) {
		let vNameIDs = [];
		
		let vBuffer;
		
		for (let i = 0; i < pNameIDs.length; i++) {
			vBuffer = game.dfreds.effects._all.find(vEffect => vEffect.name == pNameIDs[i] || vEffect.label == pNameIDs[i]);
			
			if (vBuffer) {
				vNameIDs.push(vBuffer);
			}
			else {
				vBuffer = game.dfreds.effects._customEffectsHandler._findCustomEffectsItem().effects.get(pNameIDs[i]);
				
				if (!vBuffer) {
					vBuffer = game.dfreds.effects._customEffectsHandler._findCustomEffectsItem().effects.find(v => v.name == pNameIDs[i]);
				}
				
				if (vBuffer) {
					vNameIDs.push(vBuffer);
				}
			}
		}
		
		return vNameIDs;
	}
}

export { PerceptiveCompUtils };
