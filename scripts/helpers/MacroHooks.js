import { CheckAPerception } from "../SpottingScript.js";
import { PerceptiveSystemUtils } from "../utils/PerceptiveSystemUtils.js";

//functions for macros
Hooks.on("init",() => {
	let Perception = PerceptiveSystemUtils.SystemPerceptionMacros(CheckAPerception);
	
	game.Perceptive = {
		Perception
	};
});