
const MAP_WIDTH = 1600;
const WIDTH = document.body.offsetWidth;
const HEIGHT = 900;
const SHARED_CONFIFG = {

  width: MAP_WIDTH,
  height: HEIGHT,
  zoomFactor: 1.5
}
var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    // ...
  },


  ...SHARED_CONFIFG,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true

    }
  },
  parent: Background,
  scene: [Background]

};



var game = new Phaser.Game(config);