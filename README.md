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
- Swing range: to limit the range in which this door can swing
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
Allows for player to either passively or actively spot secret doors and hidden tokens and make secret doors visible to other players by left clicking them. GMs can set seperate passiv and active DCs for spotting (or synch them).

### Settings:

#### World:
- Activate Spot Invisible feature: to activate/deactivate Spot Invisible feature
- Use Pf2e rules[Pf2e only]: to activate Pf2e specific behaviour
  - Differentiates between hiding and sneaking, using the appropiate Pf2e macros
  - Allows for the world setting Auto reroll sneaking stealth dc to be activated
    - Allows for the token setting Lock passive perception DC to be set to prevent it from being rerolled
- Automate token Can be spotted: to automatically manage the Can be spotted token setting
- Player perspective: to allow GMs to only spot tokens players can spot
- Passive perception formula: to set the formula used for passive perception (if not automated)
- Perception key-word: to set the key word used to find perception rolls (if not automated) (a key can be set to not autodetect rolls)
- Stealth key-word: to set the key word used to find stealth rolls (if not automated) (a key can be set to not autodetect rolls)
- Auto stealth behaviour: to set which perception DC values should be set when a stealth roll is detected
- Apply system stealth effect(s): to automatically apply the systems stealth effects
- [EXPERIMENTAL!] Use Perceptive stealth: to activate this feature
- Perceptive stealthing friendlies visible to allow friendly tokens that use Perceptives stealth to still be visible
- Sync Perceptive stealth removel to automatically remove applied stealth effects when Perceptives stealth effect is removed and vice versa 
- Custom stealth effects: to automatically apply custom stealth effects
- Reset spotted on token movement by default: to reset the spotters of moving tokens
- Illumination perception DC modifiers: to add a perception DC modifier based on the light level of a token
- Use Illumination perception DC modifiers for active perception: to enable the set modifiers ofr perception rolls
- Illumination perception behaviour: to set advantage or disadvantage for active perception rolls dependent on illumination
- GM confirm Spotting: to open a dialog for the GM when a player rolls a perception check to conform which tokens are spotted
- Reveal spotted tokens: to make spotted tokens visible to everyone
- Force invert "Ignore Roll" key: to invert the key for all players and remove the client setting

#### Walls/Tokens:
- Can be spotted: to activate the spotting feature on this wall
- Passive perception DC: to set the DC for passive perception (-1 for impossible)
- Active perception DC: to set the DC for actove perception (-1 for impossible, empty to synch with passive DC)
- Reset spotted on token movement[Tokens only]: to reset spotters of this token on movement
- Stealth effects[Tokens only]: to add additional stealth effects to this token
- Override world stealth effects[Tokens only]: to override the worlds stealth effects with this tokens custom stealth effects
 
The following informations will be displayed in the settings (if applicable):
 - Calculated passive perception: The passive perception of this token calculated according to the set formula
 - Spotted by: A list of token names (or IDs) this token has been spotted by
 - Illumination perception DC modifier: A light level based modifier added or subtracted from this tokens set perception DCs
 - Vision level: This tokens set vision level:
   - Basic sight: Normal behaviour
   - Low-light vision: Can see tokens in dim-light as if they were in bright light
   - Darkvision: Can see tokens in darkness as if they were in dim light and in dim light as if they were in bright light
   - Darkvision (total): Can se all tokens (even those in darkness) as if they were in bright light
  
#### Scene:
 - Bright illumination limit: to set the value below which the scene darkness is considered bright
 - Dim illumination limit: to set the value below which the scene darkness is considered dim
  
#### Client
- Invert "Ignore Roll" key: to only recognise rolls WHEN they key is pressed
- Position of illumination indicator: to show a indicator for the current illumination level in the token HUD
- Spotting ping duration: to ping new objects that are spotted with an active roll for a certain duration
- Show perception results: to show the result of own perception rolls in the chat
- Stealthed token transparency: to change the transparency of spotted tokens

## General features:

### Settings:

#### World:
- Maximum Interaction Distance: to limit the distance over which players can interact with doors
- Show Perceptive walls [DEBUG]: to show the modules walls in the wall layer for debug purposes
- Split interactions distances: to set different interactions distances for lock peeking and door moving
  - Allows for Lock peeking world setting Lock peeking distance to be set to limit the distance over which players can peek locks
  - Allows for Door moving world setting Door moving distance to be set to limit the distance over which players can move doors

### Compatibility:

The module should be compatible with all game systems and most modules on Foundry v11. If you encounter any bugs please [let me know](https://github.com/Saibot393/perceptive/issues).

#### Explicit compatability:
- [FoundryVTT Arms Reach](https://foundryvtt.com/packages/foundryvtt-arms-reach)/[Arms Reach](https://foundryvtt.com/packages/arms-reach):
  - Additional setting "Use Arms Reach distance": to use the "Arms Reach" distance instead of the set Interaction distance
- [Lock & Key](https://foundryvtt.com/packages/locknkey)
  - A "Peek lock" options will be shown on the lock interaction menu of Lock & Key
- [DFreds Convenient Effects](https://foundryvtt.com/packages/dfreds-convenient-effects)
  - Additional setting "DFreds Convenient Effects Integration" to enable stealth effects
- [Vision 5e](https://foundryvtt.com/packages/vision-5e)
  - Additional setting "Vision 5e Integration" to apply additional stealth effects and detect the vision type set by Vision 5e
- [Stealthy](https://foundryvtt.com/packages/stealthy)
  - Addtional setting "Stealthy integration" to synch the stealth DCs between Stealthy and Perceptive

### Languages:

The module contains an English, a German and a Chinese (thanks to Thousand (_thousand@Discord)) translation. If you want additional languages to be supported [let me know](https://github.com/Saibot393/perceptive/issues).

---

**If you have suggestions, questions, or requests for additional features please [let me know](https://github.com/Saibot393/perceptive/issues).**
