# Perceptive

 A Foundry VTT module to add a few loosely related vision based features. 
 
 A tutorial for some of the features can be found [here](https://www.youtube.com/watch?v=NZwZUu-Sczk).
 
 Currently implemented features are:

## Door lock peeking

Allows doors to be set a lock peekable. When a player ctrl+right-clicks a lock peekable door they can see through a small hole in the door until they ctrl+right-clicks it again or move out of the interaction distance. Only one lock can be peeked at a time.

### Settings:

#### World:
- Lock peekable by default: to set doors to be peekable by default
- Standard size of lock peeks: the default size of door lockpeeks
- Standard position of lock peeks: the default value for the Lock peek position
- Stop lock peeking on movement: to stop lock peeking even if the moving token is still within the interaction distance
- GM confrims peeks: to set wether a GM has to confirm lock peeking actions
- Peeking formula: to set the formula used when peeking a lock with a peeking DC
- Peekind default DC: to set the default DC used for new peeking doors
#### Client:
- Message popups to enable certain popups for Lock peeking interactions
#### Walls:
- Can be lock peeked: to make the door peekable
- Lock peek size: to set the doorlocks peek size (in parts of the door (0-1))
- Lock peek position to change the position of the lock gap (in parts of the door (0-1))
- Peeking DC: to set the DC for peeking through this lock

### Issues:
- Lock peeking is currently incompatible with Elevated Vision (a fix is on the way)

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
- Message popups to enable certain popups for Door moving interactions
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
- Follow on control: to follow tokens the moment they are controlled

## Spot Invisible
Allows for player to either passively or actively spot secret doors and hidden tokens and make secret doors visible to other players by left clicking them. GMs can set seperate passiv and active DCs for spotting (or synch them).

### Settings:

#### World:
- Activate Spot Invisible feature: to activate/deactivate Spot Invisible feature
- GM UI & Controls
  - Player perspective: to allow GMs to only spot tokens players can spot
  - GM confirm Spotting: to open a dialog for the GM when a player rolls a perception check to conform which tokens are spotted
  - Show failures in GM confirm dialog: to show tokens against which the perception roll failed as unchecked entries in the confirm dialog
  - Force invert "Ignore Roll" key: to invert the key for all players and remove the client setting
  - GM recives info messages: to enabled whispered informations regarding player spotting
  - Perception macro use behaviour[Pf2e only]: under which conditions perception checks are only considered when using the included macros
- Rules & Automations
  - Automate token Can be spotted: to automatically manage the Can be spotted token setting
  - Crit system: to set how crits are calculated
  - Reset spotted on token movement by default: to reset the spotters of moving tokens
  - Make spotted tokens visible: to make spotted tokens visible to everyone
  - Make allied tokens visible: to set wether allied tokens should be made visible when spotted
  - Active perception lingers: to continue using the active perception until manually removed in the token HUD
  - Lingering active perception radius: to limit the range in which the active perception remains
  - Lingering active perception duration: to limit the duration for which the active perception remains
  - Make spotted door visible on click: to make spotted secret doors become normal doors on click
- Rolls & Formulas
  - Passive perception formula: to set the formula used for passive perception (if not automated)
  - Perception key-word: to set the key word used to find perception rolls (if not automated) (a key can be set to not autodetect rolls)
  - Stealth key-word: to set the key word used to find stealth rolls (if not automated) (a key can be set to not autodetect rolls)
  - Auto stealth behaviour: to set which perception DC values should be set when a stealth roll is detected
- Effects
  - Apply system stealth effect(s): to automatically apply the systems stealth effects
  - [EXPERIMENTAL!] Use Perceptive stealth: to activate this feature
  - Perceptive stealthing friendlies visible to allow friendly tokens that use Perceptives stealth to still be visible
  - Sync Perceptive stealth removel to automatically remove applied stealth effects when Perceptives stealth effect is removed and vice versa 
  - Custom stealth effects: to automatically apply custom stealth effects
- Sight Range
  - Spotting range to limit the range in which tokens and doors can be spotted
  - Spotting cone range to set an additional cone shaped spotting range infront of tokens
  - Apply Ranges: to set when the set ranges should be applied
  - Border to border distance: to calculate the spotting distance based on token borders instead of the center
  - Standard vision direction: to set in which direction vision cones are applied
  - Range perception DC modifier: to set a spotting DC modifer per range increment (DCIncrement/RangeIncrement)
- Illumination  
  - Illumination perception DC modifiers: to add a perception DC modifier based on the light level of a token
    - Can be modified using active effects with the syntax `flags.perceptive.Modifiers.PDC.Illumination.{#LightLevel}` (#LightLevel is 0 for dark, 1 for dim, and 2 for bright)
  - Use Illumination perception DC modifiers for active perception: to enable the set modifiers ofr perception rolls
  - Illumination perception behaviour: to set advantage or disadvantage for active perception rolls dependent on illumination
  - Illumination 3D calculation: to set wether the illumination should be calculated in 3D (with elevation)
- Sounds & Images
  - Spotted Sound for a sound: to be played, should a controlled token be spotted
  - Spotted sound volume: to set the volume of the custom spotted sound
  - Spotter ping Image: to set an image with which tokens that spot an object are pinged
  - Spotter ping duration: to set the duration the Spotter ping Image show up for

#### Walls/Tokens/Tiles:
- Can be spotted: to activate the spotting feature on this wall
- Reveal when spotted: to make specific objects visible when spotted (overrides game settings when active)
- Passive perception DC: to set the DC for passive perception (-1 for impossible)
- Active perception DC: to set the DC for actove perception (-1 for impossible, empty to synch with passive DC)
- Spotting Range: to set a specific range in which this object can be spotted
- Other active skill DCs: to set the active spotting DCs when using skills other then perception (currently only works with D&D5e, Pf2e, and Pf1e)
- Reset "spotted by": to reset by whom this object has already be actively spotted by
- Reset spotted on token movement[Tokens only]: to reset spotters of this token on movement
- Stealth effects[Tokens only]: to add additional stealth effects to this token
- Override world stealth effects[Tokens only]: to override the worlds stealth effects with this tokens custom stealth effects
- Tile name[Tiles only]: to set the displayed name of this tile for e.g. dialogs
- Spotting Message: to set a chat message displayed for tokens that spot this object
 
The following informations will be displayed in the settings (if applicable):
 - Calculated passive perception: The passive perception of this token calculated according to the set formula
 - Spotted by: A list of token names (or IDs) this token has been spotted by
 - Illumination perception DC modifier: A light level based modifier added or subtracted from this tokens set perception DCs
 - Vision level: This tokens set vision level:
   - Basic sight: Normal behaviour
   - Low-light vision: Can see tokens in dim-light as if they were in bright light
   - Darkvision: Can see tokens in darkness as if they were in dim light and in dim light as if they were in bright light
   - Darkvision (total): Can se all tokens (even those in darkness) as if they were in bright light
  
#### Active Effects (Actors)
  - The attribute key `flags.perceptive.Modifiers.perception.MOD.#ObjectType.#CheckType` can be used to add modifiers to certain checks
  - The attribute key `flags.perceptive.Modifiers.perception.BEH.#ObjectType.#CheckType` can be used to alter the roll behaviour for certain checks
    -  advantage: +1, normal: 0, disadvantage: -1
    -  This attribute is additive with other advantage/disadvantage sources (use e.g. +2 to force advantage)
  -  Valid `#ObjectType` values: Wall,Token,Tile
  -  Valid `#CheckType` values: active, passive(`MOD` only), all other skill abreviations as per the "Other active skill DCs" menu
  
#### Scene:
 - Bright illumination limit: to set the value below which the scene darkness is considered bright
 - Dim illumination limit: to set the value below which the scene darkness is considered dim
  
#### Client
- Invert "Ignore Roll" key: to only recognise rolls WHEN they key is pressed
- Position of illumination indicator: to show a indicator for the current illumination level in the token HUD
- Position of active perception indicator: to set the position of the indicator for the lingering active perception
- Position of perception DC input: to set the position of the perception DC input in the token HUD
- Spotting ping duration: to ping new objects that are spotted with an active roll for a certain duration
- Show perception results: to show the result of own perception rolls in the chat
- Notify on lingering AP removal: to notify the user when a lingering active perception is removed from an owned token
- Stealthed token transparency: to change the transparency of spotted tokens

### Issues:
- The setting Player perspective is incompatible with Less Fogs Reveal Token settings

## Vision Channels
Vision channels allow GMs to make tokens, tiles and door controls conditionally visible and walls transparent or traversable to certain tokens. Colors or graphical filters may be applied to objects seen through these channels. The feature can be controlled via api, a few exmplae macros for this purpose are included.

### Settings:

#### World:
- Activate Vision Channels: to use the new feature
- Open Vision Channels Menu: to open the menu and edit the channels
     - Name: The name of this VC
     - Required to see: If this VC is required to see objects emitting on this VC
     - Through walls: If object with this VC can be seen through walls
     - Range: The range over which this VC emits (-1 for infinity)
     - Range formula: A formula based range (formulas similar to roll formulas)
     - Minimum range: The minimum range at which a VC becomes active
     - Color: The tint of object seen through this VC
     - Effect Filter (Tokens only!): The filter applied to tokens seen with this VC
     - Effect Filter Color: The color of the effect filter
     - Transparency: The transparency of objects seen with this VC (1 no transparency, 0 invisible)
     - Receive default: To set the vision channel as being received by default
 - Simulate player vision: to have the same vision a player controlling the tokens would have as a GM
 - Vision Channel 3D range: to calculate the vision channel range in 3D
 - Use logical OR mode: to use a logical OR for required vision channels instead of a logical AND
 - Show Vision Channel IDs: to show the internal vision channel IDs in the Vision Channels menu

#### Walls/Tokens/Tiles:
 - Open Vision Channels Menu: to open this objects vision channel setting menu
      - Emits: If this token/tile/door control Emits on the VC and can be seen with this channel
      - Receives: If this token/tile/door control Receives the VC and can see this channel
      - Receiver filter: to temporarily turn on/off a receiver VC (can be toggle via macro, see "Toggle VC receiver filter of selected Token" macro)
      - Custom range: a range that overrides all other ranges for this VC on this token
      - Calculated range: the range based on on the set range formula
      - Custom range minimum: a minimum range overriding the the world setting for this receiver
      - Sigth: If this wall can be seen through with this channel
      - Movement: If this wall can be moved through with this channel

#### Active Effects (Actors)
- The attribute key `flags.perceptive.VisionChannelsFlag.#VCID.Receives` can be used to set wether a token can receive the vision channel belonging to #VCID (true/false)
- The attribute key `flags.perceptive.VisionChannelsFlag.#VCID.Emits` can be used to set wether a token emits on the vision channel belonging to #VCID (true/false)
  
## General features:

### Settings:

#### World:
- Split interactions distances: to set different interactions distances for lock peeking and door moving
  - Allows for Lock peeking world setting Lock peeking distance to be set to limit the distance over which players can peek locks
  - Allows for Door moving world setting Door moving distance to be set to limit the distance over which players can move doors
- Maximum Interaction Distance: to limit the distance over which players can interact with doors
- Use Pf2e rules[Pf2e only]: to activate Pf2e specific behaviour
  - Differentiates between hiding and sneaking, using the appropiate Pf2e macros
  - Allows for the world setting Auto reroll sneaking stealth dc to be activated
    - Allows for the token setting Lock passive perception DC to be set to prevent it from being rerolled
   - The active perception DC of compatible tokens (Characters, NPCs, Familairs) will now be locked and updated automatically
   - The passive perception DC will be calculated as a skill check for compatible tokens (Characters, NPCs, Familairs)
   - Undetected will only be removed on a critical failure/success and be replaced with hidden otherwise
   - Hidden can be removed with active perception checks
- Show Perceptive walls [DEBUG]: to show the modules walls in the wall layer for debug purposes

### Compatibility:

The module should be compatible with all game systems and most modules on Foundry v11. If you encounter any bugs please [let me know](https://github.com/Saibot393/perceptive/issues).

#### Explicit compatability:
- [FoundryVTT Arms Reach](https://foundryvtt.com/packages/foundryvtt-arms-reach)/[Arms Reach](https://foundryvtt.com/packages/arms-reach):
  - Additional setting "Use Arms Reach distance": to use the "Arms Reach" distance instead of the set Interaction distance
- [Lock & Key](https://foundryvtt.com/packages/locknkey)
  - A "Peek lock" options will be shown on the lock interaction menu of Lock & Key
- [DFreds Convenient Effects](https://foundryvtt.com/packages/dfreds-convenient-effects)
  - Additional setting "DFreds Convenient Effects Integration" to enable stealth effects
- [Chris's Premades](https://foundryvtt.com/packages/chris-premades)
  - Additional setting "Chris's Premades integration" to enable effects managed by Chris's Premades
- [Vision 5e](https://foundryvtt.com/packages/vision-5e)
  - Additional setting "Vision 5e Integration" to apply additional stealth effects and detect the vision type set by Vision 5e
- [Stealthy](https://foundryvtt.com/packages/stealthy)
  - Addtional setting "Stealthy integration" to synch the stealth DCs between Stealthy and Perceptive
- [Monk's Active Tile Triggers](https://foundryvtt.com/packages/monks-active-tiles)
  - Adds additional Perceptive related trigger for spottable objects (adds a new triggers tab to spottable tokens)
  - Adds a textbox to enter the tile which should be triggered for spottable tokens
  - Adds setting Disable invisible MATT tiles to disable spottable invisible MATT Tiles
  - The following landings can be optionally used to differentiate between the different Perceptive trigger conditions: `PassiveSpot`, `ActiveSpot`
  - Adds additional Actions & Filters:
    - Action Spot object to spot specified objects
    - Action Give vision channel to give a specified action chanel as a defined type to the target(s)
    - Action Remove vision channel to remove a specified action chanel as a defined type from the target(s)
    - Action Reset \"spotted by\" to reset the tokens list that has actively spotted this target
    - Action Set \"can be spotted\" to set the can be spotted setting to a specific value or toggle it
    - Filter Filter objects spotted by to filter objects (not) spotted by specified tokens
    - Filter Filter tokens having spotted to filter tokens (not) having spotted a specified token
- [Token Magic FX](https://foundryvtt.com/packages/tokenmagic/)
  - Adds several Token Magic FX effects as Vision Channel effect filters
  - Not all Token Magic FX filters are included yet, let me know if you have specific wishes (not all filters are compatible)

### Languages:

The module contains an English, a German,  a Chinese (thanks to Thousand (_thousand@Discord)), a Japanese (thanks to [doumoku](https://github.com/doumoku)), and a Polish (thanks to [Lioheart](https://github.com/Lioheart)), and a Portuguese Brazil (thanks to [Andersants](https://github.com/Andersants)) translation. If you want additional languages to be supported [let me know](https://github.com/Saibot393/perceptive/issues).

---

**If you have suggestions, questions, or requests for additional features please [let me know](https://github.com/Saibot393/perceptive/issues).**
