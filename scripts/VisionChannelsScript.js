import { PerceptiveUtils, cModuleName, Translate } from "./utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "./helpers/PerceptiveFlags.js";
import { vDCVisionFunctions, vTokenVisionFunctions, vTileVisionFunctions, vWallInclusionFunctions } from "./helpers/BasicPatches.js";
import { cDefaultChannel, VisionChannelsWindow, VisionChannelsUtils } from "./helpers/VisionChannelsHelper.js";
import { VisionUtils } from "./utils/VisionUtils.js";

var vLocalVisionData = {
	vReceiverChannels : []
}

class VisionChannelsManager {
	//DECLARATIONS
	static async updateVisionValues(pIgnoreNewlyVisibleTiles = false) {} //updates the local vision values based on controlled tokens
	
	static async onTokenupdate(pToken, pchanges, pInfos, pUserID) {} //called when a token updates
	
	//IMPLEMENTATIONS
	static async updateVisionValues(pIgnoreNewlyVisibleTiles = false) {
		if (!game.user.isGM || game.settings.get(cModuleName, "SimulatePlayerVision")) {
			vLocalVisionData.vReceiverChannels = VisionChannelsUtils.ReducedReceiverVCs(canvas.tokens.controlled.map(vToken => vToken.document));		
		}
		else {
			vLocalVisionData.vReceiverChannels = [];
		}
		
		//SpottingManager.CheckTilesSpottingVisible(pIgnoreNewlyVisibleTiles);
		
		if (CONFIG.debug.perceptive.VCScript) {//DEBUG
			console.log("perceptive: New vision data:", vLocalVisionData);
		}
		
		VisionUtils.PrepareVCObjects();
	}
	
	//ons
	static async onTokenupdate(pToken, pchanges, pInfos, pUserID) {
		
		if (pToken.controlled) {
			VisionChannelsManager.updateVisionValues();
		}
	}
}

//Hooks
Hooks.once("ready", function() {
	if (!CONFIG.debug.hasOwnProperty(cModuleName)) {
		CONFIG.debug[cModuleName] = {};
	}
	
	CONFIG.debug.perceptive.VCScript = false;
	
	if (game.settings.get(cModuleName, "ActivateVCs")) {
		vDCVisionFunctions.push(function(pObject) {
			let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getVCEmitters(pObject.wall.document), vLocalVisionData.vReceiverChannels,{SourcePoints : canvas.tokens.controlled.map(vToken => vToken.center),
																																					TargetPoint : pObject.center,
																																					InVision : VisionUtils.simpletestVisibility(pObject.center)});
																																					
			if (vChannel) {
				VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
			}
			
			return vChannel;
		});
		
		vTokenVisionFunctions.push(function(pObject) {
			let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getVCEmitters(pObject.document), vLocalVisionData.vReceiverChannels, {SourcePoints : canvas.tokens.controlled.map(vToken => vToken.center),
																																				TargetPoint : pObject.center,
																																				InVision : VisionUtils.simpletestVisibility(pObject.center)});
			
			if (vChannel) {
				VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
			}
			
			return vChannel;
		});
		
		vTileVisionFunctions.push(function(pObject) {
			let vEmitterVCs = PerceptiveFlags.getVCEmitters(pObject.document);
			
			if (vEmitterVCs.length) {
				let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getVCEmitters(pObject.document), vLocalVisionData.vReceiverChannels, {SourcePoints : canvas.tokens.controlled.map(vToken => vToken.center),
																																					TargetPoint : pObject.center,
																																					InVision : VisionUtils.simpletestVisibility(pObject.center)});
				
				if (vChannel) {
					VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
				}
				
				return vChannel;
			}
		});		
		
		vWallInclusionFunctions.unshift(function(pWall, pBounds, pCheck) {
			let vWallChannels = [];
			
			switch (pCheck?.config?.type) {
				case "sight":
					vWallChannels = PerceptiveFlags.getVCSight(pWall.document);
					break;
				case "move":
					vWallChannels = PerceptiveFlags.getVCMovement(pWall.document);
					break;
			}
			
			let vChannel = VisionChannelsUtils.isVCvisible(vWallChannels, vLocalVisionData.vReceiverChannels, {	SourcePoints : canvas.tokens.controlled.map(vToken => vToken.center),
																												TargetPoint : pWall.center,
																												WallCheck : true});

			if (vChannel) {
				return false;
			}
		});
	}
	
	Hooks.on("updateToken", (...args) => {VisionChannelsManager.onTokenupdate(...args)});
	
	Hooks.on("controlToken", () => {VisionChannelsManager.updateVisionValues()});
});