import { PerceptiveUtils, cModuleName } from "../utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "./PerceptiveFlags.js";

const cTimeOutLength = 500; //in ms

const cDiceSound = "sounds/dice.wav";

let vTimeOutList = [];

class PerceptiveSound {
	//DECLARATIONS
	//basics
	static PlaySoundforTokens(pSound, pTokens, pInfos) {} //starts a play sound with pSound for all pTokens
	
	static PlaySound(pSound, pScene, pInfos = {pListenToken : undefined, pTimeOutSound : false, pTest : false, pVolume : undefined}) {} //starts PlaySound requests for all user
	
	static PlaySoundRequest(pSound, pSceneID, pInfos = {pListenTokenID : "", pTimeOutSound : false, pTest : false, pVolume : undefined}) {} //plays sound pSound if enabled
	
	//specifics
	static async PlaySpottedSound(pTokens, pTest = false) {} //start PlaySound requests for Lock sound
	
	static async PlayDiceSound(pTokens) {} //start PlaySound requests for Dice sound
	
	//IMPLEMENTATIONS
	static PlaySoundforTokens(pSound, pTokens, pInfos) {
		if (pInfos.pTest) {
			PerceptiveSound.PlaySound(pSound, null, {pTest : true});
		}
		else {
			for (let i = 0; i < pTokens.length; i++) {
				PerceptiveSound.PlaySound(pSound, pTokens[i].parent, {pListenToken : pTokens[i], pTimeOutSound : pInfos.pTimeOutSound, pVolume : pInfos.pVolume});
			}			
		}
	}
	
	static PlaySound(pSound, pScene, pInfos = {pListenToken : undefined, pTimeOutSound : false, pTest : false, pVolume : undefined}) {
		let vInfos = {pListenTokenID : pInfos?.pListenToken?.id, pTimeOutSound : pInfos?.pTimeOutSound, pVolume : pInfos?.pVolume, pTest : pInfos.pTest};
		
		//other clients pop up
		if (!pInfos.pTest) {
			game.socket.emit("module."+cModuleName, {pFunction : "PlaySoundRequest", pData : {pSound : pSound, pSceneID : pScene?.id, pInfos : vInfos}});
		}
		
		//own pop up
		PerceptiveSound.PlaySoundRequest(pSound, pScene?.id, vInfos);
	}
	
	static PlaySoundRequest(pSound, pSceneID, pInfos = {pListenTokenID : "", pTimeOutSound : false, pTest : false, pVolume : undefined}) {
		if (pInfos.pTest || (canvas.scene.id == pSceneID)) {
			if (pInfos.pTest || !pInfos.pListenTokenID || canvas.tokens.controlled.find(vToken => vToken.id == pInfos.pListenTokenID)) {
				//only play sound if in same scene
				if (pInfos.pTest || !vTimeOutList.includes(pSound)) {
					if (pInfos.pTimeOutSound) {
						vTimeOutList.push(pSound);
						
						setTimeout(() => {vTimeOutList = vTimeOutList.filter(vSound => vSound != pSound)}, cTimeOutLength);
					}
					
					let vVolume = 1;
					if (!isNaN(pInfos.pVolume) && !(pInfos.pVolume === false)) {
						vVolume = pInfos.pVolume;
					}
					
					AudioHelper.play({src: pSound, volume: vVolume});
				}
			}
		}
	}
	
	//specifics
	static async PlaySpottedSound(pTokens, pTest = false) {
		if (game.settings.get(cModuleName, "SpottedSound")) {
			PerceptiveSound.PlaySoundforTokens(game.settings.get(cModuleName, "SpottedSound"), pTokens, {pTimeOutSound : true, pTest : pTest, pVolume : game.settings.get(cModuleName, "SpottedSoundVolume")});
		}
	}
	
	static async PlayDiceSound(pTokens) {
		PerceptiveSound.PlaySoundforTokens(cDiceSound, pTokens, {pTimeOutSound : false});
	}
}

export function PlaySoundRequest(pData) {
	PerceptiveSound.PlaySoundRequest(pData.pSound, pData.pSceneID, pData.pInfos);
}

export { PerceptiveSound }