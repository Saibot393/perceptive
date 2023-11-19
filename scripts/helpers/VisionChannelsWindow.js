class TakeInventoryWindow extends Application {
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
			template: `modules/${cModuleName}/templates/take-inventory-window.html`,
			jQuery: true,
			title: Translate(cWindowID + ".titles." + "VisionChannels"),
			resizable: true
		});
	}
	
	getHTML(pOptions={}) {
		
		for (let i = 0; i < vInventory.length; i++) {
			vInventoryHTML = vInventoryHTML + 	`
												<div class="form-group item-entry" itemid="${vInventory[i].id}" style="display:flex;flex-direction:row;align-items:center;gap:1em;border: 1px solid">
													<img src="${vInventory[i].img}" style = "height: 2.6em;">
													<p style="width:fit-content">${vInventory[i].name}</p>
													<div style="flex-grow:1"></div>
													<div style="display:flex;flex-direction:row;align-items:center;gap:0.2em;width:fit-content">
														<input class="take-value" value="0" type="number" name="${cWindowID}.take-value.${vTokenID}.${vInventory[i].id}" style="width:2em">
														<p class="take-maximum" style="">/${vInventory[i].quantity}</p>
													</div>
													<button type="button" style="width:fit-content" name="${cWindowID}.take-all.${vTokenID}.${vInventory[i].id}" 
														onclick= "$(this).parent().find('input.take-value').val(${vInventory[i].quantity})"
														> <i class="${cTakeIcon}"></i> </button>
												</div>`;
		}
		
		vInventoryHTML = vInventoryHTML + `</div>`;
		
		//buttons	
		let vButtonsHTML = 				`<div class="form-group" style="display:flex;flex-direction:row;align-items:center;gap:1em;margin-top:1em">
											<button type="button" name="${cWindowID}.confirmchanges"> <i class="${cTransferItemsIcon}"></i> ${Translate(cWindowID + ".buttons.take.name")} </button>
											<button type="button" style="width:fit-content" name="${cWindowID}.take-all.everything"> <i class="${cTakeIcon}"></i> </button>
										</div>`;
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
	
	//DECLARATIONs
	RequestItemTransfer() {} //requests the item transfer as defined
	
	//support
	getTransferInfo() {} //returns the transfer info set in this window
	
	//IMPLEMENTATIONS
	
	RequestItemTransfer() {
		if (game.user.isGM) {
			LnKTakeInventory.ItemTransferRequest({SceneID : this.vTaker.parent.id, TokenID : this.vTaker.id}, {SceneID : this.vInventoryOwner.parent.id, TokenID : this.vInventoryOwner?.id}, this.getTransferInfo(), this.vOptions);
		}
		else {
			game.socket.emit("module."+cModuleName, {pFunction : "ItemTransferRequest", pData : {pTaker : {SceneID : this.vTaker.parent.id, TokenID : this.vTaker.id}, pInventoryOwner : {SceneID : this.vInventoryOwner.parent.id, TokenID : this.vInventoryOwner?.id}, pTransferInfo : this.getTransferInfo(), pOptions : this.vOptions}});
		}
	}
	
	//support
	getTransferInfo() {
		let vInfo = [];
		
		let vEntries = this.element.find('div.item-entry');
		
		vEntries.each(function() {
			vInfo.push({itemid : $(this).attr("itemid"), quantity : $(this).find(`input.take-value`).val()});
		});
		
		for (let i = 0; i < vInfo.length; i++) {
			vInfo[i].iscurrency = this.vInventoryInfo.find(vItem => vItem.id == vInfo[i].itemid)?.iscurrency;
		}
		
		return vInfo;
	}
}