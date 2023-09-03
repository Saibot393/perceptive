# Perceptive

 A Foundry VTT module to add a few loosely related vision based features, currently implemented features are:

## Door lock peeking

Allows doors to be set a lock peekable. When a player ctrl+right-clicks a lock peekable door they can see through a small hole in the door until they ctrl+right-clicks it again or move out of the interaction distance. Only one lock can be peeked at a time.

### Settings:

#### World:
- Lock peekable by default: to set doors to be peekable by default
- Standard size of lock peeks: the default size of door lockpeeks
- Standard position of lock peeks: the default value for the Lock peek position
- Stop lock peeking on movement: to stop lock peeking even if the moving token is still within the interaction distance
#### Walls:
- Can be lock peeked: to make the door peekable
- Lock peek size: to set the doorlocks peek size (in parts of the door (0-1))
- Lock peek position to change the position of the lock gap (in parts of the door (0-1))

## Door moving

Allows doors to be incrementally opened in either a swinging or sliding motion. Players can use the mouse wheel on the door control to slowly open or close a door.

### Settings:

#### World:
- Door standard movement type: The standard movement type of doors
- Prevent normal open by default: to set the default value for the Prevent normal opening wall setting
- Door standard hinge position: The standard hinge positions of doors
- Standard swing speed: The standard swing speed of doors
- - Swing range: to limit the range in which this door can swing
- Standard slide speed: The standard slide speed of doors
#### Client:
- Move door controls: to move the door controls with the moving doors
- Fast door move factor: to set a speed factor when moving a wall with alt+mouse-wheel
#### Walls:
- Door movement type: The way the door can be move, can be set ton None(Standard Foundry door), Swing or Slide
- Prevent normal opening: to prevent this door from being opened with left-click if it is a moving door
- Door hinge position: Position of the doors hinge (left or right)
- Swing speed: The swing speed of the door in degrees°
- Swing range to limit the range in which this door can swing in degrees°
- Slide speed: The slide speed of the door in  parts of door size (0-1)

## Token following
Allow players to automatically follow selected tokens with the camera. Can also be toggled with a key bind.

### Settings:

#### Client:
- Follow tokens: to follow the selected tokens when they move

## Spot Invisible
Allows for player to either passively or actively spot secret doors and make them visible to other players by left clicking them. GMs can set seperate passiv and active DCs for spotting (or synch them).

### Settings:

#### World:
- Activate Spot Invisible feature: to activate/deactivate Spot Invisible feature
- Passive perception formula: to set the formula used for passive perception (if not automated)
- Perception key-word: to set the key word used to find perception rolls (if not automated)

#### Walls:
- Can be spotted: to activate the spotting feature on this wall
- Passive perception DC: to set the DC for passive perception (-1 for impossible)
- Active perception DC: to set the DC for actove perception (-1 for impossible, empty to synch with passive DC)

## General features:

### Settings:

#### World:
- Maximum Interaction Distance: to limit the distance over which players can interact with doors
- Show Perceptive walls [DEBUG]: to show the modules walls in the wall layer for debug purposes

### Compatibility:

The module should be compatible with all game systems and most modules on Foundry v11. If you encounter any bugs please [let me know](https://github.com/Saibot393/perceptive/issues).

#### Explicit compatability:
- [FoundryVTT Arms Reach](https://foundryvtt.com/packages/foundryvtt-arms-reach)/[Arms Reach](https://foundryvtt.com/packages/arms-reach):
  - Additional setting "Use Arms Reach distance": to use the "Arms Reach" distance instead of the set Interaction distance
- [Lock & Key](https://foundryvtt.com/packages/locknkey)
  - A "Peek lock" options will be shown on the lock interaction menu of Lock & Key

### Languages:

The module contains an English, and a German translation. If you want additional languages to be supported [let me know](https://github.com/Saibot393/perceptive/issues).

---

**If you have suggestions, questions, or requests for additional features please [let me know](https://github.com/Saibot393/perceptive/issues).**
