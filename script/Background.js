//CREATING VARIABLES SO THEY ARE ABLE TO BE CALLED IN ALL CLASSES
let player;
let map;
let mapName;
let layers;
class Background extends Phaser.Scene {


  constructor(config) {
    super({ key: "Background" })

    //this.config = config;


  }
  init() {

  }

  preload() {
    console.log("background preload")
    this.load.spritesheet('dude', '../assets/sprites/warrior.png', { frameWidth: 69, frameHeight: 44 });
    this.load.image('tile', './assets/dungeoun/tileset.png')
    this.load.image('star', './assets/dungeoun/starts.png')
    this.load.tilemapTiledJSON('map', '../assets/dungeoun/level1.json')
    this.load.tilemapTiledJSON('map2', '../assets/level2/second.json')
    this.load.spritesheet('enemy', '../assets/sprites/enemy.png', { frameWidth: 69, frameHeight: 44 });
  }

  create() {
    console.log("background create")
    mapName = "map"
    map = this.creatMap(mapName);
    layers = this.creatLayer(map);
    let playerZone = this.getplayerZone(layers.playerZone)
    // from playerZone  it gets x and y value of the object spesfied in the tile map 
    let x = playerZone.start.x;
    let y = playerZone.start.y;
    // gets the collectable object and display it 
    //const collecLayer = this.getCollectable(layers.collectLayer)
    player = new Player(this, x, y)


    this.physics.add.collider(player, layers.platforms)




    //LOADING THE PLAYER CLASS
    //CURRENT LOAD STRUCTURE IS:
    //BACKGROUND PRELOAD -> PLAYER preload -> BACKGROUND CREATE -> BACKGROUND UPDATE -> PLAYER CREATE -> PLAYER UPDATE
    //LOAD THE SCRIPT (NOT NECESSARY IT SEEMS)
    //this.load.script("playerscript", "Player.js");
    //this.player = this.scene.add('player', Player, true)
    // const poverlap = this.endOfLevel(playerZone.end, this.player)    //this.box = this.scene.add('box', Player, true);
    //console.log(box);
    //LAUNCH THE SCENE (NOT NECESSARY IT SEEMS)
    //this.scene.launch("player", Player);

    // enemy animation --------------------
    //const collectable = this.getCollectable(layers.collectLayer);
    this.enemy = this.creatEnemy()
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


    this.physics.add.collider(this.enemy, layers.platforms)
    this.endOfLevel(playerZone.end, player);
    //this.physics.add.collider(this.enemy, this.player)
    //this.endOfLevel(playerZone.end, this.player)
    //---------------------- end ---------------------

    //CREATE CAMERA IN THE BACKGROUND CLASS
    //NEED ONE CAMERA IN EACH CLASS BECAUSE THE BACKGROUND AND PLAYER CLASSES ARE SEPERATE SCENES

    this.cameras.main.setBounds(0, 0, window.width, window.height);
    this.cameras.main.setZoom(2);
    console.log(player)



  }

  // creat a map function 

  loadLevel() {
    this.scene.pause();
    this.destroyMap();
    mapName = "map2"
    map = this.creatMap(mapName);
    let layers = this.creatLayer(map);
    let playerZone = this.getplayerZone(layers.playerZone)
    // from playerZone  it gets x and y value of the object spesfied in the tile map 
    let x = playerZone.start.x;
    let y = playerZone.start.y;
    player.x = x;
    player.y = y;
    this.physics.add.collider(player, layers.platforms);
    this.physics.world.setBounds(0 ,0 , 3200, 1600);
    this.scene.resume();
    
  }

  destroyMap() {
    this.physics.world.colliders.destroy();
    map.destroy();
  }
  
  creatMap(name) {
    const map = this.make.tilemap({ key: name });

    map.addTilesetImage('tileset', 'tile');
    return map;

  }

   
  // creat a  layer function 
  // gets the tilsets 
  // creats map for the background and the platfrom 
  // gets the object created 
  // sets the collustion for the platfrom so that the player can perofm actions on the platfrom 
  creatLayer(map) {

    const tilesets = map.getTileset('tileset');
    const background = map.createStaticLayer('Background', tilesets).setOrigin(0, 0)
    const platforms = map.createStaticLayer('Top', tilesets,).setOrigin(0, 0)
    // gets the  objects from json 
    // give the partameter with the Tiled mapname 
    const playerZone = map.getObjectLayer('player_Zone').objects;
    //const collectLayer = map.getObjectLayer('collectable').objects;
    platforms.setCollisionByExclusion(-1, true);

    return { background, platforms, playerZone }
  }

  // adds the collectable as a group of objects 
  // apply foreach collectableLayer object 
  // get the each of the collectable object x and vale 
  // retrun the value of the collectable 
  getCollectable(collectableLayer) {
    const collectables = this.physics.add.staticGroup();
    collectableLayer.forEach((collect) => {
      collectables.get(collect.x, collect.y, 'star')
      return collectables

    })
  }
  // cretas the enmey function 
  creatEnemy() {

    let enemy = this.physics.add.sprite(900, 490, 'enemy');

    //let player = this.physics.add.sprite(1410, 500, 'dude');
    //console.log(start.x, start.y, "this is start")

    enemy.body.setGravityY(700);
    enemy.setCollideWorldBounds(true);

    //enemy.body.setOffset(18, 13);

    return enemy;

  }

  //  get the coordinates for the objects ceated
  // get the two objects greated and assign them to start and end 
  getplayerZone(playerZoneLayer) {
    let playerZone = playerZoneLayer
    return {
      start: playerZone[0],
      end: playerZone[1]

    }
  }

  endOfLevel(end, player) {

    // creates a sprite for the end level objecct and provides the coordinate of the object 
    const endLevel = this.physics.add.sprite(end.x, end.y,
      'end')//.setAlpha(0)
    endLevel.body.allowGravity = false;
    const endLap = this.physics.add.overlap(player, endLevel, () => {

      endLap.active = false;

      this.loadLevel();

      console.log("Hello")
    })
    // this will stop any sort of gravity on that endlevel body 

    // check here if the player has overlapped with the endLevel 

    //const endlap = this.physics.add.overlap(player, endLevel, () => {
    // once the player overlaps with the object, make it inactive
    //endlap.active = false;
    //console.log("hello")
    //this.Scene.start("Level2", "hello")
    //console.log(end.x, end.y, "end")
    //console.log("player has won ")
  }








  update() {
    if (testLet == 0) console.log(this.player + "update")
    testLet = 1;
    //WHEN THE PLAYER CLASS EXISTS MAKE THE CAMERA FOLLOW THE PLAYER (BUGFIX)
    if (this.player) this.cameras.main.startFollow(this.player, true, 0.5, 0.5);  

    //PLAYER KILLS ENEMY
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.enemy.getBounds(), box.getBounds()) && box.active) {
      this.enemy.destroy();
    }

  }



}


function render() {
  game.debug.inputInfo(32, 32);
}

