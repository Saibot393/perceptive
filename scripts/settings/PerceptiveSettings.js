import { cModuleName, Translate, TranslateandReplace} from "../utils/PerceptiveUtils.js";
import { cDoorMoveTypes } from "../helpers/PerceptiveFlags.js";
import { PerceptiveCompUtils, cArmReach, cArmReachold, cDfredCE, cCPR, cVision5e, cStealthy, cMATT} from "../compatibility/PerceptiveCompUtils.js";
import { VisionChannelsWindow } from "../helpers/VisionChannelsHelper.js";

import {SelectedPeekhoveredDoor} from "../PeekingScript.js";
import {MoveHoveredDoor} from "../DoorMovingScript.js";
import {resetStealthDataSelected} from "../SpottingScript.js";

import {PerceptiveSystemUtils} from "../utils/PerceptiveSystemUtils.js";
import {PerceptiveUtils} from "../utils/PerceptiveUtils.js";

import {PerceptiveSound} from "../helpers/PerceptiveSound.js";

const cPlaySoundIcon = "fa-solid fa-play";

const cVCactive = true;

Hooks.once("init", () => {  // game.settings.get(cModuleName, "")
  game.settings.register(cModuleName, "lastVersion", {
	scope: "world",
	config: false,
	type: String,
	default: "0.0.0"
  }); 

  //Settings
  //general
  game.settings.register(cModuleName, "SplitInteractionDistances", {
	name: Translate("Settings.SplitInteractionDistances.name"),
	hint: Translate("Settings.SplitInteractionDistances.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false,
	requiresReload: true
  }); 
  
  game.settings.register(cModuleName, "InteractionDistance", {
	name: Translate("Settings.InteractionDistance.name"),
	hint: Translate("Settings.InteractionDistance.descrp"),
	scope: "world",
	config: !game.settings.get(cModuleName, "SplitInteractionDistances"),
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
  
  game.settings.register(cModuleName, "DFredsEffectsIntegration", {
	name: Translate("Settings.DFredsEffectsIntegration.name"),
	hint: Translate("Settings.DFredsEffectsIntegration.descrp"),
	scope: "world",
	config: PerceptiveCompUtils.isactiveModule(cDfredCE),
	type: Boolean,
	default: false,
	requiresReload: true
  }); 
  
  game.settings.register(cModuleName, "CPREffectsIntegration", {
	name: Translate("Settings.CPREffectsIntegration.name"),
	hint: Translate("Settings.CPREffectsIntegration.descrp"),
	scope: "world",
	config: PerceptiveCompUtils.isactiveModule(cCPR),
	type: Boolean,
	default: false,
	requiresReload: true
  }); 
  
  game.settings.register(cModuleName, "Vision5eIntegration", {
	name: Translate("Settings.Vision5eIntegration.name"),
	hint: Translate("Settings.Vision5eIntegration.descrp"),
	scope: "world",
	config: PerceptiveCompUtils.isactiveModule(cVision5e),
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "StealthyIntegration", {
	name: Translate("Settings.StealthyIntegration.name"),
	hint: Translate("Settings.StealthyIntegration.descrp"),
	scope: "world",
	config: PerceptiveCompUtils.isactiveModule(cStealthy),
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "UsePf2eRules", {
	name: Translate("Settings.UsePf2eRules.name"),
	hint: Translate("Settings.UsePf2eRules.descrp"),
	scope: "world",
	config: PerceptiveUtils.isPf2e(),
	type: Boolean,
	default: false,
	requiresReload: true
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
  
  game.settings.register(cModuleName, "PeekingDistance", {
	name: Translate("Settings.PeekingDistance.name"),
	hint: Translate("Settings.PeekingDistance.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "SplitInteractionDistances"),
	type: Number,
	default: 10
  });
  
  game.settings.register(cModuleName, "GMConfirmPeeking", {
	name: Translate("Settings.GMConfirmPeeking.name"),
	hint: Translate("Settings.GMConfirmPeeking.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });
  
  game.settings.register(cModuleName, "PeekingFormula", {
	name: Translate("Settings.PeekingFormula.name"),
	hint: Translate("Settings.PeekingFormula.descrp"),
	scope: "world",
	config: !game.settings.get(cModuleName, "UsePf2eRules"),
	type: String,
	default: ""
  });
  
  game.settings.register(cModuleName, "PeekingDefaultDC", {
	name: Translate("Settings.PeekingDefaultDC.name"),
	hint: Translate("Settings.PeekingDefaultDC.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: 0
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
		2: Translate("Settings.DoorstandardHinge.options." + 2)
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
  
  game.settings.register(cModuleName, "MovingDistance", {
	name: Translate("Settings.MovingDistance.name"),
	hint: Translate("Settings.MovingDistance.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "SplitInteractionDistances"),
	type: Number,
	default: 10
  });
  
  //spotting
  game.settings.register(cModuleName, "ActivateSpotting", {
	name: Translate("Settings.ActivateSpotting.name"),
	hint: Translate("Settings.ActivateSpotting.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false,
	requiresReload: true
  });  
  
	//gm ui and control
	  game.settings.register(cModuleName, "SimulatePlayerVision", {
		name: Translate("Settings.SimulatePlayerVision.name"),
		hint: Translate("Settings.SimulatePlayerVision.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false
	  });
	  
	  game.settings.register(cModuleName, "GMSpotconfirmDialogbehaviour", {
		name: Translate("Settings.GMSpotconfirmDialogbehaviour.name"),
		hint: Translate("Settings.GMSpotconfirmDialogbehaviour.descrp"),
		scope: "world",
		config: true,
		type: String,
		choices : {
			"off" : Translate("Settings.GMSpotconfirmDialogbehaviour.options.off"),
			"playersonly" :	Translate("Settings.GMSpotconfirmDialogbehaviour.options.playersonly"),
			"always" : Translate("Settings.GMSpotconfirmDialogbehaviour.options.always")
		},
		default: false
	  }); 
	  
	  game.settings.register(cModuleName, "ShowfailuresinGMconfirm", {
		name: Translate("Settings.ShowfailuresinGMconfirm.name"),
		hint: Translate("Settings.ShowfailuresinGMconfirm.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false
	  }); 
	  
	  game.settings.register(cModuleName, "MacroSeekBehaviour", {
		name: Translate("Settings.MacroSeekBehaviour.name"),
		hint: Translate("Settings.MacroSeekBehaviour.descrp"),
		scope: "world",
		config: PerceptiveUtils.isPf2e(),
		type: String,
		choices : {
			"never" : Translate("Settings.MacroSeekBehaviour.options.never"),
			"incombatonly" : Translate("Settings.MacroSeekBehaviour.options.incombatonly"),
			"always" : Translate("Settings.MacroSeekBehaviour.options.always")
		},
		default: "never"
	  }); 

	  game.settings.register(cModuleName, "ForceInvertIgnoreRollKey", {
		name: Translate("Settings.ForceInvertIgnoreRollKey.name"),
		hint: Translate("Settings.ForceInvertIgnoreRollKey.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false
	  });  	  
	  
	  game.settings.register(cModuleName, "GMReciveInformationWhisper", {
		name: Translate("Settings.GMReciveInformationWhisper.name"),
		hint: Translate("Settings.GMReciveInformationWhisper.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: true
	  }); 
  
	//RulesAutomation
	  game.settings.register(cModuleName, "AutomateTokenSpottable", {
		name: Translate("Settings.AutomateTokenSpottable.name"),
		hint: Translate("Settings.AutomateTokenSpottable.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false
	  }); 
	  
	  game.settings.register(cModuleName, "AutoRerollPPDConMove", {
		name: Translate("Settings.AutoRerollPPDConMove.name"),
		hint: Translate("Settings.AutoRerollPPDConMove.descrp"),
		scope: "world",
		config: game.settings.get(cModuleName, "UsePf2eRules"),
		type: Boolean,
		default: true
	  }); 

	  game.settings.register(cModuleName, "CritMethod", {
		name: Translate("Settings.CritMethod.name"),
		hint: Translate("Settings.CritMethod.descrp"),
		scope: "world",
		config: !game.settings.get(cModuleName, "UsePf2eRules"),
		type: String,
		choices: {
			"CritMethod-noCrit": Translate("Settings.CritMethod.options.noCrit"),
			"CritMethod-natCrit": Translate("Settings.CritMethod.options.natCrit"),
			"CritMethod-natCritpm10": Translate("Settings.CritMethod.options.natCritpm10")
		},
		default: "CritMethod-natCrit"
	  });	  
	  
	  game.settings.register(cModuleName, "resetSpottedbyMovedefault", {
		name: Translate("Settings.resetSpottedbyMovedefault.name"),
		hint: Translate("Settings.resetSpottedbyMovedefault.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false
	  }); 

	  game.settings.register(cModuleName, "MakeSpottedTokensVisible", {
		name: Translate("Settings.MakeSpottedTokensVisible.name"),
		hint: Translate("Settings.MakeSpottedTokensVisible.descrp"),
		scope: "world",
		config: true,
		type: String,
		choices: {
			"never": Translate("Settings.MakeSpottedTokensVisible.options.never"),
			"always": Translate("Settings.MakeSpottedTokensVisible.options.always"),
			"incombatonly": Translate("Settings.MakeSpottedTokensVisible.options.incombatonly"),
			"outcombatonly": Translate("Settings.MakeSpottedTokensVisible.options.outcombatonly")	
		},
		default: "never"
	  }); 
	  
	  game.settings.register(cModuleName, "RevealAllies", {
		name: Translate("Settings.RevealAllies.name"),
		hint: Translate("Settings.RevealAllies.descrp"),
		scope: "world",
		config: true,
		type: String,
		choices: {
			"never": Translate("Settings.RevealAllies.options.never"),
			"always": Translate("Settings.RevealAllies.options.always"),
			"incombatonly": Translate("Settings.RevealAllies.options.incombatonly"),
			"outcombatonly": Translate("Settings.RevealAllies.options.outcombatonly")	
		},
		default: "never"
	  }); 

	  game.settings.register(cModuleName, "LingeringAP", {
		name: Translate("Settings.LingeringAP.name"),
		hint: Translate("Settings.LingeringAP.descrp"),
		scope: "world",
		config: true,
		type: String,
		choices: {
			"off" : Translate("Settings.LingeringAP.options." + "off"),
			"always" : Translate("Settings.LingeringAP.options." + "always"),
			"outofcombatonly": Translate("Settings.LingeringAP.options." + "outofcombatonly")
		},
		default: "off"
	  }); 		

	  game.settings.register(cModuleName, "LingeringAPRadius", {
		name: Translate("Settings.LingeringAPRadius.name"),
		hint: Translate("Settings.LingeringAPRadius.descrp"),
		scope: "world",
		config: true,
		type: Number,
		default: -1
	  }); 	 

	  game.settings.register(cModuleName, "LingeringAPDuration", {
		name: Translate("Settings.LingeringAPDuration.name"),
		hint: Translate("Settings.LingeringAPDuration.descrp"),
		scope: "world",
		config: true,
		type: Number,
		default: -1
	  }); 

	  game.settings.register(cModuleName, "RevealSpottedDooronClick", {
		name: Translate("Settings.RevealSpottedDooronClick.name"),
		hint: Translate("Settings.RevealSpottedDooronClick.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false
	  }); 	  
	  
	  game.settings.register(cModuleName, "disableSpottableMATTTiles", {
		name: Translate("Settings.disableSpottableMATTTiles.name"),
		hint: Translate("Settings.disableSpottableMATTTiles.descrp"),
		scope: "world",
		config: PerceptiveCompUtils.isactiveModule(cMATT),
		type: Boolean,
		default: false
	  }); 
 
	//formulas
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
		config: !PerceptiveSystemUtils.canAutodetectSkillRolls(),
		type: String,
		default: PerceptiveSystemUtils.SystemdefaultPerceptionKeyWord()
	  });  
	  
	  game.settings.register(cModuleName, "StealthKeyWord", {
		name: Translate("Settings.StealthKeyWord.name"),
		hint: Translate("Settings.StealthKeyWord.descrp"),
		scope: "world",
		config: !PerceptiveSystemUtils.canAutodetectSkillRolls(),
		type: String,
		default: PerceptiveSystemUtils.SystemdefaultStealthKeyWord()
	  });  
	  
	  game.settings.register(cModuleName, "AutoStealthDCbehaviour", {
		name: Translate("Settings.AutoStealthDCbehaviour.name"),
		hint: Translate("Settings.AutoStealthDCbehaviour.descrp"),
		scope: "world",
		config: !game.settings.get(cModuleName, "UsePf2eRules"),
		type: String,
		choices: {
			"off" : Translate("Settings.AutoStealthDCbehaviour.options." + "off"),
			"both" : Translate("Settings.AutoStealthDCbehaviour.options." + "both"),
			"activeonly": Translate("Settings.AutoStealthDCbehaviour.options." + "activeonly")
		},
		default: "both"
	  });  

	//effects
	  game.settings.register(cModuleName, "applySystemStealthEffect", {
		name: Translate("Settings.applySystemStealthEffect.name"),
		hint: Translate("Settings.applySystemStealthEffect.descrp"),
		scope: "world",
		config: (PerceptiveUtils.isPf2e() || PerceptiveCompUtils.hasactiveEffectModule()) && (!game.settings.get(cModuleName, "UsePf2eRules")),
		type: Boolean,
		default: false
	  });   
	  
	  game.settings.register(cModuleName, "usePerceptiveStealthEffect", {
		name: Translate("Settings.usePerceptiveStealthEffect.name"),
		hint: Translate("Settings.usePerceptiveStealthEffect.descrp"),
		scope: "world",
		config: !PerceptiveUtils.isPf2e(),
		type: Boolean,
		default: false
	  }); 
	  
	  game.settings.register(cModuleName, "PerceptiveStealthFriendliesvisible", {
		name: Translate("Settings.PerceptiveStealthFriendliesvisible.name"),
		hint: Translate("Settings.PerceptiveStealthFriendliesvisible.descrp"),
		scope: "world",
		config: !PerceptiveUtils.isPf2e(),
		type: Boolean,
		default: false
	  }); 
	  
	  game.settings.register(cModuleName, "syncEffectswithPerceptiveStealth", {
		name: Translate("Settings.syncEffectswithPerceptiveStealth.name"),
		hint: Translate("Settings.syncEffectswithPerceptiveStealth.descrp"),
		scope: "world",
		config: PerceptiveCompUtils.hasactiveEffectModule(),
		type: Boolean,
		default: false
	  });   
	  
	  game.settings.register(cModuleName, "customStealthEffects", {
		name: Translate("Settings.customStealthEffects.name"),
		hint: Translate("Settings.customStealthEffects.descrp"),
		scope: "world",
		config: PerceptiveUtils.isPf2e() || PerceptiveCompUtils.hasactiveEffectModule(),
		type: String,
		default: ""
	  });  

	//ranges
	  game.settings.register(cModuleName, "SpottingRange", {
		name: Translate("Settings.SpottingRange.name"),
		hint: Translate("Settings.SpottingRange.descrp"),
		scope: "world",
		config: true,
		type: Number,
		default: -1
	  });  
	  
	  game.settings.register(cModuleName, "SpottingConeRange", {
		name: Translate("Settings.SpottingConeRange.name"),
		hint: Translate("Settings.SpottingConeRange.descrp"),
		scope: "world",
		config: true,
		type: Number,
		default: 0
	  });  

	  game.settings.register(cModuleName, "ApplyRange", {
		name: Translate("Settings.ApplyRange.name"),
		hint: Translate("Settings.ApplyRange.descrp"),
		scope: "world",
		config: true,
		type: String,
		choices: {
			"never": Translate("Settings.ApplyRange.options.never"),
			"always": Translate("Settings.ApplyRange.options.always"),
			"activeonly": Translate("Settings.ApplyRange.options.activeonly"),
			"passiveonly": Translate("Settings.ApplyRange.options.passiveonly"),
			"incombatonly": Translate("Settings.ApplyRange.options.incombatonly"),
			"outcombatonly": Translate("Settings.ApplyRange.options.outcombatonly")
		},
		default: "never"
	  });

	  game.settings.register(cModuleName, "UseBordertoBorderRange", {
		name: Translate("Settings.UseBordertoBorderRange.name"),
		hint: Translate("Settings.UseBordertoBorderRange.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false
	  });  	  	

	  game.settings.register(cModuleName, "StandardVisionDirection", {
		name: Translate("Settings.StandardVisionDirection.name"),
		hint: Translate("Settings.StandardVisionDirection.descrp"),
		scope: "world",
		config: true,
		type: Number,
		choices: {
			0: Translate("Settings.StandardVisionDirection.options.bottom"),
			90: Translate("Settings.StandardVisionDirection.options.left"),
			180: Translate("Settings.StandardVisionDirection.options.top"),
			270: Translate("Settings.StandardVisionDirection.options.right")
		},
		default: 0
	  });	

	  game.settings.register(cModuleName, "RangePDCModifier", {
		name: Translate("Settings.RangePDCModifier.name"),
		hint: Translate("Settings.RangePDCModifier.descrp"),
		scope: "world",
		config: true,
		type: String,
		default: "0/0"
	  }); 	

	  game.settings.register(cModuleName, "Range3DCalculation", {
		name: Translate("Settings.Range3DCalculation.name"),
		hint: Translate("Settings.Range3DCalculation.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false		  
	  });
  
	//illumination
	  game.settings.register(cModuleName, "IlluminationPDCModifier", {
		name: Translate("Settings.IlluminationPDCModifier.name"),
		hint: Translate("Settings.IlluminationPDCModifier.descrp"),
		scope: "world",
		config: true,
		type: Array,
		default: [0, 0],
		onChange: async (pValues) => { 	if (game.user.isGM) {
											if (pValues.length == 1) {await game.settings.set(cModuleName, "IlluminationPDCModifier", pValues[0].split(",").map(vValue => Number(vValue)))}; //prepare data
											await game.settings.set(cModuleName, "useSpottingLightLevels",  game.settings.get(cModuleName, "IlluminationPDCModifier").find(vValue => (Number(vValue) != 0) && !(isNaN(Number(vValue))))) //auto detect if feature is active
										}
									 }
	  }); 
	  
	  game.settings.register(cModuleName, "UseIlluminationPDCModifierforAP", {
		name: Translate("Settings.UseIlluminationPDCModifierforAP.name"),
		hint: Translate("Settings.UseIlluminationPDCModifierforAP.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: true
	  }); 
	  
	  game.settings.register(cModuleName, "IlluminationAPDCBehaviour", {
		name: Translate("Settings.IlluminationAPDCBehaviour.name"),
		hint: Translate("Settings.IlluminationAPDCBehaviour.descrp"),
		scope: "world",
		config: !game.settings.get(cModuleName, "UsePf2eRules"),
		type: Array,
		default: ["=", "="],
		onChange: async (pValues) => { 	if (game.user.isGM) {
											if (pValues.length == 1) {await game.settings.set(cModuleName, "IlluminationAPDCBehaviour", pValues[0].split(",").map(vValue => vValue))}; //prepare data
											await game.settings.set(cModuleName, "useLightAdvantageSystem",  game.settings.get(cModuleName, "IlluminationAPDCBehaviour").find(vValue => (PerceptiveUtils.Rollbehaviour(vValue) != 0) && !(isNaN(PerceptiveUtils.Rollbehaviour(vValue))))) //auto detect if feature is active
										}
									 }
	  }); 
	  
	  game.settings.register(cModuleName, "Light3Dcalc", {
		name: Translate("Settings.Light3Dcalc.name"),
		hint: Translate("Settings.Light3Dcalc.descrp"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false
	  }); 
	  
	//sounds
	
	  game.settings.register(cModuleName, "SpottedSound", {
		name: Translate("Settings.SpottedSound.name"),
		hint: Translate("Settings.SpottedSound.descrp"),
		scope: "world",
		config: true,
		type: String,
		default: "",
        filePicker: "audio"
	  }); 	
	  
	  game.settings.register(cModuleName, "SpottedSoundVolume", {
		name: Translate("Settings.SpottedSoundVolume.name"),
		hint: Translate("Settings.SpottedSoundVolume.descrp"),
		scope: "world",
		config: true,
		type: Number,
		range: {
			min: 0,
			max: 2,
			step: 0.05
		},
		default: 1
	  }); 
	  
	//image pings
	  game.settings.register(cModuleName, "SpotterImagePing", {
		name: Translate("Settings.SpotterImagePing.name"),
		hint: Translate("Settings.SpotterImagePing.descrp"),
		scope: "world",
		config: true,
		type: String,
		default: "",
		filePicker: "imagevideo"
	  }); 	
	  
	  game.settings.register(cModuleName, "SpotterImagePingDuration", {
		name: Translate("Settings.SpotterImagePingDuration.name"),
		hint: Translate("Settings.SpotterImagePingDuration.descrp"),
		scope: "world",
		config: true,
		type: Number,
		range: {
			min: 0,
			max: 10,
			step: 0.1
		},
		default: 1
	  });	
  
  /*
  game.settings.register(cModuleName, "GMSpotconfirmDialog", {
	name: Translate("Settings.GMSpotconfirmDialog.name"),
	hint: Translate("Settings.GMSpotconfirmDialog.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  */   
  //VCs
  game.settings.register(cModuleName, "ActivateVCs", {
	name: Translate("Settings.ActivateVCs.name"),
	hint: Translate("Settings.ActivateVCs.descrp"),
	scope: "world",
	config: cVCactive,
	type: Boolean,
	default: false,
	requiresReload: true
  }); 

  game.settings.register(cModuleName, "SimulateVCPlayerVision", {
	name: Translate("Settings.SimulateVCPlayerVision.name"),
	hint: Translate("Settings.SimulateVCPlayerVision.descrp"),
	scope: "world",
	config: cVCactive || game.settings.get(cModuleName, "ActivateVCs"),
	type: Boolean,
	default: false
  }); 

  game.settings.register(cModuleName, "VCRange3DCalc", {
	name: Translate("Settings.VCRange3DCalc.name"),
	hint: Translate("Settings.VCRange3DCalc.descrp"),
	scope: "world",
	config: cVCactive || game.settings.get(cModuleName, "ActivateVCs"),
	type: Boolean,
	default: false
  });   
  
  game.settings.register(cModuleName, "vRequiredOrBehaviour", {
	name: Translate("Settings.vRequiredOrBehaviour.name"),
	hint: Translate("Settings.vRequiredOrBehaviour.descrp"),
	scope: "world",
	config: cVCactive || game.settings.get(cModuleName, "ActivateVCs"),
	type: Boolean,
	default: false
  });   
  
  game.settings.register(cModuleName, "ShowVCIDs", {
	name: Translate("Settings.ShowVCIDs.name"),
	hint: Translate("Settings.ShowVCIDs.descrp"),
	scope: "world",
	config: cVCactive || game.settings.get(cModuleName, "ActivateVCs"),
	type: Boolean,
	default: false
  }); 
  
  //some unexposed settings for automation
  game.settings.register(cModuleName, "useSpottingLightLevels", {
	scope: "world",
	config: false,
	type: Boolean,
	default: false
  }); 
   
  game.settings.register(cModuleName, "useLightAdvantageSystem", {
	scope: "world",
	config: false,
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
  
  game.settings.register(cModuleName, "recreatePerceptiveWalls", {
	name: Translate("Settings.recreatePerceptiveWalls.name"),
	hint: Translate("Settings.recreatePerceptiveWalls.descrp"),
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
  
  game.settings.register(cModuleName, "followonControl", {
	name: Translate("Settings.followonControl.name"),
	hint: Translate("Settings.followonControl.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "MessagePopUps", {
	name: Translate("Settings.MessagePopUps.name"),
	hint: Translate("Settings.MessagePopUps.descrp"),
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
  
  game.settings.register(cModuleName, "InvertIgnoreRollKey", {
	name: Translate("Settings.InvertIgnoreRollKey.name"),
	hint: Translate("Settings.InvertIgnoreRollKey.descrp"),
	scope: "client",
	config: !game.settings.get(cModuleName, "ForceInvertIgnoreRollKey"),
	type: Boolean,
	default: false
  }); 

  game.settings.register(cModuleName, "IlluminationIconPosition", {
	name: Translate("Settings.IlluminationIconPosition.name"),
	hint: Translate("Settings.IlluminationIconPosition.descrp"),
	scope: "client",
	config: true,
	type: String,
	choices: {
		"none": Translate("Settings.IlluminationIconPosition.options.none"),
		"left": Translate("Settings.IlluminationIconPosition.options.left"),
		"right": Translate("Settings.IlluminationIconPosition.options.right")
	},
	default: "none"
  }); 
  
  game.settings.register(cModuleName, "LingeringAPIconPosition", {
	name: Translate("Settings.LingeringAPIconPosition.name"),
	hint: Translate("Settings.LingeringAPIconPosition.descrp"),
	scope: "client",
	config: true,
	type: String,
	choices: {
		"none": Translate("Settings.LingeringAPIconPosition.options.none"),
		"left": Translate("Settings.LingeringAPIconPosition.options.left"),
		"right": Translate("Settings.LingeringAPIconPosition.options.right")
	},
	default: "none"
  }); 
  
  game.settings.register(cModuleName, "PDCInputPosition", {
	name: Translate("Settings.PDCInputPosition.name"),
	hint: Translate("Settings.PDCInputPosition.descrp"),
	scope: "client",
	config: true,
	type: String,
	choices: {
		"none": Translate("Settings.PDCInputPosition.options.none"),
		"left": Translate("Settings.PDCInputPosition.options.left"),
		"right": Translate("Settings.PDCInputPosition.options.right")
	},
	default: "none"
  }); 

  game.settings.register(cModuleName, "SpottingPingDuration", {
	name: Translate("Settings.SpottingPingDuration.name"),
	hint: Translate("Settings.SpottingPingDuration.descrp"),
	scope: "client",
	config: true,
	type: Number,
	range: {
		min: 0,
		max: 10,
		step: 0.1
	},
	default: 0
  });  
  
  game.settings.register(cModuleName, "WhisperPerceptionResult", {
	name: Translate("Settings.WhisperPerceptionResult.name"),
	hint: Translate("Settings.WhisperPerceptionResult.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "WhisperLingeringAPremoval", {
	name: Translate("Settings.WhisperLingeringAPremoval.name"),
	hint: Translate("Settings.WhisperLingeringAPremoval.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "SpottedTokenTransparency", {
	name: Translate("Settings.SpottedTokenTransparency.name"),
	hint: Translate("Settings.SpottedTokenTransparency.descrp"),
	scope: "client",
	config: true,
	type: Number,
	range: {
		min: 0,
		max: 1,
		step: 0.05
	},
	default: 0.5
  });  
  
  //Keys
  game.keybindings.register(cModuleName, "PeekLock", {
	name: Translate("Keys.PeekLock.name"),
	editable: [
      {
        key: "KeyO"
      }
    ],
	onDown: () => { SelectedPeekhoveredDoor(); },
	restricted: false,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "MoveDoorLeft", {
	name: Translate("Keys.MoveDoorLeft.name"),
	onDown: () => { MoveHoveredDoor(1); },
	restricted: false,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "MoveDoorRight", {
	name: Translate("Keys.MoveDoorRight.name"),
	onDown: () => { MoveHoveredDoor(-1); },
	restricted: false,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
 
  game.keybindings.register(cModuleName, "ToggleTokenFollowing", {
	name: Translate("Keys.ToggleTokenFollowing.name"),
	onDown: () => { game.settings.set(cModuleName, "followTokens", !game.settings.get(cModuleName, "followTokens")) },
	restricted: false,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "IgnoreRoll", {
	name: Translate("Keys.IgnoreRoll.name"),
	hint: Translate("Keys.IgnoreRoll.descrp"),
	editable: [
      {
        key: "AltLeft"
      }
    ],
	restricted: false,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "resetStealthSelected", {
	name: Translate("Keys.resetStealthSelected.name"),
	hint: Translate("Keys.resetStealthSelected.descrp"),
	onDown: () => { resetStealthDataSelected(); },
	restricted: false,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  /*
  game.keybindings.register(cModuleName, "TestSpotted", {
	name: Translate("Keys.TestSpotted.name"),
	hint: Translate("Keys.TestSpotted.name"),
	onDown: () => { TestSpottedHovered() },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  */
  
  //Mouse Keys
  game.keybindings.register(cModuleName, "MousePeekLock", {
	name: Translate("Keys.MousePeekLock.name"),
	hint: Translate("Keys.MousePeekLock.descrp"),
	editable: [
      {
        key: "ControlLeft"
      }
    ],
	restricted: false,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "MouseMoveDoor", {
	name: Translate("Keys.MouseMoveDoor.name"),
	hint: Translate("Keys.MouseMoveDoor.descrp"),
	restricted: false,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "MouseMoveDoorFast", {
	name: Translate("Keys.MouseMoveDoorFast.name"),
	hint: Translate("Keys.MouseMoveDoorFast.descrp"),
	editable: [
      {
        key: "AltLeft"
      }
    ],
	restricted: false,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "EditHoveredDoor", {
	name: Translate("Keys.EditHoveredDoor.name"),
	hint: Translate("Keys.EditHoveredDoor.descrp"),
	onDown: () => {canvas.walls.hover?.document.sheet.render(true)},
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
});

function collapseContent(pHTML, pTitle, pIndentifiers) {
	let vCollapse = `<details>
						<summary>${Translate("Titles."+pTitle)}</summary>
						<div content=${pTitle}>
						</div>
					</details>`;
				
	pHTML.find(pIndentifiers).first().closest(".form-group").before(vCollapse);
	let vCollapsediv = pHTML.find(`div[content=${pTitle}]`);
	
	pHTML.find(pIndentifiers).each(function () {
		vCollapsediv.append(this);
	});
}

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
		
		//first VC setting
		vnewHTML = `<h4 class="border"><u>${Translate("Titles.VisionChannels")}</u></h4>`;
		 
		pHTML.find('input[name="' + cModuleName + '.ActivateVCs"]').closest(".form-group").before(vnewHTML);
		
		//first client setting
		vnewHTML = `<hr>
					<h3 class="border"><u>${Translate("Titles.ClientSettings")}</u></h4>`;
		 
		pHTML.find('input[name="' + cModuleName + '.followTokens"]').closest(".form-group").before(vnewHTML);	
		
		//collapses
		collapseContent(pHTML, "GMuiandcontrol", 	`[data-setting-id="perceptive.SimulatePlayerVision"],
													[data-setting-id="perceptive.GMSpotconfirmDialogbehaviour"],
													[data-setting-id="perceptive.ShowfailuresinGMconfirm"],
													[data-setting-id="perceptive.ForceInvertIgnoreRollKey"],
													[data-setting-id="perceptive.GMReciveInformationWhisper"],
													[data-setting-id="perceptive.MacroSeekBehaviour"]`);
		
		collapseContent(pHTML, "RulesAutomation", 	`[data-setting-id="perceptive.AutoRerollPPDConMove"],
												[data-setting-id="perceptive.resetSpottedbyMovedefault"],
												[data-setting-id="perceptive.CritMethod"],
												[data-setting-id="perceptive.AutomateTokenSpottable"],
												[data-setting-id="perceptive.MakeSpottedTokensVisible"],
												[data-setting-id="perceptive.RevealAllies"],
												[data-setting-id="perceptive.LingeringAP"],
												[data-setting-id="perceptive.LingeringAPRadius"],
												[data-setting-id="perceptive.LingeringAPDuration"],
												[data-setting-id="perceptive.RevealSpottedDooronClick"],
												[data-setting-id="perceptive.disableSpottableMATTTiles"]`);

		collapseContent(pHTML, "RollFormulas", 	`[data-setting-id="perceptive.PassivePerceptionFormula"],
											[data-setting-id="perceptive.PerceptionKeyWord"],
											[data-setting-id="perceptive.StealthKeyWord"],
											[data-setting-id="perceptive.AutoStealthDCbehaviour"]`);
																										
		collapseContent(pHTML, "Effects", 	`[data-setting-id="perceptive.applySystemStealthEffect"],
											[data-setting-id="perceptive.usePerceptiveStealthEffect"],
											[data-setting-id="perceptive.PerceptiveStealthFriendliesvisible"],
											[data-setting-id="perceptive.syncEffectswithPerceptiveStealth"],
											[data-setting-id="perceptive.customStealthEffects"]`);
											
		collapseContent(pHTML, "SightRange", 	`[data-setting-id="perceptive.SpottingRange"],
												[data-setting-id="perceptive.SpottingConeRange"],
												[data-setting-id="perceptive.ApplyRange"],
												[data-setting-id="perceptive.UseBordertoBorderRange"],
												[data-setting-id="perceptive.StandardVisionDirection"],
												[data-setting-id="perceptive.RangePDCModifier"],
												[data-setting-id="perceptive.Range3DCalculation"]`);
		
		collapseContent(pHTML, "Illumination", 	`[data-setting-id="perceptive.IlluminationPDCModifier"],
												[data-setting-id="perceptive.UseIlluminationPDCModifierforAP"],
												[data-setting-id="perceptive.IlluminationAPDCBehaviour"],
												[data-setting-id="perceptive.Light3Dcalc"]`);
												
		collapseContent(pHTML, "SoundnImages", 	`[data-setting-id="perceptive.SpottedSound"],
												[data-setting-id="perceptive.SpottedSoundVolume"],
												[data-setting-id="perceptive.SpotterImagePing"],
												[data-setting-id="perceptive.SpotterImagePingDuration"]`);
		
		//test buttons
		let vSoundForm;
		let vNewDiv;
		
		vSoundForm = pHTML.find(`div.form-group[data-setting-id="perceptive.SpottedSound"]`);
		vSoundForm.find('div').after(`<i class="${cPlaySoundIcon} audio-preview" style="flex-grow:0"></i>`);
		vSoundForm.find(`i`).on("click", () => {PerceptiveSound.PlaySound(vSoundForm.find("input").val(), null, {pTest : true, pVolume : pHTML.find(`input[name="perceptive.SpottedSoundVolume"]`).val()})});
		
		//menu button
		if (cVCactive || game.settings.get(cModuleName, "ActivateVCs")) {
			pHTML.find(`div.form-group[data-setting-id="perceptive.ActivateVCs"]`).after(`<button name="OpenVCMenu"> ${Translate("Titles.OpenVCMenu")}</button>`)
			pHTML.find(`button[name="OpenVCMenu"]`).on("click", () => {new VisionChannelsWindow().render(true);});
		}
	}
});  

//some pf2e rules specific settings
Hooks.on("ready", function() {
	if (game.settings.get(cModuleName, "UsePf2eRules")) {
		game.settings.set(cModuleName, "applySystemStealthEffect", true),
		game.settings.set(cModuleName, "IlluminationAPDCBehaviour", ["=","="]),
		game.settings.set(cModuleName, "CritMethod", "CritMethod-natCritpm10")
	}
	
	/*
	//version setting fixing
	let vCurrentVersion = game.modules.get(cModuleName).version;
	let vLastVersion = game.settings.get(cModuleName, "lastVersion");
	
	if (PerceptiveUtils.versionCompare(vLastVersion, vCurrentVersion) < 0) {
	}
	
	game.settings.set(cModuleName, "lastVersion", vCurrentVersion);
	*/
});
