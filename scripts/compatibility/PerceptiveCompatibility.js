import { PerceptiveCompUtils, cLocknKey, cLockTypeDoor } from "./PerceptiveCompUtils.js";
import {cModuleName, Translate} from "../utils/PerceptiveUtils.js";

const cPerceptiveIcon = "fa-solid fa-eye";

class PerceptiveCompatibility {

}

Hooks.once("init", () => {
	Hooks.on(cLocknKey +  ".DoorInteractionMenu", (pButtons, pLockObject, pLockType, pCharacter) => {
		if (pLockType == cLockTypeDoor) {
			pButtons["PeekLock"] = {
				label: Translate("Titles.PeekLock"),
				callback: () => {console.log("itworks")},
				icon: `<i class="fas ${cPerceptiveIcon}"></i>`
			}
		};
	});
});