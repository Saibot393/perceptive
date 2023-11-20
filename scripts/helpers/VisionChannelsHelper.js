import { cModuleName, Translate } from "../utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "./PerceptiveFlags.js";

const cWindowID = "vision-channels-window";

const cConfirmIcon = "fa-solid fa-check";
const cAddIcon = "fa-solid fa-plus";
const cDeleteIcon = "fa-solid fa-trash";

const cSettingName = "VisionChannels";

const cDefaultChannel = {
	Name : "Vision Channel",
	Color : "#ffffff",
	RequiredtoSee : false,
	SeethroughWalls : false,
	Range : -1,
	EffectFilter : null,
	Transparency : 1
};

class VisionChannelsWindow extends Application {
	constructor(pTargetObject = null, pOptions = {}) {
		super(pOptions);
		
		this.vOptions = pOptions;
		
		this.vChannels = game.settings.get(cModuleName, cSettingName);
		
		if (pTargetObject) {
			this.vSettingsType = "object";
			
			this.vSettingsSubType = pTargetObject.documentName;
			
			this.vTarget = pTargetObject;
		}
		else {
			//leave pTargetObject as object null to open world settings
			this.vSettingsType = "world";
		}
	}
	
	//app stuff
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [cWindowID],
			popOut: true,
			width: 800,
			height: 400,
			template: `modules/${cModuleName}/templates/${cWindowID}.html`,
			jQuery: true,
			title: Translate(cWindowID + ".titles." + "VisionChannels"),
			resizable: true
		});
	}
	
	getHTMLWorld(pOptions={}) {
		let vEntriesHTML = `<table name = "entries">`;
		
		vEntriesHTML = vEntriesHTML+ 	`<tr name="header" style="border: 1px solid #dddddd">
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Name")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "RequiredtoSee")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "SeethroughWalls")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Range")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Color")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "EffectFilter")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Transparency")}</th>
											<th style="border: 1px solid #dddddd"></th>
										</tr>`;
		
		for (let vkey of Object.keys(this.vChannels)) {
			vEntriesHTML = vEntriesHTML + 	`	<tr name="${vkey}">
													<td> <input name="Name" type="text" value="${this.vChannels[vkey].Name}"> </td>
													<td style="text-align: center; width:100px"> <input name="RequiredtoSee" type="checkbox" ${this.vChannels[vkey].RequiredtoSee ? "checked" : ""}> </td>
													<td style="text-align: center; width:100px"> <input name="SeethroughWalls" type="checkbox" ${this.vChannels[vkey].SeethroughWalls ? "checked" : ""}> </td>
													<td style="width:50px"> <input name="Range" type="number" value="${this.vChannels[vkey].Range}"> </td>
													<td style="text-align: center; width:50px"> <input name="Color" type="color" value="${this.vChannels[vkey].Color}"> </td>
													<td> 
														<select name="EffectFilter"> 
														</select>
													</td>
													<td style="width:50px"> <input name="Transparency" type="number" value="${this.vChannels[vkey].Transparency}"> </td>
													<td style="text-align: center"> <i name="delete" class="${cDeleteIcon}"></i> </td>
												</tr>`;
		}
		
		vEntriesHTML = vEntriesHTML + `</table>`;
		
		//buttons	
		let vButtonsHTML = 				`<div class="form-group" style="display:flex;flex-direction:column;align-items:center;gap:1em;margin-top:1em">
											<button type="button" name="${cWindowID}.addchannel"> <i class="${cAddIcon}"></i> ${Translate(cWindowID + ".buttons.add.name")} </button>
											<button type="button" name="${cWindowID}.confirmchanges"> <i class="${cConfirmIcon}"></i> ${Translate(cWindowID + ".buttons.confirm.name")} </button>
										</div>`;
										
		return vEntriesHTML + vButtonsHTML;
	}
	
	getHTMLObject(pOptions={}) {
		let vEntriesHTML = `<table name = "entries">`;
		
		let vRecieverSetting = this.vSettingsSubType == "Token";
		
		let vTargetSettings = PerceptiveFlags.getVisionChannels(this.vTarget, true);
		
		vEntriesHTML = vEntriesHTML + 	`<tr name="header" style="border: 1px solid #dddddd">
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Name")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Emits")}</th>`;
		if (vRecieverSetting) {
			vEntriesHTML = vEntriesHTML +	`<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Receives")}</th>`;
		}
		vEntriesHTML = vEntriesHTML +	`</tr>`;
		
		let vChannelSettings;
		
		for (let vkey of Object.keys(this.vChannels)) {
			vChannelSettings = vTargetSettings[vkey];
			
			vEntriesHTML = vEntriesHTML + 	`	<tr name="${vkey}">
													<td> ${this.vChannels[vkey].Name} </td>
													<td style="text-align: center; width:100px"> <input name="Emits" type="checkbox" ${vChannelSettings?.Emits ? "checked" : ""}> </td>`;				
			if (vRecieverSetting) {
				vEntriesHTML = vEntriesHTML + 		`<td style="text-align: center; width:100px"> <input name="Receives" type="checkbox" ${vChannelSettings?.Receives ? "checked" : ""}> </td>`;
			}
			vEntriesHTML = vEntriesHTML + 		`</tr>`;
		}
		
		vEntriesHTML = vEntriesHTML + `</table>`;
		
		//buttons	
		let vButtonsHTML = 				`<div class="form-group" style="display:flex;flex-direction:column;align-items:center;gap:1em;margin-top:1em">
											<button type="button" name="${cWindowID}.confirmchanges"> <i class="${cConfirmIcon}"></i> ${Translate(cWindowID + ".buttons.confirm.name")} </button>
										</div>`;
										
		return vEntriesHTML + vButtonsHTML;
	}
	
	getData(pOptions={}) {
		switch (this.vSettingsType) {
			case "world":
				return {
					content: this.getHTMLWorld(pOptions)
				};
				break;
			case "object":
				return {
					content: this.getHTMLObject(pOptions)
				};
				break;
		}

	}
	
	activateListeners(pHTML) {
		
		let vAddButton = pHTML.find(`button[name="${cWindowID}.addchannel"]`);
		
		vAddButton.on("click", () => {	this.vChannels[randomID()] = {...cDefaultChannel};
										this.render();
										console.log(this)});
											
		let vChannelEntries = pHTML.find(`tr`);
		
		vChannelEntries.each((vNumber, vElement) => {
			let vID = $(vElement).attr("name");
			
			$(vElement).find(`i[name="delete"]`).on("click", () => {delete this.vChannels[vID];
																	this.render()});
		});
		
		let vConfirmButton = pHTML.find(`button[name="${cWindowID}.confirmchanges"]`);
		
		vConfirmButton.on("click", () => {	this.saveChannels();
											this.close()});
	}
	
	//DECLARATIONS
	saveChannels() {} //saves the channels set in this window to the specified setting
	
	static ValueofInput(pInput) {} //returns the input data of pInput
	
	//IMPLEMENTATIONS
	saveChannels() {
		let vHTML = this.element;
		
		let vChannelSettings = {};
		
		let vChannelEntries = vHTML.find(`table`).find(`tr`);
		
		let vSettingKeys;
		
		switch (this.vSettingsType) {
			case "world" :		
				vSettingKeys = Object.keys(cDefaultChannel);
				break;
			case "object" : 
				vSettingKeys = ["Emits"];
				if (this.vSettingsSubType == "Token") {
					vSettingKeys.push("Receives");
				}
				break;
		}
		
		vChannelEntries.each((vNumber, vElement) => {
			let vID = $(vElement).attr("name");
			
			if (vID != "header") {
				let vInputObject;
				
				vChannelSettings[vID] = {};
				
				for (let vKey of vSettingKeys) {
					vInputObject = $(vElement).find(`[name="${vKey}"]`);
					
					vChannelSettings[vID][vKey] = VisionChannelsWindow.ValueofInput(vInputObject);	
				}
			}
		});
		
		switch (this.vSettingsType) {
			case "world" :		
				game.settings.set(cModuleName, cSettingName, vChannelSettings);
				break;
			case "object" :
				PerceptiveFlags.setVisionChannels(this.vTarget, vChannelSettings);
				break;
		}
		
	}
	
	static ValueofInput(pInput) {
		switch (pInput.prop("type")) {
			case "checkbox":
				return pInput.prop("checked");
				break;
			default:
				return pInput.val();
				break;
		}		
	} 
}

function testwindow(pObject = null) {
	new VisionChannelsWindow(pObject).render(true);
}

class VisionChannelsUtils {
	//DECLARATIONS
	function fixVCSetting() {} //creates missing entries in cSettingName
	
	function VCsfromNames(pNames = []) {} //returns a VCs based on a names
	
	//IMPLEMENTATIONS
	function fixVCSetting() {
		let vChannels = game.settings.get(cModuleName, cSettingName);
		
		for (let vChannelKey of Object.keys(vChannels)) {
			for (let vSettingsKey of Object.keys(cDefaultChannel)) {
				if (!vChannels[vChannelKey].hasOwnProperty(vSettingsKey)) {
					vChannels[vChannelKey][vSettingsKey] = cDefaultChannel[vSettingsKey];
				}
			}
		}
		
		game.settings.set(cModuleName, cSettingName, vChannels);
	}
	
	function VCsfromNames(pNames = []) {
		let vChannels = game.settings.get(cModuleName, cSettingName);
		
		return Object.keys(vChannels).filter(vKey => pNames.includes(vChannels[vKey].Name));
	}
}

Hooks.once("init", function() {
	if (!CONFIG[cModuleName]) {
		CONFIG[cModuleName] = {};
	}
	
	CONFIG[cModuleName].DefaultChannel = cDefaultChannel;
	
	game.settings.register(cModuleName, cSettingName, {
		name: Translate("Settings." + cSettingName + ".name"),
		hint: Translate("Settings." + cSettingName + ".descrp"),
		scope: "world",
		config: false,
		type: Object,
		default: {}
	});
	
	game.modules.get("perceptive").api.test = {testwindow};
});

Hooks.once("ready", () => {
	VisionChannelsUtils.fixVCSetting();
});

export {cDefaultChannel, VisionChannelsWindow, VisionChannelsUtils}