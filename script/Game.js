
const MAP_WIDTH = 1800;
const WIDTH = document.body.offsetWidth;
const HEIGHT = 900;
const SHARED_CONFIFG = {

  width: WIDTH,
  height: HEIGHT,
  zoomFactor: 1.5
}
var config = {
  type: Phaser.AUTO,


  ...SHARED_CONFIFG,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }

    }
  },
  scene: [Background]

};



var game = new Phaser.Game(config);