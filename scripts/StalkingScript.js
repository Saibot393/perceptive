import {PerceptiveUtils, cModuleName} from "./utils/PerceptiveUtils.js";
import { GeometricUtils } from "./utils/GeometricUtils.js";

const cStalking = true;

const cAreaScale = 1.2;

class StalkingManager {
	//DECLARATIONS
	static PanToselectedCenter(pToken, pchanges) {} //pans camera to the center of all selected tokens
	
	static PanwithChange(pToken, pchanges) {} //changes the camera according to pchanges
	
	//ons
	static OnTokenrefresh(pToken, pchanges, pInfos) {} //called when a token is updated
	
	//IMPLEMENTATIONS
	static PanToselectedCenter(pToken, pchanges) {
		let cCenter = GeometricUtils.average(PerceptiveUtils.selectedTokens().map(vToken => GeometricUtils.CenterPosition(vToken)));
		
		let vArea = GeometricUtils.GetArea(PerceptiveUtils.selectedTokens());
		
		vArea = GeometricUtils.ScaleArea(vArea, cAreaScale);
		
		let vScreenWidth = canvas.screenDimensions[0];
		
		if (!ui.sidebar._collapsed) {
			vScreenWidth = vScreenWidth - ui.sidebar.position.width;
		}
		
		let vPanTarget = {x : cCenter[0], y : cCenter[1]}
		
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
		
		console.log(vPanTarget);
		canvas.pan(vPanTarget);		
	}
	
	static PanwithChange(pToken, pchanges) {
		
	}
	
	//ons
	static OnTokenrefresh(pToken, pchanges) {
		if (PerceptiveUtils.selectedTokens().includes(pToken.document)) {
			if (game.settings.get(cModuleName, "followTokens") && pchanges.refreshPosition) {
				StalkingManager.PanToselectedCenter(pToken, pchanges);
			}
		}
	}
}

Hooks.on("refreshToken", (...args) => {console.log(args); StalkingManager.OnTokenrefresh(...args)});