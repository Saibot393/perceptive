import { cModuleName, Translate} from "../utils/PerceptiveUtils.js";
import { cDoorMoveTypes } from "../helpers/PerceptiveFlags.js";
import { PerceptiveCompUtils, cArmReach, cArmReachold} from "../compatibility/PerceptiveCompUtils.js";

import {SelectedPeekhoveredDoor} from "../PeekingScript.js";
import {MoveHoveredDoor} from "../DoorMovingScript.js";

import {PerceptiveSystemUtils} from "../utils/PerceptiveSystemUtils.js";
import {PerceptiveUtils} from "../utils/PerceptiveUtils.js";

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
	range: {
		min: 0,
		max: 1,
		step: 0.01
	},
	default: 0.05
  }); 
  
  game.settings.register(cModuleName, "LockpeekstandardPosition", {
	name: Translate("Settings.LockpeekstandardPosition.name"),
	hint: Translate("Settings.LockpeekstandardPosition.descrp"),
	scope: "world",
	config: true,
	type: Number,
	range: {
		min: 0,
		max: 1,
		step: 0.01
	},
	default: 0.5
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

  game.settings.register(cModuleName, "PreventNormalOpenbydefault", {
	name: Translate("Settings.PreventNormalOpenbydefault.name"),
	hint: Translate("Settings.PreventNormalOpenbydefault.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });   
  
  game.settings.register(cModuleName, "DoorstandardHinge", {
	name: Translate("Settings.DoorstandardHinge.name"),
	hint: Translate("Settings.DoorstandardHinge.descrp"),
	scope: "world",
	config: true,
	type: Number,
	choices: {
		0: Translate("Settings.DoorstandardHinge.options." + 0),
		1: Translate("Settings.DoorstandardHinge.options." + 1),
		2: Translate("Settings.DoorstandardHinge.options." + 1)
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
  
  game.settings.register(cModuleName, "DoorStandardSwingRange", {
	name: Translate("Settings.DoorStandardSwingRange.name"),
	hint: Translate("Settings.DoorStandardSwingRange.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: ""
  }); 

  game.settings.register(cModuleName, "DoorstandardSlideSpeed", {
	name: Translate("Settings.DoorstandardSlideSpeed.name"),
	hint: Translate("Settings.DoorstandardSlideSpeed.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: 0.05
  });    
  
  //spotting
  game.settings.register(cModuleName, "ActivateSpotting", {
	name: Translate("Settings.ActivateSpotting.name"),
	hint: Translate("Settings.ActivateSpotting.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true,
	requiresReload: true
  });   
  
  game.settings.register(cModuleName, "PassivePerceptionFormula", {
	name: Translate("Settings.PassivePerceptionFormula.name"),
	hint: Translate("Settings.PassivePerceptionFormula.descrp"),
	scope: "world",
	config: !PerceptiveUtils.isPf2e(),
	type: String,
	default: PerceptiveSystemUtils.SystemdefaultPPformula()
  }); 
  
  game.settings.register(cModuleName, "PerceptionKeyWord", {
	name: Translate("Settings.PerceptionKeyWord.name"),
	hint: Translate("Settings.PerceptionKeyWord.descrp"),
	scope: "world",
	config: !PerceptiveSystemUtils.canAutodetectPerceptionRolls(),
	type: String,
	default: PerceptiveSystemUtils.SystemdefaultPerceptionKeyWord()
  });  
  
  game.settings.register(cModuleName, "StealthKeyWord", {
	name: Translate("Settings.StealthKeyWord.name"),
	hint: Translate("Settings.StealthKeyWord.descrp"),
	scope: "world",
	config: !PerceptiveSystemUtils.canAutodetectStealthRolls(),
	type: String,
	default: PerceptiveSystemUtils.SystemdefaultStealthKeyWord()
  });  
  
  game.settings.register(cModuleName, "AutoStealthDCbehaviour", {
	name: Translate("Settings.AutoStealthDCbehaviour.name"),
	hint: Translate("Settings.AutoStealthDCbehaviour.descrp"),
	scope: "world",
	config: true,
	type: String,
	choices: {
		"off" : Translate("Settings.AutoStealthDCbehaviour.options." + "off"),
		"both" : Translate("Settings.AutoStealthDCbehaviour.options." + "both"),
		"activeonly": Translate("Settings.AutoStealthDCbehaviour.options." + "activeonly")
	},
	default: "both"
  });   
  
  game.settings.register(cModuleName, "resetSpottedbyMovedefault", {
	name: Translate("Settings.resetSpottedbyMovedefault.name"),
	hint: Translate("Settings.resetSpottedbyMovedefault.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });   
  
  //general
  
  game.settings.register(cModuleName, "showPerceptiveWalls", {
	name: Translate("Settings.showPerceptiveWalls.name"),
	hint: Translate("Settings.showPerceptiveWalls.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  //client
  game.settings.register(cModuleName, "followTokens", {
	name: Translate("Settings.followTokens.name"),
	hint: Translate("Settings.followTokens.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "moveDoorControls", {
	name: Translate("Settings.moveDoorControls.name"),
	hint: Translate("Settings.moveDoorControls.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "SpeedDoorMovefactor", {
	name: Translate("Settings.SpeedDoorMovefactor.name"),
	hint: Translate("Settings.SpeedDoorMovefactor.descrp"),
	scope: "client",
	config: true,
	type: Number,
	default: 3
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
 
  game.keybindings.register(cModuleName, "ToggleTokenFollowing", {
	name: Translate("Keys.ToggleTokenFollowing.name"),
	onDown: () => { game.settings.set(cModuleName, "followTokens", !game.settings.get(cModuleName, "followTokens")) },
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
		
		//first spotting setting
		vnewHTML = `<h4 class="border"><u>${Translate("Titles.SpottingSettings")}</u></h4>`;
		 
		pHTML.find('input[name="' + cModuleName + '.ActivateSpotting"]').closest(".form-group").before(vnewHTML);	
		
		//first client setting
		vnewHTML = `<hr>
					<h3 class="border"><u>${Translate("Titles.ClientSettings")}</u></h4>`;
		 
		pHTML.find('input[name="' + cModuleName + '.followTokens"]').closest(".form-group").before(vnewHTML);	
	}
});