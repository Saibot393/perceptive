import { PerceptiveUtils, cModuleName } from "../utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "./PerceptiveFlags.js";
import { PerceptiveCompUtils, cDfredCE, cVision5e } from "../compatibility/PerceptiveCompUtils.js";

const cStealthEffectName = "Invisible"; //standard effect
const cadvancedStealthEffectName = "Inaudible"; //necessry for some vision modules

const cStealthPf2eEffectID = "Compendium.pf2e.conditionitems.Item.VRSef5y1LmL2Hkjf"; //Mounted effects of Pf2e system

class EffectManager {
	
	//DECLARATIONS
	static applyStealthEffects(pHider) {} //gives the rider all pEffects
	
	static async removeStealthEffects(pHider, pApplyReset = false) {} //remove all effects flaged as Rideable effect
	
	//IMPLEMENTATION
	static async applyStealthEffects(pHider) {
		let vEffectDocuments;
		//Ridden Mounting Effects
		let vEffectNames = [];
		
		if (PerceptiveUtils.isPf2e() || (PerceptiveCompUtils.isactiveModule(cDfredCE) && game.settings.get(cModuleName, "DFredsEffectsIntegration"))) {	
			await EffectManager.removeStealthEffects(pHider, true);
		
			vEffectNames = PerceptiveFlags.StealthEffects(pHider);
			
			if (!PerceptiveFlags.OverrideWorldSEffects(pHider)) {
				//World Mounting effects
				vEffectNames = vEffectNames.concat(PerceptiveUtils.CustomWorldStealthEffects());
				
				//Standard mounting effect
				if (game.settings.get(cModuleName, "applySystemStealthEffect")) {
					if (PerceptiveUtils.isPf2e()) {
						vEffectNames.push(cStealthPf2eEffectID);
					}
					
					if (game.settings.get(cModuleName, "DFredsEffectsIntegration")) {
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
					
					await PerceptiveFlags.MarkasPerceptiveEffect(vEffects[i]);
				}
			}
			
			if (PerceptiveCompUtils.isactiveModule(cDfredCE) && game.settings.get(cModuleName, "DFredsEffectsIntegration")) {
				vEffectDocuments = PerceptiveCompUtils.FilterDFEffects(vEffectNames);
				
				PerceptiveCompUtils.AddDfredEffect(vEffectDocuments, pHider);
			}
		}
		
		if (game.settings.get(cModuleName, "usePerceptiveStealthEffect")) {
			PerceptiveFlags.setPerceptiveStealthing(pHider, true);
		}
	}
	
	static async removeStealthEffects(pHider, pApplyReset = false) {
		if (PerceptiveUtils.isPf2e()) {
			await pHider.actor.deleteEmbeddedDocuments("Item", pHider.actor.itemTypes.effect.concat(pHider.actor.itemTypes.condition).filter(vElement => PerceptiveFlags.isPerceptiveEffect(vElement)).map(vElement => vElement.id));
		}
		
		if (PerceptiveCompUtils.isactiveModule(cDfredCE) && game.settings.get(cModuleName, "DFredsEffectsIntegration")) {
			await PerceptiveCompUtils.RemovePerceptiveDfredEffect(pHider.actor.effects.map(vElement => vElement), pHider);
		}
		
		if (!pApplyReset) {
			await PerceptiveFlags.setPerceptiveStealthing(pHider, false);
		}
	}
}

export { EffectManager }