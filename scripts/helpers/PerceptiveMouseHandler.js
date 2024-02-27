import * as FCore from "../CoreVersionComp.js";
import { PerceptiveUtils, cModuleName } from "../utils/PerceptiveUtils.js";
import { PerceptiveCompUtils, cLibWrapper } from "../compatibility/PerceptiveCompUtils.js";

const cDoorScrollsTurnoff = {
	shiftKey : false,
	ctrlKey : false,
	altKey : false,
	default : true
} //keys at which canvas scrolling is turned off when a door control is hovered

const cDoorRClickTurnoff = {
	shiftKey : false,
	ctrlKey : true,
	altKey : false
} //keys at which canvas scrolling is turned off when a door control is hovered

//takes care of additional mouse handling
class PerceptiveMouseHandler {
	//DECLARATIONS
	//registers
	static RegisterControls() {} //call all register functions
	
	//doors
	static RegisterDoorLeftClick() {} //register Door leftclick
	
	static async RegisterDoorRightClick() {} //register Door reicht click
	
	static RegisterDoorWheel() {} //register Door Mousewheel
	
	//canvas
	static RegisterCanvasWheel() {} //register Door Mousewheel
	
	//ons
	static onDoorLeftClick(pDoorEvent, pWall) {} //called if Door is left clicked
	
	static async onDoorRightClick(pDoorEvent, pWall) {} //called if Door is left clicked
	
	static onDoorWheel(pDoorEvent, pWall) {} //called if Door is wheeled
	
	static onCanvasWheel(pEvent) {} //returns of event should be passed along
	
	//support
	static allowCanvasZoom(pEvent) {} //returns if the canvas should currently be zoomed
	
	//IMPLEMENTATIONS
	//registers
	static RegisterControls() {
		PerceptiveMouseHandler.RegisterDoorLeftClick();
		
		PerceptiveMouseHandler.RegisterDoorRightClick();
		
		PerceptiveMouseHandler.RegisterDoorWheel();
		
		PerceptiveMouseHandler.RegisterCanvasWheel();
	}
	
	//doors
	static RegisterDoorLeftClick() {
		//register onDoorLeftClick (if possible with lib-wrapper)
		/*
		if (LnKCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "DoorControl.prototype.onclick", function(vWrapped, ...args) {LnKMouseHandler.onDoorLeftClick(...args, this.wall); return vWrapped(...args)}, "WRAPPER");
		}
		else {
		*/
		if (FCore.Fversion() > 10) {
			const vOldDoorCall = DoorControl.prototype.onclick;
			
			DoorControl.prototype.onclick = async function (pEvent) {
				if (await PerceptiveMouseHandler.onDoorLeftClick(pEvent, this.wall)) {
					if (vOldDoorCall) {
						let vDoorCallBuffer = vOldDoorCall.bind(this);
						vDoorCallBuffer(pEvent);
					}
				}
			}		

			const vOldDoorCallMD = DoorControl.prototype.onmousedown;
			
			DoorControl.prototype.onmousedown = async function (pEvent) {
				if (await PerceptiveMouseHandler.onDoorLeftClick(pEvent, this.wall)) {
					if (vOldDoorCallMD) {
						let vDoorCallBuffer = vOldDoorCallMD.bind(this);
						vDoorCallBuffer(pEvent);
					}
				}
			}				
		}
		else {
			if (LnKCompUtils.isactiveModule(cLibWrapper)) {
				libWrapper.register(cModuleName, "DoorControl.prototype._onMouseDown", async function(vWrapped, ...args) {if (await PerceptiveMouseHandler.onDoorLeftClick(...args, this.wall)){ return vWrapped(...args)}}, "MIXED");
			}
			else {
				const vOldDoorCall = DoorControl.prototype._onMouseDown;
				
				DoorControl.prototype._onMouseDown = async function (pEvent) {
					if (await PerceptiveMouseHandler.onDoorLeftClick(pEvent, this.wall)) {
					
						if (vOldDoorCall) {
							let vDoorCallBuffer = vOldDoorCall.bind(this);
							vDoorCallBuffer(pEvent);
						}
					}
				}
			}
		}
		//}		
	}
	
	static async RegisterDoorRightClick() {
		//register onDoorRightClick (if possible with lib-wrapper)
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "DoorControl.prototype._onRightDown", async function(vWrapped, ...args) {if (await PerceptiveMouseHandler.onDoorRightClick(...args, this.wall)) {return vWrapped(...args)}}, "MIXED");
		}
		else {
			const vOldDoorCall = DoorControl.prototype._onRightDown;
			
			DoorControl.prototype._onRightDown = async function (pEvent) {
				if (await PerceptiveMouseHandler.onDoorRightClick(pEvent, this.wall)) {
				
					let vDoorCallBuffer = vOldDoorCall.bind(this);
					vDoorCallBuffer(pEvent);
				}
			}
		}		
	} 
	
	static RegisterDoorWheel() {
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper) && false /*strange bug, turn off for now*/) {
			libWrapper.register(cModuleName, "DoorControl.prototype.onwheel", function(vWrapped, ...args) {PerceptiveMouseHandler.onDoorWheel(...args, this.wall); return vWrapped(...args)}, "WRAPPER");
		}
		else {
			const vOldDoorCall = DoorControl.prototype.onwheel;
			
			DoorControl.prototype.onwheel = function (pEvent) {
				PerceptiveMouseHandler.onDoorWheel(pEvent, this.wall);
				
				if (vOldDoorCall) {
					let vDoorCallBuffer = vOldDoorCall.bind(this);
					vDoorCallBuffer(pEvent);
				}
			}
		}
	}
	
	//canvas
	static RegisterCanvasWheel() {
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "canvas._onMouseWheel", function(vWrapped, ...args) {if (PerceptiveMouseHandler.onCanvasWheel(...args)) {return vWrapped(...args)}}, "MIXED");
		}
		else {
			const vOldCanvasCall = canvas._onMouseWheel;
			
			canvas._onMouseWheel = function (pEvent) {
				if (PerceptiveMouseHandler.onCanvasWheel(pEvent)) {		
					if (vOldCanvasCall) {
						let vCanvasCallBuffer = vOldCanvasCall.bind(this);
						vCanvasCallBuffer(pEvent);
					}
				}
			}
		}		
	}
	
	//ons	
	static async onDoorLeftClick(pDoorEvent, pWall) {
		let vOldCall = await Hooks.call(cModuleName + "." + "DoorLClick", pWall.document, FCore.keysofevent(pDoorEvent));
		
		return vOldCall;
	} 
	
	static async onDoorRightClick(pDoorEvent, pWall) {
		let vOldCall = await Hooks.call(cModuleName + "." + "DoorRClick", pWall.document, FCore.keysofevent(pDoorEvent)); //return false to stop normal behaviour
		
		return vOldCall;
		
		/*
		if ((pDoorEvent.shiftKey && cDoorRClickTurnoff.shiftKey) || (pDoorEvent.ctrlKey && cDoorRClickTurnoff.ctrlKey) || (pDoorEvent.altKey && cDoorRClickTurnoff.altKey)) {
			return false;
		}
		else {
			return true;
		}
		*/
	}
	
	static onDoorWheel(pDoorEvent, pWall) {
		Hooks.callAll(cModuleName + "." + "DoorWheel", pWall.document, FCore.keysofevent(pDoorEvent), {x : pDoorEvent.deltaX, y : pDoorEvent.deltaY});
	} 
	
	static onCanvasWheel(pEvent) {
		if (PerceptiveMouseHandler.allowCanvasZoom(pEvent)) {
			return true;
		}
	}
	
	//support
	static allowCanvasZoom(pEvent) {
		if (PerceptiveUtils.hoveredWall()) {
			return false;//!((pEvent.shiftKey && cDoorScrollsTurnoff.shiftKey) || (pEvent.ctrlKey && cDoorScrollsTurnoff.ctrlKey) || (pEvent.altKey && cDoorScrollsTurnoff.altKey) || cDoorScrollsTurnoff.default); 
		}
		
		return true;
	} //returns if the canvas should currently be zoomed
}

//Hooks
Hooks.on("init", function() {
	PerceptiveMouseHandler.RegisterControls();
});

//

export function allowCanvasZoom(pEvent) {return PerceptiveMouseHandler.allowCanvasZoom(pEvent)}