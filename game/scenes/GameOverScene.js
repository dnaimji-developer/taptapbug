class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }
  create() {
    this.createBackground();
    this.createText();
    this.createEventHandlers();
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  createBackground() {
    let gameContainer = document.querySelector("#gameContainer");
    gameContainer.setAttribute("style", "cursor: pointer;");

    let background = this.add.image(0, 0, "gameOver").setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
  }

  createText() {
    var tconfig = {
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      text: "GAME OVER",
      style: {
        fontSize: "5.5rem",
        fontFamily: "Bangers",
        color: "#ffff00",
        align: "center",
        lineSpacing: 1,
        padding: {
          left: 5,
          right: 5,
          top: 0,
          bottom: 0,
        },
      },
    };

    let text = this.add.text(tconfig.x, tconfig.y, tconfig.text, tconfig.style);

    text.setOrigin(0.5);
    text.setShadow(0, 2, "rgba(0,0,0,1)", 2);
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
        this.scene.start("ContinueScene");
      },
      this
    );
  }
}
