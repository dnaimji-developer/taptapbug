class InstructionsScene extends Phaser.Scene {
  constructor() {
    super("InstructionsScene");
  }
  create() {
    this.createText();
    this.createEventHandlers();
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  createText() {
    let gameContainer = document.querySelector("#gameContainer");
    gameContainer.setAttribute("style", "cursor: pointer;");

    this.cameras.main.setBackgroundColor("#05386b");
    var tconfig = {
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      text: "Swat the pesky bugs before they eat all your food!",
      style: {
        fontSize: "3rem",
        fontFamily: "Bangers",
        color: "#EDF5E1",
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
    text.setWordWrapWidth(this.cameras.main.width - 50, false);
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
        this.scene.start("StartScene", { newGame: true });
      }
    );
  }
}
