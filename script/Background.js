//CREATING VARIABLES SO THEY ARE ABLE TO BE CALLED IN ALL CLASSES
let player;
let mapName;
let map;
let damageCheck = false;
let scoreText;
let score = 0;
let enemyGroup;


class Background extends Phaser.Scene {


  constructor(config) {
    super({ key: "Background" })


  }
  init() {

  }

  preload() {
    this.load.spritesheet('dude', '../assets/sprites/warrior.png', { frameWidth: 69, frameHeight: 44 });
    this.load.spritesheet('enemy', '../assets/sprites/enemy.png', { frameWidth: 41.4, frameHeight: 41.4 });
    this.load.image('tile', './assets/dungeoun/tileset.png')
    this.load.image('dimond', './assets/dungeoun/dimond.png')
    this.load.tilemapTiledJSON('map', './assets/dungeoun/level1.json')
    this.load.tilemapTiledJSON('map2', './assets/level2/cave.json')

    enemyGroup = this.add.group();
  }

  create() {
    mapName = "map"
    map = this.creatMap(mapName);
    let layers = this.creatLayer(map);
    let playerZone = this.getplayerZone
      (layers.playerZone)
    // from playerZone  it gets x and y value of the object spesfied in the tile map 
    let x = playerZone.start.x;
    let y = playerZone.start.y;
    // gets the collectable object and display it 
    // const collecLayer = this.getCollectable(layers.collectLayer)
    player = new Player(this, x, y);


    //for each enemy object create:

    //for each enemy object create:
    //.............................
    // enemy = new Enemy(this, 700 , 500);

    // enemyGroup = this.physics.add.group();
                                
    // for (var i=0 ; i<= 2 ; i++){
    // enemy = new Enemy(this, 700 , 0);
    // // let enemyPositionX = Phaser.Math.Between(200, 1000);
    // // let enemyPositionY = 0;
    // enemyGroup.create(enemyPositionX, enemyPositionY, 'enemy', 8)
    // enemyGroup.create(700, 0, enemy , 8);
    // }
    //.............................
                                
    for (var i=0 ; i<= 2 ; i++){
    // let enemyPositionX = Phaser.Math.Between(200, 1000);
    // let enemyPositionY = 0;
    // enemyGroup.create(enemyPositionX, enemyPositionY, 'enemy', 8)
    enemyGroup.add(new Enemy(this, 100*i, 100));
    }

    //............................
    //with position from tiled8
    console.log(game + "outside")
    this.physics.add.collider(player, layers.platforms)
    //...........................
    // this.physics.add.collider(enemy, layers.platforms)
    enemyGroup.getChildren().forEach((enemyOnce) => {
      console.log(enemyOnce.body);
      
    })
    setTimeout( () => {console.log("askdlj"),this.physics.add.collider(enemyGroup, layers.platforms, () => {console.log("touch")})}, 500);

      console.log(enemyGroup.getChildren());
      
    // this.physics.add.collider(enemyGroup, layers.platforms, patrolPlatform, null, this);
    //.................




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
    const collectable = this.getCollectable(layers.collectLayer);

    this.physics.add.overlap(player, collectable, this.oncollect)

    this.endOfLevel(playerZone.end, player);
    //this.physics.add.collider(this.enemy, this.player)
    //this.endOfLevel(playerZone.end, this.player)
    //---------------------- end ---------------------



    // ----------------score ------------
    // --------------- Adding Scroe----
    scoreText = this.add.text(1000, 240, 'score: 0', { fontSize: '20px', fill: 'lightgreen' });
    scoreText.setScrollFactor(0, 0).setScale(1.5).setDepth(99)
    //----- end------------
    //CREATE CAMERA IN THE BACKGROUND CLASS
    //NEED ONE CAMERA IN EACH CLASS BECAUSE THE BACKGROUND AND PLAYER CLASSES ARE SEPERATE SCENES

    this.cameras.main.setBounds(0, 0, window.width, window.height);
    this.cameras.main.setZoom(2);


  }


  // creat a map function 

  creatMap(name) {
    const map = this.make.tilemap({ key: name });

    map.addTilesetImage('tileset', 'tile');
    return map;

  }

  destroyMap() {
    this.physics.world.colliders.destroy();
    map.destroy();

  }

  levelChange() {
    this.scene.pause();
    this.destroyMap();
    mapName = "map2";
    map = this.creatMap(mapName);
    let layers = this.creatLayer(map);
    let playerZone = this.getplayerZone
      (layers.playerZone)
    // from playerZone  it gets x and y value of the object spesfied in the tile map 
    let x = playerZone.start.x;
    let y = playerZone.start.y;
    player.x = x;
    player.y = y;
    this.physics.world.setBounds(0, 0, 3200, 1600);
    this.physics.add.collider(player, layers.platforms)
    // gets the collectable object and display it 

    const collectable = this.getCollectable(layers.collectLayer);
    this.physics.add.overlap(player, collectable, this.oncollect)

    this.scene.resume();
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
    const collectLayer = map.getObjectLayer('collectable')['objects'];
    const door = map.getObjectLayer('door')
    platforms.setCollisionByExclusion(-1, true);


    return {
      background,
      platforms,
      playerZone,
      collectLayer,
      door
    }
  }

  // adds the collectable as a group of objects 
  // apply foreach collectableLayer object 
  // creat the each of the collectable object x and y value 
  // retrun the value of the collectable  object 
  getCollectable(collectableLayer) {
    const collectables = this.physics.add.staticGroup();
    collectableLayer.forEach((collect) => {
      collectables.get(collect.x, collect.y, 'dimond')



    })
    return collectables
  }
  // the first true will dsiable game object 
  // the second true will deactivate object 
  oncollect(player, collectable) {

    collectable.disableBody(true, true)
    score += 10;
    console.log(score, "scroe")
    scoreText.setText('Score: ' + score);

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

      this.levelChange();

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

    //this.physics.add.collider(this.player.player, layers.platforms)
    if (testLet == 0) console.log(this.player + "update");
    testLet = 1;
    //WHEN THE PLAYER CLASS EXISTS MAKE THE CAMERA FOLLOW THE PLAYER (BUGFIX)
    if (this.player) this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

    enemyGroup.getChildren().forEach(function(enemy) {    

    if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), box.getBounds()) && box.active) {
      enemy.setActive(false).setVisible(false);
    }
    if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), player.getBounds()) && player.alpha == 1) {
      if (player.hb !== 0) {
        player.hb.decrease(10);
        player.alpha = 0.5;
        damageCheck = true;
        setTimeout(() => { player.alpha = 1; damageCheck = false }, 1000)
      }
    }
    // see if this and player within 300px of each other
    if (enemy && Phaser.Math.Distance.Between(player.x, null, enemy.x, null) < 300 && Phaser.Math.Distance.Between(null, player.y, null, enemy.y) < 100) {
      console.log(Phaser.Math.Distance.Between(player.x, null, enemy.x, null))

      // if player to left of this AND this moving to right (or not moving)
      if (enemy.body.velocity.x > 0) {
        if (player.x < enemy.x) {
          // move this to left
          enemy.body.velocity.x = -150;
        }
      }
      // if player to right of this AND this moving to left (or not moving)
      else if (enemy.body.velocity.x <= 0) {
        if (player.x > enemy.x) {
          // move this to right
          enemy.body.velocity.x = 150; 
        }
      }
     
      if (Phaser.Math.Distance.Between(player.x, null, enemy.x, null) < 60) {
        enemy.anims.play('enemy_slash', true)
      }
      else{
        enemy.anims.play('enemy_run', true)
      }
    }
    else {
      enemy.anims.play('enemy_walk', true)
    }
    if (!enemy) {
      enemy.anims.play('enemy_die', true)
    }
    });
    
  }



}


function render() {
  game.debug.inputInfo(32, 32);
}

