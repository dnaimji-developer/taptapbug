class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }
  create() {
    this.createBackground();
    this.createEventHandlers();
  }

  createBackground() {
    let gameContainer = document.querySelector("#gameContainer");
    gameContainer.setAttribute("style", "cursor: pointer;");

    let background = this.add.image(0, 0, "youWon").setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
  }

  createEventHandlers() {
    this.input.on(
      "pointerup",
      () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
      },
      this
    );

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene.start("TitleScene");
      }
    );
  }
}
