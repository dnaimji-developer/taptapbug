class SpriteEffect extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, effectName, impactPosition) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.target = null;
    this.effectName = effectName;
    this.impactPosition = impactPosition;

    this.initAnimations(this.scene.anims);
    this.initEvents();
  }

  initEvents() {
    this.on(
      "animationcomplete",
      (animation) => {
        if (animation.key === this.effectName) {
          this.destroy();
        }
      },
      this
    );
  }

  initAnimations(anims) {
    anims.create({
      key: "hit-effect",
      frames: anims.generateFrameNumbers("hit-effect-sheet", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: 0,
    });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.placeEffect();
  }

  placeEffect() {
    if (!this.target || !this.body) {
      return;
    }
    const center = this.target.getCenter();
    this.body.reset(center.x, center.y);
  }

  playOn(target) {
    this.target = target;
    this.play(this.effectName, true);
    this.placeEffect();
  }
}
