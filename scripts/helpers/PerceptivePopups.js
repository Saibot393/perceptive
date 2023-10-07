import { PerceptiveUtils, cModuleName, cPopUpID, Translate } from "../utils/PerceptiveUtils.js";
import { GeometricUtils } from "../utils/GeometricUtils.js";

class PerceptivePopups {
	//DECLARATIONS
	static TextPopUp(pObject, pText, pWords = {}) {} //show pText over pObject and replaces {pWord} with matching vWord in pWords
	
	static TextPopUpID(pObject, pID, pWords = {}) {} //show pText over pObject and replaces {pWord} with matching vWord in pWords
	
	static PopUpRequest(pObjectID, pText) {} //handels socket calls for pop up texts
	
	//IMPLEMENTATIONS
	static TextPopUp(pObject, pText, pWords = {}) {
		let vText = pText;
		
		for (let vWord of Object.keys(pWords)) {
			vText = vText.replace("{" + vWord + "}", pWords[vWord]);
		}
		
		//other clients pop up
		game.socket.emit("module.Perceptive", {pFunction : "PopUpRequest", pData : {pTokenID: pObject.id, pText : vText}});
		
		//own pop up
		PerceptivePopups.PopUpRequest(pObject.id, vText);
	}
	
	static TextPopUpID(pObject, pID, pWords = {}) {
		PerceptivePopups.TextPopUp(pObject, Translate(cPopUpID+"."+pID), pWords)
	} 
	
	static PopUpRequest(pObjectID, pText) {
		if (game.settings.get(cModuleName, "MessagePopUps")) {
			//only relevant if token is on current canves, no scene necessary
			let vWall = PerceptiveUtils.WallfromID(pObjectID); 
			let vPosition;
			
			if (vWall) {
				vPosition = GeometricUtils.CenterPositionWall(vWall);
				
				canvas.interface.createScrollingText({x: vPosition[0], y: vPosition[1]}, pText, {text: pText, anchor: CONST.TEXT_ANCHOR_POINTS.TOP, fill: "#FFFFFF", stroke: "#000000"});
			}
		}
	}
}

//export Popups
function PopUpRequest({ pObjectID, pText } = {}) { return PerceptivePopups.PopUpRequest(pObjectID, pText); }

export { PerceptivePopups, PopUpRequest }