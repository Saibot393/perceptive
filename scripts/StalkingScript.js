import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import { GeometricUtils } from "./utils/GeometricUtils.js";

const cStalking = true;

class StalkingManager {
	//DECLARATIONS
	
	//ons
	static OnTokenrefresh(pToken, pchanges, pInfos) {} //called when a token is updated
	
	static OnTokenupdate(pToken, pchanges, pInfos) {} //called when a token is updated
	//IMPLEMENTATIONS
	
	//ons
	static OnTokenrefresh(pToken, pchanges) {
		console.log(pToken);
		console.log(pchanges);
		if (cStalking && pchanges.refreshPosition) {
			console.log(GeometricUtils.average(PerceptiveUtils.selectedTokens().map(vToken => GeometricUtils.CenterPosition(vToken))));
			if (PerceptiveUtils.selectedTokens().includes(pToken.document)) {
				canvas.pan({x : pToken.center.x, y : pToken.center.y});
			}
		}
	}
	
	static OnTokenupdate(pToken, pchanges) {
		console.log(pToken);
		console.log(pchanges);
		if (cStalking && pchanges.refreshPosition) {
			console.log(GeometricUtils.average(PerceptiveUtils.selectedTokens().map(vToken => GeometricUtils.CenterPosition(vToken))));
			if (PerceptiveUtils.selectedTokens().includes(pToken.document)) {
				//canvas.animatePan({x : pToken.center.x, y : pToken.center.y});
			}
		}
	}
}

Hooks.on("refreshToken", (...args) => StalkingManager.OnTokenrefresh(...args));

Hooks.on("updateToken", (...args) => StalkingManager.OnTokenupdate(...args));