class ContinueScene extends Phaser.Scene {
  constructor() {
    super("ContinueScene");
  }
  create() {
    this.countDownTime = 9;
    this.continue = false;
    this.createBackground();
    this.createText();
    this.createEventHandlers();
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  createBackground() {
    let gameContainer = document.querySelector("#gameContainer");
    gameContainer.setAttribute("style", "cursor: pointer;");

    this.cameras.main.setBackgroundColor("#05386b");
  }

  createText() {
    let x = this.cameras.main.width / 2;
    let y = this.cameras.main.height / 2;
    let offsetY = 10;
    let style = {
      fontSize: "4rem",
      fontFamily: "Bangers",
      fontWeight: "bolder",
      color: "#ffff00",
      align: "center",
      lineSpacing: 1,
      padding: {
        left: 5,
        right: 5,
        top: 0,
        bottom: 0,
      },
    };

    let question = this.add.text(x, y, "CONTINUE?", style);
    question.setOrigin(0.5, 1);
    question.setShadow(0, 2, "rgba(0,0,0,1)", 2);

    this.countDownText = this.add.text(
      x,
      y + offsetY,
      `${this.countDownTime}`,
      style
    );
    this.countDownText.setOrigin(0.5, 0);
    this.countDownText.setShadow(0, 2, "rgba(0,0,0,1)", 2);
  }

  createEventHandlers() {
    this.input.once(
      "pointerup",
      () => {
        this.continue = true;
        this.countDownText.setText(`${this.countDownTime}`);
        this.countDownEvent.remove();
        this.cameras.main.fadeOut(500, 0, 0, 0);
      },
      this
    );

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        if (this.continue) {
          this.scene.start("StartScene", { newGame: true });
        } else {
          this.scene.start("TitleScene");
        }
      },
      this
    );

    this.countDownEvent = this.time.addEvent({
      delay: 1000,
      callback: this.countDown,
      callbackScope: this,
      loop: true,
    });
  }

  countDown() {
    this.countDownTime--;
    this.countDownText.setText(`${this.countDownTime}`);
    if (this.countDownTime <= 0) {
      this.countDownText.setText("");
      this.countDownEvent.remove();
      this.registry.set("isFirstPlay", true);
      this.cameras.main.fadeOut(1000, 0, 0, 0);
    }
  }
}
