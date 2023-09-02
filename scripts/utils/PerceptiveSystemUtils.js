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
	
	//system defaults	
	static SystemdefaultPPformula() {} //returns the default formula for Lock breaking in the current system	
	
	static SystemdefaultAPformula() {} //returns the default formula for Lock Picking in the current system	
	
	//IMPLEMENTATIONS
	static isSystemPerceptionRoll(pMessage) {
		if (pMessage.isRoll) {
			let vSystemInfo = pMessage.flags?.[game.system.id];
			
			if (vSystemInfo) {
				switch (game.system.id) {
					case cPf2eName:
						return vSystemInfo.context.type == "perception-check";
						break;
					case cDnD5e:
						return vSystemInfo.roll.type == "skill" && vSystemInfo.roll.skillId == "prc";
						break;
				}
			}
		}
		
		return false;
	}
	
	//system defaults
	static SystemdefaultPPformula() {
		switch (game.system.id) {
			case cPf2eName:
				return "1d20 + @actor.skills.athletics.mod - 2";
				break;
			case cDnD5e:
				return "1d20 + @actor.system.abilities.str.mod + @actor.system.skills.ath.value";
				break;
			default:
				return "";
		}		
	}
	
	static SystemdefaultAPformula() {
		switch (game.system.id) {
			case cPf2eName:
				return "1d20 + @actor.skills.thievery.mod";
				break;
			case cDnD5e:
				return "1d20 + @actor.system.abilities.dex.mod + @actor.system.tools.thief.total";
				break;
			default:
				return "";
		}
	}
}

export { PerceptiveSystemUtils }