import { cModuleName, PerceptiveUtils, Translate} from "./PerceptiveUtils.js";

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

const cLockTypeLootPf2e = "LTLootPf2e"; //type for Token

const cPf2eAPDCautomationTypes = ["character", "npc", "familiar"];

const Pf2eSkillDictionary = {
    acr: "acrobatics",
    arc: "arcana",
    ath: "athletics",
    cra: "crafting",
    dec: "deception",
    dip: "diplomacy",
    itm: "intimidation",
    med: "medicine",
    nat: "nature",
    occ: "occultism",
    prf: "performance",
    rel: "religion",
    soc: "society",
    ste: "stealth",
    sur: "survival",
    thi: "thievery"
}

export { cPf2eLoottype, cLockTypeLootPf2e, cPf2eAPDCautomationTypes }

//takes care of system specific stuff
class PerceptiveSystemUtils {
	//DELCARATIONS	
	static isSystemPerceptionRoll(pMessage, pInfos) {} //returns if the message belongs to a perception roll (AP)
	
	static SystemSkillTypes() {} //returns array of all skills in this system
	
	static isSystemStealthRoll(pMessage, pInfos) {} //returns if the message belongs to a stealth roll
	
	static canAutodetectSkillRolls() {} //returns if skill rolls can be detected in this system
	
	static Pf2eRollType(pMessage, pInfos) {} //returns the type of roll this Pf2e roll was
	
	static StealthDCPf2e(pActor) {} //returns the Stealth DC of pActor
	
	static StealthStatePf2e(pToken, pInfos = {}) {} //returns the stealth state of pToken (none, hide, sneak, both)
	
	static async SystemPerceptionMacros(pPerceptionFunction) {} //returns perception macros for this system
	
	static customPf2eSeek(pOptions) {} //custom Pf2e seek macro to add a custom trait
	
	//system defaults	
	static SystemdefaultPPformula() {} //returns the default formula for Lock breaking in the current system	
	
	static SystemdefaultPerceptionKeyWord() {} //returns the systems default key word for perceptions
	
	static SystemdefaultStealthKeyWord() {} //returns the systems default key word for stealths
	
	//IMPLEMENTATIONS
	static isSystemPerceptionRoll(pMessage, pInfos) {
		if (pMessage.isRoll) {
			if (PerceptiveSystemUtils.canAutodetectSkillRolls()) {
				let vSystemInfo = pMessage.flags?.[game.system.id];
				
				let vSkill = "";
				
				if (vSystemInfo) {
					switch (game.system.id) {
						case cPf2eName:
							vSkill = Object.keys(Pf2eSkillDictionary).find(vKey => Pf2eSkillDictionary[vKey] == vSystemInfo?.modifierName);
							
							pInfos["skill"] = vSkill;
							
							return vSystemInfo.context?.type == "perception-check";
							break;
						case cDnD5e:
							pInfos["skill"] = vSystemInfo.roll.skillId;
						
							return vSystemInfo.roll.skillId == "prc";
							break;
						case cAdvanced5e:
							return vSystemInfo.rollData?.find(vRoll => vRoll.label.includes(CONFIG.A5E.skills.prc));
							break;
						case cPf1eName:
							pInfos["skill"] = vSystemInfo.subject?.skill;
						
							return vSystemInfo.subject?.skill == "per";
							break;
						default : 
							return pMessage.flavor.includes(game.settings.get(cModuleName, "PerceptionKeyWord"));
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
	
	static SystemSkillTypes() {
		if (game.system?.model?.Actor?.character?.skills) {
			return Object.keys(game.system.model.Actor.character.skills);
		}
		
		return [];
	}
	
	static isSystemStealthRoll(pMessage, pInfos) {
		if (pMessage.isRoll) {
			if (PerceptiveSystemUtils.canAutodetectSkillRolls()) {
				let vSystemInfo = pMessage.flags?.[game.system.id];
				if (vSystemInfo) {
					switch (game.system.id) {
						case cPf2eName:
							let vSkillName
							return vSystemInfo.context?.domains.includes("check") && vSystemInfo.context.domains.includes("stealth")
							break;
						case cDnD5e:
							return vSystemInfo.roll?.type == "skill" && vSystemInfo.roll.skillId == "ste";
							break;
						case cAdvanced5e:
							return vSystemInfo.rollData?.find(vRoll => vRoll.label.includes(CONFIG.A5E.skills.ste));
							break;
						case cPf1eName:
							return vSystemInfo.subject?.skill == "ste";
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
	
	static canAutodetectSkillRolls() {
		switch (game.system.id) {
			case cPf2eName:
			case cDnD5e:
			case cAdvanced5e:
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
			if (vContext.options?.includes("action:hide")) {
				return "hide";
			}
			
			if (vContext.options?.includes("action:sneak")) {
				return "sneak";
			}
		}
		
		return;
	}
	
	static StealthDCPf2e(pActor) {
		if (pActor?.system.skills.stealth) {
			//special case for NPCs
			return pActor?.system.skills.stealth.dc;
		}
		return pActor?.system.skills.ste.dc;
	}
	
	static StealthStatePf2e(pToken, pInfos = {}) {
		if (pToken.actor) {
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
	}
	
	static async SystemPerceptionMacros(pPerceptionFunction) {
		let vMacros = {};
		
		if (PerceptiveUtils.isPf2e()) {	
			vMacros.SeekwithRange = async function(pRanges) {
				let vActor = PerceptiveUtils.selectedTokens()[0]?.actor;
				let vControlled = canvas.tokens.controlled[0];
				
				if ((game.settings.get(cModuleName, "MacroSeekBehaviour") == "always") || ((game.settings.get(cModuleName, "MacroSeekBehaviour") == "incombatonly") && (vActor?.inCombat))) {
					let vMacro = function(pConeRotation = undefined) {
						let vRanges = pRanges;
						
						if (pConeRotation != undefined) {
							vRanges.ConeRotation = pConeRotation;
						}
						
						canvas.tokens.activate();
						
						if ((canvas.tokens.controlled.length <= 0) && vControlled) {
							vControlled.control();
						}
						
						game.pf2e.actions.seek({
										actors: vActor,
										callback: (pCallBack) => {
											pPerceptionFunction(PerceptiveUtils.selectedTokens().filter(vToken => vToken.actorId == pCallBack.actor.id), [[pCallBack.roll.total, pCallBack.roll.dice[0].total]], {isLingeringAP : false, Ranges : vRanges});
										}
						});	
					}
					
					if (pRanges.withTemplate && pRanges.ConeRange > 0 && vControlled) {
						const cConeRotCorrection = 90; //to make cones be rotated downwards
						
						let vTemplate = new MeasuredTemplateDocument({x : PerceptiveUtils.selectedTokens()[0].object.center.x, y : PerceptiveUtils.selectedTokens()[0].object.center.y, t : "cone", angle : 90, rotation : cConeRotCorrection, distance : pRanges.ConeRange});
						
						vTemplate = await vTemplate.constructor.create(vTemplate, {parent : canvas.scene});
						
						canvas.templates.activate();
						
						vTemplate.object.controlIcon.onclick = function() {
							canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [vTemplate.id]);
							vMacro(((vTemplate.rotation + (360 - cConeRotCorrection) - vControlled.document.rotation))%360);
						};
					}
					else {
						vMacro();
					}
				}
				else {
					ui.notifications?.warn(Translate("Warnings.MacroSeekDeactivatet"))
				}
			}
		}
		
		return vMacros;
	}
	
	static customPf2eSeek(pOptions) {
		const slug = pOptions?.skill ?? "perception"
		  , rollOptions = ["action:seek"]
		  , modifiers = pOptions?.modifiers;
		ActionMacroHelpers.simpleRollActionCheck({
			actors: pOptions.actors,
			actionGlyph: pOptions.glyph ?? "A",
			title: "PF2E.Actions.Seek.Title",
			checkContext: opts=>ActionMacroHelpers.defaultCheckContext(opts, {
				modifiers,
				rollOptions,
				slug
			}),
			traits: ["concentrate", "secret", "custom-source:perceptive"],
			event: pOptions.event,
			callback: pOptions.callback,
			difficultyClass: pOptions.difficultyClass,
			extraNotes: selector=>[ActionMacroHelpers.note(selector, "PF2E.Actions.Seek", "criticalSuccess"), ActionMacroHelpers.note(selector, "PF2E.Actions.Seek", "success")]
		}).catch(error=>{
			throw ui.notifications.error(error.message),
			error
		}
		)		
	}
	
	//system defaults
	static SystemdefaultPPformula() {
		switch (game.system.id) {
			case cDnD5e:
				return "@actor.system.skills.prc.passive";
				break;
			case cAdvanced5e:
				return "@actor.system.skills.prc.passive";
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