import {cModuleName} from "../utils/PerceptiveUtils.js";
import {PeekingIgnoreWall} from "../PeekingScript.js";
import {isSpottedby as isSpottedbyRAW} from "../SpottingScript.js";
import {PerceptiveFlags} from "../helpers/PerceptiveFlags.js";
import {VisionUtils} from "../utils/VisionUtils.js";
import {VisionChannelsUtils} from "../helpers/VisionChannelsHelper.js";
import {CanVCSeeObject} from "../VisionChannelsScript.js";
import {PatchSupport} from "../helpers/BasicPatches.js";
import {EffectManager} from "../helpers/EffectManager.js";

function objectDocument(pObject) { //for support
	let vObject = pObject;
	
	if (vObject.document) {
		vObject = vObject.document;
	}
	
	return vObject;
}

//returns if wall of pWallDoc should be ignored by Token of pTokenDoc
export function IgnoreWall(pWallDoc, pTokenDoc, pType = "sight") {	let vResult = PatchSupport.WallInclusion(pWallDoc.object, {}, {config : {type : pType, source : {object : pTokenDoc.object}}});
																	if (vResult == undefined) {
																		return false;
																	}
																	return !vResult}

export function IncludeWall(pWall, pBounds, pChek) {let vResult = PatchSupport.WallInclusion(pWall, pBounds, pChek);
													if (vResult == undefined) {
														return true;
													}
													return vResult};

//returns if pObject can be spotted by pSpotter (pCheckFOV if spotter LOS should be included in the calculations) 
export function isSpottedby(pObject, pSpotter, pChecks = {LOS : false, Range : true, Effects : true, Hidden : true, canbeSpotted : true}) {	
	return isSpottedbyRAW(objectDocument(pObject), objectDocument(pSpotter), pChecks);
}

//returns current Light level of pToken
async function LightLevel(pToken) {
	let vToken = objectDocument(pToken);
	
	if (vToken.isOwner) {
		await PerceptiveFlags.CheckLightLevel(vToken);
	}
	
	return PerceptiveFlags.LightLevel(vToken);
}


//returns current Light level modifier of pToken seen with pVisionLevel
async function LightLevelPDCModifier(pToken, pVisionLevel = 0) {	
	let vToken = objectDocument(pToken);
	
	if (vToken.isOwner) {
		await PerceptiveFlags.CheckLightLevel(vToken);
	}

	return PerceptiveFlags.getLightLevelModifier(objectDocument(vToken), pVisionLevel);
}

//returns the Lighting level at position pPosition ({x:x, y:y}), uses canvas scene if no scene is specified
function LightingLevel(pPoint, pScene = null) {
	return VisionUtils.LightingLevel(pPoint, pScene);
}

//toggles perceptive stealthing on pToken
function togglePerceptiveStealthing(pToken) {
	PerceptiveFlags.togglePerceptiveStealthing(objectDocument(pToken));
}

//sets perceptive stealthing on pToken
function setPerceptiveStealthing(pToken, pStealthing) {
	PerceptiveFlags.setPerceptiveStealthing(objectDocument(pToken), pStealthing);
}

//sets perceptive stealthing on pToken
function isPerceptiveStealthing(pToken) {
	return PerceptiveFlags.isPerceptiveStealthing(objectDocument(pToken));
}

//
function SpottablesinRange(pSpotters, pRanges = {Range : Infinity, ConeRange : 0, ConeRotation : 0}, pCategory = {Walls : true, Tokens : true}, filterSpotted = false) {
	let vScene = pSpotters[0]?.parent;
	
	let vSpottables = [];
	
	if (vScene) {
		if (pCategory.Walls) {
			vSpottables = vSpottables.concat(vScene.walls.filter(vWall => vWall.door && PerceptiveFlags.canbeSpotted(vWall)));
		}
		
		if (pCategory.Tokens) {
			vSpottables = vSpottables.concat(vScene.tokens.filter(vToken => PerceptiveFlags.canbeSpotted(vToken)));
		}
		
		if (filterSpotted) {
			vSpottables = vSpottables.filter(vObject => !PerceptiveFlags.isSpottedbyone(vObject, pSpotters));
		}
		
		let vSceneFactor = (vScene.dimensions.size)/(vScene.dimensions.distance);
		
		console.log(vSceneFactor);
		
		vSpottables = vSpottables.filter(vSpottable => VisionUtils.inVisionRange(pSpotters, vSpottable.object.center, pRanges.Range*vSceneFactor, pRanges.ConeRange*vSceneFactor, pRanges.ConeRotation, undefined));
	}
	
	return vSpottables;
}

Hooks.once("init", () => {
	game.modules.get(cModuleName).api = {
		PerceptiveFlags,
		VisionChannelsUtils,
		CanVCSeeObject,
		IncludeWall,
		IgnoreWall,
		isSpottedby,
		LightLevel,
		LightLevelPDCModifier,
		LightingLevel,
		togglePerceptiveStealthing,
		setPerceptiveStealthing,
		isPerceptiveStealthing,
		SpottablesinRange,
		EffectManager
	}
});