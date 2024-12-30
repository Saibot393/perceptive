## v4.2.1
- removed left over console log

## v4.2.0
- Fixed bug with illumination level update
- Illumination level calculations now include darkness light sources
- Illumination level calculations now include zone darkness adjustments

## v4.1.8
- Updated Polish translation (thanks to [Lioheart](https://github.com/Lioheart))

## v4.1.7
- Fixed bug that could cause graphical token effects to be reset unintentional
- Added "Game paused" popup where applicable

## v4.1.6
- small api update

## v4.1.5
- small addition to api

## v4.1.4
- added file picker to several settings (thanks to [ChasarooniZ](https://github.com/ChasarooniZ))

## v4.1.3
- small bug fix

## v4.1.2
- small bug fix

## v4.1.1
- small bug fix

## v4.1.0
- Added compatibility with [Chris's Premades](https://foundryvtt.com/packages/chris-premades)
  - Adds the world setting "Chris's Premades integration" to use the effects managed by Chris's Premade
- Fixed bug that caused setting sheets to be displayed wrongly

## v4.0.9
- Small compatibility fixes and improvements

## v4.0.8
- Compatibility update for new DFreds CE

## v4.0.7
- Added Portuguese Brazil translation (thanks to [Andersants](https://github.com/Andersants))
- Small bug fixes

## v4.0.6
- Small bug fix for levels compatibility

## v4.0.5
- Small bug fix

## v4.0.4
- Small bug fixes
- Improved illumination calculation for v12

## v4.0.3
- Objects being spotted will no longer reset their stealth DCs

## v4.0.2
- Fixed bug that caused the passive perception to always be reset when rolling stealth

## v4.0.1
- Fixed libwrapper compatibility warning

## v4.0.0
- v12 compatibility

## v3.6.6
- Fixed bug that allowed players to see invisible tokens borders when hovering over them on scenes without token vision
  - The spotting feature is now effectively disabled while on a scene without token vision

## v3.6.5
- Updated Polish translation (thanks to [Lioheart](https://github.com/Lioheart))
  
## v3.6.4
- Improved perceptive effects recognition

## v3.6.3
- Added Polish translation (thanks to [Lioheart](https://github.com/Lioheart))

## v3.6.2
- Improved active effect synch

## v3.6.1
- Fix for [stealthy](https://foundryvtt.com/packages/stealthy) compatibility

## v3.6.0
- Updated Japanese translation (thanks to [doumoku](https://github.com/doumoku))
- Added macro "Remove lingering AP selected" to quickly eddit certain spot invisible settings of selected objects
- Added optional key to open settings of hovered door

## v3.5.10
- Improved swing range calculations

## v3.5.9
- Fixed synching error for module flags, affecting moveable door walls

## v3.5.8
- Restored compatibility with Stealthy (compatible with Stealthy v4.0.4 and upwards) (thanks to [Eligarf](https://github.com/Eligarf))

## v3.5.7
- Fixed bug that caused mistake with VC when levels was active

## v3.5.6
- Small fix concerning effects

## v3.5.5
- Fixed some bugs in regards to spotting pings and sounds
- Stealth checks that have a result below zero will now count as zero

## v3.5.4
- Fixed small bug connected to the token HUD perception DC inputs

## v3.5.3
- Possible fix for VC range bug

## v3.5.2
- Fixed bug that caused tiles to become visible even if not checked in the GM spotting confirmation menu

## v3.5.1
- Fixed small error that prevented 0 from being a valid stealth DC

## v3.5.0
- Added setting Follow on control to follow tokens the moment they are controlled
- Added setting Position of perception DC input to set the position of the perception DC input in the token HUD
- The lingering active perception indicator can now be used to change the lingering perception value
- Added vision channel option Minimum range to set the minimum range at which a VC becomes active
- Added vision channel option Receive default to set the vision channel as being received by default

## v3.4.3
- Small bug fix

## v3.4.2
- Fixed bug that prevented the "other dcs" menu from appearing
- Hid accidentally exposed setting

## v3.4.1
- Added explicit support for [Level Up: Advanced 5th Edition (Official)](https://foundryvtt.com/packages/a5e)

## v3.4.0
- Added [MATT](https://foundryvtt.com/packages/monks-active-tiles) actions:
    - Give vision channel to give a specified action chanel as a defined type to the target(s)
    - Remove vision channel to remove a specified action chanel as a defined type from the target(s)
    - Reset \"spotted by\" to reset the tokens list that has actively spotted this target
    - Set \"can be spotted\" to set the can be spotted setting to a specific value or toggle it

## v3.3.3
- Fixed levels related bug

## v3.3.2
- Small bug fix for levels compatibility

## v3.3.1
- Fixed bug with VC macros
- Improved VC updates

## v3.3.0
- Added options "in combat only" and "out of combat only" to "Make spotted tokens visible" and "Make allied tokens visible"
- Added setting Disable invisible MATT tiles to disable spottable invisible MATT Tiles
- Added object setting Reveal when spotted to make specific objects visible when spotted (overrides game settings when active)

## v3.2.3
- Small bug fix

## v3.2.2
- Improved levels compatibility
- Fixed some bugs
- Updated PF2e compatibility

## v3.2.1
- Bug fix and improvement for `isspottedby` api 

## v3.2.0
- Improved [Wall Height](https://foundryvtt.com/packages/wall-height) & [Levels](https://foundryvtt.com/packages/levels) compatibility (included LOS check)
- Spotted secret doors will no longer become normal doors when clicked
    - Added world setting "Make spotted door visible on click" to make spotted secret doors become normal doors on click
- Added world setting "Use logical OR mode" to use a logical OR for required vision channels instead of a logical AND

## v3.1.15
- Improved camera pan smoothness of "Follow tokens" feature

## v3.1.14
- Small bug fix to prevent spotting message spam
- Small bug fix to prevent moving door from being opened again when being closed by scrolling (and scrolling to fast)

## v3.1.13
- Fixed bug that caused additional walls to be created
- Added debug setting Recreate Perceptive walls on scene load

## v3.1.12
- Fixed visual bug that caused walls that were supossed to be hidden to show up on the wall layer ui when levels was active
- Improved performance on scene load when a large amount of moveable or peekable doors are placed

## v3.1.11
- Improved [Wall Height](https://foundryvtt.com/packages/wall-height) & [Levels](https://foundryvtt.com/packages/levels) compatibility
    - Wall Height and Tile level will now be included in 3D range calculations
    - Peekable and Movable doors will no longer cause "phantom" walls to appear above or below them
    - Door icons will no longer be displayed on the wrong level for GMs

## v3.1.10
- Walls accidentally created due to lag will now be automatically be removed on map load and walls will be preloaded to decrease the probability of walls being created due to lag
- Visible objects actively spotted for the first time will now trigger the spotted by features

## v3.1.9
- Fix to prevent lag related bugs with door moving

## v3.1.8
- Added missing translation
- Improved Lock peeking stability and fixed bugs

## v3.1.7
- Improved api function `isSpottedby`

## v3.1.6
- Reworked door moving logic to prevent flickering when opening a door (should also slightly improve performance)

## v3.1.5
- Fixed compatibility issue with [Levels module](https://foundryvtt.com/packages/levels)

## v3.1.4
- Fixed bug that caused errors when creating VCs via code

## v3.1.3
- Added compatibility with [Token Magic FX](https://foundryvtt.com/packages/tokenmagic/)
    - Several Token Magic FX effects are available as Vision Channel effect filters
    - Not all Token Magic FX filters are included yet, let me know if you have specific wishes (not all filters are compatible)

## v3.1.2
- Fixed bug that caused tile and tokens to be displayed with the wrong color tint

## v3.1.1
- Improved prototype compatibility

## v3.1.0
- Prototype token vision channel settings can now be set
- Added world VC option Range formula to set a calculation based range (formulas similar to roll formulas)
- Added token vc option Receiver filter to temporarily turn on/off a receiver VC (can be toggle via macro, see "Toggle VC receiver filter of selected Token" macro)
- Added token vc option Custom range to override the default and the calculated range for the VC
- Added token vc option Calculated range to see the result of the Range formula for this token

## v3.0.5
- Small bug fix

## v3.0.4
- Added missing translation for lock peeking checks

## v3.0.3
- Improved compatibility with [Alternative Token Visibility](https://foundryvtt.com/packages/tokenvisibility#:~:text=By%20measuring%20the%20precise%20token,they%20partially%20overlap%20a%20wall.), the Line of Sight Algorithm "Token area 3d" should now work correctly with perceptive

## v3.0.2
- Added icons for some macros

## v3.0.1
- Fixed small bug

## v3.0.0
- New Feature "Vision Channels" (VC)
    - Added world setting activate Vision Channels to use the new feature
    - Added world setting Open Vision Channels Menu to open the menu and edit the channels
        - Name: The name of this VC
        - Required to see: If this VC is required to see objects emitting on this VC
        - Through walls: If object with this VC can be seen through walls
        - Range: The range over which this VC emits (-1 for infinity)
        - Color: The tint of object seen through this VC
        - Effect Filter: The filter applied to tokens seen with this VC
        - Effect Filter Color: The color of the effect filter
        - Transparency: The transparency of objects seen with this VC (1 no transparency, 0 invisible)
    - Added world setting Simulate player vision to have the same vision a player controlling the tokens would have as a GM
    - Added world setting Vision Channel 3D range to calculate the vision channel range in 3D
    - Added world setting Show Vision Channel IDs to show the internal vision channel IDs in the Vision Channels menu
    - Added Token/Tile/Wall setting Open Vision Channels Menu
        - Emits: If this token/tile/door control Emits on the VC and can be seen with this channel
        - Receives: If this token/tile/door control Receives the VC and can see this channel
        - Sigth: If this wall can be seen through with this channel
        - Movement: If this wall can be moved through with this channel
    - Added a few example macros for vision channels to demo the api
    - Active effects can be used to give tokens channels (both as receiver/emitter), see example macro `Generate AE attribute key by Name` for further information
- Improvements to Token following feature
    - The camera will now pan whenever a new token is selected

## v2.9.4
- Added world setting Range 3D calculation to calculate the vision range in 3D
- Do under no circumstances enter `game.settings.set("perceptive", "ActivateVCs", true)` into the console to activate a prerelase version of the next Perceptive feature

## v2.9.3
- Fixed bug that caused DC to be calculated wrongly

## v2.9.2
- Fixed bug that cause the spotting of tiles to sometimes triggers multiple times

## v2.9.1
- Small ui bug fix for removed lingering ap chat message

## v2.9.0
- Lock peeking feature:
    -  Added world setting GM confrims peeks to set wether a GM has to confirm lock peeking actions
    -  Added world setting Peeking formula to set the formula used when peeking a lock with a peeking DC
    -  Added world setting Peekind default DC to set the default DC used for new peeking doors
    -  Added wall setting Peeking DC to set the DC for peeking through this lock
-  Spotting feature:
    -  Added world setting Illumnation 3D calculation to set wether the illumination should be calculated in 3D (with elevation)
    -  Added world setting Spotted sound volume to set the volume of the custom spotted sound
    -  Added a test button for the custom spotted sound
    -  Added world setting Spotter ping Image to set an image with which tokens that spot an object are pinged
    -  Added world setting Spotter ping duration to set the duration the Spotter ping Image show up for
    -  Added token/tile/wall setting Spotting Message to set a chat message displayed for tokens that spot this object
    -  Added example macro to ping with a custom image
-  Moved the Use Pf2e rules to general settings, since it now also affects the peeking feature

## v2.8.3
- Fixed bug that sometimes cuased empty messages to be displayed when character with lingering active perception entered combat
- Improved MATT actions and filter text

## v2.8.2
- Illumination calculations now correctly consider token lights

## v2.8.1
- Fixed ui bug caused by minimizing the object settings window

## v2.8.0
- Added world setting Range perception DC modifier to set a spotting DC modifer per range increment (DCIncrement/RangeIncrement)
- Added world setting Spotted Sound for a sound to be played, should a controlled  token be spotted
- Added client setting Notify on lingering AP removal to notify the user when a lingering active perception is removed from an owned token
- The lingering active perception will now be removed at the start of cambat should Active perception lingers be set to out of combat
- Added object setting Spotting Range to set a specific range in which this object can be spotted
- Improved spottables visibility on innitial render

## v2.7.3
- Fixed MATT ui bug

## v2.7.2
- Small tile settings ui fix
- Fixed MATT action Spot object ui

## v2.7.1
- Fixed a few typos and ui bugs
- No longer sprinkles tokens with fine particles
- The perceptive stealthing "effect" is no longer considered experimental (i received no bug reports so...)
- The wall settings tab will no longer disappear when reopening the settings by double clicking a wall again

## v2.7.0
- Added active effects modifiers:
  - The attribute key `flags.perceptive.Modifiers.perception.MOD.#ObjectType.#CheckType` can be used to add modifiers to certain checks
  - The attribute key `flags.perceptive.Modifiers.perception.BEH.#ObjectType.#CheckType` can be used to alter the roll behaviour for certain checks
    -  advantage: +1, normal: 0, disadvantage: -1
    -  This attribute is additive with other advantage/disadvantage sources (use e.g. +2 to force advantage)
  -  Valid `#ObjectType` values: Wall,Token,Tile
  -  Valid `#CheckType` values: active, passive(`MOD` only), all other skill abreviations as per the "Other active skill DCs" menu
- Added custom actions for MATT:
  - Added action Spot object to spot specified objects
  - Added filter Filter objects spotted by to filter objects (not) spotted by specified tokens
  - Added filter Filter tokens having spotted to filter tokens (not) having spotted a specified token 

## v2.6.7
- Small ui fix for tile settings

## v2.6.6
- Added Reset "spotted by" button to sheet settings

## v2.6.5
- Micro fix for previous  fix

## v2.6.4
- Fixed a stupid bug

## v2.6.3
- A console debug mode for the spotting feature can now be accessed with `CONFIG.debug.perceptive.SpottingScript = true`

## v2.6.2
- Small UI bug fix for MATT trigger settings
- Small translation improvement for MATT trigger settings

## v2.6.1
- Some small improvements to lingering active perception
- Added missing popup texts
- Added world setting GM recives info messages to enabled whispered informations regarding player spotting

## v2.6.0
- Added world setting Lingering active perception radius to limit the range in which the active perception remains
- Added world setting Lingering active perception duration to limit the duration for which the active perception remains
- Added popups for gained and removed lingering active perception
- Added macros to remove lingering active perception from selected tokens or scene wide
- Added compatibility with [Monk's Active Tile Triggers](https://foundryvtt.com/packages/monks-active-tiles)
  - Adds additional Perceptive related trigger for spottable objects (adds a new triggers tab to spottable tokens)
  - Adds a textbox to enter the tile which should be triggered for spottable tokens
  - The following landings can be optionally used to differentiate between the different Perceptive trigger conditions: `PassiveSpot`, `ActiveSpot`

## v2.5.0
- Tiles are now compatible with the Spot Invisible feature
- Added tile setting Tile name to set the displayed name of this tile for e.g. dialogs
- Added missing client setting Position of active perception indicator to set the position of the indicator for the lingering active perception

## v2.4.2
- Small bug fix in cases where tokens do not have valid actors

## v2.4.1
- Added "out of combat only" option to the Apply ranges setting

## v2.4.0
- Added world setting Make allied tokens visible to set wether allied tokens should be made visible when spotted
- Added token/wall setting menu Other active skill DCs to set the active spotting DCs when using skills other then perception (currently only works with D&D5e, Pf2e, and Pf1e)

## v2.3.0
- Added macro Request spotting to allow players to request spottables in vision without a roll
- Added a bunch of api function to filter spottables in range, get illuminations informations and interface with the perceptive stealthing effect

## v2.2.1
- Small bug fix regarding illumination advantage/disadvantage

## v2.2.0
- Improved door moving
- Improved advantage/disadvantage calculation
- Added client setting Message popups to enable certain popups for Lock peek and Door moving interactions

## v2.1.3
- Added world setting Show failures in GM confirm dialog to show tokens against which the perception roll failed as unchecked entries in the confirm dialog

## v2.1.2
- Added Japanese translation (thanks to [doumoku](https://github.com/doumoku))

## v2.1.1
- Added support for active effects
  - Active effects can now be used to modify the light level dependent perception dcs
    - Use this syntax flags.perceptive.Modifiers.PDC.Illumination.{#LightLevel} for this modifier (#LightLevel is 0 for dark, 1 for dim and 2 for bright)

## v2.1.0
- The control key for lockpeeking a door when rightclicking and for moving a door with the mouse wheel (including fast move) can now be set per client

## v2.0.8
- Fixed moving door scrolls bug with [Zoom/Pan Options](https://foundryvtt.com/packages/zoom-pan-options) module that caused the canvas to scroll, even when a door control was hovered
  - Activate [libWrapper](https://foundryvtt.com/packages/lib-wrapper) to activate this fix

## v2.0.7
- Added new Macro for PF2e to use a template when seeking within a cone

## v2.0.6
- Added world setting Standard vision direction to set in which direction vision cones are applied

## v2.0.5
- Small fix to cone range calculation

## v2.0.4
- Fixed bug in cone range calculation
- Fixed typo in Seek: 30-Foot Cone macro
- Added option in combat only to the Apply ranges setting

## v2.0.3
- Replaced setting Perception only with Macros with more detailed setting Perception macro use behaviour
- Fixed small error in Pf2e Seek (unlimited Range) macro

## v2.0.2
- Changed passive perception formula for D&D5e (new Formula : @actor.system.skills.prc.passive)
  - The used formula can be reset to the systems default by setting it to ""

## v2.0.1
- Fixed compatibility bugs with Levels (thanks to [araburguiere](https://github.com/taraburguiere))

## v2.0.0
- Reordered most spotting settings into collapsible subgroups to bring order to this mess
- Changed the GM confirm Spotting setting to  choose when the confirm dialog should show up: never, for players, always
- Changes to Use Pf2e rules:
  - The active perception DC of compatible tokens (Characters, NPCs, Familairs) will now be locked and updated automatically
  - The passive perception DC will be calculated as a skill check for compatible tokens (Characters, NPCs, Familairs)
  - Undetected will only be removed on a critical failure/success and be replaced with hidden otherwise
  - Hidden can be removed with active perception checks
- When Make spotted tokens visible is checked Perceptive will now also remove the core foundry invisibility from spotted tokens
- Added world setting Crit system to choose how crits are calculated for perception checks
- Added world setting Active perception lingers to continue using the active perception until manually removed in the token HUD
- Added world setting Apply Ranges to set when the set ranges should be applied
- Added world setting Border to border distance to calculate the spotting distance based on token borders instead of the center
- Added world setting Crit system to set how crits are calculated
- Added world setting Perception only with Marcos[Pf2e only] to limit perception checks to those made with the included macros
- Added hooks for active perception checks and newly visible objects

## v1.9.7
- small bug fixes
- added api for "isSpottedby"

## v1.9.6
- Fixed potential compatibility issue with Walled Templates

## v1.9.5
- Fixed bug when calculating the lighting level while global illumination was disabled

## v1.9.4
- Fixed a few bugs with the spotting range
- Added world setting Spotting cone range to set an additional cone shaped spotting range infront of tokens

## v1.9.3
- The tab bar of token settings should be less likely to overflow when multiple modules add tabs

## v1.9.2
- Fixed a bug that prevented secret doors from being actively spotted when a spotting range was set

## v1.9.1
- Added world setting Spotting range to limit the range in which tokens and doors can be spotted

## v1.9.0
- Added wold setting Use Pf2e rules to activate Pf2e specific behaviour
  - Differentiates between hiding and sneaking, using the appropiate Pf2e macros (keys will be added in a later version of this module later)
  - Adds different effects, either hidden for hide or undetected for sneaking
  - The active perception DC will be calculated with this formula: stealth modifier + 10
  - Allows for the world setting Auto reroll sneaking stealth dc to be activated
    - The passive perception DC will be rerolled when a sneaking token moves
    - Allows the passive perception DC to be locked per token, preventing it from being rerolled
- Added world setting Split interactions distances to set different interactions distances for lock peeking and door moving
  - Allows for world setting Lock peeking distance to be set to limit the distance over which players can peek locks
  - Allows for world setting Door moving distance to be set to limit the distance over which players can move doors

## v1.8.4
- Fixed bug that hid hidden doors from GMs

## v1.8.3
- Fixed several bugs in regards to pinging of newly spotted objects and reporting the result of perception checks
- Improved simulated player vision, hidden doors should now be correctly hidden
- Perceptive wall should now be hidden the moment they are created (unless the DEBUG option is turned on)

## v1.8.2
- Fixed a bug that could occur when "init" is called twice

## v1.8.1
- Fixed compatibility issue with Stealthy

## v1.8.0
- Added world setting Perceptive stealthing friendlies visible to allow friendly tokens that use Perceptives stealth to still be visible
- Added world setting Sync Perceptive stealth removel to automatically remove applied stealth effects when Perceptives stealth effect is removed and vice versa
- Added client setting Show perception results to show the result of own perception rolls in the chat

## v1.7.5
- Fixed compatibility issue with Levels thanks to help from [theripper93](https://github.com/theripper93) (requires Levels v.4.2.2 or higher)

## v1.7.4
- Added world setting Use Illumination perception DC modifiers for active perception to enable the set modifiers ofr perception rolls
- Added world setting Illumination perception behaviour to set advantage or disadvantage for active perception rolls dependent on illumination
- Improved confirm spotting ui to include used roll behaviour per token

## v1.7.3
- Added Chinese translation (thanks to Thousand (_thousand @Discord))

## v1.7.2
- Added world setting Atomate token Can be spotted to automatically manage the Can be spotted token setting
- Added client setting Stealthed token transparency to change the transparency of spotted tokens
- Added integration with Stealthy
  - Added world setting Stealthy integration to synch the stealth DCs between Stealthy and Perceptive

## v1.7.1
- Small ui improvement
- Fixed bug that prevented hidden doors from being actively spotted

## v1.7.0
- Spot Invisible improvements:
  - A few general improvements
  - Added ping for passively spotted object
  - Added world setting Reveal spotted tokens to make spotted tokens visible
  - Spottables tokens and door controls should now be correctly calculated the moment a token is selected or a scene is loaded
  - Added [EXPERIMENTAL!] custom stealth "effect" that is not directly affected by any vision calculation other than perceptive
    - Added world setting [EXPERIMENTAL!] Use Perceptive stealth to activate this feature
    - Added custom "effect" to the effect panel
    - Added token setting Is Perceptive stealthing to enable or disable the Perceptive stealth effect
    - This is not an effect in the conventional sense and only imitates the way an effects works
    - The ui is unfinished/buggy and may not always work correctly
    - There may be bugs where tokens remain invisible

## v1.6.2
- Improved some UI in the wall sheet settings
- Spot Invisible improvements:
  - Added scene setting Bright illumination limit to set the value below which the scene darkness is considered bright
  - Added scene setting Dim illumination limit to set the value below which the scene darkness is considered dim

## v1.6.1
- Fixed a bug where tokens spotted by the GM only appear after moving the spotting token
- The illumination indicator will now be displayed for all tokens, even non spottables

## v1.6.0
- Spot Invisible improvements:
  - The "spotted by" list should now correctly reset when a new stealth check is rolled
  - Added key Remove selected tokens stealth to reset the stealh values of the selected tokens
  - Added world setting GM confirm Spotting to open a dialog for the GM when a player rolls a perception check to conform which tokens are spotted
  - Added client setting Position of illumination indicator to show a indicator for the current illumination level in the token HUD
  - Added client setting Spotting ping duration to ping new objects that are spotted with an active roll for a certain duration
  - Added the vision modes "blindsight", "truesight" and "devilssight" as "Darikvsion (Total)" Vision levels 

## v1.5.3
- Bug fix regarding DFreds CE

## v1.5.2
- Added world setting Force invert "Ignore Roll" key to invert the key for all players and remove the client setting

## v1.5.1
- Added client setting Invert "Ignore Roll" key to only recognise rolls WHEN they key is pressed

## v1.5.0
- Spot Invisible improvements:
  - Added key to ignore stealth and perception checks
  - Added world setting Player perspective to allow GMs to only spot tokens players can spot
  - Added world setting Illumination perception DC modifiers to add a perception DC modifier based on the light level of a token
  - Added world setting Apply system stealth effect(s) to automatically apply the systems stealth effects
  - Added world setting Custom stealth effects to automatically apply custom stealth effects
  - Added token setting Stealth effects to add additional stealth effects to this token
  - Added token setting Override world stealth effects to override the worlds stealth effects with this tokens custom stealth effects
  - Added spotting info to spotable objects setting sheet, containing (if applicable):
    - Calculated passive perception: The passive perception of this token calculated according to the set formula
    - Spotted by: A list of token names (or IDs) this token has been spotted by
    - Illumination perception DC modifier: A light level based modifier added or subtracted from this tokens set perception DCs
    - Vision level: This tokens set vision level:
      - Basic sight: Normal behaviour
      - Low-light vision: Can see tokens in dim-light as if they were in bright light
      - Darkvision: Can see tokens in darkness as if they were in dim light and in dim light as if they were in bright light
      - Darkvision (total): Can se all tokens (even those in darkness) as if they were in bright light
  - Added DFreds Convenient Effects integration:
    - Allow stealth effects to be applied
  - Added Vision 5e integration:
    - Adds the world setting Vision 5e Integration to add additional system stealth effects and correctly register the set token vision level
    
## v1.4.2
- Fixed bug with arms reach integration

## v1.4.1
- small visual bug fix for spotable tokens

## v1.4.0
- Small bug fixes regarding lock peeking
- Tokens can now be spotted
  - Added world setting Stealth key-word to set the key word used to find stealth rolls (if not automated)
  - Added world setting Auto stealth behaviour to set which perception DC values should be set when a stealth roll is detected
  - Added world setting Reset spotted on token movement by default to reset the spotters of moving tokens
  - Added spotting related wall settings to tokens (seperate tab)
    - Added token setting Reset spotted on token movement to reset spotters of this token on movement

## v1.3.2
- Added api for compatibility

## v1.3.1
- Small bug fix

## v1.3.0
- Several small bug fixes and improvements
- Added Spot Invisible feature:
  - added World setting Activate Spot Invisible feature to activate/deactivate Spot Invisible feature
  - added World setting Passive perception formula to set the formula used for passive perception (if not automated)
  - added World setting Perception key-word to set the key word used to find perception rolls (if not automated)
  - added Wall setting Can be spotted to activate the Spot Invisible feature on this wall
  - added Wall setting Passive perception DC to set the DC for passive perception (-1 for impossible)
  - added Wall setting Active perception DC to set the DC for actove perception (-1 for impossible, empty to synch with passive DC)

## v1.2.4
- Small bug fix

## v1.2.3
- Small compatibility fix

## v1.2.2
- Fixed compatibility issue with drag-ruler

## v1.2.1
- Fixed bug that caused Token following not to work

## v1.2.0
- Added settings tab for walls settings
- General improvements regarding compatibility and bug prevention
- routing lib should now work correctly with peekable doors
- New feature: Token following
  - Added client setting Follow tokens to follow the selected tokens when thy move
  - Added control key to toggle Follow tokens setting
- Door peeking
  - Added wall setting Lock peek position to change the position of the lock gap
  - Added world setting Standard position of lock peeks to set the default value for the Lock peek position
- Door moving
  - Door controlls will no longer be hidden by their swinging door
  - Added center as hinge position option
  - Added wall setting Prevent normal opening to prevent this door from being opened with left-click if it is a moving door
  - Added wall setting Swing range to limit the range in which this door can swing
  - Added world setting Prevent normal open by default to set the default value for the Prevent normal opening wall setting
  - Added world setting Standard swing range to set the default value for the Swing range wall setting
  - Added client setting Move door controls to move the door controls with the moving doors
  - Added client setting Fast door move factor to set a speed factor when moving a wall with alt+mouse-wheel

## v1.1.0
- Added setting Maximum Interaction Distance to limit the distance over which players can interact with doors
- Added support for the [FoundryVTT Arms Reach](https://foundryvtt.com/packages/foundryvtt-arms-reach)/[Arms Reach](https://foundryvtt.com/packages/arms-reach) module
  - Additional setting "Use Arms Reach distance" to use the "Arms Reach" distance instead of the set Interaction distance
- Added key control support for peeking and moving locks
- Added Integration with the [Lock & Key](https://foundryvtt.com/packages/locknkey) module
  - A "Peek lock" options will be shown on the lock interaction menu of Lock & Key
- Added setting Stop lock peeking on movement to stop lock peeking even if the moving token is still within the interaction distance

## v1.0.0
- First release on Foundry
  - Added Lock peeking
  - Added Door moving
