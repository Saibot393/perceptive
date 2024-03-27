import {PerceptiveUtils, cModuleName, Translate, TranslateandReplace} from "../utils/PerceptiveUtils.js";
import {PerceptiveSystemUtils} from "../utils/PerceptiveSystemUtils.js";

class PerceptiveRollHandler {
	//DECLARATIONS
	static async onChatMessage(pMessage, pInfos, pSenderID) {} //called when a chatmessage is created
	
	//IMPLEMENTATIONS
	static async onChatMessage(pMessage, pInfos, pSenderID) {
		if (game.userId == pSenderID) {
			let vActorID = "";
			
			let pRollInfos = {};

			if (pMessage.actor) {
				vActorID = pMessage.actor.id;
			}
			else {
				if (pMessage.speaker) {
					vActorID = pMessage.speaker.actor;
				}
			}

			if ((!keyboard.downKeys.has(game.keybindings.get(cModuleName, "IgnoreRoll")[0]?.key)) ^ (game.settings.get(cModuleName, "InvertIgnoreRollKey") || game.settings.get(cModuleName, "ForceInvertIgnoreRollKey"))) {
				if ((game.settings.get(cModuleName, "MacroSeekBehaviour") == "never") || ((game.settings.get(cModuleName, "MacroSeekBehaviour") == "incombatonly") && (!pMessage.actor?.inCombat))) {
					if (PerceptiveSystemUtils.isSystemPerceptionRoll(pMessage, pRollInfos)) {
						Hooks.call(cModuleName + ".PerceptionRoll", vActorID, pMessage.rolls[0], pSenderID);
					}
					else {
						if (PerceptiveSystemUtils.canAutodetectSkillRolls() && pRollInfos.skill?.length > 0) {
							Hooks.call(cModuleName + ".PerceptionRoll", vActorID, pMessage.rolls[0], pSenderID, pRollInfos.skill);
						}
					}
				}

				if (!game.settings.get(cModuleName, "UsePf2eRules")) {
					if (PerceptiveSystemUtils.isSystemStealthRoll(pMessage)) {
						Hooks.call(cModuleName + ".StealthRoll", vActorID, pMessage.rolls[0], pSenderID);
					}
				}
				else {
					let vPf2eRollType = PerceptiveSystemUtils.Pf2eRollType(pMessage);
					if (["sneak", "hide"].includes(vPf2eRollType)) {
						Hooks.call(cModuleName + ".StealthRollPf2e", vActorID, pMessage.rolls[0], vPf2eRollType, pSenderID);
					}
				}
			}
		}
	}
}

Hooks.once("ready", function() {
	if (game.settings.get(cModuleName, "ActivateSpotting")) {
		Hooks.on("createChatMessage", (pMessage, pInfos, pSenderID) => {PerceptiveRollHandler.onChatMessage(pMessage, pInfos, pSenderID)});
	}
});

