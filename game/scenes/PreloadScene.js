class PreloadScene extends Phaser.Scene {
  constructor(config) {
    super("PreloadScene");
    this.config = config;
  }

  preload() {
    this.load.image("title", "assets/backgrounds/title.png");
    this.load.image("level_1", "assets/backgrounds/table_1.jpg");
    this.load.image("level_2", "assets/backgrounds/table_2.jpg");
    this.load.image("level_3", "assets/backgrounds/table_3.jpg");
    this.load.image("level_4", "assets/backgrounds/table_4.jpg");
    this.load.image("level_5", "assets/backgrounds/table_5.jpg");
    this.load.image("gameOver", "assets/backgrounds/gameOver.png");
    this.load.image("youWon", "assets/backgrounds/youWon.png");
    this.load.image("heart", "assets/health/heart.png");

    this.load.spritesheet("player-sheet", "assets/player/player.png", {
      frameWidth: 302,
      frameHeight: 625,
    });
    this.load.spritesheet("bugs-sheet", "assets/bugs/bugs.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("food-sheet", "assets/food/food.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(
      "hit-effect-sheet",
      "assets/effects/hit_effect_sheet.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    this.load.once("complete", () => {
      this.startGame();
    });

    this.load.addFile(new WebFontFile(this.load, this.config.fontFamilies));
  }

  startGame() {
    this.registry.set("isFirstPlay", true);
    this.scene.start("TitleScene");
  }
}
