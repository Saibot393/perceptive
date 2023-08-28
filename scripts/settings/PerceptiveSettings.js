import { cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import { cDoorMoveTypes } from "../helpers/PerceptiveFlags.js";
import { PerceptiveCompUtils, cArmReach, cArmReachold} from "../compatibility/PerceptiveCompUtils.js";

import {SelectedPeekhoveredDoor} from "../PeekingScript.js";
import {MoveHoveredDoor} from "../DoorMovingScript.js";


Hooks.once("init", () => {  // game.settings.get(cModuleName, "")
  //Settings
  //general
  game.settings.register(cModuleName, "InteractionDistance", {
	name: Translate("Settings.InteractionDistance.name"),
	hint: Translate("Settings.InteractionDistance.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: 10
  });   
  
  game.settings.register(cModuleName, "UseArmsreachDistance", {
	name: Translate("Settings.UseArmsreachDistance.name"),
	hint: Translate("Settings.UseArmsreachDistance.descrp"),
	scope: "world",
	config: PerceptiveCompUtils.isactiveModule(cArmReach) || PerceptiveCompUtils.isactiveModule(cArmReachold),
	type: Boolean,
	default: false
  }); 
  
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
  
  game.settings.register(cModuleName, "StopPeekonMove", {
	name: Translate("Settings.StopPeekonMove.name"),
	hint: Translate("Settings.StopPeekonMove.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
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
  
  //Keys (GM)
  game.keybindings.register(cModuleName, "PeekLock", {
	name: Translate("Keys.PeekLock.name"),
	editable: [
      {
        key: "KeyO"
      }
    ],
	onDown: () => { SelectedPeekhoveredDoor(); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "MoveDoorLeft", {
	name: Translate("Keys.MoveDoorLeft.name"),
	onDown: () => { MoveHoveredDoor(1); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
   game.keybindings.register(cModuleName, "MoveDoorRight", {
	name: Translate("Keys.MoveDoorRight.name"),
	onDown: () => { MoveHoveredDoor(-1); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
});

//Hooks
Hooks.on("renderSettingsConfig", (pApp, pHTML, pData) => {
	//add a few titles	
	
	let vnewHTML;
	
	if (game.user.isGM) {
		//first peek setting
		vnewHTML = `<h4 class="border"><u>${Translate("Titles.LockPeekSettings")}</u></h4>`;
		 
		pHTML.find('input[name="' + cModuleName + '.Peekablebydefault"]').closest(".form-group").before(vnewHTML);

		//first door move setting
		vnewHTML = `<h4 class="border"><u>${Translate("Titles.DoorMoveSettings")}</u></h4>`;
		 
		pHTML.find('select[name="' + cModuleName + '.DoorstandardMove"]').closest(".form-group").before(vnewHTML);	
	}
});