import { PerceptiveCompUtils, cLocknKey, cLibWrapper, cArmReach, cWallHeight, cLockTypeDoor, cStealthy, cLevels, cZnPOptions, cMATT, cMATTTriggerTileF, cMATTTriggerConditionsF, cTConditions, cSimpleTConditions } from "./PerceptiveCompUtils.js";
import {cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import {RequestPeekDoor, PeekingIgnoreWall} from "../PeekingScript.js";
import {PerceptiveFlags} from "../helpers/PerceptiveFlags.js";
import {IgnoreWall} from "./APIHandler.js";
import {allowCanvasZoom} from "../helpers/PerceptiveMouseHandler.js";
import {PerceptiveSheetSettings} from "../settings/PerceptiveSheetSettings.js";

const cPerceptiveIcon = "fa-solid fa-eye";

class PerceptiveCompatibility {
	//DECLARATION
	//specific: Lock & Key
	static addPeekingButton(pButtons, pLockObject, pLockType, pCharacter, pShowall) {} //adds an appropiate peeking button to pButtons
	
	//specific: stealthy
	static onTokenupdate(pToken, pchanges, pInfos) {}//called when a token is updated
	
	static onEffectupdate(pEffect, pchanges, pInfos) {}//called when a token is updated
	
	//specific: MATT
	static addTriggerSettings(pApp, pHTML, pData, pAddBasics = false) {} //adds the Lock & Key Trigger settings to pApp
	
	static async onPerceptiveSpotting(pLock, pCharacter, pInfos) {} //called when someone uses a lock (only GM side)
	
	static TriggerTilerequest(pData) {} //called when a tile is requested to be triggered
	
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
		if (pAddBasics) {
			let vTabbar = pHTML.find(`nav.sheet-tabs`);
			
			let vTabButtonHTML = 	`
							<a class="item" data-tab="triggers">
								<i class="fas ${cTriggersIcon}"></i>
								${Translate("Titles.Triggers")}
							</a>
							`; //tab button HTML
			
			vTabbar.append(vTabButtonHTML);		
		}
		
		let vprevTab = pHTML.find(`div[data-tab=${cModuleName}]`); //places rideable tab after last core tab "basic"
		let vTabContentHTML = `<div class="tab" data-tab="triggers"></div>`; //tab content sheet HTML
		vprevTab.after(vTabContentHTML);
		
		if (pAddBasics) {
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cMATTTriggerTileF +".name"), 
														vhint : Translate("SheetSettings."+ cMATTTriggerTileF +".descrp"), 
														vtype : "text",
														vwide : true,
														vvalue : PerceptiveCompUtils.MATTTriggerTileID(pApp.object),
														vflagname : cMATTTriggerTileF
														}, `div[data-tab="triggers"]`);		
		}
			
		let vTypeOptions;
		
		for (let vUseType of [cLUuseKey, cLUusePasskey, cLUpickLock, cLUbreakLock, cLUFreeCircumvent]) {
			switch (vUseType) {
				case cLUuseKey:
				case cLUusePasskey:
				case cLUFreeCircumvent:
					vTypeOptions = cSimpleTConditions;
					break;
				case cLUpickLock:
				case cLUbreakLock:
					vTypeOptions = cTConditions;
					break;
			}
			
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cMATTTriggerConditionsF + "." + vUseType +".name"), 
														//vhint : Translate("SheetSettings."+ cMATTTriggerConditionsF + "." + vUseType +".descrp"), 
														vtype : "select",
														voptions : 	vTypeOptions,		
														voptionsName : cMATTTriggerConditionsF,
														vvalue : PerceptiveCompUtils.MattTriggerCondition(pApp.object, vUseType),
														vflagname : cMATTTriggerConditionsF + "." + vUseType
														}, `div[data-tab="triggers"]`);	
		}
	}
	
	static async onPerceptiveSpotting(pLock, pCharacter, pInfos) {
		if (PerceptiveCompUtils.MATTTriggered(pLock, pInfos)) {
			let vTile = await PerceptiveCompUtils.MATTTriggerTile(pLock);
			
			if (vTile) {
				if (!pInfos.useData.userID || pInfos.useData.userID == game.user.id) {
					vTile.trigger({ tokens: [pCharacter], method: 'trigger', options: {landing : pInfos.UseType}});
				}
				else {
					game.socket.emit("module."+cModuleName, {pFunction : "TriggerTilerequest", pData : {UserID : pInfos.useData.userID, TileID : vTile.id, CharacterID : pCharacter.id, Infos : pInfos}});
				}
			}
		}
	}
	
	static TriggerTilerequest(pData) {
		if (pData.UserID == game.user.id) {
			let vTile = canvas.tiles.get(pData.TileID)?.document;
			
			let vCharacter = canvas.tokens.get(pData.CharacterID)?.document;
			
			if (vTile && vCharacter) {
				vTile.trigger({ tokens: [vCharacter], method: 'trigger', options: {landing : pData.Infos.UseType}});
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
		//Hooks.on(cModuleName + ".WallLockSettings", (pApp, pHTML, pData) => LnKCompatibility.addTriggerSettings(pApp, pHTML, pData));
		
		//Hooks.on(cModuleName + ".TokenLockSettings", (pApp, pHTML, pData) => LnKCompatibility.addTriggerSettings(pApp, pHTML, pData, true));
		
		//Hooks.on(cModuleName + ".LockUse", (pLock, pCharacter, pInfos) => LnKCompatibility.onLnKLockUse(pLock, pCharacter, pInfos));
	}
});

function TriggerTilerequest(pData) {return PerceptiveCompatibility.TriggerTilerequest(pData)};

export {TriggerTilerequest}