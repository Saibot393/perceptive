import { PerceptiveUtils, cModuleName, Translate } from "./utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "./helpers/PerceptiveFlags.js";
import { vDCVisionFunctions, vTokenVisionFunctions, vTileVisionFunctions, vWallInclusionFunctions } from "./helpers/BasicPatches.js";
import { cDefaultChannel, VisionChannelsWindow, VisionChannelsUtils } from "./helpers/VisionChannelsHelper.js";
import { VisionUtils } from "./utils/VisionUtils.js";

var vLocalVisionData = {
	vReceiverChannels : [],
	vCompleteVision : false,
	vRange3D : false
}

class VisionChannelsManager {
	//DECLARATIONS
	static async updateVisionValues(pIgnoreNewlyVisibleTiles = false) {} //updates the local vision values based on controlled tokens
	
	//support
	static VisionPoint(pObject) {} //returns the vision point of pObject used for range calc
	
	static CurrentSourcePoints() {} //returns the current vision source points
	
	static CanVCSeeObject(pViewer, pObject) {} //returns if pSpotter can see pObject
	
	static async OnAEChange(pActor) {} //called when the AEs of an actor changes
	
	//ons
	static async onTokenupdate(pToken, pchanges, pInfos, pUserID) {} //called when a token updates
	
	//IMPLEMENTATIONS
	static async updateVisionValues(pIgnoreNewlyVisibleTiles = false) {
		if (!game.user.isGM || (game.settings.get(cModuleName, "SimulateVCPlayerVision") && canvas.tokens.controlled.length > 0)) {
			vLocalVisionData.vReceiverChannels = VisionChannelsUtils.ReducedReceiverVCs(canvas.tokens.controlled.map(vToken => vToken.document), true);	

			vLocalVisionData.vCompleteVision = false;
		}
		else {
			vLocalVisionData.vReceiverChannels = [];
			
			vLocalVisionData.vCompleteVision = true;
			
			VisionUtils.ResettoGMVision();
		}
		
		vLocalVisionData.vRange3D = game.settings.get(cModuleName, "VCRange3DCalc");
		
		if (CONFIG.debug.perceptive.VCScript) {//DEBUG
			console.log("perceptive: New vision data:", vLocalVisionData);
		}
		
		VisionUtils.PrepareVCObjects();
	}
	
	//support
	static VisionPoint(pObject) {
		if (vLocalVisionData.vRange3D) {
			return {...pObject.center, elevation : pObject.document.elevation};
		}
		else {
			return pObject.center;
		}
	}
	
	static CurrentSourcePoints() {
		return canvas.tokens.controlled.map(vToken => VisionChannelsManager.VisionPoint(vToken));
	}
	
	static CanVCSeeObject(pViewer, pObject) {
		let vInfos = {	SourcePoints : pViewer.object?.center,
						TargetPoint : undefined,
						InVision : undefined};
						
		let vEmitters = [pObject];
		
		switch (pObject.documentName) {
			case "Token":
				vEmitters = PerceptiveFlags.getVCEmitters(pObject, true);
				vInfos.TargetPoint = VisionChannelsManager.VisionPoint(pObject.object);
				vInfos.InVision = VisionUtils.simpletestVisibility(pObject.object?.center);
				break;
			case "Tile":
				vEmitters = PerceptiveFlags.getVCEmitters(pObject);
				vInfos.TargetPoint = VisionChannelsManager.VisionPoint(pObject.object);
				vInfos.InVision = VisionUtils.simpletestVisibility(pObject.object?.center);
				break;
			case "Wall":
				vEmitters = PerceptiveFlags.getVCEmitters(pObject);
				vInfos.TargetPoint = pObject.object?.center;
				vInfos.InVision = VisionUtils.WalltestVisibility(pObject.object);
				break;
		}
		
		return VisionChannelsUtils.isVCvisible(vEmitters, VisionChannelsUtils.ReducedReceiverVCs([pViewer], true), vInfos);
	}
	
	static async OnAEChange(pActor) {
		if (canvas.tokens.controlled.find(vToken => vToken.actor == pActor)) {
			await VisionChannelsManager.updateVisionValues();
			
			let vControlled = canvas.tokens.controlled;
			
			for (let i = 0; i < vControlled.length; i++) {
				vControlled[i].updateVisionSource();
			}
		}
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
			if (vLocalVisionData.vCompleteVision) {return true};
			
			let vInfos = {	SourcePoints : canvas.tokens.controlled.map(vToken => vToken.center),
							TargetPoint : pObject.center,
							InVision : VisionUtils.WalltestVisibility(pObject.wall)};
			
			let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getVCEmitters(pObject.wall.document), vLocalVisionData.vReceiverChannels, vInfos);
			
			//console.log(vInfos);
																																					
			if (vChannel) {
				VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
			}
			
			return vChannel;
		});
		
		vTokenVisionFunctions.push(function(pObject) {
			if (vLocalVisionData.vCompleteVision || pObject.controlled) {return true};
			
			let vInfos =  {	SourcePoints : VisionChannelsManager.CurrentSourcePoints(),
							TargetPoint : VisionChannelsManager.VisionPoint(pObject),
							InVision : VisionUtils.simpletestVisibility(pObject.center)};
			
			let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getVCEmitters(pObject.document, true), vLocalVisionData.vReceiverChannels, vInfos);
			
			//console.log(vInfos, PerceptiveFlags.getVCEmitters(pObject.document, true), vLocalVisionData.vReceiverChannels);
			
			if (vChannel) {
				VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
			}
			
			return vChannel;
		});
		
		vTileVisionFunctions.push(function(pObject) {
			if (vLocalVisionData.vCompleteVision) {return true};
			
			let vEmitterVCs = PerceptiveFlags.getVCEmitters(pObject.document);
			
			if (vEmitterVCs.length) {
				let vInfos = {	SourcePoints : VisionChannelsManager.CurrentSourcePoints(),
								TargetPoint : VisionChannelsManager.VisionPoint(pObject),
								InVision : VisionUtils.simpletestVisibility(pObject.center)};
				
				let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getVCEmitters(pObject.document), vLocalVisionData.vReceiverChannels, vInfos);
				
				//console.log(vInfos, PerceptiveFlags.getVCEmitters(pObject.document), vLocalVisionData.vReceiverChannels);
				
				if (vChannel) {
					VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
				}
				
				return vChannel;
			}
		});		
		
		vWallInclusionFunctions.unshift(function(pWall, pBounds, pCheck) {
			if (vLocalVisionData.vCompleteVision) {return true};
			
			let vWallChannels = [];
			
			switch (pCheck?.config?.type) {
				case "sight":
					vWallChannels = PerceptiveFlags.getVCSight(pWall.document);
					break;
				case "move":
					vWallChannels = PerceptiveFlags.getVCMovement(pWall.document);
					break;
			}
			
			let vInfos = {	SourcePoints : canvas.tokens.controlled.map(vToken => vToken.center),
							TargetPoint : pWall.center,
							WallCheck : true}
			
			let vChannel = VisionChannelsUtils.isVCvisible(vWallChannels, vLocalVisionData.vReceiverChannels, vInfos);
			
			//console.log(vInfos);

			if (vChannel) {
				return false;
			}
		});
	}
	
	Hooks.on("updateToken", (...args) => {VisionChannelsManager.onTokenupdate(...args)});
	
	Hooks.on("controlToken", () => {VisionChannelsManager.updateVisionValues()});
	
	Hooks.on("initializeVisionSources", () => {VisionChannelsManager.updateVisionValues()});
	
	Hooks.on("createActiveEffect", (pEffect, pInfos, pID) => {VisionChannelsManager.OnAEChange(pEffect.parent)});
	
	Hooks.on("deleteActiveEffect",  (pEffect, pInfos, pID) => {VisionChannelsManager.OnAEChange(pEffect.parent)});
});

export function CanVCSeeObject(pViewer, pObject) {return VisionChannelsManager.CanVCSeeObject(pViewer, pObject)};