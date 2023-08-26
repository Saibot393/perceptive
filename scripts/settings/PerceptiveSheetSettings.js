import * as FCore from "../CoreVersionComp.js";
import {cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import {PerceptiveFlags, cDoorMovementF, cDoorHingePositionF, cDoorSwingSpeedF, cDoorSlideSpeedF} from "../helpers/PerceptiveFlags.js";
import {cDoorMoveTypes, cHingePositions} from "../helpers/PerceptiveFlags.js";

const cPerceptiveIcon = "fa-solid fa-eye";

class PerceptiveSheetSettings {
	//DECLARATIONS	
	static WallSheetSettings(pApp, pHTML, pData) {} //add settinsg to wall sheet
	
	//support
	static AddHTMLOption(pHTML, pInfos, pto) {} //adds a new HTML option to pto in pHTML
	
	static createHTMLOption(pInfos, pto, pwithformgroup = false) {} //creates new html "code"
	
	//IMPLEMENTATIONS
	
	static WallSheetSettings(pApp, pHTML, pData) {
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
		
		//wall movement type
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cDoorMovementF +".name"), 
													vhint : Translate("SheetSettings."+ cDoorMovementF +".descrp"), 
													vtype : "select", 
													voptions : cDoorMoveTypes,
													vvalue : PerceptiveFlags.DoorMovementType(pApp.document), 
													vflagname : cDoorMovementF
													}, `fieldset.${cModuleName}-options`);

		//wall hinge position
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cDoorHingePositionF +".name"), 
													vhint : Translate("SheetSettings."+ cDoorHingePositionF +".descrp"), 
													vtype : "select", 
													voptions : cHingePositions,
													vvalue : PerceptiveFlags.DoorHingePosition(pApp.document), 
													vflagname : cDoorHingePositionF
													}, `fieldset.${cModuleName}-options`);
											
		//wall swing speed
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cDoorSwingSpeedF +".name"), 
													vhint : Translate("SheetSettings."+ cDoorSwingSpeedF +".descrp"), 
													vtype : "number", 
													vvalue : PerceptiveFlags.getDoorSwingSpeed(pApp.document), 
													vflagname : cDoorSwingSpeedF
													}, `fieldset.${cModuleName}-options`);
													
		//wall slide speed
		PerceptiveSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cDoorSlideSpeedF +".name"), 
													vhint : Translate("SheetSettings."+ cDoorSlideSpeedF +".descrp"), 
													vtype : "number", 
													vvalue : PerceptiveFlags.getDoorSlideSpeed(pApp.document), 
													vflagname : cDoorSlideSpeedF
													}, `fieldset.${cModuleName}-options`);
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
		
		switch (vtype){
			case "number":
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
			case "numberpart":
				vnewHTML = vnewHTML + `<input type=number name="flags.${cModuleName}.${vflagname[0]}" id=${vID} value="${vvalue[0]}"><label>/</label><input type=number name="flags.${cModuleName}.${vflagname[1]}" id=${vID} value="${vvalue[1]}">`;
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