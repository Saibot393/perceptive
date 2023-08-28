//CONSTANTS
const cModuleName = "perceptive"; //name of Module

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
	
	static PrimaryCharacter() {} //returns the first selected token document if available or the default character document
	
	static SelectedandPrimary() {} //returns all selected tokens and the primary character (if not allready included)
	
	//Token Controls
	static selectedTokens() {} //get array of all selected tokens
	
	static targetedToken() {} //get first selected token
	
	static hoveredToken() {} //get first hovered token
	
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
}

function Translate(pName){
  return game.i18n.localize(cModuleName+"."+pName);
}

//Export RideableFlags Class
export{ PerceptiveUtils, Translate, cModuleName };
