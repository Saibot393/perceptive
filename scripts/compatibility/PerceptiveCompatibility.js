import { PerceptiveCompUtils, cLocknKey, cLockTypeDoor } from "./PerceptiveCompUtils.js";
import {cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import {RequestPeekDoor} from "../PeekingScript.js";

const cPerceptiveIcon = "fa-solid fa-eye";

class PerceptiveCompatibility {
	//DECLARATION
	static addPeekingButton(pButtons, pLockObject, pLockType, pCharacter) {} //adds an appropiate peeking button to pButtons
	
	//IMPLEMENTATIONS
	static addPeekingButton(pButtons, pLockObject, pLockType, pCharacter) {
		pButtons["PeekLock"] = {
			label: Translate("Titles.PeekLock"),
			callback: () => {RequestPeekDoor(pLockObject, [pCharacter])},
			icon: `<i class="fas ${cPerceptiveIcon}"></i>`
		};		
	}
}

Hooks.once("init", () => {
	Hooks.on(cLocknKey +  ".DoorInteractionMenu", (pButtons, pLockObject, pLockType, pCharacter) => {
		if (pLockType == cLockTypeDoor) {
			PerceptiveCompatibility.addPeekingButton(pButtons, pLockObject, pLockType, pCharacter);
		};
	});
});