//Some basic patches to inject code into vision functions (if available via lib wrapper
import {cModuleName} from "../utils/PerceptiveUtils.js";
import {PerceptiveCompUtils, cLibWrapper } from "../compatibility/PerceptiveCompUtils.js";

var vDCVisionFunctions = [];
var vTokenVisionFunctions = [];
var vTileVisionFunctions = [];

function CheckTilesVisibility() {
	
}

Hooks.once("ready", function() {
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
		libWrapper.register(cModuleName, "DoorControl.prototype.isVisible", function(vWrapped, ...args) {
																										let vBuffer;
																										
																										for (let i = 0; i < vDCVisionFunctions.length; i++) {
																											vBuffer = vDCVisionFunctions[i](this);
																											
																											if (vBuffer != undefined) {
																												return vBuffer;
																											}
																										}
																										
																										return vWrapped(args)}, "MIXED");
	}
	else {
		const vOldDControlCall = DoorControl.prototype.__lookupGetter__("isVisible");

		DoorControl.prototype.__defineGetter__("isVisible", function () {
			let vBuffer;
			
			for (let i = 0; i < vDCVisionFunctions.length; i++) {
				vBuffer = vDCVisionFunctions[i](this);
				
				if (vBuffer != undefined) {
					return vBuffer;
				}
			}

			let vDControlCallBuffer = vOldDControlCall.bind(this);

			return vDControlCallBuffer();
		});
	}
	
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
		libWrapper.register(cModuleName, "CONFIG.Token.objectClass.prototype.isVisible", function(vWrapped, ...args) {
																														let vBuffer;
																														
																														for (let i = 0; i < vTokenVisionFunctions.length; i++) {
																															vBuffer = vTokenVisionFunctions[i](this);
																															
																															if (vBuffer != undefined) {
																																return vBuffer;
																															}
																														}
				
																														return vWrapped(args)}, "MIXED");
	}
	else {
		const vOldTokenCall = CONFIG.Token.objectClass.prototype.__lookupGetter__("isVisible");

		CONFIG.Token.objectClass.prototype.__defineGetter__("isVisible", function () {
			let vBuffer;
			
			for (let i = 0; i < vTokenVisionFunctions.length; i++) {
				vBuffer = vTokenVisionFunctions[i](this);
				
				if (vBuffer != undefined) {
					return vBuffer;
				}
			}

			let vTokenCallBuffer = vOldTokenCall.bind(this);

			return vTokenCallBuffer();
		});
	}
});

export {vDCVisionFunctions, vTokenVisionFunctions, vTileVisionFunctions}