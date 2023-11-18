import { cModuleName } from "../utils/PerceptiveUtils.js";

const cDefaultoptions = {
	size: 1,
	Image: "",
	ImageColor: "#ffffff",
	Rings: false,
	RingColor: "#ffffff",
	duration: 1000
}

//based on Foundry VTTs chevron ping
class CustomPing extends Ping {
  constructor(origin, options={}) {
	let vOptions = foundry.utils.mergeObject(CONFIG.Canvas.pings.styles.CustomPing.default, options, {inplace : false});
	  
    super(origin, vOptions);
    this.radius = (this.options.size / 2) * .75;

    // The inner ring is 3/4s the size of the outer.
    this.radiusinner = this.radius * .75;

    // The animation is split into three stages. First, the chevron fades in and moves downwards, then the rings fade
    // in, then everything fades out as the chevron moves back up.
    // Store the 1/4 time slice.
    this._t14 = this.options.duration * .25;

    // Store the 1/2 time slice.
    this._t12 = this.options.duration * .5;

    // Store the 3/4s time slice.
    this._t34 = this._t14 * 3;
	
	this.RingColor = options.RingColor;
	this.ImageColor = options.ImageColor;
  }
  
  async animate() {
    this.removeChildren();
	
	if (this.options.Rings) {
		this.addChild(...this._createRings());
	}
	
	if (this.options.Image.length) {
		this.Image = await this.loadImage();
		this.addChild(this.Image);
	}
	
    return super.animate();
  }

  _animateFrame(dt, animation) {
    const { time } = animation;
    if ( time < this._t14 ) {
		// Normalise t between 0 and 1.
		const t = time / this._t14;
		// Apply easing function.
		const dy = CanvasAnimation.easeOutCircle(t);
		if (this.Image) {
			this.Image.y = this._y + (this.hoverheight * dy);
			this.Image.alpha = time / this._t14;
		}
    } else if ( time < this._t34 ) {
      const t = time - this._t14;
      const valpha = t / this._t12;
      this.drawRing(valpha);
    } else {
		const t = (time - this._t34) / this._t14;
		const valpha = 1 - t;
		const dy = CanvasAnimation.easeInCircle(t);
		if (this.Image) {
			this.Image.y = this._y + ((1 - dy) * this.hoverheight);
			this.Image.alpha = valpha;
		}
		this.drawRing(valpha);
    }
  }
  
  drawRing(alpha) {
		if (this.options.Rings) {
			this._outer.clear();
			this._inner.clear();
			this._outer.lineStyle(6, this.options.RingColor, alpha).drawCircle(0, 0, this.radius);
			this._inner.lineStyle(3, this.options.RingColor, alpha).drawCircle(0, 0, this.radiusinner);
		}
  }

  async loadImage() {
    const vTexture = await TextureLoader.loader.loadTexture(this.options.Image);
    const vImage = PIXI.Sprite.from(vTexture);
    vImage.tint = this.options.ImageColor;

    const width = this.options.size;
    const height = (vTexture.height / vTexture.width) * width;
    vImage.width = width;
    vImage.height = height;

    // The chevron begins the animation slightly above the pinged point.
    this.hoverheight = height / 2;
    vImage.x = -(width / 2);
    vImage.y = this._y = -height - this.hoverheight;

    return vImage;
  }
  
  _createRings() {
    this._outer = new PIXI.Graphics();
    this._inner = new PIXI.Graphics();
    return [this._outer, this._inner];
  }
}


Hooks.on("init", () => {
	CONFIG.Canvas.pings.styles.CustomPing = {
		class : CustomPing,
		default : cDefaultoptions
	};
	
	/*
	  game.keybindings.register(cModuleName, "PingCustom", {
		name: "Press Me",
		editable: [
		  {
			key: "KeyL"
		  }
		],
		onDown: () => { 
			canvas.ping(canvas.mousePosition, {style : "CustomPing", duration :  10000, Image : "worlds/elderon/Bilder/Halvar.png"});
		},
		restricted: false,
		precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
	  });*/
});
