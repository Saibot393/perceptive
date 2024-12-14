import { cModuleName } from "../utils/PerceptiveUtils.js";
import { PerceptiveFlags, cPerceptiveEffectF } from "../helpers/PerceptiveFlags.js";
import { GeometricUtils } from "../utils/GeometricUtils.js";

//Module Names
const cLibWrapper = "lib-wrapper";
const cArmReach = "foundryvtt-arms-reach";
const cArmReachold = "arms-reach";
const cLocknKey = "LocknKey";
const cWallHeight = "wall-height";
const cDfredCE = "dfreds-convenient-effects";
const cVision5e = "vision-5e";
const cStealthy = "stealthy";
const cLevels = "levels";
const cZnPOptions = "zoom-pan-options";
const cRideable = "Rideable";
const cMATT = "monks-active-tiles";
const cATV = "tokenvisibility";
const cTokenMagic = "tokenmagic";
const cEpicRolls = "epic-rolls-5e";
const cMassEdit = "multi-token-edit";
const cMWE = "monks-wall-enhancement";
const cCPR = "chris-premades";

//special words
const cLockTypeDoor = "LTDoor"; //type for door locks

//Trigger conditions for MATT
const cTCNever = "never";
const cTCAlways = "always";
const cTCactive = "active";
const cTCpassive = "passive";

const cTConditions = [cTCNever, cTCAlways, cTCactive, cTCpassive];

const cTTNewlySpotted = "NewlySpotted";

const cTTypes = [cTTNewlySpotted];

const cMATTTriggerTileF = "MATTTriggerTileFlag";
const cMATTTriggerConditionsF = "MATTTriggerConditionsFlag";

export { cLockTypeDoor }

export { cLibWrapper, cArmReach, cArmReachold, cLocknKey, cWallHeight, cDfredCE, cVision5e, cStealthy, cLevels, cZnPOptions, cRideable, cMATT, cATV, cMATTTriggerTileF, cMATTTriggerConditionsF, cTConditions, cTTypes, cTTNewlySpotted, cTokenMagic, cEpicRolls, cMassEdit, cMWE, cCPR}

class PerceptiveCompUtils {
	//DECLARATIONS
	//basic
	static isactiveModule(pModule) {} //determines if module with id pModule is active
	
	//specific: Foundry ArmsReach, ArmsReach
	static ARReachDistance() {} //[ArmReach] retunrs the set interactions distance of armsreach
	
	static ARWithinDistance(pCharacter, pObject) {} //[ArmReach] returns if pCharacter is close enought to pLock to interact
	
	//effect modules specific: dfreds-convenient-effects & chris premades
	static hasactiveEffectModule() {} //returns if an effect module compatibility is enabled
	
	static addIDNameEffects(pNameIDs, pToken) {} //adds effects matching pNameIDs to pToken using compatible modules
	
	static async RemovePerceptiveEffects(pToken) {} //removes perceptive effects from pToken actor
	
	static isPercpetiveEffect(pEffect) {} //returns if pEffect is a perceptive effect
	
	//specific: dfreds-convenient-effects
	static async AddDfredEffect(pEffects, pToken) {} //uses dfreds api to add effects with pEffectNames to pToken
	
	static async RemovePerceptiveDfredEffect(pEffects, pToken) {} //uses dfreds api to remove effects with pEffectNames to pToken
	
	static async FilterDFEffects(pNameIDs) {} //returns an array of effects fitting the ids or names in pNameIDs
	
	//specific: chris premades
	static async AddCPREffects(pEffects, pToken) {} //uses CPR to add effects to pToken
	
	static FilterCPREffects(pNameIDs) {} //returns array of effects datas
	
	//specific: MATT
	static async MATTTriggerTile(pObject) {} //returns Tile triggered by pObject actions
	
	static MATTTriggerTileID(pObject) {} //returns the ID of the triggered tile of this lock
	
	static setMATTTriggercondition(pObject, pInfos) {} //sets the MATT trigger condition of pObject
	
	static MattTriggerCondition(pObject, pType) {} //returns the MATT trigger condition of pObject for pType
	
	static MATTTriggered(pObject, pType, pOutcome) {} //returns if a triiger of pType with pOutcome triggers the MATT tile of pObject
	
	//specific: wall-height & levels
	static WHLelevation(pObject) {} //returns a calculated middle elevation of pObject
	
	static LVLLOStest(pPoint) {} //returns if is in line of sight
	
	static WHLVLzmiddle(pObject) {} //returns the calculated z middle of pObject
	
	//specific: Rideable
	//static compatibilityName(pTile) {} //returns the rideable tile name of pTile, false otherwise
	
	//IMPLEMENTATIONS
	//basic
	static isactiveModule(pModule) {
		if (game.modules.find(vModule => vModule.id == pModule)) {
			return game.modules.find(vModule => vModule.id == pModule).active;
		}
		
		return false;
	};
	
	//specific: Foundry ArmsReach
	static ARReachDistance() {
		if (PerceptiveCompUtils.isactiveModule(cArmReach)) {
			return game.settings.get(cArmReach, "globalInteractionMeasurement");
		}
		
		if (PerceptiveCompUtils.isactiveModule(cArmReachold)) {
			return game.settings.get(cArmReachold, "globalInteractionDistance");
		}
	}
	
	static ARWithinDistance(pCharacter, pObject) {
		if (PerceptiveCompUtils.isactiveModule(cArmReach)) {
			if (game.modules.get(cArmReach).api) {
				return game.modules.get(cArmReach).api.isReachable(pCharacter.object, pObject.object);
			}
		}		
		
		if (PerceptiveCompUtils.isactiveModule(cArmReachold)) {
			if (game.modules.get(cArmReachold).api) {
				return game.modules.get(cArmReachold).api.isReachable(pCharacter.object, pObject.object);
			}
		}	
		
		return true;//if anything fails
	}
	
	//effect modules specific: dfreds-convenient-effects & chris premades
	static hasactiveEffectModule() {
		return (PerceptiveCompUtils.isactiveModule(cDfredCE) && game.settings.get(cModuleName, "DFredsEffectsIntegration")) || (PerceptiveCompUtils.isactiveModule(cCPR) && game.settings.get(cModuleName, "CPREffectsIntegration"))
	}
	
	static async addIDNameEffects(pNameIDs, pToken) {
		if (PerceptiveCompUtils.isactiveModule(cDfredCE) && game.settings.get(cModuleName, "DFredsEffectsIntegration")) {
			await PerceptiveCompUtils.AddDfredEffect(await PerceptiveCompUtils.FilterDFEffects(pNameIDs), pToken);
		}

		if (PerceptiveCompUtils.isactiveModule(cCPR) && game.settings.get(cModuleName, "CPREffectsIntegration")) {
			await PerceptiveCompUtils.AddCPREffects(PerceptiveCompUtils.FilterCPREffects(pNameIDs), pToken);
		}
	}
	
	static async RemovePerceptiveEffects(pToken) {
		let vEffectIDs = pToken.actor.effects.filter(vEffect => PerceptiveCompUtils.isPercpetiveEffect(vEffect)).map(vEffect => vEffect.id);

		await pToken.actor.deleteEmbeddedDocuments("ActiveEffect", vEffectIDs);
	}
	
	static isPercpetiveEffect(pEffect) {
		return pEffect.origin == cModuleName || (pEffect.flags && pEffect.flags[cModuleName] && pEffect.flags[cModuleName][cPerceptiveEffectF]);
	} 
	
	//specific: dfreds-convenient-effects
	static async AddDfredEffect(pEffects, pToken) {
		if (game.release.generation < 12) {
			for (let i = 0; i < pEffects.length; i++) {
				await game.dfreds.effectInterface._socket.executeAsGM('addEffect', {
					effect: {...pEffects[i].toObject(), flags : {[cModuleName] : {[cPerceptiveEffectF] : true}}},
					uuid : pToken.actor.uuid,
					origin : cModuleName
				});
				/*
				game.dfreds.effectInterface.addEffect({effectName : pEffectNames[i], uuid : pToken.actor.uuid, origin : cModuleName})
				*/
			}
		}
		else {
			for (let i = 0; i < pEffects.length; i++) {
				await game.dfreds.effectInterface.addEffect({
					effectData: {...pEffects[i].toObject(),
								 flags : {[cModuleName] : {[cPerceptiveEffectF] : true}}},
					uuid : pToken.actor.uuid
				});
				/*
				game.dfreds.effectInterface.addEffect({effectName : pEffectNames[i], uuid : pToken.actor.uuid, origin : cModuleName})
				*/
			}
		}
	}
	
	static async RemovePerceptiveDfredEffect(pEffects, pToken) {
		let vEffects = pEffects.filter(vEffect => PerceptiveCompUtils.isPercpetiveEffect(vEffect));
		
		if (game.release.generation < 12) {
			for (let i = 0; i < vEffects.length; i++) {
				let vName = vEffects[i].name;
				
				if (!vName) {
					vName = vEffects[i].label;
				}
				
				if (vEffects[i]?.parent?.effects.get(vEffects[i].id)) {
					if (game.user.isGM) {
						await pToken.actor.deleteEmbeddedDocuments("ActiveEffect", [vEffects[i].id], {[cModuleName + "delete"] : true})
					}
					else {
						await game.dfreds.effectInterface?._socket.executeAsGM('removeEffect', {
							effectName: vName,
							uuid : pToken.actor.uuid//,
							//origin : cModuleName
						});
					}
				}
				//game.dfreds.effectInterface.removeEffect({effectName : pEffectNames[i], uuid : pToken.actor.uuid, origin : cModuleName})
			}	
		}
		else {
			for (let i = 0; i < vEffects.length; i++) {
				let vName = vEffects[i].name;
				
				if (!vName) {
					vName = vEffects[i].label;
				}
				
				if (vEffects[i]?.parent?.effects.get(vEffects[i].id)) {
					if (game.user.isGM) {
						await pToken.actor.deleteEmbeddedDocuments("ActiveEffect", [vEffects[i].id], {[cModuleName + "delete"] : true})
					}
					else {
						await game.dfreds.effectInterface.removeEffect({
							effectName: vName,
							uuid : pToken.actor.uuid//,
							//origin : cModuleName
						});
					}
				}
				//game.dfreds.effectInterface.removeEffect({effectName : pEffectNames[i], uuid : pToken.actor.uuid, origin : cModuleName})
			}	
		}
	}
	
	static async FilterDFEffects(pNameIDs) {
		let vNameIDs = [];
		
		let vBuffer;
		
		if (game.release.generation < 12) {
			for (let i = 0; i < pNameIDs.length; i++) {
				vBuffer = game.dfreds.effects?._all.find(vEffect => vEffect.name == pNameIDs[i] /*|| vEffect.label == pNameIDs[i]*/);
				
				if (vBuffer) {
					vNameIDs.push(vBuffer);
				}
				else {
					vBuffer = game.dfreds.effects?._customEffectsHandler._findCustomEffectsItem()?.effects.get(pNameIDs[i]);
					
					if (!vBuffer) {
						vBuffer = game.dfreds.effects?._customEffectsHandler._findCustomEffectsItem()?.effects.find(v => v.name == pNameIDs[i]);
					}
					
					if (vBuffer) {
						vNameIDs.push(vBuffer);
					}
				}
			}
		}
		else {
			for (let i = 0; i < pNameIDs.length; i++) {
				vBuffer = await game.dfreds.effectInterface.findEffect({effectName : pNameIDs[i]});
				
				if (!vBuffer) {
					vBuffer = await game.dfreds.effectInterface.findEffect({effectId : pNameIDs[i]});
				}	
					
				if (!vBuffer) {
					vBuffer = await fromUuid(pNameIDs[i]);
				}
					
				if (vBuffer) {
					vNameIDs.push(vBuffer);
				}
			}
		}
		
		return vNameIDs;
	}
	
	//specific: chris premades
	static async AddCPREffects(pEffects, pToken) {
		await pToken.actor.createEmbeddedDocuments("ActiveEffect", pEffects, {keepId: true});
		
		for (let vEffect of pEffects) {
			let vAppliedEffect = pToken.actor.effects.find(vAE => vAE._source?._id == vEffect.id);
			
			if (vAppliedEffect) {
				await vAppliedEffect.setFlag(cModuleName, cPerceptiveEffectF, true);
				await vAppliedEffect.update({origin : cModuleName});
			}
		}
	}
	
	static FilterCPREffects(pNameIDs) {
		let vEffects = game.items.find(i => i.flags[cCPR]?.effectInterface).collections.effects;
		
		if (!vEffects) {
			return [];
		}
		
		vEffects = vEffects.filter(vEffect => pNameIDs.find(vNameID => vEffect.name == vNameID || vEffect.id == vNameID || vEffect.uuid == vNameID));
		
		/*
		for (let i = 0; i < vEffects.length; i++) {
			vEffects[i] = {...vEffects[i]};
		}
		*/
		return vEffects;
	}
	
	//specific: MATT
	static async MATTTriggerTile(pObject) {
		let vID = PerceptiveCompUtils.MATTTriggerTileID(pObject); //from MATT
		
		let vTile;
		
		if (vID) {
			vTile = await fromUuid(vID);
		}
		
		if (!vTile) {
			vTile = await pObject.parent.tiles.get(vID);
		}
		
		return vTile;
	}
	
	static MATTTriggerTileID(pObject) {
		let vID;
		
		if (pObject.documentName == "Tile") {
			return pObject.id;
		}
		
		if (PerceptiveCompUtils.isactiveModule(cLocknKey)) {
			if (pObject?.flags.hasOwnProperty(cModuleName)) {
				if (pObject?.flags[cLocknKey]) {
					vID = pObject?.flags[cLocknKey][cMATTTriggerTileF]; //from LnK
				}
			}
		}
		else {
			if (pObject?.flags.hasOwnProperty(cModuleName)) {
				if (pObject?.flags[cModuleName]) {
					vID = pObject?.flags[cModuleName][cMATTTriggerTileF]; //from Perceptive
				}
			}
		}
		
		if (vID) {
			return vID;
		}		
		
		vID = pObject?.flags[cMATT]?.entity?.id; //from MATT
		
		if (vID) {
			return vID;
		}		
		
		return "";
	}
	
	static setMATTTriggercondition(pObject, pType, pCondition) {
		if (pObject) {
			pObject.setFlag(cModuleName, cMATTTriggerConditionsF + "." + pType, pCondition);
		}
	}
	
	static MattTriggerCondition(pObject, pType) {
		let vTriggerCondition;
		
		let vFlags = pObject.flags[cModuleName];
		
		if (vFlags?.hasOwnProperty(cMATTTriggerConditionsF)) {
			vTriggerCondition = vFlags[cMATTTriggerConditionsF][pType];
		}
		
		if (cTConditions.includes(vTriggerCondition)) {
			return vTriggerCondition;
		}
		else {
			return cTCNever;
		}
	}
	
	static MATTTriggered(pObject, pInfos) {
		switch (PerceptiveCompUtils.MattTriggerCondition(pObject, pInfos.TriggerType)) {
			case cTCAlways:
				return true;
				break;
			case cTCactive:
				return !pInfos.PassivSpot;
				break;
			case cTCpassive:
				return pInfos.PassivSpot;
				break;
			case cTCNever:
			default:
				return false;
				break;
		}
	}
	
	//specific: wall-height & levels
	static WHLelevation(pObject) {
		if (PerceptiveCompUtils.isactiveModule(cWallHeight)) {
			if (pObject?.flags[cWallHeight]) {
				if (pObject.flags[cWallHeight].hasOwnProperty("top") || pObject.flags[cWallHeight].hasOwnProperty("bottom")) {
					if (isFinite(pObject.flags[cWallHeight].top) && isFinite(pObject.flags[cWallHeight].bottom)) {
						return (pObject.flags[cWallHeight].top + pObject.flags[cWallHeight].bottom)/2;
					}
					else {
						if (isFinite(pObject.flags[cWallHeight].top)) {
							return pObject.flags[cWallHeight].top;
						}
						
						if (isFinite(pObject.flags[cWallHeight].bottom)) {
							return pObject.flags[cWallHeight].bottom;
						}
					}
				}
			}
			
			if (pObject?.flags[cLevels]) {
				if (pObject.flags[cLevels].hasOwnProperty("top") || pObject.flags[cLevels].hasOwnProperty("bottom")) {
					if (isFinite(pObject.flags[cLevels].top) && isFinite(pObject.flags[cLevels].bottom)) {
						return (pObject.flags[cLevels].top + pObject.flags[cLevels].bottom)/2;
					}
					else {
						if (isFinite(pObject.flags[cLevels].top)) {
							return pObject.flags[cLevels].top;
						}
						
						if (isFinite(pObject.flags[cLevels].bottom)) {
							return pObject.flags[cLevels].bottom;
						}
					}
				}
			}
		}
	} 
	
	static LVLLOStest(pPoint) {
		let vtokens = canvas.tokens.controlled.filter(vtoken => vtoken.vision);
		
		if (!vtokens.length && !game.user.isGM && game.user.character) {
			vtokens.push(...canvas.tokens.placeables.filter(vtoken => vtoken.vision && vtoken.actor == game.user.character));
		}
		
		let vpoints = vtokens.map((vtoken) => {return {...vtoken.center, z : vtoken.losHeight}});
		
		if (game.user.isGM && !vpoints.length) {
			let vlosHeight = Infinity;
			if (CONFIG.Levels.UI.rangeEnabled) {
				vlosHeight = CONFIG.Levels.UI.range[1];
			}
			
			vpoints.push({...pPoint, z : vlosHeight})
		}
		
		return vpoints.some((vpoint) => {
			let collision = CONFIG.Levels.handlers.SightHandler.testCollision(vpoint, pPoint);
			
			if (!collision || (collision.x == pPoint.x && collision.y == pPoint.y && collision.z == pPoint.z)) return true;
		})
	}
	
	static WHLVLzmiddle(pObject) {
		if (!pObject) return;
		
		if (pObject.losHeight != undefined) {
			return pObject.losHeight;
		}
		
		let vdocument = pObject.document ?? pObject.wall?.document;
		
		if (vdocument) {
			let vmiddle;
			
			if (vdocument.flags[cWallHeight]) {
				vmiddle = (vdocument.flags[cWallHeight].bottom + vdocument.flags[cWallHeight].top)/2;
			}
			
			if (isNaN(vmiddle) && CONFIG.Levels) {
				let range = CONFIG.Levels.helpers.getRangeForDocument(vdocument);
				
				vmiddle = (range.rangeBottom + range.rangeTop)/2;
				
				if (isNaN(vmiddle) && range.rangeBottom != undefined && range.rangeTop != undefined) {
					vmiddle = 0;
				}
			}
			
			if (!isNaN(vmiddle)) {
				return vmiddle;
			}
		}
		
		return undefined;
	}
	
	//specific: Rideable
	/*
	static compatibilityName(pTile) {
		if (PerceptiveCompUtils.isactiveModule(cRideable)) {
			return pTile?.flags[cRideable]?.TileRideableNameFlag;
		}
		
		return false;
	}
	*/
	
	//Special TM
	static async CreateTMEffect(pEffectID, pColor, pTarget) {
		let vFilter = null;
		
		if (PerceptiveCompUtils.isactiveModule(cTokenMagic) && TokenMagic.filterTypes && pTarget?.mesh) {
			let vParams = { color: pColor };
			
			let vEffectClass = TokenMagic.filterTypes[pEffectID];
			
			if (vEffectClass) {
				let vDefaultPara = {};
				
				switch (pEffectID) {
					case "distortion" :
						vDefaultPara = {
							animated:
								{
									maskSpriteX: { active: true, speed: 0.05, animType: "move" },
									maskSpriteY: { active: true, speed: 0.07, animType: "move" }
								}	
						}		
						break;
					case "transform" :
						vDefaultPara = {
							twRadiusPercent: 70,
							padding: 10,
							animated:
							{
								twRotation:
								{
									animType: "sinOscillation",
									val1: -90,
									val2: +90,
									loopDuration: 5000,
								}
							}
						}
						break;
					case "fog" :
						vDefaultPara = {
							density: 0.65,
							time: 0,
							dimX: 1,
							dimY: 1,
							animated :
							{
								time : 
								{ 
									active: true, 
									speed: 2.2, 
									animType: "move" 
								}
							}
						}
						break;
					case "wave":
						vDefaultPara = {
							time: 0,
							strength: 0.03,
							frequency: 15,
							maxIntensity: 4.0,
							minIntensity: 0.5,
							padding:25,
							animated :
							{
								time : 
								{ 
									active: true, 
									speed: 0.0180,
									animType: "move",
								}
							}
						}
						break;	
					case "electric":
						vDefaultPara = {
							color: 0xFFFFFF,
							time: 0,
							blend: 1,
							intensity: 5,
							animated :
							{
								time : 
								{ 
									active: true, 
									speed: 0.0020, 
									animType: "move" 
								}
							}
						}
						break;
					case "fire":
						vDefaultPara = {
							intensity: 1,
							color: 0xFFFFFF,
							amplitude: 1,
							time: 0,
							blend: 2,
							fireBlend : 1,
							animated :
							{
								time : 
								{ 
									active: true, 
									speed: -0.0024, 
									animType: "move" 
								},
								intensity:
								{
									active:true,
									loopDuration: 15000,
									val1: 0.8,
									val2: 2,
									animType: "syncCosOscillation"
								},
								amplitude:
								{
									active:true,
									loopDuration: 4400,
									val1: 1,
									val2: 1.4,
									animType: "syncCosOscillation"
								}
							  
							}
						}
						break;
					case "smoke":
						vDefaultPara = {
							color: 0x50FFAA,
							time: 0,
							blend: 2,
							dimX: 1,
							dimY: 1,
							animated :
							{
								time : 
								{ 
									active: true, 
									speed: 0.0015, 
									animType: "move"
								}
							}
						}
						break;		
					case "shockwave":
						vDefaultPara = {
							time: 0,
							strength: 0.03,
							frequency: 15,
							maxIntensity: 4.0,
							minIntensity: 0.5,
							padding:25,
							animated :
							{
								time : 
								{ 
									active: true, 
									speed: 0.0180,
									animType: "move",
								}
							}
						}
						break;	
					case "flood":
						vDefaultPara = {
							time: 0,
							color: 0x0020BB,
							billowy: 0.43,
							tintIntensity: 0.72,
							glint: 0.31,
							scale: 70,
							padding: 10,
							animated :
							{
								time : 
								{ 
									active: true, 
									speed: 0.0006, 
									animType: "move"
								}
							}
						}
						break;
					case "fire":
						vDefaultPara = {
							intensity: 1,
							color: 0xFFFFFF,
							amplitude: 1,
							time: 0,
							blend: 2,
							fireBlend : 1,
							animated :
							{
								time : 
								{ 
									active: true, 
									speed: -0.0024, 
									animType: "move" 
								},
								intensity:
								{
									active:true,
									loopDuration: 15000,
									val1: 0.8,
									val2: 2,
									animType: "syncCosOscillation"
								},
								amplitude:
								{
									active:true,
									loopDuration: 4400,
									val1: 1,
									val2: 1.4,
									animType: "syncCosOscillation"
								}
							}
						}
						break;
					case "adjustment":
						vDefaultPara = {
							saturation: 1,
							brightness: 1,
							contrast: 1,
							gamma: 1,
							red: 0.2,
							green: 0.2,
							blue: 0.2,
							alpha: 1,
							animated:
							{
								alpha: 
								{ 
									active: true, 
								    loopDuration: 2000, 
								    animType: "syncCosOscillation",
								    val1: 0.35,
								    val2: 0.75 
								}
							}
						}
						break;
					case "ripples":
						vDefaultPara = {
							filterType: "ripples",
							color: 0xCC9000,
							time: 0,
							alphaDiscard: false,
							animated :
							{
								time : 
								{ 
									active: true, 
									speed: 0.0009, 
									animType: "move" 
								}
							}
						};
						break;
					case "blur":
						vDefaultPara = {
							padding: 10,
							quality: 4.0,
							blur: 0,
							blurX: 0,
							blurY: 0,
							animated:
							{
								blurX: 
								{ 
								   active: true, 
								   animType: "syncCosOscillation", 
								   loopDuration: 500, 
								   val1: 0, 
								   val2: 6
								},
								blurY: 
								{ 
								   active: true, 
								   animType: "syncCosOscillation", 
								   loopDuration: 750, 
								   val1: 0, 
								   val2: 6}
							}
						};
						break;
				}
				
				vParams = {...vDefaultPara, ...vParams};
				
				vFilter = new vEffectClass(vParams);
				
				vFilter.targetPlaceable = pTarget;
				
				vFilter.placeableImg = pTarget.mesh;
				
				vFilter.anime.puppet.enabled = true;
				
				
				//prevent animations from restarting on recreate
				vFilter.uniforms.__defineGetter__("time", () => {return canvas.app.ticker.lastTime});
				vFilter.uniforms.__defineSetter__("time", () => {});
				
				for (let key of Object.keys(vFilter.anime.elapsedTime)) {
					vFilter.anime.elapsedTime.__defineGetter__(key, () => {return canvas.app.ticker.lastTime});
					vFilter.anime.elapsedTime.__defineSetter__(key, () => {});
				}
				
				for (let key of Object.keys(vFilter.anime.elapsedTime)) {
					vFilter.anime.loopElapsedTime.__defineGetter__(key, () => {return canvas.app.ticker.lastTime});
					vFilter.anime.loopElapsedTime.__defineSetter__(key, () => {});
				}
				/*
				if (vFilter.anime.loopElapsedTime) {
					console.log(vFilter.anime);
					console.log(vFilter.anime.animated);
					console.log(vFilter.anime.animated.maskSpriteX);
					console.log(vFilter.anime.animated.maskSpriteX.loopDuration);
					vFilter.anime.loopElapsedTime.__defineGetter__("maskSpriteX", () => {return (canvas.app.ticker.lastTime % vFilter.anime.animated.maskSpriteY.loopDuration)});
					vFilter.anime.loopElapsedTime.__defineSetter__("maskSpriteX", () => {});
					vFilter.anime.loopElapsedTime.__defineGetter__("maskSpriteY", () => {return (canvas.app.ticker.lastTime % vFilter.anime.animated.maskSpriteY.loopDuration)});
					vFilter.anime.loopElapsedTime.__defineSetter__("maskSpriteY", () => {});
					vFilter.anime.elapsedTime.__defineGetter__("maskSpriteX", () => {return (canvas.app.ticker.lastTime)});
					vFilter.anime.elapsedTime.__defineSetter__("maskSpriteX", () => {});
					vFilter.anime.elapsedTime.__defineGetter__("maskSpriteY", () => {return (canvas.app.ticker.lastTime)});
					vFilter.anime.elapsedTime.__defineSetter__("maskSpriteY", () => {});
				}
				*/
			}
		}
		
		return vFilter;
	}
}

export { PerceptiveCompUtils };
