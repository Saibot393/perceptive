import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import { GeometricUtils } from "./utils/GeometricUtils.js";

const cStalking = true;

const cAreaScale = 1.2;

class StalkingManager {
	//DECLARATIONS
	
	//ons
	static OnTokenrefresh(pToken, pchanges, pInfos) {} //called when a token is updated
	
	static OnTokenupdate(pToken, pchanges, pInfos) {} //called when a token is updated
	//IMPLEMENTATIONS
	
	//ons
	static OnTokenrefresh(pToken, pchanges) {
		if (cStalking && pchanges.refreshPosition) {
			console.log();
			if (PerceptiveUtils.selectedTokens().includes(pToken.document)) {
				let cCenter = GeometricUtils.average(PerceptiveUtils.selectedTokens().map(vToken => GeometricUtils.CenterPosition(vToken)));
				
				let vArea = GeometricUtils.GetArea(PerceptiveUtils.selectedTokens());
				
				vArea = GeometricUtils.ScaleArea(vArea, cAreaScale);
				
				let vScreenWidth = canvas.screenDimensions[0];
				
				let vPanTarget = {x : cCenter[0], y : cCenter[1]}
				
				if (!ui.sidebar._collapsed) {
					vScreenWidth = vScreenWidth - ui.sidebar.position.width;
				}
				
				let vScale = (canvas.screenDimensions[0] - ui.chat.position.width)/GeometricUtils.AreaWidth(vArea);
				
				if (vScale < canvas.stage.scale.x) {
					vPanTarget.scale = vScale;
				}
				
				canvas.pan(vPanTarget);
			}
		}
	}
}

Hooks.on("refreshToken", (...args) => StalkingManager.OnTokenrefresh(...args));