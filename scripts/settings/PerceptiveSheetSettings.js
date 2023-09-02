import * as FCore from "../CoreVersionComp.js";
import {cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import {PerceptiveFlags, cDoorMovementF, cDoorHingePositionF, cDoorSwingSpeedF, cDoorSlideSpeedF, cDoorSwingRangeF} from "../helpers/PerceptiveFlags.js";
import {cDoorMoveTypes, ccanbeLockpeekedF, cLockPeekSizeF, cLockPeekPositionF, cHingePositions, cSwingSpeedRange, cPreventNormalOpenF, cSlideSpeedRange, ccanbeSpottedF, cPPDCF, cAPDCF} from "../helpers/PerceptiveFlags.js";
import {WallTabInserter} from "../helpers/WallTabInserter.js";

const cPerceptiveIcon = "fa-regular fa-eye";

class PerceptiveSheetSettings {
	//DECLARATIONS	
	static WallSheetSettings(pApp, pHTML, pData) {} //add settinsg to wall sheet
	
	//support
	static AddHTMLOption(pHTML, pInfos, pto) {} //adds a new HTML option to pto in pHTML
	
	static createHTMLOption(pInfos, pto, pwithformgroup = false) {} //creates new html "code"
	
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
			
			//wall can be lockpeeked
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ ccanbeLockpeekedF +".name"), 
														vhint : Translate("SheetSettings."+ ccanbeLockpeekedF +".descrp"), 
														vtype : "checkbox", 
														vvalue : PerceptiveFlags.canbeLockpeeked(pApp.document), 
														vflagname : ccanbeLockpeekedF
														}, `div[data-tab="${cModuleName}"]`);
														
			//lock peeking size
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockPeekSizeF +".name"), 
														vhint : Translate("SheetSettings."+ cLockPeekSizeF +".descrp"), 
														vtype : "number", 
														//vrange : cSwingSpeedRange,
														vvalue : PerceptiveFlags.LockPeekingSize(pApp.document), 
														vstep : 0.01,
														vflagname : cLockPeekSizeF
														}, `div[data-tab="${cModuleName}"]`);
														
			//lock peeking position
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockPeekPositionF +".name"), 
														vhint : Translate("SheetSettings."+ cLockPeekPositionF +".descrp"), 
														vtype : "number", 
														//vrange : [0,1],
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
														
			//can be spotted
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ ccanbeSpottedF +".name"), 
														vhint : Translate("SheetSettings."+ ccanbeSpottedF +".descrp"), 
														vtype : "checkbox", 
														vvalue : PerceptiveFlags.canbeSpotted(pApp.document), 
														vflagname : ccanbeSpottedF
														}, `div[data-tab="${cModuleName}"]`);
														
			//passive perception dc
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPPDCF +".name"), 
														vhint : Translate("SheetSettings."+ cPPDCF +".descrp"), 
														vtype : "number", 
														vvalue : PerceptiveFlags.getPPDC(pApp.document, true), 
														vflagname : cPPDCF
														}, `div[data-tab="${cModuleName}"]`);
						
			//active perception dc
			PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cAPDCF +".name"), 
														vhint : Translate("SheetSettings."+ cAPDCF +".descrp"), 
														vtype : "number", 
														vvalue : PerceptiveFlags.getAPDC(pApp.document, true), 
														vflagname : cAPDCF
														}, `div[data-tab="${cModuleName}"]`);
		}
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
		
		let vrange = [0, 0];
		if (pInfos.hasOwnProperty("vrange")) {
			vrange = pInfos.vrange;
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
				vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID} value="${vvalue}" step="${vstep}">`;
				break;
			case "text":
				vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID} value="${vvalue}">`;
				break;
				
			case "checkbox":
				if (vvalue) {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID} checked>`;
				}
				else {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID}>`;
				}
				break;
				
			case "select":
				vnewHTML = vnewHTML + `<select name="flags.${cModuleName}.${vflagname}">`;
				
				for (let i = 0; i < voptions.length; i++) {
					if (voptions[i] == vvalue) {
						vnewHTML = vnewHTML + `<option value="${voptions[i]}" selected>${Translate("SheetSettings." + vflagname+ ".options." + voptions[i])}</option>`;
					}
					else {
						vnewHTML = vnewHTML + `<option value="${voptions[i]}">${Translate("SheetSettings." + vflagname+ ".options." + voptions[i])}</option>`;
					}
				}
				
				vnewHTML = vnewHTML + `</select>`;
				break;
			case "range":
				vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID} value="${vvalue}" min="${vrange[0]}" max="${vrange[1]}" step="${vstep}">`;
				break;
			case "numberpart":
			case "numberinterval":
				vnewHTML = vnewHTML + `<input type=number name="flags.${cModuleName}.${vflagname[0]}" id=${vID} value="${vvalue[0]}"><label>${vNumberSeperator}</label><input type=number name="flags.${cModuleName}.${vflagname[1]}" id=${vID} value="${vvalue[1]}">`;
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
}


Hooks.once("ready", () => {
	if (game.user.isGM) {

		Hooks.on("renderWallConfig", (vApp, vHTML, vData) => PerceptiveSheetSettings.WallSheetSettings(vApp, vHTML, vData)); //for walls
	}
});
