class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, playerConfig) {
    let { startPosition } = playerConfig;

    super(scene, startPosition.x, startPosition.y, "player-sheet");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
    this.initEvents();
  }

  init() {
    this.setName("player");
    this.setScale(0.2);
    this.setOrigin(0.5, 0.8);
    this.setBodySize(this.width, this.height / 2);
    this.setOffset(0, 0);
    this.setDepth(1);

    this.isSwatting = false;
    this.timeOfLastSwat = null;
    this.swatDuration = 250;
    this.swatDamage = 100;

    this.initAnimations(this.scene.anims);
    this.effectManager = new EffectManager(this.scene);
  }

  initAnimations(anims) {
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNumbers("player-sheet", {
        start: 0,
        end: 0,
      }),
      frameRate: 8,
      repeat: -1,
    });

    anims.create({
      key: "player-swat",
      frames: anims.generateFrameNumbers("player-sheet", {
        start: 0,
        end: 3,
      }),
      frameRate: 16,
      repeat: 0,
    });
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.scene.input.on("pointerdown", this.startSwatting, this);
    this.scene.input.on("pointerup", this.stopSwatting, this);
  }

  update(time, delta) {
    if (!this.body) {
      return;
    }

    const pointer = this.scene.input.activePointer;
    this.x = pointer.x;
    this.y = pointer.y;

    if (
      this.timeOfLastSwat &&
      this.timeOfLastSwat + this.swatDuration <= this.scene.time.now
    ) {
      this.isSwatting = false;
    }
  }

  startSwatting() {
    this.isSwatting = true;
    this.play("player-swat", true);
    this.timeOfLastSwat = this.scene.time.now;
  }

  stopSwatting() {
    this.isSwatting = false;
    this.play("player-idle", true);
  }

  deliversHit(entity) {
    const impactPosition = { x: this.x, y: this.y };
    this.effectManager.playEffectOn("hit-effect", entity, impactPosition);
    if (
      entity.name === "bug" &&
      this.scene.bugs.getMatching("isAlive", true).length <= 0
    ) {
      this.scene.events.removeListener("PLAYER_LOSE");
      this.scene.events.emit("PLAYER_WIN");
    }
  }
}
