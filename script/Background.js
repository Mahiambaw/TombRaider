let player;
let layers;
let testLet = 0;
let playerZone;

class Background extends Phaser.Scene {


  constructor(config) {
    super({ key: "Background" })

    this.config = config;


  }

  preload() {

    this.load.image('tile', './assets/dungeoun/tileset.png')

    this.load.tilemapTiledJSON('map', './assets/dungeoun/level1.json')
    this.load.spritesheet('enemy', '../assets/sprites/enemy.png', { frameWidth: 69, frameHeight: 44 });
  }

  create() {
    const map = this.creatMap();
    layers = this.creatLayer(map);

    playerZone = this.getplayerZone(layers.playerZone)
    this.enemy = this.creatEnemy()

    this.load.script("playerscript", "Player.js");
    this.player = this.scene.add('player', Player, true);
    this.scene.launch("player", Player);

    // enemy animation --------------------
    this.anims.create({
      key: 'enemy_idle',
      frames: this.anims.generateFrameNumbers('enemy', { start: 60, end: 68 }),
      frameRate: 8,
      repeat: -1

    })

    this.anims.create({
      key: 'enemy_run',
      frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 8 }),
      FrameRate: 8,
      repeat: -1

    })
    this.anims.create({
      key: 'enemy_Back',
      frames: this.anims.generateFrameNumbers('enemy', { start: 39, end: 46 }),
      FrameRate: 8,
      repeat: -1

    })
    this.anims.create({
      key: 'enemy_Front',
      frames: this.anims.generateFrameNumbers('enemy', { start: 47, end: 54 }),
      FrameRate: 8,
      repeat: -1

    })
    //-------- end-----------------
    //------- collaider for both enemy ------------
    //this.enemy.setImmovable(true);
    //this.enemy.setSize(this.player.width, this.player.height)
    //this.endOfLevel(playerZone.end, this.player)

    this.physics.add.collider(this.enemy, layers.platforms)
    //this.physics.add.collider(this.enemy, this.player)

    //---------------------- end ---------------------

    this.cameras.main.setBounds(0, 0, window.width, window.height);
    this.cameras.main.setZoom(2);

  }



  creatMap() {
    const map = this.make.tilemap({ key: 'map' });

    map.addTilesetImage('tileset', 'tile');
    return map;

  }

  creatLayer(map) {
    const tilesets = map.getTileset('tileset');

    const background = map.createStaticLayer('Background', tilesets).setOrigin(0, 0)

    const platforms = map.createStaticLayer('Top', tilesets,).setOrigin(0, 0)

    const playerZone = map.getObjectLayer('player_Zone').objects;
    platforms.setCollisionByExclusion(-1, true);

    return { background, platforms, playerZone }



  }


  creatEnemy() {

    let enemy = this.physics.add.sprite(900, 490, 'enemy');

    //let player = this.physics.add.sprite(1410, 500, 'dude');
    //console.log(start.x, start.y, "this is start")

    enemy.body.setGravityY(700);
    enemy.setCollideWorldBounds(true);

    //enemy.body.setOffset(18, 13);

    return enemy;

  }


  getplayerZone(playerZoneLayer) {
    let playerZone = playerZoneLayer
    return {
      start: playerZone[0],
      end: playerZone[1]

    }
  }
  endOfLevel(end, player) {

    //console.log(end.x, end.y, "end")
    const endLevel = this.physics.add.sprite(end.x, end.y,
      'end').setAlpha(0)
    endLevel.body.allowGravity = false;
    const endlap = this.physics.add.overlap(player, endLevel, () => {
      endlap.active = false;
      //console.log(end.x, end.y, "end")
      console.log("player has won ")
    })





  }





  update() {
    //this.physics.add.collider(this.player.player, layers.platforms)
    if(testLet == 0)console.log(this.player.player + "update")
        testLet = 1;
        if(this.player.player)this.cameras.main.startFollow(this.player.player, true, 0.5, 0.5);
  }



}


function render() {
  game.debug.inputInfo(32, 32);
}

