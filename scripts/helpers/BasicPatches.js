//Some basic patches to inject code into vision functions (if available via lib wrapper
import {cModuleName} from "../utils/PerceptiveUtils.js";
import {PerceptiveCompUtils, cLibWrapper } from "../compatibility/PerceptiveCompUtils.js";

var vDCVisionFunctions = [];
var vTokenVisionFunctions = [];
var vTileVisionFunctions = [];
var vWallInclusionFunctions = [];

class PatchSupport {
	//DECLARATIONS
	static CheckTilesVisibility(pToken) {} //tests the visibility of all tile on canvas

	static WallInclusion(pWall, pBounds, pCheck) {} //returns if pWall should be included in pCheck
	
	//IMPLEMENTATIONS
	static CheckTilesVisibility(pToken) {
		let vTiles = canvas.tiles.placeables;
		
		let vBuffer;
		
		for (let i = 0; i < vTiles.length; i++) {
			for (let j = 0; j < vTileVisionFunctions.length; j++) {
				vBuffer = vTileVisionFunctions[j](vTiles[i]);
				
				if (vBuffer != undefined) {
					vTiles[i].visible = vBuffer;
					break;
				}
				
				//vTiles[i].visible = VisionUtils.simpletestVisibility(vTiles[i].center);
			}
		}
	}
	
	static WallInclusion(pWall, pBounds, pCheck) {
		let vBuffer;
		
		for (let i = 0; i < vWallInclusionFunctions.length; i++) {
			vBuffer = vWallInclusionFunctions[i](pWall, pBounds, pCheck);
			
			if (vBuffer != undefined) {
				return vBuffer;
			}
		}
	}
}

Hooks.once("ready", function() {
	Hooks.on("refreshToken", (pToken) => {
		if (pToken.controlled) {
			PatchSupport.CheckTilesVisibility(pToken);
		}
	});
	
	Hooks.on("controlToken", (pToken) => {
		PatchSupport.CheckTilesVisibility(pToken);
	});
	
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
		libWrapper.register(cModuleName, "DoorControl.prototype.isVisible", function(pWrapped, ...args) {
																										let vBuffer;
																										
																										for (let i = 0; i < vDCVisionFunctions.length; i++) {
																											vBuffer = vDCVisionFunctions[i](this);
																											
																											if (vBuffer != undefined) {
																												return vBuffer;
																											}
																										}
																										
																										return pWrapped(args)}, "MIXED");
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
		libWrapper.register(cModuleName, "CONFIG.Token.objectClass.prototype.isVisible", function(pWrapped, ...args) {
																														let vBuffer;
																														
																														for (let i = 0; i < vTokenVisionFunctions.length; i++) {
																															vBuffer = vTokenVisionFunctions[i](this);
																															if (vBuffer != undefined) {
																																return vBuffer;
																															}
																														}
				
																														return pWrapped(args)}, "MIXED");
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
	
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
		libWrapper.register(cModuleName, "ClockwiseSweepPolygon.prototype._testWallInclusion", function(pWrapped, pWall, pBounds) {
																																	let vBuffer = PatchSupport.WallInclusion(pWall, pBounds, this);
																														
																																	if (vBuffer != undefined) {
																																		return vBuffer;
																																	}
				
																																	return pWrapped(pWall, pBounds)}, "MIXED");
	}
	else {
		const vOldWallCall = ClockwiseSweepPolygon.prototype._testWallInclusion;
		
		ClockwiseSweepPolygon.prototype._testWallInclusion = function (pWall, pBounds) {
			let vBuffer = PatchSupport.WallInclusion(pWall, pBounds, this);
			
			if (vBuffer != undefined) {
				return vBuffer;
			}
			
			let vWallCallBuffer = vOldWallCall.bind(this);
			
			return vWallCallBuffer(pWall, pBounds);
		}
	}	
});

export {vDCVisionFunctions, vTokenVisionFunctions, vTileVisionFunctions, vWallInclusionFunctions, PatchSupport}