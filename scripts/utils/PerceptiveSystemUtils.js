import { cModuleName} from "./PerceptiveUtils.js";

//system names
const cPf2eName = "pf2e"; //name of Pathfinder 2. edition system
const cPf1eName = "pf1"; //name of Pathfinder 1. edition system
const cDnD5e = "dnd5e"; //name of D&D 5e system
const cAdvanced5e = "a5e"; //name of the advanced D&D 5e system
const cStarFinderName = "sfrpg"; //name of Starfinder system
const c13thage = "archmage"; //name of the 13th age system
const cCoC7 = "CoC7"; //name of call of cthulhu 7 system
const cWarhammer4e = "wfrp4e"; //name of the warhammer 4e system
const cDarkEye5e = "dsa5"; //name of the black eye 5e system
const cBitD = "blades-in-the-dark"; //name of the blades in the dark system
const cCyberpunkRED = "cyberpunk-red-core"; //name of the cyberpunk red core system
const cSandbox = "sandbox"; //name of the sandbox system

//Tokentype
const cPf2eLoottype = "loot"; //type of loot tokens in Pf2e

//Lock Types
const cLockTypeLootPf2e = "LTLootPf2e"; //type for Token

export { cPf2eLoottype, cLockTypeLootPf2e }

//takes care of system specific stuff
class PerceptiveSystemUtils {
	//DELCARATIONS	
	static isSystemPerceptionRoll(pMessage, pInfos) {} //returns if the message belongs to a perception roll (AP)
	
	static canAutodetectPerceptionRolls() {} //returns if perception rolls can be recognized in this system
	
	//system defaults	
	static SystemdefaultPPformula() {} //returns the default formula for Lock breaking in the current system	
	
	static SystemdefaultPerceptionKeyWord() {} //returns the systems default key word for perceptions
	
	//IMPLEMENTATIONS
	static isSystemPerceptionRoll(pMessage) {
		if (pMessage.isRoll) {
			if (PerceptiveSystemUtils.canAutodetectPerceptionRolls()) {
				let vSystemInfo = pMessage.flags?.[game.system.id];
				
				if (vSystemInfo) {
					switch (game.system.id) {
						case cPf2eName:
							return vSystemInfo.context.type == "perception-check";
							break;
						case cDnD5e:
							return vSystemInfo.roll.type == "skill" && vSystemInfo.roll.skillId == "prc";
							break;
						case cPf1eName:
							return vSystemInfo.subject.skill == "per";
							break;
					}
				}
			}
			else {
				return pMessage.flavor.includes(game.settings.get(cModuleName, "PerceptionKeyWord"));
			}
		}
		else {
			//key word recognition
		}
		
		return false;
	}
	
	static canAutodetectPerceptionRolls() {
		switch (game.system.id) {
			case cPf2eName:
			case cDnD5e:
			case cPf1eName:
				return true;
				break;	
			default:
				return false;
				break;
		}
	}
	
	//system defaults
	static SystemdefaultPPformula() {
		switch (game.system.id) {
			case cDnD5e:
				return "10 + @actor.system.abilities.wis.mod + @actor.system.skills.prc.value";
				break;
			default:
				return "";
		}		
	}
	
	static SystemdefaultPerceptionKeyWord() {
		switch (game.system.id) {
			default:
				return "Perception";
		}
	}
}

export { PerceptiveSystemUtils }