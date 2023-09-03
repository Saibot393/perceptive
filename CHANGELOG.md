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
