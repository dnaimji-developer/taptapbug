class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    this.level = this.registry.get("level") || 1;
    this.LAST_LEVEL = 5;

    this.createEvents();

    this.bg = this.createBackground();
    this.livesDisplay = this.createLivesDisplay();
    this.food = this.add.group();
    this.bugs = this.add.group();
    this.player = null;

    this.createPlayer();
    this.createFood();
    this.createBugs();

    this.createFoodColliders(this.food, this.bugs);
    this.createBugColliders(this.bugs, this.player);

    this.registry.set("isFirstPlay", false);

    this.cameras.main.fadeIn(100, 0, 0, 0);
  }

  update(time, delta) {}

  createEvents() {
    if (this.events.listenerCount("PLAYER_WIN") <= 0) {
      this.events.once("PLAYER_WIN", this.playerWin, this);
    }
    if (this.events.listenerCount("PLAYER_LOSE") <= 0) {
      this.events.once("PLAYER_LOSE", this.playerLose, this);
    }
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.loseLevel();
      }
    );
  }

  playerWin() {
    if (this.level === this.LAST_LEVEL) {
      this.gameWon();
    } else {
      this.nextLevel();
    }
  }

  playerLose() {
    this.cameras.main.fadeOut(750, 0, 0, 0);
  }

  createBackground() {
    let gameContainer = document.getElementById("gameContainer");
    gameContainer.setAttribute("style", "cursor: none;");

    let background = this.add.image(0, 0, `level_${this.level}`).setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    return background;
  }

  createLivesDisplay() {
    let livesDisplay = this.add.container(7, 7);
    livesDisplay.setName("livesDisplay");
    let playerLives = this.registry.get("playerLives");

    for (let index = 0; index < playerLives; index++) {
      let heartImage = this.add.image(0, 0, "heart").setOrigin(0).setScale(0.2);
      let offsetX = heartImage.displayWidth * index;
      heartImage.setX(0 + offsetX);
      livesDisplay.add(heartImage);
    }

    return livesDisplay;
  }

  createFood() {
    let numFood = (this.level - 1) * 25 + 20;
    for (let i = 0; i < numFood; i++) {
      let startConfig = this.getRandomFood();
      let food = new Food(this, startConfig);
      this.food.add(food);
    }
  }

  createBugs() {
    let numBugs = (this.level - 1) * 2 + 3;
    for (let i = 0; i < numBugs; i++) {
      let startConfig = this.getRandomBug();
      let bug = new Bug(this, startConfig);
      this.bugs.add(bug);
    }
  }

  createPlayer() {
    let startConfig = {};
    startConfig.startPosition = { x: 0, y: 0 };
    this.player = new Player(this, startConfig);
  }

  createFoodColliders(food, bugs) {
    this.physics.add.overlap(food, bugs, this.onHit, null, this);
  }

  createBugColliders(bugs, player) {
    this.physics.add.overlap(bugs, player, this.onHit, null, this);
  }

  nextLevel() {
    this.registry.inc("level", 1);

    this.food.setActive(false).setVisible(false);
    this.bugs.setActive(false).setVisible(false);
    this.player.setActive(false).setVisible(false);
    this.livesDisplay.setVisible(false);

    this.scene.transition({
      target: "StartScene",
      duration: 2000,
      moveAbove: false,
      onUpdate: this.transitionOut,
      data: { newGame: false },
    });
  }

  loseLevel() {
    this.registry.inc("playerLives", -1);
    let playerLives = this.registry.get("playerLives");

    if (playerLives <= 0) {
      this.scene.start("GameOverScene");
    } else {
      this.scene.restart();
    }
  }

  gameWon() {
    this.food.setActive(false).setVisible(false);
    this.bugs.setActive(false).setVisible(false);
    this.player.setActive(false).setVisible(false);
    this.livesDisplay.setVisible(false);

    this.scene.transition({
      target: "WinScene",
      duration: 4000,
      moveAbove: false,
      onUpdate: this.transitionOut,
    });
  }

  transitionOut(progress) {
    this.bg.y = -this.cameras.main.height * progress;
  }

  onHit(entity, source) {
    entity.takesHit(source);
  }

  getRandomFood() {
    let foodItemNum = Phaser.Math.Between(0, 63);
    let startPosition = this.getRandomPosition();
    return { foodItemNum, startPosition };
  }

  getRandomBug() {
    let startPosition = this.getRandomPosition();
    let bugIndex = Phaser.Math.Between(0, 7);

    return { bugIndex, startPosition };
  }

  getRandomPosition() {
    let boundaryX = {
      start: 12,
      end: this.cameras.main.width - 12,
    };
    let boundaryY = {
      start:
        this.livesDisplay.y + this.livesDisplay.getFirst().displayHeight + 15,
      end: this.cameras.main.height - this.player.displayHeight,
    };
    let startPosition = {};
    startPosition.x = Phaser.Math.Between(boundaryX.start, boundaryX.end);
    startPosition.y = Phaser.Math.Between(boundaryY.start, boundaryY.end);

    return startPosition;
  }
}
