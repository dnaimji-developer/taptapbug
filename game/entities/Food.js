class Food extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, foodConfig) {
    let { foodItemNum, startPosition } = foodConfig;

    super(scene, startPosition.x, startPosition.y, "food-sheet", foodItemNum);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
    this.initEvents();
  }

  init() {
    this.setName("food");
    this.setScale(2);
    this.setOrigin(0.5, 0.5);
    this.setBodySize(this.width - 12, this.height - 12);
    this.setImmovable();
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time, delta) {}

  takesHit(source) {
    source.deliversHit(this);
  }
}
