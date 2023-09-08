import { PerceptiveCompUtils, cLocknKey, cLibWrapper, cArmReach, cLockTypeDoor } from "./PerceptiveCompUtils.js";
import {cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import {RequestPeekDoor, PeekingIgnoreWall} from "../PeekingScript.js";
import {PerceptiveFlags} from "../helpers/PerceptiveFlags.js";

const cPerceptiveIcon = "fa-solid fa-eye";

class PerceptiveCompatibility {
	//DECLARATION
	static addPeekingButton(pButtons, pLockObject, pLockType, pCharacter, pShowall) {} //adds an appropiate peeking button to pButtons
	
	//IMPLEMENTATIONS
	static addPeekingButton(pButtons, pLockObject, pLockType, pCharacter, pShowall) {
		if (pShowall || PerceptiveFlags.canbeLockpeeked(pLockObject)) {
			pButtons["PeekLock"] = {
				label: Translate("Titles.PeekLock"),
				callback: () => {RequestPeekDoor(pLockObject, [pCharacter])},
				icon: `<i class="fas ${cPerceptiveIcon}"></i>`
			}	
		}
	}
}

export function IgnoreWall(pWallDoc, pTokenDoc) {return PeekingIgnoreWall(pWallDoc, pTokenDoc)}

Hooks.once("init", () => {
	if (PerceptiveCompUtils.isactiveModule(cLibWrapper)) {
		libWrapper.ignore_conflicts(cModuleName, cArmReach, "DoorControl.prototype._onRightDown");
	}	
	
	if (PerceptiveCompUtils.isactiveModule(cLocknKey)) {
		Hooks.on(cLocknKey +  ".DoorInteractionMenu", (pButtons, pLockObject, pLockType, pCharacter, pShowall) => {
			if (pLockType == cLockTypeDoor) {
				PerceptiveCompatibility.addPeekingButton(pButtons, pLockObject, pLockType, pCharacter, pShowall);
			};
		});
	};
	
	//compatibility exports
	game.modules.get(cModuleName).api = {
		IgnoreWall
	}
});