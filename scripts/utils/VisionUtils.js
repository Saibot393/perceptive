import {GeometricUtils} from "./GeometricUtils.js";
import { PerceptiveUtils, cModuleName } from "./PerceptiveUtils.js";
import { PerceptiveFlags } from "../helpers/PerceptiveFlags.js";
import { PerceptiveCompUtils, cVision5e, cLevels } from "../compatibility/PerceptiveCompUtils.js";
import {PerceptiveSystemUtils} from "./PerceptiveSystemUtils.js";

//const cTransparentalpha = 0.5;

const cDimInterval = [1/4, 3/4]; //Scene darkness values between which the scene is dim (lower is bright, higher is dark)

const cSpotConeAngle = 90; //in degrees

const cSTDTint = 16777215;

const cLightLevel = {
					Dark : 0,
					Dim : 1,
					Bright : 2
					};
					
const cVisionLevel = {
					 Normal : 0,
					 LowLight : 1,
					 Dark : 2,
					 TotalDark : 3
					 };
					 
export {cLightLevel, cVisionLevel};

class VisionUtils {
	//DECLARATIONS
	//support
	static spotablesinVision(pToken, pCategory = {Walls : true, Tokens : true, Tiles : true}) {} //returns spotables in tokens vision of specified categories
	
	static spotableDoorsinVision(pToken) {} //returns an array of walls that are spotable and within the vision of pToken
	
	static spotableTokensinVision(pToken) {} //returns an array of tokens that are spotable and within the vision of pToken
	
	static spotableTilesinVision(pToken) {} //returns an array of tiles that are spotable and within the vision of pToken
	
	static inVisionRange(pSpotters, pPosition, pRange, pConeRange, pConeRotation = 0, pTolerance = undefined, pInfos = undefined) {} //checks if pPosition is in pRange or pConeRange of one of pSpotters 
	
	static async PassivPerception(pToken) {} //returns the passive perception of pToken
	
	static MaketempVisible(pObjects) {} //makes pObjects visible until next vision refresh
	
	static async PrepareSpotables() {} //generates spotables and makes them pre visible
	
	static async PreapreSpotableToken(pToken) {} //generates pToken and makes them pre visible
	
	static async PreapreSpotableTile(pTile) {} //generates pTile and makes them pre visible
	
	static PrepareVCObjects() {} //generates VC objects and makes them pre visible
	
	static ResettoGMVision() {} //resets all object to standard gm vision
	
	static simpletestVisibility(ppoint, pInfos = {tolerance : 2, object : null}) {} //simple visibility test without vision mode check
	
	static WalltestVisibility(pWall, pInfos = {tolerance : 2, object : null}) {} //simple visibility test without vision mode check
	
	static VisionLevel(pToken) {} //returns the Vision level of pToken (special calc for Pf2e)
	
	static LightingLevel(pPoint, pScene = null) {} //returns the lightning level at a given point in a given scene (Dark = 0, Dim = 1, Bright = 2)
	
	static correctedLightLevel(pLightLevel, pVisionLevel) {} //returns pLightLevel with pVisionLevel(Normalsight = 0, Low-Light Vision = 1, Darkvision = 2, TotalDarkvision = 3)
	
	static LightingPDCModifier(pLightLevel) {} //returns the PDC modifier for pLightLevel
	
	static LightingPDCModifierToken(pToken, pVisionLevel = 0) {} //returns PDC modifier of pToken when viewed with pVisionLevel(Normalsight = 0, Low-Light Vision = 1, Darkvision = 2)
	
	static LightingAPDCBehaviour(pLightLevel, pVisionLevel = 0) {} //returns the APDC behaviour for pLightLevel (-1:disadvantage, 0:normal, 1:advantage)
	
	static LightingAPDCBehaviourToken(pToken, pVisionLevel = 0) {} //returns APDC behaviour of pToken when viewed with pVisionLevel(Normalsight = 0, Low-Light Vision = 1, Darkvision = 2)	
	
	static RangeDCModifier(pRangeInfo, pRangeInterval, pRangeDC) {} //return the range dependetn DC modifier (per complete pRangeInterval increase by pRangeDC)
	
	static objectelevation(pObject) {} //returns the elevation of pObject
	
	//IMPLEMENTATIONS
	static spotablesinVision(pToken, pCategory = {Walls : true, Tokens : true, Tiles : true}) {
		let vSpotables = [];
		
		if (pCategory.Walls) {
			vSpotables = vSpotables.concat(VisionUtils.spotableDoorsinVision(pToken));
		}
		
		if (pCategory.Tokens) {
			vSpotables = vSpotables.concat(VisionUtils.spotableTokensinVision(pToken));
		}
		
		if (pCategory.Tiles) {
			vSpotables = vSpotables.concat(VisionUtils.spotableTilesinVision(pToken));
		}
		
		return vSpotables;
	}
	
	static spotableDoorsinVision(pToken) {
		let vDoors = canvas.walls.doors;
		
		let vDoorsinRange = [];
		
		//let vRange = pToken.sight.range;
		
		let vinVision;
		
		for (let i = 0; i < vDoors.length; i++) {
			vinVision = false;
			
			if (PerceptiveFlags.canbeSpotted(vDoors[i].document)) {//partly modified from foundry.js
				/*
				const ray = vDoors[i].toRay();
				const [x, y] = vDoors[i].midpoint;
				const [dx, dy] = [-ray.dy, ray.dx];
				const t = 3 / (Math.abs(dx) + Math.abs(dy)); // Approximate with Manhattan distance for speed
				const points = [
				  {x: x + (t * dx), y: y + (t * dy)},
				  {x: x - (t * dx), y: y - (t * dy)}
				];
				*/
				
				// Test each point for visibility
				vinVision = VisionUtils.simpletestVisibility(vDoors[i].midpoint, {tolerance: 0, object: vDoors[i].doorControl, ray : true});
				/*
				vinVision = points.some(p => {
				  return canvas.effects.visibility.testVisibility(p, {tolerance : 0, object : {document : null}}) /*&& (Math.sqrt((p.x - pToken.x)**2 + (p.y - pToken.y)**2) < vRange)
				});		
				*/			
			}
			
			if (vinVision) {
				vDoorsinRange.push(vDoors[i]);
			}
		}
		
		return vDoorsinRange.map(vDoor => vDoor.document);
	}
	
	static spotableTokensinVision(pToken) {
		let vTokens = canvas.tokens.placeables;
		
		let vTokensinRange = [];
		
		let vinVision;
		
		for (let i = 0; i < vTokens.length; i++) {
			vinVision = false;
			
			if (PerceptiveFlags.canbeSpotted(vTokens[i].document)) {//partly modified from foundry.js
				// Clear the detection filter
				//vTokens[i].detectionFilter = undefined;

				// Some tokens are always visible
				//if ( !canvas.effects.visibility.tokenVision ) return true;
				//if ( vTokens[i].controlled ) return true;
				
				// Otherwise, test visibility against current sight polygons
				//if ( canvas.effects.visionSources.get(vTokens[i].sourceId)?.active ) return true;
				const tolerance = Math.min(vTokens[i].w, vTokens[i].h) / 4;
				vinVision = VisionUtils.simpletestVisibility(vTokens[i].center, {tolerance, object: vTokens[i]});
			}
			
			if (vinVision) {
				vTokensinRange.push(vTokens[i]);
			}
		}
		
		return vTokensinRange.map(vToken => vToken.document);
	}
	
	static spotableTilesinVision(pToken) {
		let vTiles = canvas.tiles.placeables;
		
		let vTilesinRange = [];
		
		let vinVision;
		
		for (let i = 0; i < vTiles.length; i++) {
			vinVision = false;
			
			if (PerceptiveFlags.canbeSpotted(vTiles[i].document)) {//partly modified from foundry.js
				// Clear the detection filter
				//vTokens[i].detectionFilter = undefined;

				// Some tokens are always visible
				//if ( !canvas.effects.visibility.tokenVision ) return true;
				//if ( vTokens[i].controlled ) return true;
				
				// Otherwise, test visibility against current sight polygons
				//if ( canvas.effects.visionSources.get(vTokens[i].sourceId)?.active ) return true;
				let tolerance;
				
				if (vTiles[i].mesh) {
					tolerance = Math.min(vTiles[i].mesh.width, vTiles[i].mesh.height) / 4;
				}
				else {
					tolerance = Math.min(vTiles[i].width, vTiles[i].height) / 4;
				}
				
				vinVision = VisionUtils.simpletestVisibility(vTiles[i].center, {tolerance, object: vTiles[i]});
			}
			
			if (vinVision) {
				vTilesinRange.push(vTiles[i]);
			}
		}
		
		return vTilesinRange.map(vTile => vTile.document);		
	}
	
	static inVisionRange(pSpotters, pPosition, pRange, pConeRange, pConeRotation = 0, pTolerance = undefined, pInfos = undefined) {
		if (pRange >= Infinity && !pInfos) {
			return true;
		}
		
		let vElevationScale = 1;
		
		if (pPosition.elevation != undefined) {
			vElevationScale = pSpotters[0]?.parent.dimensions.size/pSpotters[0]?.parent.dimensions.distance;
	    }
		
		return pSpotters.find((vSpotter) => {	//burst and cone range check	
												let vTotalTolerance = 0;
												
												if (pTolerance) {
													vTotalTolerance = Math.max(vSpotter.object.width, vSpotter.object.height) / 2;
													
													vTotalTolerance = vTotalTolerance + pTolerance.PointTolerance;
												}
												
												let vDistance;
												
												let vPosition = vSpotter.object.center;
												
												if (pInfos?.visionPoint) {
													vPosition = pInfos.visionPoint;
												}
												
												if ((pPosition.elevation != undefined) && (vSpotter.elevation != pPosition.elevation)) {
													vDistance = GeometricUtils.DistanceXYZ({...vPosition, elevation : vSpotter.elevation}, pPosition, vElevationScale);
												}
												else {
													vDistance = GeometricUtils.DistanceXY(vPosition, pPosition);
												}
												
												let vCalculatedDistance = vDistance - vTotalTolerance;
												
												if (pInfos) {
													pInfos.VisionDistance = vCalculatedDistance;
												}
												
												if((vCalculatedDistance) <= pRange) {
													//is in burst
													return true;
												}
												
												if ((vCalculatedDistance) <= pConeRange) {
													//is in cone range, check angle
													let vAngleDiff = GeometricUtils.NormalAngle(GeometricUtils.Differencefromxy(pPosition, vPosition)) - (vSpotter.rotation + pConeRotation)%360;
													
													return Math.min(Math.abs(vAngleDiff), Math.abs(vAngleDiff-360)) < cSpotConeAngle/2;
												}
												
												return false;});		
	}
	
	static async PassivPerception(pToken) {
		if (pToken && pToken.actor) {
			if (PerceptiveUtils.isPf2e()) {
				return await pToken.actor.system.perception?.dc;
			}
			else {
				let vRollData = {actor : pToken.actor};
				let vRollFormula = game.settings.get(cModuleName, "PassivePerceptionFormula");
				
				if (vRollFormula == "") {
					vRollFormula = PerceptiveSystemUtils.SystemdefaultPPformula();
				}
				
				let vRoll = new Roll(vRollFormula, vRollData);
				await vRoll.evaluate();
				return vRoll.total;
			}
		}
		
		return 0; //if anything fails
	}
	
	static MaketempVisible(pObjects) {
		for (let i = 0; i < pObjects.length; i++) {
			if ((pObjects[i].documentName == "Wall") && pObjects[i]._object?.doorControl) {
				pObjects[i]._object.doorControl.visible = true;
			}
			
			if ((pObjects[i].documentName == "Token") && !pObjects[i].object?.visible) {
				pObjects[i].object.visible = true;
				if (game.release.generation >= 12) pObjects[i].object.refresh();
				pObjects[i].object.mesh.alpha = game.settings.get(cModuleName, "SpottedTokenTransparency");
			}
			
			if ((pObjects[i].documentName == "Tile") && !pObjects[i].object?.visible) {
				pObjects[i].object.visible = true;
				if (game.release.generation >= 12) pObjects[i].object.refresh();
				if (pObjects[i].object.mesh) {
					pObjects[i].object.mesh.alpha = game.settings.get(cModuleName, "SpottedTokenTransparency");
				}
			}			
		}		
	}
	
	static async PrepareSpotables() {
		let vDoors = canvas.walls.doors;
		
		for (let i = 0; i < vDoors.length; i++) {
			//make sure all spotable doors have doorcontrols
			if (!vDoors[i].doorControl && PerceptiveFlags.canbeSpotted(vDoors[i].document)) {
				vDoors[i].doorControl = canvas.controls.doors.addChild(new DoorControl(vDoors[i]));
				vDoors[i].doorControl.draw();
				//vDoors[i].doorControl.visible = false;
			}
		}

		let vTokens = canvas.tokens.placeables;
		
		for (let i = 0; i < vTokens.length; i++) {
			if (vTokens[i].document.hidden && PerceptiveFlags.canbeSpotted(vTokens[i].document)) {
				//make token mesh half visible
				VisionUtils.PreapreSpotableToken(vTokens[i]);
			}
		}
		
		let vTiles = canvas.tiles.placeables;
		
		for (let i = 0; i < vTiles.length; i++) {
			if (vTiles[i].document.hidden && PerceptiveFlags.canbeSpotted(vTiles[i].document)) {
				//make token mesh half visible
				VisionUtils.PreapreSpotableTile(vTiles[i]);
			}
		}
	}
	
	static async PreapreSpotableToken(pToken) {
		if ((pToken.mesh.alpha < game.settings.get(cModuleName, "SpottedTokenTransparency")) || PerceptiveFlags.isPerceptiveStealthing(pToken.document)) {
			pToken.mesh.alpha = game.settings.get(cModuleName, "SpottedTokenTransparency");
		}
	}
	
	static async PreapreSpotableTile(pTile) {
		if (pTile.mesh?.alpha < game.settings.get(cModuleName, "SpottedTokenTransparency")) {
			pTile.mesh.alpha = game.settings.get(cModuleName, "SpottedTokenTransparency");
		}
		
		if (game.release.generation >= 12) {
			pTile.refresh();
		}
	}
	
	static PrepareVCObjects() {
		let vDoors = canvas.walls.doors;
		
		for (let i = 0; i < vDoors.length; i++) {
			//make sure all VC Doors have doorcontrols
			if (!vDoors[i].doorControl && PerceptiveFlags.hasVCEmitter(vDoors[i].document)) {
				vDoors[i].doorControl = canvas.controls.doors.addChild(new DoorControl(vDoors[i]));
				vDoors[i].doorControl.draw();
				//vDoors[i].doorControl.visible = false;
			}
		}		
	}
	
	static ResettoGMVision() {
		let vTiles = canvas.tiles.placeables;
		
		for (let i = 0; i < vTiles.length; i++) {
			if (!PerceptiveCompUtils.isactiveModule(cLevels)) {
				//Levels takes care of this, if active (leads to strange blink ins otherwise)
				vTiles[i].visible = true;
				if (game.release.generation >= 12) vTiles[i].refresh();
			}
			if (vTiles[i].mesh) {
				if (vTiles[i].document?.texture?.tint != undefined) {
					if (game.release.generation >= 12) {
						vTiles[i].mesh.tint = vTiles[i].document.texture.tint;
					}
					else {
						vTiles[i].mesh.tint = parseInt(vTiles[i].document.texture.tint.substr(1,7), 16);
					}
				}
				else {
					vTiles[i].mesh.tint = cSTDTint;
				}
			}
		}
		
		let vTokens = canvas.tokens.placeables;
		
		for (let i = 0; i < vTokens.length; i++) {
			if (vTokens[i].document?.texture?.tint != undefined) {
				let vTargetTint = vTokens[i].document.texture.tint;
				
				if (typeof vTargetTint == "string") {
					vTargetTint = parseInt(vTargetTint.substr(1,7), 16)
				}
				
				vTokens[i].mesh.tint = vTargetTint;
			}
			else {
				vTokens[i].mesh.tint = cSTDTint;
			}
			
			vTokens[i].detectionFilter = null;
		}	

		let vDoors = canvas.walls.doors;
		
		for (let i = 0; i < vDoors.length; i++) {
			vDoors[i].doorControl.icon.tint = cSTDTint;
		}			
	}
	
	static simpletestVisibility(ppoint, pInfos = {tolerance : 0, object : null, ray : false}) { //adapted from foundry.js
		// If no vision sources are present, the visibility is dependant of the type of user
		if ( !canvas.effects.visionSources.some(s => s.active) ) return game.user.isGM;

		// Prepare an array of test points depending on the requested tolerance
		let points = [];
		
		if (pInfos.ray && pInfos.object?.wall) {
			const wallobject = pInfos.object.wall;
			const ray = wallobject.toRay();
			const [x, y] = ppoint;
			const [dx, dy] = [-ray.dy, ray.dx];
			const t = 3 / (Math.abs(dx) + Math.abs(dy)); // Approximate with Manhattan distance for speed
			points = [
				{x: x + (t * dx), y: y + (t * dy)},
				{x: x - (t * dx), y: y - (t * dy)}
			];
		}
		else {
			const t = pInfos.tolerance;
			const offsets = t > 0 ? [[0, 0], [-t, -t], [-t, t], [t, t], [t, -t], [-t, 0], [t, 0], [0, -t], [0, t]] : [[0, 0]];
			points = offsets.map(o => new PIXI.Point(ppoint.x + o[0], ppoint.y + o[1]));
		}

		if (PerceptiveCompUtils.isactiveModule(cLevels)) {
			let vz = PerceptiveCompUtils.WHLVLzmiddle(pInfos.object);
			
			points = points.map(p => {
				return {x : p.x, y : p.y, z : vz};
			});
			
			return points.some(p => {
				return PerceptiveCompUtils.LVLLOStest(p);
			});
		}
		else {
			return points.some(p => {
				if (game.release.generation >= 12) {
					return canvas.visibility.testVisibility(p, {tolerance : 0, object : {document : null}});
				}
				else {
					return canvas.effects.visibility.testVisibility(p, {tolerance : 0, object : {document : null}});
				}
			});
		}
	}
	
	static WalltestVisibility(pWall, pInfos = {tolerance : 2, object : null}) {
		// If no vision sources are present, the visibility is dependant of the type of user
		const ray = pWall.toRay();
		const [x, y] = pWall.midpoint;
		const [dx, dy] = [-ray.dy, ray.dx];
		const t = 3 / (Math.abs(dx) + Math.abs(dy)); // Approximate with Manhattan distance for speed
		const points = [
		  {x: x + (t * dx), y: y + (t * dy)},
		  {x: x - (t * dx), y: y - (t * dy)}
		];
		
		// Test each point for visibility
		return points.some(p => {
			if (game.release.generation >= 12) {
				return canvas.visibility.testVisibility(p, {tolerance : 0, object : {document : null}});
			}
			else {
				return canvas.effects.visibility.testVisibility(p, {tolerance : 0, object : {document : null}}) /*&& (Math.sqrt((p.x - pToken.x)**2 + (p.y - pToken.y)**2) < vRange)*/;
			}
		});	
	}
	
	static VisionLevel(pToken) {
		let vVLevel = cVisionLevel.Normal;
		
		if (PerceptiveUtils.isPf2e() && pToken.actor?.system?.perception?.senses?.length) {
			let vsenses = pToken.actor.system.perception.senses;
			
			if (vsenses.find(vsense => (vsense.type == "darkvision") && (vsense.range > 0))) {
				vVLevel = cVisionLevel.TotalDark;
			}
			else {
				if (vsenses.find(vsense => (vsense.type == "lowLightVision") && (vsense.range > 0))) {
					vVLevel = cVisionLevel.LowLight;
				}				
			}
		}
		else {
			let vVisionMode;
			if (PerceptiveCompUtils.isactiveModule(cVision5e) && game.settings.get(cModuleName, "Vision5eIntegration")) {
				vVisionMode = pToken._source.sight.visionMode
			}
			else {
				vVisionMode = pToken.sight.visionMode;
			}
			
			switch (vVisionMode) {
				case "lightAmplification":
					vVLevel = cVisionLevel.LowLight;
				case "darkvision":
					vVLevel = cVisionLevel.Dark;
					break;
				case "blindsight":
				case "truesight":
				case "devilsSight":
					vVLevel = cVisionLevel.TotalDark;
					break;
			}
		}
		
		//document._source.sight.visionMode
		
		return vVLevel;
	}
	
	static LightingLevel(pPoint, pScene = null) {
		//start value Darkness
		let vLightningLevel = cLightLevel.Dark;
		
		let vScene = pScene;
		
		let v3Dcalc = pPoint.hasOwnProperty("elevation");
		let vElevationScale = 1;
		
		if (!vScene) {
			vScene = canvas.scene;
		}
		
		let vHasGlobalLight;
		
		if (game.release.generation < 12) {
			vHasGlobalLight = vScene.globalLight;
		}
		else {
			vHasGlobalLight = vScene.environment.globalLight.enabled;
		}
		
		let vLightCheck = true; //if non darkness lights need to be checked
		
		if (vScene) {
			let vDarkness = vScene.darkness;
			
			let vRegions = canvas.scene.regions.filter(vRegion => true);
			
			vRegions = vRegions.filter(vRegion => vRegion.object.testPoint(pPoint, pPoint.elevation)); //replace with token set
			
			let vBehaviours = [];
			
			vRegions.forEach(vRegion => {
				if (vRegion?.behaviors) {
					vBehaviours.push(...vRegion.behaviors.filter(vBehaviour => vBehaviour.active && vBehaviour.type == "adjustDarknessLevel"));
				}
			});
			
			const cModes = foundry.data.regionBehaviors.AdjustDarknessLevelRegionBehaviorType.MODES;

			vBehaviours.forEach(vBehaviour => {
				switch ( vBehaviour.system.mode ) {
					case cModes.OVERRIDE: vDarkness = vBehaviour.system.modifier;
					case cModes.BRIGHTEN: vDarkness = vDarkness * (1 - vBehaviour.system.modifier);
					case cModes.DARKEN: vDarkness = 1 - ((1 - vDarkness) * (1 - vBehaviour.system.modifier));
				}
			});
			
			if (vHasGlobalLight && (vDarkness < PerceptiveFlags.SceneBrightEnd(vScene))/*cDimInterval[0]*/) {
				vLightningLevel = cLightLevel.Bright;
				vLightCheck = false;
			}
			else {
				if (vHasGlobalLight && (vDarkness < PerceptiveFlags.SceneDimEnd(vScene))/*cDimInterval[1]*/) {
					vLightningLevel = cLightLevel.Dim;
				}
			}
			
			let vrelevantLightSources = vScene.lights.filter(vLight => !vLight.hidden).map(vLight => vLight._object?.source);
			
			vrelevantLightSources = vrelevantLightSources.concat(vScene.tokens.filter(vToken => vToken.object?.light?.active).map(vToken => vToken.object.light));
			
			if (vLightCheck || vrelevantLightSources.find(vLight => vLight.isDarkness)) {
				if (!vLightCheck) {
					vrelevantLightSources = vrelevantLightSources.filter(vLight => vLight.isDarkness);
				}
				
				vrelevantLightSources = vrelevantLightSources.filter(vLight => vLight?.shape?.contains(pPoint.x, pPoint.y));
				
				if (v3Dcalc) {
					vElevationScale = vScene.dimensions.size/vScene.dimensions.distance;
					
					vrelevantLightSources = vrelevantLightSources.filter(vLight => (vLight.elevation == pPoint.elevation) || (GeometricUtils.DistanceXYZ(pPoint, vLight, vElevationScale) < vLight.data.dim));
				}
				
				let vrelevantDarkSources = vrelevantLightSources.filter(vLight => vLight.isDarkness);
				
				vrelevantLightSources = vrelevantLightSources.filter(vLight => !vLight.isDarkness);
				
				if (vrelevantDarkSources.length) {
					vLightningLevel = cLightLevel.Dark;
				}
				else {
					if (vLightCheck && vrelevantLightSources.length > 0) {
						//at least Dim
						vLightningLevel = cLightLevel.Dim;
						
						if (v3Dcalc) {
							if (vrelevantLightSources.find(vLight => GeometricUtils.DistanceXYZ(pPoint, vLight, vElevationScale) < vLight.data.bright)) {
								//is Bright
								vLightningLevel = cLightLevel.Bright;
							}						
						}
						else {
							if (vrelevantLightSources.find(vLight => GeometricUtils.DistanceXY(pPoint, vLight) < vLight.data.bright)) {
								//is Bright
								vLightningLevel = cLightLevel.Bright;
							}
						}
					}
				}
			}
		}
		
		//zones
		
		
		return vLightningLevel;
	}
	
	static correctedLightLevel(pLightLevel, pVisionLevel) {
		let vValue = pLightLevel;
		
		if (vValue < 0) {
			return vValue;
		}
		
		switch (pVisionLevel) {
			case cVisionLevel.LowLight: //Pf2e rules
				if (vValue == cLightLevel.Dim) {
					vValue = cLightLevel.Bright;
				}
				break;
			case cVisionLevel.Dark: //D&D rules
				if (vValue < cLightLevel.Bright) {
					vValue = vValue + 1;
				}
				break;
			case cVisionLevel.TotalDark: //Pf2e rules
				if (vValue < cLightLevel.Bright) {
					vValue = cLightLevel.Bright;
				}
				break;
		}
		
		return vValue;
	}
	
	static LightingPDCModifier(pLightLevel) {
		if (pLightLevel < 0) {
			return 0;
		}
		
		let vModifier = game.settings.get(cModuleName, "IlluminationPDCModifier")[Math.max(0, pLightLevel-1)];
		
		return Number(vModifier);
	}
	
	static LightingPDCModifierToken(pToken, pVisionLevel = 0) {
		if (!game.settings.get(cModuleName, "IlluminationPDCModifier").find(vValue != 0)) {
			return 0;
		}
		else {
			return VisionUtils.LightingPDCModifier(VisionUtils.correctedLightLevel(VisionUtils.LightingLevel(pToken, pToken.parent), pVisionLevel));
		}
	}
	
	static LightingAPDCBehaviour(pLightLevel, pVisionLevel = 0) {
		let vBehaviour = game.settings.get(cModuleName, "IlluminationAPDCBehaviour")[Math.max(0, VisionUtils.correctedLightLevel(pLightLevel, pVisionLevel)-1)];
		
		return vBehaviour;		
	}
	
	static LightingAPDCBehaviourToken(pToken, pVisionLevel = 0) {
		return VisionUtils.LightingAPDCBehaviour(VisionUtils.correctedLightLevel(VisionUtils.LightingLevel(pToken, pToken.parent), pVisionLevel));
	}	
	
	static RangeDCModifier(pRangeInfo, pRangeInterval, pRangeDC) {
		if (pRangeInterval > 0 && pRangeDC != 0 && pRangeInfo.VisionDistance) {
			return Math.trunc(pRangeInfo.VisionDistance/pRangeInterval) * pRangeDC;
		}
		
		return 0;
	}
	
	static objectelevation(pObject) {
		let vElevation = PerceptiveCompUtils.WHLelevation(pObject);
		
		if (vElevation == undefined) {
			vElevation = pObject.elevation;
		}
		
		return vElevation;
	}
}

export { VisionUtils }