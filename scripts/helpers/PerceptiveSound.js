import { PerceptiveUtils, cModuleName } from "../utils/PerceptiveUtils.js";
import { PerceptiveFlags } from "./PerceptiveFlags.js";

let vTimeOutList = [];

class PerceptiveSound {
	//DECLARATIONS
	//basics
	static PlaySound(pSound, pScene, pInfos = {pListenToken : undefined, pTimeOutSound : false}) {} //starts PlaySound requests for all user
	
	static PlaySoundRequest(pSound, pSceneID, pInfos = {pListenTokenID : "", pTimeOutSound : false}) {} //plays sound pSound if enabled
	
	//specifics
	static async PlaySpottedSound(pTokens) {} //start PlaySound requests for Lock sound
	
	//IMPLEMENTATIONS
	static PlaySound(pSound, pScene, pInfos = {pListenToken : undefined, pTimeOutSound : false}) {
		
		//other clients pop up
		game.socket.emit("module."+cModuleName, {pFunction : "PlaySoundRequest", pData : {pSound : pSound, pSceneID : pScene.id, pInfos : {pListenTokenID : pInfos?.pListenToken?.id, pTimeOutSound : pInfos?.pTimeOutSound}}});
		
		//own pop up
		PerceptiveSound.PlaySoundRequest(pSound, pScene.id, {pListenTokenID : pInfos?.pListenToken?.id, pTimeOutSound : pInfos?.pTimeOutSound});
	}
	
	static PlaySoundRequest(pSound, pSceneID, pInfos = {pListenTokenID : "", pTimeOutSound : false}) {
		if (canvas.scene.id == pSceneID) {
			if (!pInfos.pListenTokenID || canvas.tokens.controlled.find(vToken => vToken.id == pInfos.pListenTokenID)) {
				//only play sound if in same scene
				if (!vTimeOutList.includes(pSound)) {
					if (pInfos.pTimeOutSound) {
						vTimeOutList.push(pSound);
						
						setTimeout(() => {vTimeOutList = vTimeOutList.filter(vSound => vSound != pSound)}, 500);
					}
					
					AudioHelper.play({src: pSound, volume: 1});
				}
			}
		}
	}
	
	//specifics
	static async PlaySpottedSound(pTokens) {
		if (game.settings.get(cModuleName, "SpottedSound")) {
			for (let i = 0; i < pTokens.length; i++) {
				PerceptiveSound.PlaySound(game.settings.get(cModuleName, "SpottedSound"), pTokens[i].parent, {pListenToken : pTokens[i], pTimeOutSound : true});
			}
		}
	}
}
/*
Hooks.on(cModuleName+".onLock", (pLockType, pLock) => LnKSound.PlayLockSound(pLockType, pLock));
		
Hooks.on(cModuleName+".onunLock", (pLockType, pLock) => LnKSound.PlayunLockSound(pLockType, pLock));

Hooks.on(cModuleName+".DiceRoll", (pRollType, pCharacter) => LnKSound.PlayDiceSound(pCharacter));
*/

export function PlaySoundRequest(pData) {
	PerceptiveSound.PlaySoundRequest(pData.pSound, pData.pSceneID, pData.pInfos);
}

export { PerceptiveSound }