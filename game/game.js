const WIDTH = 320;
const HEIGHT = 640;

const SHARED_CONFIG = {
  fontFamilies: ["Fredoka One", "Bangers"],
};

const Scenes = [
  PreloadScene,
  TitleScene,
  InstructionsScene,
  StartScene,
  ContinueScene,
  GameOverScene,
  WinScene,
  PlayScene,
];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  title: "TAP TAP BUG",
  banner: {
    text: "#05386b",
    background: ["#05386b", "#379683", "#5cdb95", "#8ee4af"],
    hidePhaser: true,
  },
  type: Phaser.AUTO,
  parent: "gameContainer",
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: WIDTH,
    height: HEIGHT,
  },
  render: {
    pixelArt: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
  autoFocus: true,
  scene: initScenes(),
};

new Phaser.Game(config);
