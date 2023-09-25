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
