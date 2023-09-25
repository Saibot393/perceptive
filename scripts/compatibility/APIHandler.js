import {cModuleName} from "../utils/PerceptiveUtils.js";
import {PeekingIgnoreWall} from "../PeekingScript.js";
import {isSpottedby as isSpottedbyRAW} from "../SpottingScript.js";

//returns if wall of pWallDoc should be ignored by Token of pTokenDoc
export function IgnoreWall(pWallDoc, pTokenDoc) {return PeekingIgnoreWall(pWallDoc, pTokenDoc)}

//returns if pObject can be spotted by pSpotter (pCheckFOV if spotter FOV should be included in the calculations) 
export function isSpottedby(pObject, pSpotter, pChecks = {Range : true}) {
	let vObject = pObject;
	let vSpotter = pSpotter;
	
	if (vObject.document) {
		vObject = vObject.document;
	}
	
	if (vSpotter.document) {
		vSpotter = vSpotter.document;
	}
	
	return isSpottedbyRAW(vObject, vSpotter, pChecks);
}

Hooks.once("init", () => {
	game.modules.get(cModuleName).api = {
		IgnoreWall,
		isSpottedby
	}
});