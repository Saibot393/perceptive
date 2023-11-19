import { cModuleName, Translate } from "../utils/PerceptiveUtils.js";

const cWindowID = "vision-channels-window";
const cConfirmIcon = "fa-solid fa-check";

class VisionChannelsWindow extends Application {
	constructor(pOptions = {}) {
		super(pOptions);
		
		this.vOptions = pOptions;
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
	
	getHTML(pOptions={}) {
		let vEntriesHTML = `<table>`;
		
		vEntriesHTML = `<tr>
							<th>${Translate(cWindowID + ".entries.titles." + "name")}</th>
							<th>${Translate(cWindowID + ".entries.titles." + "required")}</th>
							<th>${Translate(cWindowID + ".entries.titles." + "throughwalls")}</th>
							<th>${Translate(cWindowID + ".entries.titles." + "range")}</th>
							<th>${Translate(cWindowID + ".entries.titles." + "color")}</th>
							<th>${Translate(cWindowID + ".entries.titles." + "filter")}</th>
							<th>${Translate(cWindowID + ".entries.titles." + "transparency")}</th>
						</tr>`;
		
		for (let i = 0; i < 1; i++) {
			vEntriesHTML = vEntriesHTML + 	`	<tr>
													<td> <input type="text"> </td>
													<td> <input type="checkbox"> </td>
													<td> <input type="checkbox"> </td>
													<td> <input type="number"> </td>
													<td> <input type="color"> </td>
													<td> 
														<select> 
														</select>
													</td>
													<td> <input type="number"> </td>
												</tr>`;
		}
		
		vEntriesHTML = vEntriesHTML + `</table>`;
		
		//buttons	
		let vButtonsHTML = 				`<div class="form-group" style="display:flex;flex-direction:row;align-items:center;gap:1em;margin-top:1em">
											<button type="button" name="${cWindowID}.confirmchanges"> <i class="${cConfirmIcon}"></i> ${Translate(cWindowID + ".buttons.confirm.name")} </button>
										</div>`;
										
		return vEntriesHTML + vButtonsHTML;
	}
	
	getData(pOptions={}) {
		return {
			content: this.getHTML(pOptions)
		};
	}
	
	activateListeners(pHTML) {
		
		let vConfirmButton = pHTML.find(`button[name="${cWindowID}.confirmchanges"]`);
		
		vConfirmButton.on("click", () => {});
	}
	
	async _updateObject(pEvent, pData) {
	}	
	
	//DECLARATIONS
	
	//IMPLEMENTATIONS
}

function testwindow() {
	new VisionChannelsWindow().render(true);
}

Hooks.once("ready", function() {
	game.modules.get("perceptive").api.test = {testwindow}
});