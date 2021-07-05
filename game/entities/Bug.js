class Bug extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, bugConfig) {
    let { bugIndex, startPosition } = bugConfig;
    let bugStartFrame = bugIndex * 34;

    super(scene, startPosition.x, startPosition.y, "bugs-sheet", bugStartFrame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.bugIndex = bugIndex;
    this.bugStartFrame = bugStartFrame;

    this.init();
    this.initEvents();
  }

  init() {
    this.setName("bug");
    this.setScale(1);
    this.setOrigin(0.5, 0.5);
    this.setBodySize(this.width - 20, this.height - 15);
    this.setCollideWorldBounds(true);
    this.setInteractive();

    this.isAlive = true;
    this.isHit = false;
    this.timeOfLastHit = null;
    this.hitDuration = 250;
    this.deadTint = 0xa9a7a7;
    this.status = "HUNGRY";

    this.follower = null;

    let startSpeed = 50 + 10 * this.scene.registry.get("level");
    let endSpeed = 100 + 5 * this.scene.registry.get("level");
    let startHealth = 100;
    let endHealth = 300 + 100 * this.scene.registry.get("level");
    this.speed = Phaser.Math.Between(startSpeed, endSpeed);
    this.health = Phaser.Math.RoundTo(
      Phaser.Math.Between(startHealth, endHealth),
      2
    );

    this.bugAnims = {
      idle: `bug-idle-${this.bugIndex}`,
      walk: `bug-walk-${this.bugIndex}`,
      die: `bug-die-${this.bugIndex}`,
    };
    this.initAnimations(this.scene.anims);
  }

  initAnimations(anims) {
    anims.create({
      key: this.bugAnims.idle,
      frames: anims.generateFrameNumbers("bugs-sheet", {
        start: 0 + this.bugStartFrame,
        end: 2 + this.bugStartFrame,
      }),
      frameRate: 3 + this.speed / 10,
      repeat: -1,
    });

    anims.create({
      key: this.bugAnims.walk,
      frames: anims.generateFrameNumbers("bugs-sheet", {
        start: 4 + this.bugStartFrame,
        end: 11 + this.bugStartFrame,
      }),
      frameRate: 8 + this.speed / 10,
      repeat: -1,
    });

    anims.create({
      key: this.bugAnims.die,
      frames: anims.generateFrameNumbers("bugs-sheet", {
        start: 13 + this.bugStartFrame,
        end: 16 + this.bugStartFrame,
      }),
      frameRate: 8 + this.speed / 10,
      repeat: 2,
    });
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.on(
      "animationcomplete",
      (animation) => {
        if (animation.key == this.bugAnims.die) {
          this.setTint(this.deadTint);
        }
      },
      this
    );
  }

  update(time, delta) {
    if (!this.body || !this.isAlive) {
      return;
    }
    if (this.status == "HUNGRY") {
      this.walkToClosestFood();
    }
    if (this.status == "SCARED") {
      this.runAway();
    }
  }

  walkToClosestFood() {
    let food = this.scene.food.getChildren();
    let closestFood = this.closest(this, food);

    if (closestFood) {
      var target = closestFood;
      let angle = Phaser.Math.Angle.BetweenPoints(this, target);
      var distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        target.x,
        target.y
      );
      this.rotation = angle + Phaser.Math.PI2 / 4;
      this.scene.physics.moveTo(this, target.x, target.y, this.speed);
      this.play(this.bugAnims.walk, true);
    } else {
      this.body.stop();
      this.play(this.bugAnims.idle, true);
    }
  }

  runAway() {
    this.angle = this.follower.angle + 90;
    this.setPosition(this.follower.x, this.follower.y);

    let distToEndPath = Phaser.Math.Distance.Between(
      this.follower.x,
      this.follower.y,
      this.follower.path.getEndPoint().x,
      this.follower.path.getEndPoint().y
    );
    if (distToEndPath == 0) {
      this.follower.destroy();
      this.status = "HUNGRY";
    }
  }

  planEscape() {
    let path = this.createEscapePath();
    this.follower = this.scene.add.follower(path, this.x, this.y);

    let duration = Math.ceil(this.follower.path.getLength() / this.speed) * 500;
    this.follower.startFollow({
      positionOnPath: true,
      duration: duration,
      yoyo: false,
      repeat: 0,
      rotateToPath: true,
      verticalAdjust: true,
    });

    this.play(this.bugAnims.walk, true);

    this.status = "SCARED";
  }

  createEscapePath() {
    let path = new Phaser.Curves.Path(this.x, this.y);
    let numSegments = Phaser.Math.Between(1, 10);

    for (let index = 0; index < numSegments; index++) {
      let rand1 = Phaser.Math.Between(0, 1);
      let offsetX = Phaser.Math.Between(60, 80);
      let offsetY = Phaser.Math.Between(60, 80);
      let xRadius = Phaser.Math.Between(20, 80);
      let yRadius = Phaser.Math.Between(20, 80);
      let startAngle = Phaser.Math.Between(0, 359);
      let endAngle = Phaser.Math.Between(startAngle, 360);
      let clockwise = Phaser.Math.Between(0, 1) === 1 ? true : false;
      let rotation = Phaser.Math.Between(0, 360);

      switch (rand1) {
        case 0:
          let rand2 = Phaser.Math.Between(0, 7);
          switch (rand2) {
            case 0:
              path.lineTo(this.x, this.y - offsetY);
              break;
            case 1:
              path.lineTo(this.x, this.y + offsetY);
              break;
            case 2:
              path.lineTo(this.x - offsetX, this.y);
              break;
            case 3:
              path.lineTo(this.x + offsetX, this.y);
              break;
            case 4:
              path.lineTo(this.x - offsetX, this.y - offsetY);
              break;
            case 5:
              path.lineTo(this.x - offsetX, this.y + offsetY);
              break;
            case 6:
              path.lineTo(this.x + offsetX, this.y - offsetY);
              break;
            case 7:
              path.lineTo(this.x + offsetX, this.y + offsetY);
              break;
            default:
              break;
          }
          break;
        case 1:
          path.ellipseTo(
            xRadius,
            yRadius,
            startAngle,
            endAngle,
            clockwise,
            rotation
          );
          break;
        default:
          break;
      }
    }

    return path;
  }

  closest(source, targets) {
    if (!targets) {
      return null;
    }

    let min = Number.MAX_VALUE;
    let closest = null;
    let x = source.x;
    let y = source.y;
    let len = targets.length;

    for (let i = 0; i < len; i++) {
      let target = targets[i];
      let body = target.body || target;

      if (
        source === target ||
        source === body ||
        source === body.gameObject ||
        source === body.center
      ) {
        continue;
      }

      let distance = Phaser.Math.Distance.Between(
        x,
        y,
        body.center.x,
        body.center.y
      );

      if (distance < min) {
        closest = target;
        min = distance;
      }
    }

    return closest;
  }

  takesHit(source) {
    if (source.isSwatting) {
      if (
        this.isAlive &&
        (!this.timeOfLastHit ||
          this.timeOfLastHit + this.hitDuration <= this.scene.time.now)
      ) {
        this.health -= source.swatDamage;
        if (this.health <= 0) {
          this.isAlive = false;
          this.body.stop();
        } else {
          this.planEscape();
        }
        this.timeOfLastHit = this.scene.time.now;
      }
      source.deliversHit(this);
      !this.isAlive && this.play(this.bugAnims.die);
    }
  }

  deliversHit(entity) {
    if (entity.name === "food") {
      entity.destroy();
      if (this.scene.food.getLength() <= 0) {
        this.body.stop();
        this.scene.events.removeListener("PLAYER_WIN");
        this.scene.events.emit("PLAYER_LOSE");
      }
    }
  }
}
