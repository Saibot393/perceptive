import { DoorMoveRequest } from "../DoorMovingScript.js";
import { PeekDoorRequest } from "../PeekingScript.js";
import { SpotObjectsRequest, DoorVisibleRequest } from "../SpottingScript.js";

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
		case "DoorVisibleRequest":
			DoorVisibleRequest(pData);
			break;
	}
}

Hooks.once("ready", () => { game.socket.on("module.perceptive", organiseSocketEvents); });