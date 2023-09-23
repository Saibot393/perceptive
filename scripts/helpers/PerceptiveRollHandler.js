import {PerceptiveUtils, cModuleName, Translate, TranslateandReplace} from "../utils/PerceptiveUtils.js";
import {PerceptiveSystemUtils} from "../utils/PerceptiveSystemUtils.js";

class PerceptiveMouseHandler {
	//DECLARATIONS
	static async onChatMessage(pMessage, pInfos, pSenderID) {} //called when a chatmessage is created
	
	//IMPLEMENTATIONS
	static async onChatMessage(pMessage, pInfos, pSenderID) {
		if (game.userId == pSenderID) {
			let vActorID = "";

			if (pMessage.actor) {
				vActorID = pMessage.actor.id;
			}
			else {
				if (pMessage.speaker) {
					vActorID = pMessage.speaker.actor;
				}
			}

			if ((!keyboard.downKeys.has(game.keybindings.get(cModuleName, "IgnoreRoll")[0].key)) ^ (game.settings.get(cModuleName, "InvertIgnoreRollKey") || game.settings.get(cModuleName, "ForceInvertIgnoreRollKey"))) {
				if (PerceptiveSystemUtils.isSystemPerceptionRoll(pMessage)) {
					Hooks.call(cModuleName + ".PerceptionRoll", vActorID, pMessage.rolls[0]);
				}

				if (PerceptiveSystemUtils.isSystemStealthRoll(pMessage)) {
					Hooks.call(cModuleName + ".StealthRoll", vActorID, pMessage.rolls[0]);
				}
			}
		}
	}
}

Hooks.once("ready", function() {
	if (game.settings.get(cModuleName, "ActivateSpotting")) {
		Hooks.on("createChatMessage", (pMessage, pInfos, pSenderID) => {PerceptiveMouseHandler.onChatMessage(pMessage, pInfos, pSenderID)});
	}
});

