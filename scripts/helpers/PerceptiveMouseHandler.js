import * as FCore from "../CoreVersionComp.js";
import { PerceptiveUtils, cModuleName } from "../utils/PerceptiveUtils.js";
import { PerceptiveCompUtils, cLibWrapper } from "../compatibility/PerceptiveCompUtils.js";

const cDoorScrollsTurnoff = {
	shiftKey : false,
	ctrlKey : false,
	altKey : false,
	default : true
} //keys at which canvas scrolling is turned off when a door control is hovered

//takes care of additional mouse handling
class PerceptiveMouseHandler {
	//DECLARATIONS
	//registers
	static RegisterControls() {} //call all register functions
	
	//doors
	static RegisterDoorLeftClick() {} //register Door leftclick
	
	static RegisterDoorWheel() {} //register Door Mousewheel
	
	//canvas
	static RegisterCanvasWheel() {} //register Door Mousewheel
	
	//ons
	static onDoorLeftClick(pDoorEvent, pWall) {} //called if Door is left clicked
	
	static onDoorWheel(pDoorEvent, pWall) {} //called if Door is wheeled
	
	static onCanvasWheel(pEvent) {} //returns of event should be passed along
	
	//IMPLEMENTATIONS
	//registers
	static RegisterControls() {
		PerceptiveMouseHandler.RegisterDoorLeftClick();
		
		PerceptiveMouseHandler.RegisterDoorWheel();
		
		PerceptiveMouseHandler.RegisterCanvasWheel();
	}
	
	//doors
	static RegisterDoorLeftClick() {
		const vOldDoorCall = DoorControl.prototype.onclick;
		
		DoorControl.prototype.onclick = function (pEvent) {
			PerceptiveMouseHandler.onDoorLeftClick(pEvent, this.wall);
			
			if (vOldDoorCall) {
				let vDoorCallBuffer = vOldDoorCall.bind(this);
				vDoorCallBuffer(pEvent);
			}
		}	
	}
	
	static RegisterDoorWheel() {
		if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
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
	static onDoorLeftClick(pDoorEvent, pWall) {
		Hooks.callAll(cModuleName + "." + "DoorLClick", pWall.document, FCore.keysofevent(pDoorEvent));
	}
	
	static onDoorWheel(pDoorEvent, pWall) {
		Hooks.callAll(cModuleName + "." + "DoorWheel", pWall.document, FCore.keysofevent(pDoorEvent), {x : pDoorEvent.deltaX, y : pDoorEvent.deltaY});
	} 
	
	static onCanvasWheel(pEvent) {
		if (PerceptiveUtils.hoveredWall()) {
			return !((pEvent.shiftKey && cDoorScrollsTurnoff.shiftKey) || (pEvent.ctrlKey && cDoorScrollsTurnoff.ctrlKey) || (pEvent.altKey && cDoorScrollsTurnoff.altKey) || cDoorScrollsTurnoff.default); 
		}
		else {
			return true;
		}
	}
}

//Hooks
Hooks.on("init", function() {
	PerceptiveMouseHandler.RegisterControls();
});