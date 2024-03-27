//CONSTANTS
const cModuleName = "perceptive"; //name of Module

const cPf2eName = "pf2e";

//type names
const cPf2EffectType = "effect"; //the item type of Pf2e effects
const cPf2ConditionType = "condition"; //the item type of Pf2e conditions

const cDelimiter = ";";

const cPopUpID = "Popups";

const RollbehaviourKeywords = {
	advantage : 1,
	adv : 1,
	"+" : 1,
	normal : 0,
	"=" : 0,
	disadvantage : -1,
	disadv : -1,
	"-" : -1
}

//a few support functions
class PerceptiveUtils {
	//DECLARATIONS
	
	//Identification
	static isPf2e() {} //used for special Pf2e functions
	
	//Token IDs/Names
	static TokensfromIDs (pIDs, pScene = null) {} //returns an array of Tokens belonging to the pIDs
	
	static IDsfromTokens (pTokens) {} //returns an array of IDs belonging to the pTokens
	
	static TokenfromID (pID, pScene = null) {} //returnsthe Token matching pID
	
	static WallfromID(pID, pScene = null) {} //returns the Wall matching pID
	
	static WallsfromIDs(pIDs, pScene = null) {} //returns the Wall matching pID
	
	static TilesfromIDs(pIDs, pScene = null) {} //returns an array of Tiles belonging to the pIDs
	
	static TilefromID(pID, pScene = null) {} //returns tile belonging to pID in pScene
	
	static ObjectfromID(pID, pScene = null) {} //returns object (token, wall, tile) belonging to pID in pScene
	
	static IDsfromWalls(pWalls) {} //returns IDs of pWalls
	
	static hoveredWall() {} //get first hovered wall
	
	static hoveredObject() {} //get first hovered object
	
	static SelectedandPrimary() {} //returns all selected tokens and the primary character (if not allready included)
	
	static TokenNamesfromIDs(pIDs, pScene = null) {} //returns a string matching pIDs Tokens
	
	static TokenNamesarrayfromIDs(pIDs, pScene = null) {} //returns an array matching pIDs Tokens
	
	//Token Controls
	static selectedTokens() {} //get array of all selected tokens
	
	static targetedToken() {} //get first selected token
	
	static hoveredToken() {} //get first hovered token
	
	static PrimaryCharacter() {} //returns the first selected token document if available or the default character document
	
	//rolls
	static Rollbehaviour(pKeyword) {} //returns the Rollrepeat level associated with pKeyword (-1:disadvantage, 0:normal, 1:advantage)
	
	static AddRollBehaviour(pBehaviour1, pBehaviour2, pAsNumber = false) {} //returns the Rollbehaviour summ of pBehaviour1 and pBehaviour2
	
	static RollbehaviourKeywordsList(pSingleString = false) {} //returns a list of valid keywords
	
	static ApplyrollBehaviour(pBehaviour, pRoll1, pRoll2) {} //applies roll behaviour(adv., normal, disadv.) to pRoll1 and pRoll2
	
	static successDegree(pRollresult, pDC, pCritMode = -1, pRollBonus = 0) {} //returns the degree of success of pRollresult and pRolldetails based on the pDC and the world crit settings
	
	static CritType(pTypeName = game.settings.get(cModuleName, "CritMethod")) {} //returns the numerical crit type of pTypeName
	
	static async twoRoll(pRoll, pInfos = {}) {} //returns two rolls based on pRoll (either rerolls for second reroll or uses second roll if present), by order, not result and includes the souce behaviour in pInfos
	
	//Pf2e specific
	static async ApplicableEffects(pIdentifications) {} //returns an array of documents defined by their names or ids through pIdentifications and present in the compendium or items tab
	
	//effects
	static CustomWorldStealthEffects() {} //returns array of stealth effects for this world
	
	//keyboard
	static KeyisDown(pKeyName, pnoKeyvalid = false) {} //returns if a key belonging to keybinding pKeyName is down (pnoKeyvalid if no key pressed is valid "input")
	
	//users
	static GMUserIDs() {} //returns an array of GM role users
	
	static OwnerIDs(pToken) {} //returns IDs of owners of this token
	
	//versions
	static versionCompare(pVersion, pCompare) {}
	
	//IMPLEMENTATIONS
	
	//Identification	
	static isPf2e() {
		return game.system.id === cPf2eName;
	}	
	
	//Token IDs/Names
	static TokensfromIDs (pIDs, pScene = null) {
		if (pScene) {
			return pScene.tokens.filter(vDocument => pIDs.includes(vDocument.id)).concat(pScene.tiles.filter(vDocument => pIDs.includes(vDocument.id)));
		}
		else {
			return canvas.tokens.placeables.filter(vToken => pIDs.includes(vToken.id)).map(vToken => vToken.document).concat(canvas.tiles.placeables.filter(vToken => pIDs.includes(vToken.id)).map(vToken => vToken.document));;
		}
	}
	
	static IDsfromTokens (pTokens) {
		let vIDs = [];
					
		for (let i = 0; i < pTokens.length; i++) {
			let vBuffer = null;
			
			if (pTokens[i]) {
				vIDs[vIDs.length] = pTokens[i].id;
			}
		}
		
		return vIDs;
	}
	
	static TokenfromID (pID, pScene = null) {
		if (pScene) {
			let vDocument = pScene.tokens.find(vDocument => vDocument.id === pID);
			
			if (!vDocument) {
				vDocument = pScene.tiles.find(vDocument => vDocument.id === pID);
			}
			
			if (vDocument) {
				return vDocument;
			}
			else {
				return null;
			}
		}
		else {
			//default scene
			let vToken = canvas.tokens.placeables.find(vToken => vToken.id === pID);
			
			if (!vToken) {
				vToken = canvas.tiles.placeables.find(vToken => vToken.id === pID);
			}
			
			if (vToken) {
				return vToken.document;
			}
			else {
				return null;
			}
		}
	} 
	
	static WallfromID(pID, pScene = null) {
		if (pScene) {
			let vDocument = pScene.walls.get(pID);
			
			if (vDocument) {
				return vDocument;
			}
			else {
				return null;
			}
		}
		else {
			//default scene
			let vWall = canvas.walls.get(pID);
			if (vWall) {
				return vWall.document;
			}
			else {
				return null;
			}
		}		
	}
	
	static WallsfromIDs(pIDs, pScene = null) {
		return pIDs.map(vID => PerceptiveUtils.WallfromID(vID, pScene));
	}
	
	static TilesfromIDs(pIDs, pScene = null) {
		return vIDs.map(vID => PerceptiveUtils.TilefromID(vID, pScene));
	}
	
	static TilefromID(pID, pScene = null) {
		if (pScene) {
			return pScene.tiles.get(pID);
		}
		else {
			//default scene
			let vTile = canvas.tiles.get(pID);
			if (vTile) {
				return vTile.document;
			}
			else {
				return null;
			}
		}			
	}
	
	static ObjectfromID(pID, pScene = null) {
		let vObject = PerceptiveUtils.TokenfromID(pID, pScene);
		
		if (!vObject) {
			vObject = PerceptiveUtils.WallfromID(pID, pScene);
			
			if (!vObject) {
				vObject = PerceptiveUtils.TilefromID(pID, pScene);
			}
		}
		
		return vObject;
	} 
	
	static IDsfromWalls(pWalls) {
		return pWalls.map(vWall => vWall.id);
	}
	
	//Token Controls
	static selectedTokens() {
		return canvas.tokens.controlled.map(pToken => pToken.document);
	}
	
	static targetedToken() {
		if (game.user.targets.ids.length) {
			return canvas.tokens.placeables.find(velement => velement.id === game.user.targets.ids[0]).document;
		}
		else {
			return null;
		}
	}
	
	static hoveredToken() {
		if (canvas.tokens.hover) {
			return canvas.tokens.hover.document;
		}
		else {
			return null;
		}
	}
	
	static hoveredWall() {
		if (canvas.walls.hover) {
			return canvas.walls.hover.document;
		}
		else {
			return null;
		}		
	}
	
	static hoveredObject() {
		if (PerceptiveUtils.hoveredWall()) {
			return PerceptiveUtils.hoveredWall();
		}
		else {
			return PerceptiveUtils.hoveredToken();
		}
	}
	
	static PrimaryCharacter() {
		let vCharacter = PerceptiveUtils.selectedTokens()[0];
		
		if ((!vCharacter || !vCharacter.isOwner) && game.user.character) {
			//select a token representing the standard character of the player
			vCharacter = canvas.scene.tokens.find(vToken => vToken.actor.id == game.user.character.id);
		}
		
		return vCharacter;
	}
	
	static SelectedandPrimary() {
		let vPrimeCharacter = canvas.scene.tokens.find(vToken => vToken.actor.id == game.user.character.id);
		
		let vSelected = PerceptiveUtils.selectedTokens();
		
		if (vPrimeCharacter && !vSelected.includes(vPrimeCharacter)) {
			vSelected = vSelected.concat(vPrimeCharacter);
		}
		
		return vSelected;
	}
	
	//rolls
	static Rollbehaviour(pKeyword) {
		if (PerceptiveUtils.RollbehaviourKeywordsList().includes(pKeyword)) {
			return RollbehaviourKeywords[pKeyword];
		}
		else {
			return Number(pKeyword);
		}
	}
	
	static AddRollBehaviour(pBehaviour1, pBehaviour2, pAsNumber = false) {
		let vBehaviour1 = pBehaviour1;
		
		if (vBehaviour1 == undefined) {
			vBehaviour1 = 0;
		}
		
		if (isNaN(vBehaviour1)) {
			vBehaviour1 = PerceptiveUtils.Rollbehaviour(vBehaviour1);
		}
		
		let vBehaviour2 = pBehaviour2;
		
		if (vBehaviour2 == undefined) {
			vBehaviour2 = 0;
		}
		
		if (isNaN(vBehaviour2)) {
			vBehaviour2 = PerceptiveUtils.Rollbehaviour(vBehaviour2);
		}		
		
		let vResult = Math.min(1, Math.max(-1, vBehaviour1 + vBehaviour2));
		
		if (pAsNumber) {
			return vResult;
		}
		
		return Object.keys(RollbehaviourKeywords).find(vKeyword => RollbehaviourKeywords[vKeyword] == vResult); //find string with associated value
	}
	
	static RollbehaviourKeywordsList(pSingleString = false) {
		let vWords = Object.keys(RollbehaviourKeywords);
		
		if (pSingleString) {
			let vString = "";
			
			for (let i = 0; i < vWords.length; i++) {
				vString = vString + vWords[i];
				
				if (i < vWords.length - 1) {
					vString = vString + ", ";
				}
			}
			
			return vString;
		}
		else {
			return vWords;
		}
	}
	
	static ApplyrollBehaviour(pBehaviour, pRoll1, pRoll2) {
		let vNumericalBehaviour = PerceptiveUtils.Rollbehaviour(pBehaviour);
		
		switch (vNumericalBehaviour) {
			case -1:
				if (pRoll1[0] <= pRoll2[0]) {
					return pRoll1;
				}
				else {
					return pRoll2;
				}
				break;
			case 1:
				if (pRoll1[0] >= pRoll2[0]) {
					return pRoll1;
				}
				else {
					return pRoll2;
				}
				break;
			case 0:
			default:
				return pRoll1;
		}
	}
	
	static successDegree(pRollresult, pDC, pCritMode = -1, pRollBonus = 0) {
		let vsuccessDegree;
		let vCritMode = pCritMode;
		let vTotalResult = pRollresult[0] + pRollBonus;
		let vDiceResult = pRollresult[1];
		if (vCritMode < 0) {
			vCritMode = 0;
			
			vCritMode = PerceptiveUtils.CritType();
		}
		
		if (vTotalResult >= pDC) {
			vsuccessDegree = 1; //S
		}
		else {
			vsuccessDegree = 0; //F
		}
		
		if (vDiceResult > 0) {
			switch (vCritMode) {
				case 1:
					//normal crit
					if (vDiceResult == 20) {
						vsuccessDegree = 2; //crit S
					}
					
					if (vDiceResult == 1) {
						vsuccessDegree = -1;//crit F
					}	
					break;
				case 2:
					//+-10 crit
					if (vsuccessDegree == 1) {
						if (vTotalResult >= (pDC + 10)) {
							vsuccessDegree = 2;//crit S
						}
					}
					
					if (vsuccessDegree == 0) {
						if (vTotalResult <= (pDC - 10)) {
							vsuccessDegree = -1;//crit F
						}
					}	
					
					if (vDiceResult == 20) {
						vsuccessDegree = vsuccessDegree + 1;//increase degree
					}
					
					if (vDiceResult == 1) {
						vsuccessDegree = vsuccessDegree -1;//decrease degree
					}
					break;
			}
		}
		
		vsuccessDegree = Math.min(2, Math.max(-1, vsuccessDegree)); //make sure vsuccessDegree is in [-1, 2]
		
		return vsuccessDegree;
	}
	
	static CritType(pTypeName = game.settings.get(cModuleName, "CritMethod")) {
		switch (game.settings.get(cModuleName, "CritMethod")) {
			case "CritMethod-natCrit":
				return 1;
				break;
			case "CritMethod-natCritpm10":
				return 2;
				break;	
			default:
			case "CritMethod-noCrit":
				return 0;
				break;
		}	
	}
	
	static async twoRoll(pRoll, pInfos = {}) {
		let vFirstResult;
		let vSecondResult;
		
		if ((pRoll.dice[0].number > 1) && pRoll.options?.hasOwnProperty("advantageMode")) {
			pInfos.SourceRollBehaviour = Number(pRoll.options?.advantageMode);
			
			if (pRoll.dice[0].results[0]?.active) {
				vFirstResult = [pRoll.total, pRoll.dice[0].total];
				
				vSecondResult = [pRoll.total - pRoll.dice[0].total + pRoll.dice[0].results[1].result, pRoll.dice[0].results[1].result];	
			}
			else {
				vFirstResult = [pRoll.total - pRoll.dice[0].total + pRoll.dice[0].results[0].result, pRoll.dice[0].results[0].result];
				
				vSecondResult = [pRoll.total, pRoll.dice[0].total];					
			}
		}
		else {
			pInfos.SourceRollBehaviour = RollbehaviourKeywords.normal;
			
			vFirstResult = [pRoll.total, pRoll.dice[0].total];
		
			//second roll for adv/disadv
			let vSecondRoll = new Roll(pRoll.formula);
			
			await vSecondRoll.evaluate();
			
			vSecondResult = [vSecondRoll.total, vSecondRoll.dice[0].total];			
		}
		
		if (pInfos.SourceRollBehaviour == undefined) {
			pInfos.SourceRollBehaviour = 0;
		}
		
		return [vFirstResult, vSecondResult];
	}
	
	static TokenNamesfromIDs(pIDs, pScene = null) {
		let vNames = "";
		
		let vToken;
		
		for (let i = 0; i < pIDs.length; i++) {
			if (vNames.length) {
				vNames = vNames + ", "
			}
			
			vToken = PerceptiveUtils.TokenfromID(pIDs[i], pScene);
			
			if (vToken) {
				vNames = vNames + vToken.name;
			}
			else {
				vNames = vNames + "[" + pIDs[i] + "]";
			}
		}
		
		if (vNames.length == 0) {
			vNames = "-";
		}
		
		return vNames;
	} 
	
	static TokenNamesarrayfromIDs(pIDs, pScene = null) {
		return pIDs.map(vID => PerceptiveUtils.TokenfromID(vID, pScene).name).filter(vName => vName.length > 0)
	}
	
	//Pf2e specific
	static async ApplicableEffects(pIdentifications) {
		let vEffects = [];
		
		for (let i = 0; i < pIdentifications.length; i++) {
			//world
			//id
			let vBuffer = await game.items.get(pIdentifications[i]);
			
			//-name
			if (!vBuffer) {
				vBuffer = await game.items.find(vEffect => vEffect.name == pIdentifications[i]);
			}
			
			//uu-id
			if (!vBuffer) {
				vBuffer = await fromUuid(pIdentifications[i]);
			}
			
			//compendium
			if (!vBuffer) {
				let vElement;
				let vPacks = game.packs.filter(vPacks => vPacks.documentName == "Item");//.map(vPack => vPack.index);
				
				//-id
				let vPack = vPacks.find(vPack => vPack.index.get(pIdentifications[i]));
				
				if (vPack) {
					vElement = vPack.index.get(pIdentifications[i]);
				}
				else {//-name
					vPack = vPacks.find(vPack => vPack.index.find(vData => vData.name == pIdentifications[i]));
					
					if (vPack) {
						vElement = vPack.index.find(vData => vData.name == pIdentifications[i]);
					}
				}
			
				if (vElement) {
					vBuffer = vElement;
					/*
					vBuffer = await game.items.filter(vToken => vToken.flags.core).find(vToken => vToken.flags.core.sourceId == "Compendium." + vPack.collection + ".Item." + vElement._id);
					
					if (!vBuffer) {
						vBuffer = await game.items.importFromCompendium(vPack, vElement._id);
					};
					*/
				}
			}
			
			if (vBuffer && [cPf2ConditionType, cPf2EffectType].includes(vBuffer.type)) {
				if (typeof vBuffer == "object") {
					vEffects[vEffects.length] = foundry.utils.duplicate(vBuffer);
				}
				else {
					vEffects[vEffects.length] = vBuffer.toObject();
				}
			}
		}
		
		return vEffects;		
	}
	
	//effects
	static CustomWorldStealthEffects() {
		return game.settings.get(cModuleName, "customStealthEffects").split(cDelimiter);
	}
	
	//keyboard
	static KeyisDown(pKeyName, pnoKeyvalid = false) {
		if (game.keybindings.bindings.get(cModuleName + "." + pKeyName).length > 0) {
			return Boolean(game.keybindings.get(cModuleName, pKeyName).find(vKey => keyboard.downKeys.has(vKey.key)));
		}
		
		return Boolean(pnoKeyvalid);
	}
	
	//users
	static GMUserIDs() {
		return game.users.filter(vUser => vUser.isGM).map(vUser => vUser.id);
	}
	
	static OwnerIDs(pToken) {
		
	} 
	
	//versions
	static versionCompare(pVersion, pCompare) {
		let vVersionNumbers = pVersion.split(".");
		let vCompareNumbers = pCompare.split(".");
		
		for (let i = 0; i < Math.min(vVersionNumbers.length, vCompareNumbers.length); i++) {
			if (vVersionNumbers[i] < vCompareNumbers[i]) {
				return -1;
			}
			
			if (vVersionNumbers[i] > vCompareNumbers[i]) {
				return 1;
			}
		}
		
		return 0;
	}
}

function Translate(pName, pWithModuleTag = true){
	if (pWithModuleTag) {
		return game.i18n.localize(cModuleName+"."+pName);
	}
	else {
		return game.i18n.localize(pName)
	}
}

function TranslateandReplace(pName, pWords = {}){
	let vContent = Translate(pName);
	
	for (let vWord of Object.keys(pWords)) {
		vContent = vContent.replace("{" + vWord + "}", pWords[vWord]);
	}
 
	return vContent;
}

//Export RideableFlags Class
export{ PerceptiveUtils, Translate, TranslateandReplace, cModuleName, cPopUpID};
