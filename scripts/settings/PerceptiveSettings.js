import { cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import { cDoorMoveTypes } from "../helpers/PerceptiveFlags.js";


Hooks.once("init", () => {  // game.settings.get(cModuleName, "")
  //Settings
  //peeking
  game.settings.register(cModuleName, "Peekablebydefault", {
	name: Translate("Settings.Peekablebydefault.name"),
	hint: Translate("Settings.Peekablebydefault.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 

  game.settings.register(cModuleName, "LockpeekstandardSize", {
	name: Translate("Settings.LockpeekstandardSize.name"),
	hint: Translate("Settings.LockpeekstandardSize.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: 0.05
  }); 
  
  //door moving
  game.settings.register(cModuleName, "DoorstandardMove", {
	name: Translate("Settings.DoorstandardMove.name"),
	hint: Translate("Settings.DoorstandardMove.descrp"),
	scope: "world",
	config: true,
	type: String,
	choices: {
		[cDoorMoveTypes[0]]: Translate("Settings.DoorstandardMove.options." + cDoorMoveTypes[0]),
		[cDoorMoveTypes[1]]: Translate("Settings.DoorstandardMove.options." + cDoorMoveTypes[1]),
		[cDoorMoveTypes[2]]: Translate("Settings.DoorstandardMove.options." + cDoorMoveTypes[2])
	},
	default: cDoorMoveTypes[0]
  });  
  
  game.settings.register(cModuleName, "DoorstandardHinge", {
	name: Translate("Settings.DoorstandardHinge.name"),
	hint: Translate("Settings.DoorstandardHinge.descrp"),
	scope: "world",
	config: true,
	type: Number,
	choices: {
		0: Translate("Settings.DoorstandardHinge.options." + 0),
		1: Translate("Settings.DoorstandardHinge.options." + 1)
	},
	default: 0
  });  
  
  game.settings.register(cModuleName, "DoorstandardSwingSpeed", {
	name: Translate("Settings.DoorstandardSwingSpeed.name"),
	hint: Translate("Settings.DoorstandardSwingSpeed.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: 5
  }); 

  game.settings.register(cModuleName, "DoorstandardSlideSpeed", {
	name: Translate("Settings.DoorstandardSwingSpeed.name"),
	hint: Translate("Settings.DoorstandardSwingSpeed.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: 0.05
  });    
  
  //general
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