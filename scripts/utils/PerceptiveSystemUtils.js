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

const cPf2eAPDCautomationTypes = ["character", "npc", "familiar"];

export { cPf2eLoottype, cLockTypeLootPf2e, cPf2eAPDCautomationTypes }

//takes care of system specific stuff
class PerceptiveSystemUtils {
	//DELCARATIONS	
	static isSystemPerceptionRoll(pMessage, pInfos) {} //returns if the message belongs to a perception roll (AP)
	
	static isSystemStealthRoll(pMessage, pInfos) {} //returns if the message belongs to a stealth roll
	
	static canAutodetectStealthRolls() {} //returns if perception rolls can be recognized in this system
	
	static canAutodetectPerceptionRolls() {} //returns if stealth rolls can be recognized in this system
	
	static Pf2eRollType(pMessage, pInfos) {} //returns the type of roll this Pf2e roll was
	
	static StealthDCPf2e(pActor) {} //returns the Stealth DC of pActor
	
	static StealthStatePf2e(pToken, pInfos = {}) {} //returns the stealth state of pToken (none, hide, sneak, both)
	
	//system defaults	
	static SystemdefaultPPformula() {} //returns the default formula for Lock breaking in the current system	
	
	static SystemdefaultPerceptionKeyWord() {} //returns the systems default key word for perceptions
	
	static SystemdefaultStealthKeyWord() {} //returns the systems default key word for stealths
	
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
	
	static isSystemStealthRoll(pMessage, pInfos) {
		if (pMessage.isRoll) {
			if (PerceptiveSystemUtils.canAutodetectPerceptionRolls()) {
				let vSystemInfo = pMessage.flags?.[game.system.id];
				
				if (vSystemInfo) {
					switch (game.system.id) {
						case cPf2eName:
							return vSystemInfo.context.domains.includes("check") && vSystemInfo.context.domains.includes("stealth")
							break;
						case cDnD5e:
							return vSystemInfo.roll.type == "skill" && vSystemInfo.roll.skillId == "ste";
							break;
						case cPf1eName:
							return vSystemInfo.subject.skill == "ste";
							break;
					}
				}
			}
			else {
				return pMessage.flavor.includes(game.settings.get(cModuleName, "StealthKeyWord"));
			}
		}
		else {
			//key word recognition
		}
		
		return false;		
	}
	
	static canAutodetectStealthRolls() {
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
	
	static Pf2eRollType(pMessage, pInfos) {
		let vContext = pMessage?.flags?.pf2e?.context;
		
		if (vContext) {
			if (vContext.options.includes("action:hide")) {
				return "hide";
			}
			
			if (vContext.options.includes("action:sneak")) {
				return "sneak";
			}
		}
		
		return;
	}
	
	static StealthDCPf2e(pActor) {
		return pActor?.system.skills.ste.dc;
	}
	
	static StealthStatePf2e(pToken, pInfos = {}) {
		let vRelevantEffects = pToken.actor.items.filter(vItem => vItem?.flags?.perceptive?.PerceptiveEffectFlag);
		
		let vhidden = vRelevantEffects.find(vEffect => vEffect.rollOptionSlug == "hidden");
		
		pInfos["hideEffect"] = vhidden;
		
		let vundetected = vRelevantEffects.find(vEffect => vEffect.rollOptionSlug == "undetected");
		
		pInfos["sneakEffect"] = vundetected;
		
		return [["none", "hide"], ["sneak", "both"]][Number(Boolean(vundetected))][Number(Boolean(vhidden))];
		
		/*
		if (!vhidden && !vundetected) {
			return "none";
		}
		
		if (vhidden && !vundetected) {
			return "hide"
		}
		
		if (!vhidden && vundetected) {
			return "sneak"
		}
		
		if (vhidden && vundetected) {
			return "both"
		}
		*/
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
	
	static SystemdefaultStealthKeyWord() {
		switch (game.system.id) {
			default:
				return "Stealth";
		}		
	}
}

export { PerceptiveSystemUtils }