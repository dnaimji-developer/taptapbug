class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create({ newGame }) {
    if (newGame) {
      this.registry.set("playerLives", 3);
      this.registry.set("level", 1);
    }

    this.level = this.registry.get("level");
    if (this.level === 1) {
      this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    this.createText();
    this.createEventHandlers();
  }

  createText() {
    let gameContainer = document.querySelector("#gameContainer");
    gameContainer.setAttribute("style", "cursor: pointer;");

    this.cameras.main.setBackgroundColor("#05386b");
    var tconfig = {
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      text: `LEVEL ${this.level}`,
      style: {
        fontSize: "32px",
        fontFamily: "Fredoka One",
        color: "#ffff00",
        align: "center",
        lineSpacing: 1,
      },
    };
    let text = this.add.text(tconfig.x, tconfig.y, tconfig.text, tconfig.style);
    text.setOrigin(0.5);
    text.setInteractive();
  }

  createEventHandlers() {
    this.input.on("pointerup", () => {
      this.cameras.main.fadeOut(100, 0, 0, 0);
    });

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene.start("PlayScene", { gameStatus: "PLAYER_START" });
      }
    );
  }
}
