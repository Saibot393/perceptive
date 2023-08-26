import { cModuleName, Translate, LnKutils} from "../utils/LnKutils.js";
import { LnKSystemutils} from "../utils/LnKSystemutils.js";
import { LnKCompUtils, cArmReach, cArmReachold } from "../compatibility/LnKCompUtils.js";
import { UseKeyonHoveredLock, PickHoveredLock, BreakHoveredLock } from "../KeyManager.js";
import { TogglehoveredLockGM, CopyhoveredLockGM, PastehoveredLockGM, CreateNewKeyhoveredGM } from "../LockManager.js";


Hooks.once("init", () => {  // game.settings.get(cModuleName, "")
  //Settings
  game.settings.register(cModuleName, "useGMquickKeys", {
	name: Translate("Settings.useGMquickKeys.name"),
	hint: Translate("Settings.useGMquickKeys.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "allowLocking", {
	name: Translate("Settings.allowLocking.name"),
	hint: Translate("Settings.allowLocking.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "startasLocked", {
	name: Translate("Settings.startasLocked.name"),
	hint: Translate("Settings.startasLocked.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "LockDistance", {
	name: Translate("Settings.LockDistance.name"),
	hint: Translate("Settings.LockDistance.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: 15
  }); 
  
  game.settings.register(cModuleName, "UseArmReachDistance", {
	name: Translate("Settings.UseArmReachDistance.name"),
	hint: Translate("Settings.UseArmReachDistance.descrp"),
	scope: "world",
	config: (LnKCompUtils.isactiveModule(cArmReach) || LnKCompUtils.isactiveModule(cArmReachold)),
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "alwaysopenOwned", {
	name: Translate("Settings.alwaysopenOwned.name"),
	hint: Translate("Settings.alwaysopenOwned.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "showallLockInteractions", {
	name: Translate("Settings.showallLockInteractions.name"),
	hint: Translate("Settings.showallLockInteractions.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "preventUseinPause", {
	name: Translate("Settings.preventUseinPause.name"),
	hint: Translate("Settings.preventUseinPause.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  /*
  game.settings.register(cModuleName, "autoKeyuse", {
	name: Translate("Settings.autoKeyuse.name"),
	hint: Translate("Settings.autoKeyuse.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  */
  
  game.settings.register(cModuleName, "KeyItemtype", {
	name: Translate("Settings.KeyItemtype.name"),
	hint: Translate("Settings.KeyItemtype.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKSystemutils.Systemdefaultitemtype()
  }); 
  
  game.settings.register(cModuleName, "KeyitemCreationPopup", {
	name: Translate("Settings.KeyitemCreationPopup.name"),
	hint: Translate("Settings.KeyitemCreationPopup.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  });
  
  game.settings.register(cModuleName, "UseKeynameasID", {
	name: Translate("Settings.UseKeynameasID.name"),
	hint: Translate("Settings.UseKeynameasID.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "usePf2eSystem", {
	name: Translate("Settings.usePf2eSystem.name"),
	hint: Translate("Settings.usePf2eSystem.descrp"),
	scope: "world",
	config: LnKSystemutils.isPf2e(),
	type: Boolean,
	default: false,
	requiresReload: true
  }); 
  
  game.settings.register(cModuleName, "CritMethod", {
	name: Translate("Settings.CritMethod.name"),
	hint: Translate("Settings.CritMethod.descrp"),
	scope: "world",
	config: !game.settings.get(cModuleName, "usePf2eSystem"), //replaced by Pf2e
	type: String,
	choices: {
		"CritMethod-noCrit": Translate("Settings.CritMethod.options.noCrit"),
		"CritMethod-natCrit": Translate("Settings.CritMethod.options.natCrit"),
		"CritMethod-natCritpm10": Translate("Settings.CritMethod.options.natCritpm10")
	},
	default: "CritMethod-natCrit"
  });
  
  game.settings.register(cModuleName, "LockPickItem", {
	name: Translate("Settings.LockPickItem.name"),
	hint: Translate("Settings.LockPickItem.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKSystemutils.SystemdefaultLockPickItem()
  });  
  
  game.settings.register(cModuleName, "MentionLockPickItem", {
	name: Translate("Settings.MentionLockPickItem.name"),
	hint: Translate("Settings.MentionLockPickItem.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });  
  
  game.settings.register(cModuleName, "RemoveLPoncritFail", {
	name: Translate("Settings.RemoveLPoncritFail.name"),
	hint: Translate("Settings.RemoveLPoncritFail.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "JamLockonLPcritFail", {
	name: Translate("Settings.JamLockonLPcritFail.name"),
	hint: Translate("Settings.JamLockonLPcritFail.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });
  
  game.settings.register(cModuleName, "JamedLockKeyunusable", {
	name: Translate("Settings.JamedLockKeyunusable.name"),
	hint: Translate("Settings.JamedLockKeyunusable.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });
  
  game.settings.register(cModuleName, "LockPickFormula", {
	name: Translate("Settings.LockPickFormula.name"),
	hint: Translate("Settings.LockPickFormula.descrp"),
	scope: "world",
	config: !game.settings.get(cModuleName, "usePf2eSystem"), //replaced by Pf2e
	type: String,
	default: LnKSystemutils.SystemdefaultLPformula()
  }); 
  
  game.settings.register(cModuleName, "LockBreakFormula", {
	name: Translate("Settings.LockBreakFormula.name"),
	hint: Translate("Settings.LockBreakFormula.descrp"),
	scope: "world",
	config: !game.settings.get(cModuleName, "usePf2eSystem"), //replaced by Pf2e
	type: String,
	default: LnKSystemutils.SystemdefaultLBformula()
  }); 
  
  game.settings.register(cModuleName, "LockBreakunlockable", {
	name: Translate("Settings.LockBreakunlockable.name"),
	hint: Translate("Settings.LockBreakunlockable.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "onlyCombatMultiSuccess", {
	name: Translate("Settings.onlyCombatMultiSuccess.name"),
	hint: Translate("Settings.onlyCombatMultiSuccess.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });  
  
  //client
  game.settings.register(cModuleName, "ControlSceme", {
	name: Translate("Settings.ControlSceme.name"),
	hint: Translate("Settings.ControlSceme.descrp"),
	scope: "client",
	config: true,
	type: String,
	choices: {
		"ControlSceme-rightKeys"   : Translate("Settings.ControlSceme.options.rightKeys"),
		"ControlSceme-rightPopups" : Translate("Settings.ControlSceme.options.rightPopups")
	},
	default: "ControlSceme-rightKeys"
  });
  
  game.settings.register(cModuleName, "MessagePopUps", {
	name: Translate("Settings.MessagePopUps.name"),
	hint: Translate("Settings.MessagePopUps.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "PlayLockSounds", {
	name: Translate("Settings.PlayLockSounds.name"),
	hint: Translate("Settings.PlayLockSounds.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  //Keys (GM)
  game.keybindings.register(cModuleName, "ToggleLock", {
	name: Translate("Keys.ToggleLock.name"),
	onDown: () => { TogglehoveredLockGM(); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "CopyLock", {
	name: Translate("Keys.CopyLock.name"),
	onDown: () => { CopyhoveredLockGM(); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "PasteLock", {
	name: Translate("Keys.PasteLock.name"),
	onDown: () => { PastehoveredLockGM(); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "CreatenewKey", {
	name: Translate("Keys.CreatenewKey.name"),
	onDown: () => { CreateNewKeyhoveredGM(); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  //Key
  game.keybindings.register(cModuleName, "UseKey", {
    name: Translate("Keys.UseKey.name"),
    editable: [
      {
        key: "KeyK"
      }
    ],
    onDown: () => { UseKeyonHoveredLock(); },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "PickLock", {
    name: Translate("Keys.PickLock.name"),
    editable: [
      {
        key: "KeyP"
      }
    ],
    onDown: () => { PickHoveredLock(); },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "BreakLock", {
    name: Translate("Keys.BreakLock.name"),
    editable: [
      {
        key: "KeyL"
      }
    ],
    onDown: () => { BreakHoveredLock(); },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
});

//Hooks
Hooks.on("renderSettingsConfig", (pApp, pHTML, pData) => {
	//add a few titles	
	
	let vnewHTML;
	
	if (game.user.isGM) {
		//first world setting
		vnewHTML = `<h3 class="border">${Translate("Titles.WorldSettings")}</h3>`;
		 
		pHTML.find('input[name="' + cModuleName + '.useGMquickKeys"]').closest(".form-group").before(vnewHTML);
		
		//gm controlls
		vnewHTML = ``;
		for (let i = 0; i <= 4; i++) {
			vnewHTML = vnewHTML + `<p>${Translate("Text.GMControls.line"+i)}</p>`
		}
		
		pHTML.find('input[name="' + cModuleName + '.onlyCombatMultiSuccess"]').closest(".form-group").after(vnewHTML);
		
		//first client setting
		vnewHTML = `
					<hr>
					<h3 class="border">${Translate("Titles.ClientSettings")}</h3>
					`;
		 
		pHTML.find('select[name="' + cModuleName + '.ControlSceme"]').closest(".form-group").before(vnewHTML);
	}
	
	//player controlls
	vnewHTML = ``;
	for (let i = 0; i <= 3; i++) {
		vnewHTML = vnewHTML + `<p>${Translate("Text.PlayerControls.line"+i)}</p>`
	}
	
	pHTML.find('input[name="' + cModuleName + '.PlayLockSounds"]').closest(".form-group").after(vnewHTML);
});