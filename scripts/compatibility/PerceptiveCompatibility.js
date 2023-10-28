import { PerceptiveCompUtils, cLocknKey, cLibWrapper, cArmReach, cWallHeight, cLockTypeDoor, cStealthy, cLevels, cZnPOptions, cMATT, cMATTTriggerTileF, cMATTTriggerConditionsF, cTConditions, cTTypes, cTTNewlySpotted } from "./PerceptiveCompUtils.js";
import {cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import {RequestPeekDoor, PeekingIgnoreWall} from "../PeekingScript.js";
import {PerceptiveFlags} from "../helpers/PerceptiveFlags.js";
import {IgnoreWall} from "./APIHandler.js";
import {allowCanvasZoom} from "../helpers/PerceptiveMouseHandler.js";
import {PerceptiveSheetSettings} from "../settings/PerceptiveSheetSettings.js";

const cPerceptiveIcon = "fa-solid fa-eye";
const cTriggersIcon = "fa-running";

class PerceptiveCompatibility {
	//DECLARATION
	//specific: Lock & Key
	static addPeekingButton(pButtons, pLockObject, pLockType, pCharacter, pShowall) {} //adds an appropiate peeking button to pButtons
	
	//specific: stealthy
	static onTokenupdate(pToken, pchanges, pInfos) {}//called when a token is updated
	
	static onEffectupdate(pEffect, pchanges, pInfos) {}//called when a token is updated
	
	//specific: MATT
	static addTriggerSettings(pApp, pHTML, pData, pAddBasics = false) {} //adds the Lock & Key Trigger settings to pApp
	
	static async onPerceptiveSpotting(pObjects, pInfos, pSpotters) {} //called when someone spots a lock
	
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
	
	//specific: MATT
	static addTriggerSettings(pApp, pHTML, pData, pAddBasics = false) {
		let vAddBasics = pAddBasics && !pHTML.find(`a[data-tab="triggers"]`).length;
		
		if (vAddBasics) {
			let vTabbar = pHTML.find(`nav.sheet-tabs`);
			
			let vTabButtonHTML = 	`
							<a class="item" data-tab="triggers">
								<i class="fas ${cTriggersIcon}"></i>
								${Translate("Titles.Triggers")}
							</a>
							`; //tab button HTML
			
			vTabbar.append(vTabButtonHTML);		
		}
		
		let vContentTabName = "triggers";
		
		if (pApp.object.documentName == "Tile") {
			//this is a tile, change tab
			vContentTabName = "trigger-setup";
		}
		else {	
			if (!pHTML.find(`div[data-tab="${vContentTabName}"]`).length) {
				//create new tab field
				let vprevTab = pHTML.find(`div[data-tab=${cModuleName}]`); //places triggers tab after last core tab "basic"
				let vTabContentHTML = `<div class="tab" data-tab="${vContentTabName}"></div>`; //tab content sheet HTML
				vprevTab.after(vTabContentHTML);
			}
		}
		
		if (vAddBasics) {
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cMATTTriggerTileF +".name"), 
														vhint : Translate("SheetSettings."+ cMATTTriggerTileF +".descrp"), 
														vtype : "text",
														vwide : true,
														vvalue : PerceptiveCompUtils.MATTTriggerTileID(pApp.object),
														vflagname : cMATTTriggerTileF
														}, `div[data-tab="${vContentTabName}"]`);		
		}
			
		let vTypeOptions;
		
		for (let vTriggerType of cTTypes) {
			vTypeOptions = cTConditions;
			
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cMATTTriggerConditionsF + "." + vTriggerType +".name"), 
														//vhint : Translate("SheetSettings."+ cMATTTriggerConditionsF + "." + vUseType +".descrp"), 
														vtype : "select",
														voptions : 	vTypeOptions,		
														voptionsName : cMATTTriggerConditionsF,
														vvalue : PerceptiveCompUtils.MattTriggerCondition(pApp.object, vTriggerType),
														vflagname : cMATTTriggerConditionsF + "." + vTriggerType
														}, `div[data-tab="${vContentTabName}"]`);	
		}
	}
	
	static async onPerceptiveSpotting(pObjects, pInfos, pSpotters) {
		console.log(pInfos);
		for (let i = 0; i < pObjects.length; i++) {
			if (PerceptiveCompUtils.MATTTriggered(pObjects[i], pInfos)) {
				let vTile = await PerceptiveCompUtils.MATTTriggerTile(pObjects[i]);
				
				let vLanding;
				
				if (pInfos.PassivSpot) {
					vLanding = "PassiveSpot";
				}
				else {
					vLanding = "ActiveSpot";
				}
				
				if (vTile) {
					vTile.trigger({ tokens: pSpotters, method: 'trigger', options: {landing : vLanding}});
				}
			}
		}
	}
}

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
		
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.ignore_conflicts(cModuleName, cStealthy, "DoorControl.prototype.isVisible");
		}
	}
	
	if (PerceptiveCompUtils.isactiveModule(cLevels)) {
		libWrapper.register(cModuleName, "CONFIG.Levels.handlers.SightHandler.shouldIgnoreWall", function(pWrapped, pwall, pcollisiontype, options) {if ((options?.source?.document.documentName == "Token") && IgnoreWall(pwall.document, options.source.document)){return true} return pWrapped(pwall, pcollisiontype, options)}, "MIXED");
	}
	
	if (PerceptiveCompUtils.isactiveModule(cZnPOptions)) {
		libWrapper.register(cModuleName, "MouseManager.prototype._onWheel", function(pWrapped, ...args) {if (allowCanvasZoom(args[0])) {return pWrapped(...args)}}, "MIXED");
	
		libWrapper.ignore_conflicts(cModuleName, cZnPOptions, "MouseManager.prototype._onWheel");
	}
	
	if (PerceptiveCompUtils.isactiveModule(cMATT)) {
		Hooks.on(cModuleName + ".WallSpottingSettings", (pApp, pHTML, pData) => PerceptiveCompatibility.addTriggerSettings(pApp, pHTML, pData));
		
		Hooks.on(cModuleName + ".TokenSpottingSettings", (pApp, pHTML, pData) => PerceptiveCompatibility.addTriggerSettings(pApp, pHTML, pData, true));
		
		Hooks.on(cModuleName + ".TileSpottingSettings", (pApp, pHTML, pData) => PerceptiveCompatibility.addTriggerSettings(pApp, pHTML, pData));
		
		Hooks.on(cModuleName + ".NewlyVisible", (pObjects, pInfos, pSpotters) => PerceptiveCompatibility.onPerceptiveSpotting(pObjects, pInfos, pSpotters));
	}
});

function TriggerTilerequest(pData) {return PerceptiveCompatibility.TriggerTilerequest(pData)};

export {TriggerTilerequest}