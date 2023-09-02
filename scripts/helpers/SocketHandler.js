import { DoorMoveRequest } from "../DoorMovingScript.js";
import { PeekDoorRequest } from "../PeekingScript.js";
import { SpotObjectsRequest } from "../SpottingScript.js";

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
	}
}

Hooks.once("ready", () => { game.socket.on("module.perceptive", organiseSocketEvents); });