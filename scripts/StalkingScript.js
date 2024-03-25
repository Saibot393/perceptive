import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import { GeometricUtils } from "./utils/GeometricUtils.js";

const cStalking = true;

const cAreaScale = 1.2;

class StalkingManager {
	//DECLARATIONS
	static PanToselectedCenter(pToken, pchanges) {} //pans camera to the center of all selected tokens
	
	//ons
	static OnTokenrefresh(pToken, pchanges, pInfos) {} //called when a token is updated
	
	static OnTokenControl(pToken, pControl) {} //called when the token controll changes
	
	//IMPLEMENTATIONS
	static PanToselectedCenter(pToken, pchanges) {
		if (PerceptiveUtils.selectedTokens().length) {
			let pCenter = GeometricUtils.average(PerceptiveUtils.selectedTokens().map(vToken => GeometricUtils.liveCenterPosition(vToken)));
			
			let vArea = GeometricUtils.GetArea(PerceptiveUtils.selectedTokens());
			
			vArea = GeometricUtils.ScaleArea(vArea, cAreaScale);
			
			let vScreenWidth = canvas.screenDimensions[0];
			
			if (!ui.sidebar._collapsed) {
				vScreenWidth = vScreenWidth - ui.sidebar.position.width;
			}
			
			let vPanTarget = {x : pCenter[0], y : pCenter[1]}
			
			let vxScale = (vScreenWidth)/GeometricUtils.AreaWidth(vArea);
			let vyScale = (canvas.screenDimensions[1])/GeometricUtils.AreaHeight(vArea);
			
			let vScale = Math.min(vxScale, vyScale);
			
			if (vScale < canvas.stage.scale.x) {
				vPanTarget.scale = vScale;
			}
			else {
				vPanTarget.scale = canvas.stage.scale.x;
			}
			
			vPanTarget.x = vPanTarget.x + (canvas.screenDimensions[0] - vScreenWidth)/vPanTarget.scale/2;	
			
			canvas.pan(vPanTarget);
		}
	}
	
	//ons
	static OnTokenrefresh(pToken, pchanges, pTest) {
		if (pchanges.refreshPosition) {
			if (PerceptiveUtils.selectedTokens().includes(pToken.document)) {
				if (game.settings.get(cModuleName, "followTokens") && pchanges.refreshPosition) {
					StalkingManager.PanToselectedCenter(pToken, pchanges);
				}
			}
		}
	}
	
	static OnTokenControl(pToken, pControl) {
		if (game.settings.get(cModuleName, "followonControl")) {
			if (pControl && game.settings.get(cModuleName, "followTokens")) {
				StalkingManager.PanToselectedCenter(pToken);
			}		
		}
	} 
}

Hooks.on("refreshToken", (...args) => {StalkingManager.OnTokenrefresh(...args)});

Hooks.on("controlToken", (pToken, pControl) => {StalkingManager.OnTokenControl(pToken, pControl)});