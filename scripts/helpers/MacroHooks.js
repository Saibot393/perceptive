import { CheckAPerception, SpotObjectsinVision, RemoveLingeringAP} from "../SpottingScript.js";
import { PerceptiveSystemUtils } from "../utils/PerceptiveSystemUtils.js";

//functions for macros
Hooks.on("init",async function () {
	let Perception = await PerceptiveSystemUtils.SystemPerceptionMacros(CheckAPerception);
	
	game.Perceptive = {
		Perception,
		SpotObjectsinVision,
		RemoveLingeringAP
	};
});