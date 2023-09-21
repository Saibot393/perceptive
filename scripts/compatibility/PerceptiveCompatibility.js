import { PerceptiveCompUtils, cLocknKey, cLibWrapper, cArmReach, cWallHeight, cLockTypeDoor, cStealthy, cLevels } from "./PerceptiveCompUtils.js";
import {cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import {RequestPeekDoor, PeekingIgnoreWall} from "../PeekingScript.js";
import {PerceptiveFlags} from "../helpers/PerceptiveFlags.js";

const cPerceptiveIcon = "fa-solid fa-eye";

class PerceptiveCompatibility {
	//DECLARATION
	//specific: Lock & Key
	static addPeekingButton(pButtons, pLockObject, pLockType, pCharacter, pShowall) {} //adds an appropiate peeking button to pButtons
	
	//specific: stealthy
	static onTokenupdate(pToken, pchanges, pInfos) {}//called when a token is updated
	
	static onEffectupdate(pEffect, pchanges, pInfos) {}//called when a token is updated
	
	//IMPLEMENTATIONS
	//specific: Lock & Key
	static addPeekingButton(pButtons, pLockObject, pLockType, pCharacter, pShowall) {
		if (pShowall || PerceptiveFlags.canbeLockpeeked(pLockObject)) {
			pButtons["PeekLock"] = {
				label: Translate("Titles.PeekLock"),
				callback: () => {RequestPeekDoor(pLockObject, [pCharacter])},
				icon: `<i class="fas ${cPerceptiveIcon}"></i>`
			}	
		}
	}
	
	//specific: stealthy
	static onTokenupdate(pToken, pchanges, pInfos) {
		if (game.settings.get(cModuleName, "StealthyIntegration")) {
			if (pchanges.flags?.perceptive?.hasOwnProperty("PPDCFlag") || pchanges.flags?.perceptive?.hasOwnProperty("APDCFlag")) {
				let vMaxResult = Math.max(PerceptiveFlags.getPPDC(pToken, true), PerceptiveFlags.getAPDC(pToken, true));
				
				if ((vMaxResult >= 0) && (vMaxResult < Infinity)) {
					let vStealthyEffects = pToken.actor.effects.filter(vEffect => vEffect.flags?.stealthy?.hidden);
					
					for (let i = 0; i < vStealthyEffects.length; i++) {
						vStealthyEffects[i].flags.stealthy.hidden = vMaxResult;
					}
				}
			}
		}
	}

	static onEffectupdate(pEffect, pchanges, pInfos) {
		if (game.settings.get(cModuleName, "StealthyIntegration")) {
			if (pchanges.flags?.stealthy?.hasOwnProperty("hidden")) {
				let vStealthValue = pchanges.flags.stealthy.hidden;
				
				let vActiveScenes = game.scenes.filter(vScene => vScene.active);
				
				let vNewDCs = {PPDC : vStealthValue, APDC : vStealthValue};
				
				for (let i = 0; i < vActiveScenes.length; i++) {
					let vrelevantTokens = vActiveScenes[i].tokens.filter(vToken => vToken.actorId == pEffect.parent.id);
					
					for (let j = 0; j < vrelevantTokens.length; j++) {
						PerceptiveFlags.setSpottingDCs(vrelevantTokens[j], vNewDCs);
					}
				}
			}	
		}
	}
}

export function IgnoreWall(pWallDoc, pTokenDoc) {return PeekingIgnoreWall(pWallDoc, pTokenDoc)}

Hooks.once("init", () => {
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
		libWrapper.ignore_conflicts(cModuleName, cArmReach, "DoorControl.prototype._onRightDown");
		
		libWrapper.ignore_conflicts(cModuleName, cWallHeight, "DoorControl.prototype.isVisible");
	}	
	
	if (PerceptiveCompUtils.isactiveModule(cLocknKey)) {
		Hooks.on(cLocknKey +  ".DoorInteractionMenu", (pButtons, pLockObject, pLockType, pCharacter, pShowall) => {
			if (pLockType == cLockTypeDoor) {
				PerceptiveCompatibility.addPeekingButton(pButtons, pLockObject, pLockType, pCharacter, pShowall);
			};
		});
	};
	
	if (PerceptiveCompUtils.isactiveModule(cStealthy)) {
		Hooks.on("updateToken", (pToken, pchanges, pInfos) => {PerceptiveCompatibility.onTokenupdate(pToken, pchanges, pInfos)});
		
		Hooks.on("updateActiveEffect", (pEffect, pchanges, pInfos) => {PerceptiveCompatibility.onEffectupdate(pEffect, pchanges, pInfos)});
	}
	
	if (PerceptiveCompUtils.isactiveModule(cLevels)) {
		libWrapper.register(cModuleName, "CONFIG.Levels.handlers.SightHandler.shouldIgnoreWall", function(pWrapped, pwall, pcollisiontype, options) {if ((options?.source?.document.documentName == "Token") && IgnoreWall(pwall.document, options?.source?.document)){return true} return pWrapped(pwall, pcollisiontype, options)}, "MIXED");
	}
	
	//compatibility exports
	game.modules.get(cModuleName).api = {
		IgnoreWall
	}
});