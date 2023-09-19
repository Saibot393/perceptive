//CONSTANTS
const cModuleName = "perceptive"; //name of Module

const cPf2eName = "pf2e";

//type names
const cPf2EffectType = "effect"; //the item type of Pf2e effects
const cPf2ConditionType = "condition"; //the item type of Pf2e conditions

const cDelimiter = ";";

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
	
	static RollbehaviourKeywordsList(pSingleString = false) {} //returns a list of valid keywords
	
	static ApplyrollBehaviour(pBehaviour, pRoll1, pRoll2) {} //applies roll behaviour(adv., normal, disadv.) to pRoll1 and pRoll2
	
	//Pf2e specific
	static async ApplicableEffects(pIdentifications) {} //returns an array of documents defined by their names or ids through pIdentifications and present in the compendium or items tab
	
	//effects
	static CustomWorldStealthEffects() {} //returns array of stealth effects for this world
	
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
		if (PerceptiveUtils.RollbehaviourKeywordsList(pKeyword)) {
			return RollbehaviourKeywords[pKeyword];
		}
		else {
			return Number(pKeyword);
		}
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
				return Math.min(pRoll1, pRoll2);
				break;
			case 1:
				return Math.max(pRoll1, pRoll2);
				break;
			case 0:
			default:
				return pRoll1;
		}
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
			//-uuid
			let vBuffer = await game.items.get(pIdentifications[i]);
			
			//-name
			if (!vBuffer) {
				vBuffer = await game.items.find(vEffect => vEffect.name == pIdentifications[i]);
			}
			
			//direct id
			if (!vBuffer) {
				vBuffer = await fromUuid(pIdentifications[i]);
			}
			
			//compendium
			if (!vBuffer) {
				let vElement;
				let vPacks = game.packs.filter(vPacks => vPacks.documentName == "Item");//.map(vPack => vPack.index);
				
				//-uuid
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
			
			if (vBuffer && [cPf2ConditionType, cPf2EffectType].includes(vBuffer.type) ) {
				vEffects[vEffects.length] = vBuffer.toObject();
			}
		}
		
		return vEffects;		
	}
	
	//effects
	static CustomWorldStealthEffects() {
		return game.settings.get(cModuleName, "customStealthEffects").split(cDelimiter);
	}
}

function Translate(pName){
	return game.i18n.localize(cModuleName+"."+pName);
}

function TranslateandReplace(pName, pWords = {}){
	let vContent = Translate(pName);
	
	for (let vWord of Object.keys(pWords)) {
		vContent = vContent.replace("{" + vWord + "}", pWords[vWord]);
	}
 
	return vContent;
}

//Export RideableFlags Class
export{ PerceptiveUtils, Translate, TranslateandReplace, cModuleName };
