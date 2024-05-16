import { DoorMoveRequest } from "../DoorMovingScript.js";
import { PeekDoorRequest } from "../PeekingScript.js";
import { SpotObjectsRequest, resetStealthRequest, toggleDoorStateRequest, PlayerMakeTempVisible } from "../SpottingScript.js";
import { PopUpRequest } from "../helpers/PerceptivePopups.js";
import { PlaySoundRequest } from "../helpers/PerceptiveSound.js";

//execute functions with pData depending on pFunction
function organiseSocketEvents({pFunction, pData} = {}) {
	switch(pFunction) {
		case "DoorMoveRequest":
			DoorMoveRequest(pData);
			break;
		case "PeekDoorRequest":
			PeekDoorRequest(pData);
			break;
		case "SpotObjectsRequest":
			SpotObjectsRequest(pData);
			break;
		case "resetStealthRequest":
			resetStealthRequest(pData);
			break;
		case "toggleDoorStateRequest":
			toggleDoorStateRequest(pData);
			break;
		case "PlayerMakeTempVisible":
			PlayerMakeTempVisible(pData);
			break;
		case "PopUpRequest":
			PopUpRequest(pData);
			break;
		case "PlaySoundRequest":
			PlaySoundRequest(pData);
			break;			
	}
}

Hooks.once("ready", () => { game.socket.on("module.perceptive", organiseSocketEvents); });