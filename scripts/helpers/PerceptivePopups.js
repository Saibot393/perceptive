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
		game.socket.emit("module.perceptive", {pFunction : "PopUpRequest", pData : {pObjectID: pObject.id, pText : vText}});
		
		//own pop up
		PerceptivePopups.PopUpRequest(pObject.id, vText);
	}
	
	static TextPopUpID(pObject, pID, pWords = {}) {
		PerceptivePopups.TextPopUp(pObject, Translate(cPopUpID+"."+pID), pWords)
	} 
	
	static PopUpRequest(pObjectID, pText) {
		if (game.settings.get(cModuleName, "MessagePopUps")) {
			//only relevant if object is on current canvas, no scene necessary
			let vObject = PerceptiveUtils.ObjectfromID(pObjectID); 
			let vPosition;		
			
			if (vObject) {
				vPosition = GeometricUtils.CenterPositionObject(vObject);
				
				canvas.interface.createScrollingText({x: vPosition[0], y: vPosition[1]}, pText, {text: pText, anchor: CONST.TEXT_ANCHOR_POINTS.TOP, fill: "#FFFFFF", stroke: "#000000"});
			}
		}
	}
}

//export Popups
function PopUpRequest({ pObjectID, pText } = {}) {return PerceptivePopups.PopUpRequest(pObjectID, pText); }

export { PerceptivePopups, PopUpRequest }