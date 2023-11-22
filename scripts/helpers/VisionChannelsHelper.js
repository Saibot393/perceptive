import { cModuleName, Translate } from "../utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "./PerceptiveFlags.js";
import { GeometricUtils } from "../utils/GeometricUtils.js";

const cWindowID = "vision-channels-window";

const cConfirmIcon = "fa-solid fa-check";
const cAddIcon = "fa-solid fa-plus";
const cDeleteIcon = "fa-solid fa-trash";

const cSettingName = "VisionChannels";

const cEffectFilters = ["off", "outline", "outline_waves", "glow"];

const cDefaultChannel = {
	Name : "Vision Channel",
	Color : "#ffffff",
	RequiredtoSee : false,
	SeethroughWalls : false,
	Range : -1,
	EffectFilter : null,
	EffectFilterColor : "#000000",
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
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "EffectFilter.name")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "EffectFilterColor")}</th>
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
														<select name="EffectFilter">`;
														
			for (let vOption of cEffectFilters) {
				vEntriesHTML = vEntriesHTML + 				`<option value = ${vOption} ${this.vChannels[vkey].EffectFilter==vOption ? "selected" : ""}> ${Translate(cWindowID + ".entries.titles.EffectFilter.options." + vOption)} </option>`;
			}
						
			vEntriesHTML = vEntriesHTML + 				`</select>
													</td>
													<td style="text-align: center; width:100px"> <input name="EffectFilterColor" type="color" value="${this.vChannels[vkey].EffectFilterColor}"> </td>
													<td style="width:50px"> <input name="Transparency" type="number" value="${this.vChannels[vkey].Transparency}" min="0" max="1" step="0.05"> </td>
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
		
		let vWallSetting = this.vSettingsSubType == "Wall";
		
		let vTargetSettings = PerceptiveFlags.getVisionChannels(this.vTarget, true);
		
		vEntriesHTML = vEntriesHTML + 	`<tr name="header" style="border: 1px solid #dddddd">
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Name")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Emits")}</th>`;
		if (vRecieverSetting) {
			vEntriesHTML = vEntriesHTML +	`<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Receives")}</th>`;
		}
		if (vWallSetting) {
			vEntriesHTML = vEntriesHTML +	`<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Sight")}</th>
											<th style="border: 1px solid #dddddd">${Translate(cWindowID + ".entries.titles." + "Movement")}</th>`;
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
			if (vWallSetting) {
				vEntriesHTML = vEntriesHTML +	`<td style="text-align: center; width:100px"> <input name="Sight" type="checkbox" ${vChannelSettings?.Sight ? "checked" : ""}> </td>
												<td style="text-align: center; width:100px"> <input name="Movement" type="checkbox" ${vChannelSettings?.Movement ? "checked" : ""}> </td>`;
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
										this.render();});
											
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
				if (this.vSettingsSubType == "Wall") {
					vSettingKeys.push("Sight");
					vSettingKeys.push("Movement");
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
	static fixVCSetting() {} //creates missing entries in cSettingName
	
	static VCsfromNames(pNames = []) {} //returns a VCs based on a names
	
	static isVCvisible(pEmitterChannels, pReceiverChannels,  pVCInfos = {SourcePoints : [], TargetPoint : undefined, InVision : false, WallCheck : false, returnasID : false}) {} //returns if an object with pEmitterChannels is visible to vision source with pReceiverChannels and pVCInfos (which will also include additional infos to this
	
	static ReducedReceiverVCs(pTokens) {} //returns an array of unique vision channels active in pTokens
	
	//graphics
	static ApplyGraphics(pObject, pChannel) {} //applies the effect of pChannel to the mesh of pObject
	
	//Import/Export GMBH Saibot
	static AddChannel(pChannel, pID = "") {} //adds pChannel to world under pID (or random ID if not specified)
	
	static AddChannels(pChannels, pOverrideDuplicates = false) {} //merges a channel object into worlds channels
	
	static ExportChannelsbyID(pID = undefined) {} //returns object of channels matching pID (single ID, array, undefined for all)
	
	static ExportChannelsbyName(pName = undefined) {} //returns object of channels matching pID (single pName, array, undefined for all)
	
	//IMPLEMENTATIONS
	static fixVCSetting() {
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
	
	static VCsfromNames(pNames = []) {
		let vChannels = game.settings.get(cModuleName, cSettingName);
		
		return Object.keys(vChannels).filter(vKey => pNames.includes(vChannels[vKey].Name));
	}
	
	static isVCvisible(pEmitterChannels, pReceiverChannels, pVCInfos = {SourcePoints : [], TargetPoint : undefined, InVision : false, WallCheck : false, returnasID : false}) {
		if (pEmitterChannels.length) {
			pVCInfos.Report = {};
			
			let vChannels = game.settings.get(cModuleName, cSettingName);
			
			let vCommons = pEmitterChannels.filter(vChannelID => pReceiverChannels.includes(vChannelID));
			
			let vNotReceived = pEmitterChannels.filter(vChannelID => !vCommons.includes(vChannelID));
			
			if (vNotReceived.find(vChannelID => vChannels[vChannelID]?.RequiredtoSee)) {
				//a required channel is not recived
				pVCInfos.Report.Reason = "RequiredVCnotMatched";
				return false;
			}
			
			if (!pVCInfos.WallCheck && !pVCInfos.InVision) {
				//check if see through walls is necessary for vision
				vCommons = vCommons.filter(vChannelID => vChannels[vChannelID].SeethroughWalls);
			}
			
			if (vCommons.length) {
				//seperate ranged and not ranged 
				let vRangeLessVCs = vCommons.filter(vChannelID => (vChannels[vChannelID]?.Range < 0));
				
				if (vRangeLessVCs.length) {
					//check range less
					pVCInfos.Report.Reason = "RangeLessVC";
					
					if (pVCInfos.returnasID) {
						return vRangeLessVCs[0];
					}
					
					return vChannels[vRangeLessVCs[0]];
				}
				else {
					if (pVCInfos.TargetPoint) {
						//check ranged
						let vRangedVCs = vCommons.filter(vChannelID => !vRangeLessVCs.includes(vChannelID));
						
						let vMaxRange = 0;
						let vMaxVC = undefined;
						
						vRangedVCs.forEach(vChannelID => {if (vChannels[vChannelID]?.Range > vMaxRange){vMaxVC = vChannelID; vMaxRange = vChannels[vChannelID]?.Range}});
						
						vMaxRange = vMaxRange * (canvas.scene.dimensions.size)/(canvas.scene.dimensions.distance);
						
						if (vMaxVC) {
							//check VC with heighest Range
							if (pVCInfos.SourcePoints.find(vPoint => GeometricUtils.DistanceXY(vPoint, pVCInfos.TargetPoint) < vMaxRange)) {
								pVCInfos.Report.Reason = "RangedVC";
								
								if (pVCInfos.returnasID) {
									return vMaxVC;
								}
								
								return vChannels[vMaxVC];
							}
						}
					}
				}
			}
		}
	}
	
	static ReducedReceiverVCs(pTokens) {
		let vVCs = [];
		
		for (let i = 0; i < pTokens.length; i++) {
			vVCs = vVCs.concat(PerceptiveFlags.getVCReceivers(pTokens[i]).filter(vChannelID => !vVCs.includes(vChannelID)));
		}
		
		return vVCs;
	}
	
	//graphics
	static ApplyGraphics(pObject, pChannel) {
		if (pObject) {
			if (pObject instanceof Token) {	
				let vFilter;
				
				switch (pChannel.EffectFilter) {
					case "outline":
					case "waves":
					case "outline_waves":
						vFilter = OutlineOverlayFilter.create({
							outlineColor : Color.fromString(pChannel.EffectFilterColor).rgb.concat([1]),
							thickness : [1, 1],
							knockout : false, //anti aliasing
							wave : ["waves", "outline_waves"].includes(pChannel.EffectFilter)
						});
						break;
					case "glow" :
						vFilter = GlowOverlayFilter.create({
							glowColor :  Color.fromString(pChannel.EffectFilterColor).rgb.concat([1])
						});
						break;
				}
				
				
				
				if (vFilter) {
					pObject.detectionFilter = vFilter;
				}
			}
			
			if (pObject.mesh) {
				pObject.mesh.tint = parseInt(pChannel.Color.substr(1,7), 16);
				
				pObject.mesh.alpha = pChannel.Transparency;
			}
			else {
				if (pObject.icon) {
					pObject.icon.tint = parseInt(pChannel.Color.substr(1,7), 16);
					
					pObject.icon.alpha = pChannel.Transparency;
				}
			}
		}
	}
	
	//Import/Export GMBH Saibot
	static AddChannel(pChannel, pID = "") {
		let vChannels = game.settings.get(cModuleName, cSettingName);
		
		let vID = pID;
		
		if (!vID.length) {
			vID = randomID();
		}
		
		for (let vKey of Object.keys(cDefaultChannel)) {
			if (!(typeof pChannel[vKey] == typeof cDefaultChannel[vKey])) {
				ui.notifications.error(`${cModuleName} : Faulty Vision Channel with ID ${pID} at field ${vKey} not added to World (name : ${pChannel.Name})`);
				return;
			}
		}
		
		vChannels[vID] = pChannel;
	}
	
	static AddChannels(pChannels, pOverrideDuplicates = false) {
		for (let vKey of Object.keys(pChannels)) {
			VisionChannelsUtils.AddChannel(pChannels[vKey], vKey);
		}
	}
	
	static ExportChannelsbyID(pID = undefined) {
		let vIDs = pID;
		
		if (typeof vID == "string") {
			vIDs = [vID];
		}
		
		let vExport = {};
		
		let vChannels = game.settings.get(cModuleName, cSettingName); 
		
		for (vID of vIDs) {
			if (vChannels[vID]) {
				vExport[vID] = {...vChannels[vID]}
			}
		}
		
		return vExport;
	}
	
	static ExportChannelsbyName(pName = undefined) {
		let vNames = pName;
		
		if (typeof vNames == "string") {
			vNames = [vNames];
		}
		
		let vChannels = game.settings.get(cModuleName, cSettingName); 
		
		return VisionChannelsUtils.ExportChannelsbyID(Object.keys(vChannels).filter(vID => vNames.includes(vChannels[vID].Name)));
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
	
	game.modules.get("perceptive").test = {testwindow, VisionChannelsUtils};
});

Hooks.once("ready", () => {
	VisionChannelsUtils.fixVCSetting();
});

export {cDefaultChannel, VisionChannelsWindow, VisionChannelsUtils}