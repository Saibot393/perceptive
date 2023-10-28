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
const cStealthy = "stealthy";
const cLevels = "levels";
const cZnPOptions = "zoom-pan-options";
const cRideable = "Rideable";
const cMATT = "monks-active-tiles";

//special words
const cLockTypeDoor = "LTDoor"; //type for door locks

//Trigger conditions for MATT
const cTCNever = "never";
const cTCAlways = "always";
const cTCactive = "active";
const cTCpassive = "passive";

const cTConditions = [cTCNever, cTCAlways, cTCactive, cTCpassive];

const cTTNewlySpotted = "NewlySpotted";

const cTTypes = [cTTNewlySpotted];

const cMATTTriggerTileF = "MATTTriggerTileFlag";
const cMATTTriggerConditionsF = "MATTTriggerConditionsFlag";

export { cLockTypeDoor }

export { cLibWrapper, cArmReach, cArmReachold, cLocknKey, cWallHeight, cDfredCE, cVision5e, cStealthy, cLevels, cZnPOptions, cRideable, cMATT, cMATTTriggerTileF, cMATTTriggerConditionsF, cTConditions, cTTypes, cTTNewlySpotted}

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
	
	static isPercpetiveEffect(pEffect) {} //returns if pEffect is a perceptive effect
	
	//specific: MATT
	static async MATTTriggerTile(pObject) {} //returns Tile triggered by pObject actions
	
	static MATTTriggerTileID(pObject) {} //returns the ID of the triggered tile of this lock
	
	static setMATTTriggercondition(pObject, pInfos) {} //sets the MATT trigger condition of pObject
	
	static MattTriggerCondition(pObject, pType) {} //returns the MATT trigger condition of pObject for pType
	
	static MATTTriggered(pObject, pType, pOutcome) {} //returns if a triiger of pType with pOutcome triggers the MATT tile of pObject
	
	//specific: Rideable
	//static compatibilityName(pTile) {} //returns the rideable tile name of pTile, false otherwise
	
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
	
	static isPercpetiveEffect(pEffect) {
		return pEffect.origin == cModuleName;
	} 
	
	//specific: MATT
	static async MATTTriggerTile(pObject) {
		let vID = pObject?.flags[cMATT]?.entity.id; //from MATT
		
		if (vID) {
			return fromUuid(vID);
		}
		
		if (pObject?.flags[cModuleName]) {
			vID = pObject?.flags[cModuleName][cMATTTriggerTileF]; //from LnK
		}		
		
		if (vID) {
			return pObject.parent.tiles.get(vID);
		}
	}
	
	static MATTTriggerTileID(pObject) {
		let vID;
		
		if (pObject.documentName == "Tile") {
			return pObject.id;
		}

		if (pObject?.flags.hasOwnProperty(cModuleName)) {
			vID = pObject?.flags[cModuleName][cMATTTriggerTileF]; //from LnK
		}
		
		if (vID) {
			return vID;
		}
		
		vID = pObject?.flags[cMATT]?.entity.id; //from MATT
		
		if (vID) {
			return vID;
		}		
		
		return "";
	}
	
	static setMATTTriggercondition(pObject, pType, pCondition) {
		if (pObject) {
			pObject.setFlag(cModuleName, cMATTTriggerConditionsF + "." + pType, pCondition);
		}
	}
	
	static MattTriggerCondition(pObject, pType) {
		let vTriggerCondition;
		
		let vFlags = pObject.flags[cModuleName];
		
		if (vFlags?.hasOwnProperty(cMATTTriggerConditionsF)) {
			vTriggerCondition = vFlags[cMATTTriggerConditionsF][pType];
		}
		
		if (cTConditions.includes(vTriggerCondition)) {
			return vTriggerCondition;
		}
		else {
			return cTCNever;
		}
	}
	
	static MATTTriggered(pObject, pInfos) {
		switch (PerceptiveCompUtils.MattTriggerCondition(pObject, pInfos.UseType)) {
			case cTCAlways:
				return true;
				break;
			case cTCactive:
				return !pInfos.PassivSpot;
				break;
			case cTCpassive:
				return pInfos.PassivSpot;
				break;
			case cTCNever:
			default:
				return false;
				break;
		}
	}
	
	//specific: Rideable
	/*
	static compatibilityName(pTile) {
		if (PerceptiveCompUtils.isactiveModule(cRideable)) {
			return pTile?.flags[cRideable]?.TileRideableNameFlag;
		}
		
		return false;
	}
	*/
}

export { PerceptiveCompUtils };
