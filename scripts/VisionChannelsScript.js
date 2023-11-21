import { PerceptiveUtils, cModuleName, Translate } from "./utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "./helpers/PerceptiveFlags.js";
import {vDCVisionFunctions, vTokenVisionFunctions, vTileVisionFunctions} from "./helpers/BasicPatches.js";
import { cDefaultChannel, VisionChannelsWindow, VisionChannelsUtils } from "./helpers/VisionChannelsHelper.js";
import { VisionUtils } from "./utils/VisionUtils.js";

var vLocalVisionData = {
	vReceiverChannels : []
}

class VisionChannelsManager {
	//DECLARATIONS
	
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
	}
	
	//ons
	static async onTokenupdate(pToken, pchanges, pInfos, pUserID) {
		
		if (pToken.isOwner && pToken.parent == canvas.scene) {
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
			let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getEmitters(pObject.wall.document), vLocalVisionData.vReceiverChannels, {SourcePoints : canvas.tokens.controlled.map(vObject => vObject.center),
																																					TargetPoint : pObject.center,
																																					InVision : VisionUtils.simpletestVisibility(pObject.center)});
																																					
			if (vChannel) {
				VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
			}
			
			return vChannel;
		});
		
		vTokenVisionFunctions.push(function(pObject) {
			let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getEmitters(pObject.document), vLocalVisionData.vReceiverChannels, 	{SourcePoints : canvas.tokens.controlled.map(vObject => vObject.center),
																																				TargetPoint : pObject.center,
																																				InVision : VisionUtils.simpletestVisibility(pObject.center)});
			
			if (vChannel) {
				VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
			}
			
			return vChannel;
		});
	}
	
	Hooks.on("updateToken", (...args) => {VisionChannelsManager.onTokenupdate(...args)});
});