import { cModuleName, Translate} from "../utils/PerceptiveUtils.js";


Hooks.once("init", () => {  // game.settings.get(cModuleName, "")
  //Settings
  game.settings.register(cModuleName, "hidePerceptiveWalls", {
	name: Translate("Settings.showPerceptiveWalls.name"),
	hint: Translate("Settings.showPerceptiveWalls.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
});

//Hooks
Hooks.on("renderSettingsConfig", (pApp, pHTML, pData) => {
});