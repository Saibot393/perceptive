import { PerceptiveUtils, cModuleName } from "../utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "./PerceptiveFlags.js";
import { PerceptiveCompUtils, cDfredCE, cVision5e } from "../compatibility/PerceptiveCompUtils.js";

const cStealthEffectName = "Invisible"; //standard effect
const cadvancedStealthEffectName = "Inaudible"; //necessry for some vision modules

const cUndetectedPf2eEffectID = "Compendium.pf2e.conditionitems.Item.VRSef5y1LmL2Hkjf"; //normal stealth effects of Pf2e system
const cHiddenPf2eEffectID = "Compendium.pf2e.conditionitems.Item.iU0fEDdBp3rXpTMC"//hide effect of Pf2e system

class EffectManager {
	
	//DECLARATIONS
	static applyStealthEffects(pHider, pInfos = {}) {} //gives the rider all pEffects
	
	static async removeStealthEffects(pHider, pApplyReset = false) {} //remove all effects flaged as perceptive effect
	
	static onPerceptiveEffectdeletion(pEffect, pInfos, pUserID, pActor) {} //called when an effect marked as perceptive effect is deleted
	
	//IMPLEMENTATION
	static async applyStealthEffects(pHider, pInfos = {}) {
		let vEffectDocuments;
		//Ridden Mounting Effects
		let vEffectNames = [];
		
		if (PerceptiveUtils.isPf2e() || PerceptiveCompUtils.hasactiveEffectModule()) {	
			await EffectManager.removeStealthEffects(pHider, true);
		
			vEffectNames = PerceptiveFlags.StealthEffects(pHider);
			
			if (!PerceptiveFlags.OverrideWorldSEffects(pHider)) {
				//World Mounting effects
				vEffectNames = vEffectNames.concat(PerceptiveUtils.CustomWorldStealthEffects());
				
				//Standard mounting effect
				if (game.settings.get(cModuleName, "applySystemStealthEffect")) {
					if (PerceptiveUtils.isPf2e()) {
						if (pInfos.hasOwnProperty("Type")) {
							switch (pInfos.Type) {
								case "hide" : 
									vEffectNames.push(cHiddenPf2eEffectID);
									break;
								case "sneak" :
									vEffectNames.push(cUndetectedPf2eEffectID);
									break;
									
							}
						}
						else {
							vEffectNames.push(cUndetectedPf2eEffectID);
						}
					}
					
					if (PerceptiveCompUtils.hasactiveEffectModule()) {
						vEffectNames.push(cStealthEffectName);
						
						if (PerceptiveCompUtils.isactiveModule(cVision5e) && game.settings.get(cModuleName, "Vision5eIntegration")) {
							vEffectNames.push(cadvancedStealthEffectName);
						}
					}
				}
			}
			
			if (PerceptiveUtils.isPf2e()) {
				vEffectDocuments = await PerceptiveUtils.ApplicableEffects(vEffectNames);
				
				let vEffects = await pHider.actor.createEmbeddedDocuments("Item", vEffectDocuments);
				
				for (let i = 0; i < vEffects.length; i++) {
					await PerceptiveFlags.MarkasPerceptiveEffect(vEffects[i], pInfos.EffectInfos);
				}
			}
			
			if (PerceptiveCompUtils.hasactiveEffectModule()) {
				PerceptiveCompUtils.addIDNameEffects(vEffectNames, pHider);
			}
		}
		
		if (game.settings.get(cModuleName, "usePerceptiveStealthEffect")) {
			await PerceptiveFlags.setPerceptiveStealthing(pHider, true);
		}
	}
	
	static async removeStealthEffects(pHider, pApplyReset = false) {
		if (PerceptiveUtils.isPf2e()) {
			await pHider.actor.deleteEmbeddedDocuments("Item", pHider.actor.itemTypes.effect.concat(pHider.actor.itemTypes.condition).filter(vElement => PerceptiveFlags.isPerceptiveEffect(vElement)).map(vElement => vElement.id));
		}
		
		if (PerceptiveCompUtils.hasactiveEffectModule()) {
			await PerceptiveCompUtils.RemovePerceptiveEffects(pHider);
		}
		
		if (!pApplyReset && pHider) {
			await PerceptiveFlags.setPerceptiveStealthing(pHider, false);
		}
	}
	
	static onPerceptiveEffectdeletion(pEffect, pInfos, pUserID, pActor) {
		if (game.user.isGM) {
			if (game.settings.get(cModuleName, "syncEffectswithPerceptiveStealth")) {
				let vActiveScenes = game.scenes.filter(vScene => vScene.active);
				
				for (let i = 0; i < vActiveScenes.length; i++) {
					let vrelevantTokens = vActiveScenes[i].tokens.filter(vToken => vToken.actorId == pActor.id);
					
					for (let j = 0; j < vrelevantTokens.length; j++) {	
						PerceptiveFlags.setPerceptiveStealthing(vrelevantTokens[j], false);
					}
				}			
			}
		}
	}
}

Hooks.on("deleteActiveEffect", (pEffect, pInfos, pUserID) => {if (PerceptiveCompUtils.isPercpetiveEffect(pEffect)) {Hooks.call(cModuleName + ".PerceptiveEffectdeletion", pEffect, pInfos, pUserID, pEffect.parent)}});

Hooks.on("deleteItem", (pEffect, pInfos, pUserID) => {if (PerceptiveUtils.isPf2e() && PerceptiveFlags.isPerceptiveEffect(pEffect)) {Hooks.call(cModuleName + ".PerceptiveEffectdeletion", pEffect, pInfos, pUserID, pEffect.parent)}});

Hooks.on(cModuleName + ".PerceptiveEffectdeletion", (pEffect, pInfos, pUserID, pActor) => EffectManager.onPerceptiveEffectdeletion(pEffect, pInfos, pUserID, pActor));

export { EffectManager }