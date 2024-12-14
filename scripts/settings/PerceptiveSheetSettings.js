import * as FCore from "../CoreVersionComp.js";
import {cModuleName, Translate, TranslateandReplace} from "../utils/PerceptiveUtils.js";
import {PerceptiveFlags, cDoorMovementF, cDoorHingePositionF, cDoorSwingSpeedF, cDoorSlideSpeedF, cDoorSwingRangeF} from "../helpers/PerceptiveFlags.js";
import {cDoorMoveTypes, ccanbeLockpeekedF, cPeekingDCF, cLockPeekSizeF, cLockPeekPositionF, cHingePositions, cSwingSpeedRange, cPreventNormalOpenF, cSlideSpeedRange, ccanbeSpottedF, cPPDCF, cAPDCF, cresetSpottedbyMoveF, cStealthEffectsF, cOverrideWorldSEffectsF, cSceneBrightEndF, cSceneDimEndF, cPerceptiveStealthingF, cLockPPDCF, cotherSkillADCsF, cTilePerceptiveNameF, cSpottingRangeF, cSpottingMessageF, cRevealwhenSpottedF} from "../helpers/PerceptiveFlags.js";
import { VisionChannelsWindow } from "../helpers/VisionChannelsHelper.js";
import {WallTabInserter} from "../helpers/WallTabInserter.js";
import {PerceptiveUtils} from "../utils/PerceptiveUtils.js";
import {VisionUtils} from "../utils/VisionUtils.js";
import { PerceptiveCompUtils, cDfredCE, cRideable} from "../compatibility/PerceptiveCompUtils.js";
import {PerceptiveSystemUtils, cPf2eAPDCautomationTypes } from "../utils/PerceptiveSystemUtils.js";

const cPerceptiveIcon = "fa-regular fa-eye";

class PerceptiveSheetSettings {
	//DECLARATIONS	
	static WallSheetSettings(pApp, pHTML, pData) {} //add settinsg to wall sheet
	
	static async TokenSheetSettings(pApp, pHTML, pData) {} //add settinsg to token sheet
	
	static async TileSheetSettings(pApp, pHTML, pData) {} //add settinsg to tile sheet
	
	static SceneSheetSettings(pApp, pHTML, pData) {} //add settinsg to scene sheet 
	
	//dialogs
	static OpenotherSkillDCs(pApp) {} //opens a popup to enter other Skill DCs for object of pApp
	
	//standard settings
	static AddSpottableSettings(pApp, pHTML, pData, pto) {} //adds the Spottable settings to pApp
	
	static AddVCSettings(pApp, pHTML, pData, pto) {} //adds the VC settings to pApp
	
	//support
	static AddHTMLOption(pHTML, pInfos, pto) {} //adds a new HTML option to pto in pHTML
	
	static createHTMLOption(pInfos, pto, pwithformgroup = false) {} //creates new html "code"
	
	static FixSheetWindow(pHTML, pIndentifier) {} //fixes the formating of pHTML sheet window
	
	//IMPLEMENTATIONS
	
	static WallSheetSettings(pApp, pHTML, pData) {
		if (!PerceptiveFlags.isPerceptiveWall(pApp.document)) {
			//create Tabs if necessary
			WallTabInserter.InsertWallTabs(pApp, pHTML, pData);
			
			/*
			//setup
			let vprevElement = pHTML.find(`fieldset.door-options`);
			if (!vprevElement.length) {
				//if door options was not found, try other search
				vprevElement = pHTML.find(`select[name="ds"]`).closest(".form-group");
			}
			
			
			let vNewSection = `	<fieldset class="${cModuleName}-options">
									<legend><i class="${cPerceptiveIcon}"></i> ${Translate("Titles."+cModuleName)}</legend>
								</fieldset>`;
								
			vprevElement.after(vNewSection);
			*/
			
			let vTabbar = pHTML.find(`nav.sheet-tabs`);
			let vprevTab = pHTML.find(`div[data-tab="basic"]`); //places rideable tab after last core tab "basic"
			
			let vTabButtonHTML = 	`
							<a class="item" data-tab="${cModuleName}">
								<i class="${cPerceptiveIcon}"></i>
								${Translate("Titles."+cModuleName)}
							</a>
							`; //tab button HTML
			let vTabContentHTML = `<div class="tab" data-tab="${cModuleName}"></div>`; //tab content sheet HTML
			
			vTabbar.append(vTabButtonHTML);
			vprevTab.after(vTabContentHTML);	
			
			/*
			let vCollapse = `<details>
						<summary>${Translate("Titles."+"test")}</summary>
						<div content=${"test"}>
						</div>
					</details>`;
					
			pHTML.find(`div[data-tab="${cModuleName}"]`).append(vCollapse);
			*/
					
			
			
			//wall can be lockpeeked
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ ccanbeLockpeekedF +".name"), 
														vhint : Translate("SheetSettings."+ ccanbeLockpeekedF +".descrp"), 
														vtype : "checkbox", 
														vvalue : PerceptiveFlags.canbeLockpeeked(pApp.document), 
														vflagname : ccanbeLockpeekedF
														}, `div[data-tab="${cModuleName}"]`);
														
			//lock peeking dc
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPeekingDCF +".name"), 
														vhint : Translate("SheetSettings."+ cPeekingDCF +".descrp"), 
														vtype : "number", 
														vvalue : PerceptiveFlags.PeekingDC(pApp.document, true), 
														vflagname : cPeekingDCF
														}, `div[data-tab="${cModuleName}"]`);
														
			//lock peeking size
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockPeekSizeF +".name"), 
														vhint : Translate("SheetSettings."+ cLockPeekSizeF +".descrp"), 
														vtype : "range", 
														vrange : [0,1],
														vvalue : PerceptiveFlags.LockPeekingSize(pApp.document), 
														vstep : 0.01,
														vflagname : cLockPeekSizeF
														}, `div[data-tab="${cModuleName}"]`);
														
			//lock peeking position
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockPeekPositionF +".name"), 
														vhint : Translate("SheetSettings."+ cLockPeekPositionF +".descrp"), 
														vtype : "range", 
														vrange : [0,1],
														vvalue : PerceptiveFlags.LockPeekingPosition(pApp.document), 
														vstep : 0.01,
														vflagname : cLockPeekPositionF
														}, `div[data-tab="${cModuleName}"]`);
			
			//wall movement type
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cDoorMovementF +".name"), 
														vhint : Translate("SheetSettings."+ cDoorMovementF +".descrp"), 
														vtype : "select", 
														voptions : cDoorMoveTypes,
														vvalue : PerceptiveFlags.DoorMovementType(pApp.document), 
														vflagname : cDoorMovementF
														}, `div[data-tab="${cModuleName}"]`);
														
			//prevent normal open if applicable
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPreventNormalOpenF +".name"), 
														vhint : Translate("SheetSettings."+ cPreventNormalOpenF +".descrp"), 
														vtype : "checkbox", 
														vvalue : PerceptiveFlags.PreventNormalOpen(pApp.document, true), 
														vflagname : cPreventNormalOpenF
														}, `div[data-tab="${cModuleName}"]`);

			//wall hinge position
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cDoorHingePositionF +".name"), 
														vhint : Translate("SheetSettings."+ cDoorHingePositionF +".descrp"), 
														vtype : "select", 
														voptions : cHingePositions,
														vvalue : PerceptiveFlags.DoorHingePosition(pApp.document), 
														vflagname : cDoorHingePositionF
														}, `div[data-tab="${cModuleName}"]`);
												
			//wall swing speed
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cDoorSwingSpeedF +".name"), 
														vhint : Translate("SheetSettings."+ cDoorSwingSpeedF +".descrp"), 
														vtype : "number", 
														//vrange : cSwingSpeedRange,
														vvalue : PerceptiveFlags.getDoorSwingSpeed(pApp.document), 
														vflagname : cDoorSwingSpeedF
														}, `div[data-tab="${cModuleName}"]`);
														
			//wall swing range
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cDoorSwingRangeF +".name"), 
														vhint : Translate("SheetSettings."+ cDoorSwingRangeF +".descrp"), 
														vtype : "numberinterval", 
														//vrange : cSwingSpeedRange,
														vvalue : PerceptiveFlags.getDoorSwingRange(pApp.document), 
														vflagname : [cDoorSwingRangeF, cDoorSwingRangeF],
														}, `div[data-tab="${cModuleName}"]`);
														
			//wall slide speed
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cDoorSlideSpeedF +".name"), 
														vhint : Translate("SheetSettings."+ cDoorSlideSpeedF +".descrp"), 
														vtype : "number", 
														//vrange : cSlideSpeedRange,
														vvalue : PerceptiveFlags.getDoorSlideSpeed(pApp.document), 
														vstep : 0.01,
														vflagname : cDoorSlideSpeedF
														}, `div[data-tab="${cModuleName}"]`);
							
			if (game.settings.get(cModuleName, "ActivateSpotting")) {			
				PerceptiveSheetSettings.AddSpottableSettings(pApp, pHTML, pData, `div[data-tab="${cModuleName}"]`);
				
				//infos 
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p>${Translate("Titles.SpottingInfos.Title")}</p>`);
				
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p class="hint">${TranslateandReplace("Titles.SpottingInfos.Spottedby", {pNames : PerceptiveFlags.SpottedbyNames(pApp.document)})}</p>`);
				
				Hooks.call(cModuleName + ".WallSpottingSettings", pApp, pHTML, pData);
			}
			
			if (game.settings.get(cModuleName, "ActivateVCs")) {
				PerceptiveSheetSettings.AddVCSettings(pApp, pHTML, pData, `div[data-tab="${cModuleName}"]`);
			}
		}
	}
	
	static async TokenSheetSettings(pApp, pHTML, pData) {
		if (game.user.isGM) {
			if (game.settings.get(cModuleName, "ActivateSpotting") || game.settings.get(cModuleName, "ActivateVCs")) {
				//add new tab
				let vTabbar = pHTML.find(`[data-group="main"].sheet-tabs`);
				let vprevTab = pHTML.find(`div[data-tab="resources"]`); //places perceptive tab after last core tab "details"
				
				let vTabButtonHTML = 	`
								<a class="item" data-tab="${cModuleName}">
									<i class="fas ${cPerceptiveIcon}"></i>
									${Translate("Titles."+cModuleName)}
								</a>
								`; //tab button HTML
				let vTabContentHTML = `<div class="tab" data-group="main" data-tab="${cModuleName}"></div>`; //tab content sheet HTML
				
				vTabbar.append(vTabButtonHTML);
				vprevTab.after(vTabContentHTML);	
			}
			
			if (game.settings.get(cModuleName, "ActivateSpotting")) {
				
				if (game.settings.get(cModuleName, "usePerceptiveStealthEffect") || PerceptiveFlags.isPerceptiveStealthing(pApp.document)) {
					//if this token is perceptive stealthing
					PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPerceptiveStealthingF +".name"), 
														vhint : Translate("SheetSettings."+ cPerceptiveStealthingF +".descrp"), 
														vtype : "checkbox", 
														vvalue : PerceptiveFlags.isPerceptiveStealthing(pApp.document), 
														vflagname : cPerceptiveStealthingF
														}, `div[data-tab="${cModuleName}"]`);
				}
													
				//standard settings
				PerceptiveSheetSettings.AddSpottableSettings(pApp, pHTML, pData, `div[data-tab="${cModuleName}"]`);
				
				if (game.settings.get(cModuleName, "UsePf2eRules") && game.settings.get(cModuleName, "AutoRerollPPDConMove")) {
					//lock APDC against move refreshes
					PerceptiveSheetSettings.AddHTMLOption(pHTML, {	vlabel : Translate("SheetSettings."+ cLockPPDCF +".name"), 
																	vhint : Translate("SheetSettings."+ cLockPPDCF +".descrp"), 
																	vtype : "checkbox", 
																	vvalue : PerceptiveFlags.PPDCLocked(pApp.document), 
																	vflagname : cLockPPDCF
																	}, `div[data-tab="${cModuleName}"]`);					
				}
				
				//reset spotted by on move
				PerceptiveSheetSettings.AddHTMLOption(pHTML, {	vlabel : Translate("SheetSettings."+ cresetSpottedbyMoveF +".name"), 
																vhint : Translate("SheetSettings."+ cresetSpottedbyMoveF +".descrp"), 
																vtype : "checkbox", 
																vvalue : PerceptiveFlags.resetSpottedbyMove(pApp.document), 
																vflagname : cresetSpottedbyMoveF
																}, `div[data-tab="${cModuleName}"]`);
								
				if (PerceptiveUtils.isPf2e() || game.settings.get(cModuleName, "DFredsEffectsIntegration")) {
					//stealth effects
					PerceptiveSheetSettings.AddHTMLOption(pHTML, {	vlabel : Translate("SheetSettings."+ cStealthEffectsF +".name"), 
																	vhint : Translate("SheetSettings."+ cStealthEffectsF +".descrp"), 
																	vtype : "text", 
																	vwide : true,
																	vvalue : PerceptiveFlags.StealthEffects(pApp.document, true), 
																	vflagname : cStealthEffectsF
																	}, `div[data-tab="${cModuleName}"]`);			

					//stealth effects override
					PerceptiveSheetSettings.AddHTMLOption(pHTML, {	vlabel : Translate("SheetSettings."+ cOverrideWorldSEffectsF +".name"), 
																	vhint : Translate("SheetSettings."+ cOverrideWorldSEffectsF +".descrp"), 
																	vtype : "checkbox", 
																	vwide : true,
																	vvalue : PerceptiveFlags.OverrideWorldSEffects(pApp.document), 
																	vflagname : cOverrideWorldSEffectsF
																	}, `div[data-tab="${cModuleName}"]`);
				}
								
				//infos 
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p>${Translate("Titles.SpottingInfos.Title")}</p>`);
				
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p class="hint">${TranslateandReplace("Titles.SpottingInfos.PP", {pValue :  await VisionUtils.PassivPerception(pApp.document)})}</p>`);
				
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p class="hint">${TranslateandReplace("Titles.SpottingInfos.Spottedby", {pNames : PerceptiveFlags.SpottedbyNames(pApp.document)})}</p>`);
				
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p class="hint">${TranslateandReplace("Titles.SpottingInfos.LightModifier", {pValue :  PerceptiveFlags.getLightLevelModifier(pApp.document)})}</p>`);
				
				if (!game.settings.get(cModuleName, "UsePf2eRules")) {
					pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p class="hint">${TranslateandReplace("Titles.SpottingInfos.LightRollBehaviour", {pBehaviour :  PerceptiveFlags.getAPRollBehaviour(pApp.document)})}</p>`);
				}
				
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p class="hint">${TranslateandReplace("Titles.SpottingInfos.VisionLevel.name", {pLevel : Translate("Titles.SpottingInfos.VisionLevel.value" + VisionUtils.VisionLevel(pApp.document))})}</p>`);
			
				Hooks.call(cModuleName + ".TokenSpottingSettings", pApp, pHTML, pData);
			}

			if (game.settings.get(cModuleName, "ActivateVCs")) {
				PerceptiveSheetSettings.AddVCSettings(pApp, pHTML, pData, `div[data-tab="${cModuleName}"]`);
			}			
		}
		
		PerceptiveSheetSettings.FixSheetWindow(pApp.element, `nav.sheet-tabs[data-group="main"]`);
	}
	
	static async TileSheetSettings(pApp, pHTML, pData) {
		if (game.user.isGM) {
			if (game.settings.get(cModuleName, "ActivateSpotting") || game.settings.get(cModuleName, "ActivateVCs")) {
				//add new tab
				let vTabbar = pHTML.find(`nav.sheet-tabs:first`);
				let vprevTab = pHTML.find(`div[data-tab="animation"]`); //places perceptive tab after last core tab "details"
				
				let vTabButtonHTML = 	`
								<a class="item" data-tab="${cModuleName}">
									<i class="fas ${cPerceptiveIcon}"></i>
									${Translate("Titles."+cModuleName)}
								</a>
								`; //tab button HTML
				let vTabContentHTML = `<div class="tab" data-tab="${cModuleName}"></div>`; //tab content sheet HTML
				
				vTabbar.append(vTabButtonHTML);
				vprevTab.after(vTabContentHTML);
			}
			
			if (game.settings.get(cModuleName, "ActivateSpotting")) {							
				//Tile name for perceptive purposes (possible rideable synch)
				PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cTilePerceptiveNameF +".name"), 
																vhint : Translate("SheetSettings."+ cTilePerceptiveNameF +".descrp"), 
																vtype : "text", 
																vwide : true,
																vvalue : PerceptiveFlags.PerceptiveName(pApp.document),
																vflagname : cTilePerceptiveNameF
																}, `div[data-tab="${cModuleName}"]`);	
															
				//standard settings
				PerceptiveSheetSettings.AddSpottableSettings(pApp, pHTML, pData, `div[data-tab="${cModuleName}"]`);	
				
				//infos 
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p>${Translate("Titles.SpottingInfos.Title")}</p>`);
				
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(`<p class="hint">${TranslateandReplace("Titles.SpottingInfos.Spottedby", {pNames : PerceptiveFlags.SpottedbyNames(pApp.document)})}</p>`);
				
				Hooks.call(cModuleName + ".TileSpottingSettings", pApp, pHTML, pData);
			}
			
			if (game.settings.get(cModuleName, "ActivateVCs")) {
				PerceptiveSheetSettings.AddVCSettings(pApp, pHTML, pData, `div[data-tab="${cModuleName}"]`);
			}
		}
		
		
		PerceptiveSheetSettings.FixSheetWindow(pApp.element, `nav.sheet-tabs:first`);
	}
	
	static SceneSheetSettings(pApp, pHTML, pData) {
			//create title (under which all settings are placed)
			let vTittleHTML = `<fieldset data-group="${cModuleName}" name="BrightDimEnd"><legend><p><i class="fas ${cPerceptiveIcon}"></i>  ${Translate("Titles.perceptive")}</p> </legend></fieldset>`;
			
			pHTML.find('input[name="darkness"]').closest(".form-group").after(vTittleHTML);
			console.log(pHTML.find('input[name="darkness"]'))
			
			//scene bright end
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cSceneBrightEndF +".name"), 
														vhint : Translate("SheetSettings."+ cSceneBrightEndF +".descrp"), 
														vtype : "range", 
														vrange : [0, 1],
														vstep : 0.01,
														vvalue : PerceptiveFlags.SceneBrightEnd(pApp.document), 
														vflagname : cSceneBrightEndF
														}, `fieldset[data-group="${cModuleName}"]`);
														
			//scene dim end
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cSceneDimEndF +".name"), 
														vhint : Translate("SheetSettings."+ cSceneDimEndF +".descrp"), 
														vtype : "range", 
														vrange : [0, 1],
														vstep : 0.01,
														vvalue : PerceptiveFlags.SceneDimEnd(pApp.document), 
														vflagname : cSceneDimEndF
														}, `fieldset[data-group="${cModuleName}"]`);
	}
	
	//dialogs
	static OpenotherSkillDCs(pApp) {
		let vSkillsObject = game.system?.model?.Actor?.character?.skills || CONFIG[game.system.id.toUpperCase()].skills;
		
		if (vSkillsObject) {
			let vSkills = Object.keys(vSkillsObject);
			
			let vContent = `<p> ${Translate("SheetSettings."+ cotherSkillADCsF +".name")} </p>`;
			
			for (let vSkill of vSkills) {
				vContent = vContent + PerceptiveSheetSettings.createHTMLOption({	vlabel : TranslateandReplace("SheetSettings."+ cotherSkillADCsF +".entry", {pSkill : vSkill}), 
																					//vhint : Translate("SheetSettings."+ vsubFlagname +".descrp"), 
																					vtype : "text", 
																					vvalue : PerceptiveFlags.getotherSkillADC(pApp.object, vSkill, true),
																					vflagname : cotherSkillADCsF + "." + vSkill,
																					vID : vSkill
																					}, true);
			}
			
			new Dialog({
			title: Translate("SheetSettings."+ cotherSkillADCsF + ".Title"),
			content: vContent,
			buttons: {
				confirmButton: {
					label: Translate("SheetSettings."+ cotherSkillADCsF + ".confirmButtonname"),
					callback: (html) => {let vInputs = {}; for(let vSkill of vSkills){vInputs[vSkill] = html.find(`input#${vSkill}`).val()}; PerceptiveFlags.setotherSkillADCs(pApp.object, vInputs)},
					icon: `<i class="fas ${cPerceptiveIcon}"></i>`
				}
			},
			default: Translate("SheetSettings."+ cotherSkillADCsF + ".confirmButtonname")
		}).render(true);
		}
	}
	
	//standard settings
	static AddSpottableSettings(pApp, pHTML, pData, pto) {
		//can be spotted
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ ccanbeSpottedF +".name"), 
													vhint : Translate("SheetSettings."+ ccanbeSpottedF +".descrp"), 
													vtype : "checkbox", 
													vvalue : PerceptiveFlags.canbeSpotted(pApp.document), 
													vflagname : ccanbeSpottedF
													}, pto);
													
		//reveal when spotted
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cRevealwhenSpottedF +".name"), 
													vhint : Translate("SheetSettings."+ cRevealwhenSpottedF +".descrp"), 
													vtype : "checkbox", 
													vvalue : PerceptiveFlags.RevealwhenSpotted(pApp.document), 
													vflagname : cRevealwhenSpottedF
													}, pto);
													
		//passive perception dc
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPPDCF +".name"), 
													vhint : Translate("SheetSettings."+ cPPDCF +".descrp"), 
													vtype : "number", 
													vvalue : PerceptiveFlags.getPPDC(pApp.document, true), 
													vflagname : cPPDCF
													}, pto);
					
		//active perception dc
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cAPDCF +".name"), 
													vhint : Translate("SheetSettings."+ cAPDCF +".descrp"), 
													vtype : "number", 
													vlocked : game.settings.get(cModuleName, "UsePf2eRules") && cPf2eAPDCautomationTypes.includes(pApp.document.actor?.type),
													vvalue : PerceptiveFlags.getAPDC(pApp.document, true), 
													vflagname : cAPDCF
													}, pto);
													
		//custom spotting range 
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cSpottingRangeF +".name"), 
													vhint : Translate("SheetSettings."+ cSpottingRangeF +".descrp"), 
													vtype : "number", 
													vvalue : PerceptiveFlags.SpottingRange(pApp.document), 
													vflagname : cSpottingRangeF
													}, pto);
													
		if (PerceptiveSystemUtils.canAutodetectSkillRolls()) {
			//other skill dcs menu button
			let vSkillsButton = `<button id = "${cModuleName}.otherSkillDCs"> ${Translate("SheetSettings." + cotherSkillADCsF + ".openButtonname")} </button>`;
			pHTML.find(pto).append(vSkillsButton);
			pHTML.find(`button[id="${cModuleName}.otherSkillDCs"]`).click(function() {PerceptiveSheetSettings.OpenotherSkillDCs(pApp)});
		}
		
		let vResetButton = `<button id = "${cModuleName}.ResetSpottedby"> ${Translate("Titles.ResetSpottedby")} </button>`;
		pHTML.find(pto).append(vResetButton);
		pHTML.find(`button[id="${cModuleName}.ResetSpottedby"]`).click(function() {PerceptiveFlags.clearSpottedby(pApp.document);});	

		//spotting message 
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cSpottingMessageF +".name"), 
													vhint : Translate("SheetSettings."+ cSpottingMessageF +".descrp"), 
													vtype : "text", 
													vwide : true,
													vvalue : PerceptiveFlags.SpottingMessage(pApp.document), 
													vflagname : cSpottingMessageF
													}, pto);
									
	}
	
	static AddVCSettings(pApp, pHTML, pData, pto) {
			let vVCMenuButton = `<button name = "${cModuleName}.openVCMenu"> ${Translate("Titles.OpenVCMenu")} </button>`;
			pHTML.find(pto).append(vVCMenuButton);
			pHTML.find(`button[name="${cModuleName}.openVCMenu"]`).click(function() {new VisionChannelsWindow(pApp.document).render(true);});		
	}
	
	//support
	static AddHTMLOption(pHTML, pInfos, pto) {
		pHTML.find(pto/*`div[data-tab="${cModuleName}"]`*/).append(PerceptiveSheetSettings.createHTMLOption(pInfos))
	}
	
	static createHTMLOption(pInfos, pwithformgroup = false) {
		let vlabel = "Name";	
		if (pInfos.hasOwnProperty("vlabel")) {
			vlabel = pInfos.vlabel;
		}
		
		let vID = "Name";	
		if (pInfos.hasOwnProperty("vID")) {
			vID = pInfos.vID;
		}
		
		let vtype = "text";	
		if (pInfos.hasOwnProperty("vtype")) {
			vtype = pInfos.vtype;
		}
		
		let vvalue = "";	
		if (pInfos.hasOwnProperty("vvalue")) {
			vvalue = pInfos.vvalue;
		}
		
		let vstep = 1;	
		if (pInfos.hasOwnProperty("vstep")) {
			vstep = pInfos.vstep;
		}
		
		let vflagname = "";	
		if (pInfos.hasOwnProperty("vflagname")) {
			vflagname = pInfos.vflagname;
		}
		
		let vhint = "";	
		if (pInfos.hasOwnProperty("vhint")) {
			vhint = pInfos.vhint;
		}
		
		let vunits = "";	
		if (pInfos.hasOwnProperty("vunits")) {
			vunits = pInfos.vunits;
		} 
		
		let voptions = [];
		if (pInfos.hasOwnProperty("voptions")) {
			voptions = pInfos.voptions;
		} 
		
		let voptionsName = vflagname;
		if (pInfos.hasOwnProperty("voptionsName")) {
			voptionsName = pInfos.voptionsName;
		} 
		
		let vrange = [0, 0];
		if (pInfos.hasOwnProperty("vrange")) {
			vrange = pInfos.vrange;
		} 
		
		let vlockedstate = "";
		if (pInfos.hasOwnProperty("vlocked") && pInfos.vlocked) {
			vlockedstate = "disabled";
		}
		
		let vnewHTML = ``;
		
		if (pwithformgroup) {
			vnewHTML = vnewHTML + `<div class="form-group">`;
		}
		
		if (!(pInfos.hasOwnProperty("vwide") && pInfos.vwide)) {
			vnewHTML = `
				<div class="form-group slim">
					<label>${vlabel}</label>
				<div class="form-fields">
			`;
		}
		else {//for wide imputs
			vnewHTML = `
				<div class="form-group">
					<label>${vlabel}</label>
				<div class="form-fields">
			`;
		}
		
		let vfullflagname;
		
		if (pInfos.hasOwnProperty("vfullflagname")) {
			vfullflagname = pInfos.vfullflagname;
		}
		else {
			vfullflagname = cModuleName + "." + vflagname;
		}
		
		let vNumberSeperator;
		
		switch (vtype){
			case "numberpart":
				vNumberSeperator = "/";
				break;
			case "numberinterval":
				vNumberSeperator = "-";
				break;
		}
				
		switch (vtype){
			case "number":
				vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${vfullflagname}" id=${vID} value="${vvalue}" step="${vstep}" ${vlockedstate}>`;
				break;
			case "text":
				vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${vfullflagname}" id=${vID} value="${vvalue}" ${vlockedstate}>`;
				break;
				
			case "checkbox":
				if (vvalue) {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${vfullflagname}" id=${vID} checked ${vlockedstate}>`;
				}
				else {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${vfullflagname}" id=${vID} ${vlockedstate}>`;
				}
				break;
				
			case "select":
				vnewHTML = vnewHTML + `<select name="flags.${vfullflagname}" ${vlockedstate}>`;
				
				for (let i = 0; i < voptions.length; i++) {
					if (voptions[i] == vvalue) {
						vnewHTML = vnewHTML + `<option value="${voptions[i]}" selected>${Translate("SheetSettings." + voptionsName+ ".options." + voptions[i])}</option>`;
					}
					else {
						vnewHTML = vnewHTML + `<option value="${voptions[i]}">${Translate("SheetSettings." + voptionsName+ ".options." + voptions[i])}</option>`;
					}
				}
				
				vnewHTML = vnewHTML + `</select>`;
				break;
			case "range":
				vnewHTML = vnewHTML + 	`<input type=${vtype} name="flags.${vfullflagname}" id=${vID} value="${vvalue}" min="${vrange[0]}" max="${vrange[1]}" step="${vstep}" ${vlockedstate}>
										<span class="${vtype}-value">${vvalue}</span>`;
				break;
			case "numberpart":
			case "numberinterval":
				vnewHTML = vnewHTML + `<input type=number name="flags.${cModuleName}.${vflagname[0]}" id=${vID} value="${vvalue[0]}" ${vlockedstate}><label>${vNumberSeperator}</label><input type=number name="flags.${cModuleName}.${vflagname[1]}" id=${vID} value="${vvalue[1]}" ${vlockedstate}>`;
				break;
			case "numberxy":
				vnewHTML = vnewHTML + `<label>x:</label><input type=number name="flags.${cModuleName}.${vflagname[0]}" id=${vID} value="${vvalue[0]}" ${vlockedstate}><label>y:</label><input type=number name="flags.${cModuleName}.${vflagname[1]}" id=${vID} value="${vvalue[1]}" ${vlockedstate}>`;
				break;
		}
			
		vnewHTML = vnewHTML + `</div>`;
		
		if (vhint != "") {
			vnewHTML = vnewHTML + `<p class="hint">${vhint}</p>`;
		}
		
		vnewHTML = vnewHTML + `</div>`;
		
		//pHTML.find('[name="RideableTitle"]').after(vnewHTML);
		//pHTML.find(pto/*`div[data-tab="${cModuleName}"]`*/).append(vnewHTML);
		return vnewHTML;
	}
	
	static RegisterItemSheetTabChange() {
		//register onChangeTab (if possible with lib-wrapper)
		if (LnKCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "ItemSheet.prototype._onChangeTab", function(vWrapped, ...args) { this.LnKTabactive = (args[2] == cModuleName); return vWrapped(...args)}, "WRAPPER");
		}
		else {
			const vOldSheetCall = ItemSheet.prototype._onChangeTab;
			
			ItemSheet.prototype._onChangeTab = async function (...args) {
				this.LnKTabactive = (args[2] == cModuleName); //args[2] is tab name
				
				let vSheetCallBuffer = vOldSheetCall.bind(this);
				
				vSheetCallBuffer(args);
			}
		}		
	}
	
	static FixSheetWindow(pHTML, pIndentifier) {
		let vNeededWidth = 0;
		
		pHTML.find(pIndentifier).children().each(function() {
			vNeededWidth = vNeededWidth + $(this).outerWidth();
		});
		
		let vWindow = pHTML.find(pIndentifier).closest(`div.app.window-app`);
		
		if (vNeededWidth > pHTML.width()) {
			pHTML.width(vNeededWidth);
		}		
	}
}

Hooks.once("ready", () => {
	if (game.user.isGM) {
		Hooks.on("renderWallConfig", (pApp, pHTML, pData) => PerceptiveSheetSettings.WallSheetSettings(pApp, pHTML, pData)); //for walls
		
		Hooks.on("renderTokenConfig", (pApp, pHTML, pData) => PerceptiveSheetSettings.TokenSheetSettings(pApp, pHTML, pData)); //for tokens
		
		Hooks.on("renderTileConfig", (pApp, pHTML, pData) => PerceptiveSheetSettings.TileSheetSettings(pApp, pHTML, pData)); //for tokens
		
		Hooks.on("renderSceneConfig", (pApp, pHTML, pData) => PerceptiveSheetSettings.SceneSheetSettings(pApp, pHTML, pData)); //for scenes 
	}
});

export {PerceptiveSheetSettings}