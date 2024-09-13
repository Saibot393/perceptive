import { PerceptiveUtils, cModuleName, Translate } from "./utils/PerceptiveUtils.js";
import { PerceptiveFlags, cVisionChannelsF } from "./helpers/PerceptiveFlags.js";
import { vDCVisionFunctions, vTokenVisionFunctions, vTileVisionFunctions, vWallInclusionFunctions } from "./helpers/BasicPatches.js";
import { cDefaultChannel, VisionChannelsWindow, VisionChannelsUtils } from "./helpers/VisionChannelsHelper.js";
import { VisionUtils } from "./utils/VisionUtils.js";

var vLocalVisionData = {
	vReceiverChannels : [],
	vCompleteVision : false,
	vRange3D : false,
	vRequiredOrBehaviour : false,
	vRangeList : {}
}

class VisionChannelsManager {
	//DECLARATIONS
	static async updateVisionValues(pIgnoreNewlyVisibleTiles = false) {} //updates the local vision values based on controlled tokens
	
	//support
	static VisionPoint(pObject) {} //returns the vision point of pObject used for range calc
	
	static CurrentSourcePoints() {} //returns the current vision source points
	
	static CanVCSeeObject(pViewer, pObject) {} //returns if pSpotter can see pObject
	
	static async OnAEChange(pActor) {} //called when the AEs of an actor changes
	
	static CheckTilesVisibility() {} //tests the visibility of all tile on canvas
	
	//ons
	static async onTokenupdate(pToken, pchanges, pInfos, pUserID) {} //called when a token updates
	
	//IMPLEMENTATIONS
	static async updateVisionValues(pIgnoreNewlyVisibleTiles = false) {
		if (!game.user.isGM || (game.settings.get(cModuleName, "SimulateVCPlayerVision") && canvas.tokens.controlled.length > 0)) {
			let vTokens = canvas.tokens.controlled.map(vToken => vToken.document);
			
			vLocalVisionData.vReceiverChannels = VisionChannelsUtils.ReducedReceiverVCs(vTokens, true, true);	

			vLocalVisionData.vCompleteVision = false;
			
			vLocalVisionData.vRangeList = await VisionChannelsUtils.CalculateRangeList(vLocalVisionData.vReceiverChannels, vTokens);
			
			vLocalVisionData.vRangeList = {...vLocalVisionData.vRangeList, ...VisionChannelsUtils.GetinherentRangeList(vTokens, vLocalVisionData.vRangeList)};
		}
		else {
			vLocalVisionData.vReceiverChannels = [];
			
			vLocalVisionData.vCompleteVision = true;
			
			VisionUtils.ResettoGMVision();
		}
		
		vLocalVisionData.vRange3D = game.settings.get(cModuleName, "VCRange3DCalc");
		
		vLocalVisionData.vRequiredOrBehaviour = game.settings.get(cModuleName, "vRequiredOrBehaviour")
		
		if (CONFIG.debug.perceptive.VCScript) {//DEBUG
			console.log("perceptive: New vision data:", vLocalVisionData);
		}
		
		VisionUtils.PrepareVCObjects();
		
		if (game.release.generation >= 12) VisionChannelsManager.CheckTilesVisibility();
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
						InVision : undefined,
						logicalOR : game.settings.get(cModuleName, "vRequiredOrBehaviour")
					};
						
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
		
		return VisionChannelsUtils.isVCvisible(vEmitters, VisionChannelsUtils.ReducedReceiverVCs([pViewer], true, true), vInfos);
	}
	
	static async OnAEChange(pActor) {
		if (canvas.tokens.controlled.find(vToken => vToken.actor == pActor)) {
			await VisionChannelsManager.updateVisionValues();
			
			let vControlled = canvas.tokens.controlled;
			
			for (let i = 0; i < vControlled.length; i++) {
				if (vControlled[i].updateVisionSource) vControlled[i].updateVisionSource();
			}
		}
	}
	
	static CheckTilesVisibility() {
		let vTiles = canvas.tiles.placeables;
		
		let vBuffer;
		
		for (let i = 0; i < vTiles.length; i++) {
			vTiles[i].renderFlags.set({refreshState: true});
		}
	}
	
	//ons
	static async onTokenupdate(pToken, pchanges, pInfos, pUserID) {
		if (pToken.object?.controlled) {
			VisionChannelsManager.updateVisionValues();
			
			if (pchanges?.flags?.perceptive?.hasOwnProperty(cVisionChannelsF)) {
				if (pToken.object.updateVisionSource) pToken.object.updateVisionSource();
			}
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
		vDCVisionFunctions.unshift(function(pObject) {
			if (vLocalVisionData.vCompleteVision) {return undefined};
			
			let vInfos = {	SourcePoints : canvas.tokens.controlled.map(vToken => vToken.center),
							TargetPoint : pObject.center,
							InVision : VisionUtils.WalltestVisibility(pObject.wall),
							RangeList : vLocalVisionData.vRangeList,
							logicalOR : vLocalVisionData.vRequiredOrBehaviour
						};
						
			let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getVCEmitters(pObject.wall.document), vLocalVisionData.vReceiverChannels, vInfos);
			
			//console.log(vInfos);
																																					
			if (vChannel) {
				VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
			}
			
			if (CONFIG.debug.perceptive.VCScript) {
				console.log(vInfos);
			}
			
			return vChannel;
		});
		
		vTokenVisionFunctions.push(function(pObject) {
			if (vLocalVisionData.vCompleteVision || pObject.controlled) {return undefined};
			
			let vInfos =  {	SourcePoints : VisionChannelsManager.CurrentSourcePoints(),
							TargetPoint : VisionChannelsManager.VisionPoint(pObject),
							InVision : VisionUtils.simpletestVisibility(pObject.center, {object : pObject}),
							RangeList : vLocalVisionData.vRangeList,
							logicalOR : vLocalVisionData.vRequiredOrBehaviour
						};
			
			let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getVCEmitters(pObject.document, true), vLocalVisionData.vReceiverChannels, vInfos);
			
			//console.log(vInfos, PerceptiveFlags.getVCEmitters(pObject.document, true), vLocalVisionData.vReceiverChannels);
			
			if (vChannel) {
				VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
			}
		
			if (CONFIG.debug.perceptive.VCScript) {
				console.log(vInfos);
			}
			
			return vChannel;
		});
		
		vTileVisionFunctions.unshift(function(pObject) {
			if (vLocalVisionData.vCompleteVision) {return undefined};
			
			let vEmitterVCs = PerceptiveFlags.getVCEmitters(pObject.document);
			
			if (vEmitterVCs.length) {
				let vInfos = {	SourcePoints : VisionChannelsManager.CurrentSourcePoints(),
								TargetPoint : VisionChannelsManager.VisionPoint(pObject),
								InVision : VisionUtils.simpletestVisibility(pObject.center, {object : pObject}),
								RangeList : vLocalVisionData.vRangeList,
								logicalOR : vLocalVisionData.vRequiredOrBehaviour
							};

				let vChannel = VisionChannelsUtils.isVCvisible(PerceptiveFlags.getVCEmitters(pObject.document), vLocalVisionData.vReceiverChannels, vInfos);
				
				//console.log(vInfos, PerceptiveFlags.getVCEmitters(pObject.document), vLocalVisionData.vReceiverChannels);
				
				if (vChannel) {
					VisionChannelsUtils.ApplyGraphics(pObject, vChannel);
				}
				
				if (CONFIG.debug.perceptive.VCScript) {
					console.log(vInfos);
				}
				
				return vChannel;
			}
		});		
		
		vWallInclusionFunctions.push(function(pWall, pBounds, pCheck) {
			if (vLocalVisionData.vCompleteVision) {return undefined};
			
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
							WallCheck : true,
							RangeList : vLocalVisionData.vRangeList,
							logicalOR : vLocalVisionData.vRequiredOrBehaviour
						};
			
			let vChannel = VisionChannelsUtils.isVCvisible(vWallChannels, vLocalVisionData.vReceiverChannels, vInfos);
			
			//console.log(vInfos);
			
			if (CONFIG.debug.perceptive.VCScript) {
				console.log(vInfos);
			}

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
	
	if (game.release.generation >= 12) {
		Hooks.on("refreshToken", (pToken) => {
			if (pToken.controlled) {
				VisionChannelsManager.CheckTilesVisibility();
			}
		});
		
		Hooks.on("controlToken", (pToken) => {
			VisionChannelsManager.CheckTilesVisibility();
		});
	}
	
	Hooks.on(cModuleName+".updateVCVision", async (pObject) => {
		if (pObject.object?.controlled && pObject.documentName == 'Token') {
			await VisionChannelsManager.updateVisionValues();
			
			if (pObject.object.updateVisionSource) pObject.object.updateVisionSource();
		}
	});
});

export function CanVCSeeObject(pViewer, pObject) {return VisionChannelsManager.CanVCSeeObject(pViewer, pObject)};