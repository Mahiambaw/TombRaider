
let layers;
let testLet = 0;
let level2Zone;

class Level2 extends Phaser.Scene {
  constructor(config) {
    super({ key: "Level2" })
    // this.config = config

  }
  // gets the dta that is being sent from the Background class
  init(data) {
    // this.message = data.message;
    // console.log(this.message)
  }

  preload() {
    //this.load.spritesheet('dude', '../assets/sprites/warrior.png', { frameWidth: 69, frameHeight: 44 });
    this.load.image('tile', '../assets/dungeoun/tileset.png')
    this.load.tilemapTiledJSON('map', '../assets/level2/second.json')
  }



  create() {

    // this.scale.displaySize.setAspectRatio(width / height);
    // this.scale.refresh();
    // get the creatMap from the background 
    const map = this.creatMap();

    const layers = this.creatLayer2(map);
    console.log(layers)
    //const player = this.player = this.scene.add('player', Background, true);
    this.physics.add.collider(player, layers.platfroms)
    console.log(map, "hello")

    //console.log(player)
    // this.cameras.main.setBounds(0, 0, window.width, window.height);
    // this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(0, 0, window.width, window.height);
    this.cameras.main.setZoom(0.2);

  }

  creatMap() {
    const map = this.make.tilemap({ key: 'map' });

    map.addTilesetImage('tileset', 'tile');
    return map;

  }

  creatLayer2(map) {
    // get the tilsets from the map2 which 
    const tileset = map.getTileset('tileset');
    const background = map.createStaticLayer("Background", tileset)
    const platfroms = map.createStaticLayer("Top", tileset)
    platfroms.setCollisionByExclusion(-1, true);

    return { background, platfroms }
  }

}
