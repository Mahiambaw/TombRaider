//CREATING VARIABLES SO THEY ARE ABLE TO BE CALLED IN ALL CLASSES
let player;
let mapName;
let map;
//let enemy;
let damageCheck = false;
let scoreText;
let key = 0;
let score = 0;
let keys;
let keyText;
let doorText;
let step;
let soundInterval = false;
let enemyGroup;
let collectable;
let hurt;
let keypickup;
let coinpickup;
let deathSound;
let menu;
let menuCheck = true;
let allowControls = false;
let doorOpen;
let slash;
let ost;



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
    this.load.spritesheet('spin', './assets/dungeoun/dimond_anim.png', { frameWidth: 30, frameHeight: 30 })

    this.load.image('key', './assets/level2/key.png')
    this.load.image('door', './assets/level2/lockdoorr.png')
    this.load.tilemapTiledJSON('map', './assets/dungeoun/level1.json')
    this.load.tilemapTiledJSON('map2', './assets/level2/cave.json')

    if(menuCheck) menu = this.scene.add('menu', Menu, true);

    enemyGroup = this.add.group();
    
    //-----------SOUNDS---------------
    this.load.audio('ost', './assets/sounds/OST.mp3')
    this.load.audio('step', './assets/sounds/dirt_run3.ogg');
    this.load.audio('dmg', './assets/sounds/hurt.wav');
    this.load.audio('deathsound', './assets/sounds/death.wav');
    this.load.audio('keypickup', './assets/sounds/win.wav');
    this.load.audio('coinpickup', './assets/sounds/coin.ogg');
    this.load.audio('dooropen', './assets/sounds/dooropen.wav');
    this.load.audio('slash', 'assets/sounds/slash.wav');

    //-----------ENDSOUNDS-------------
  }

  create() {
    console.log("background create")
    if(!menuCheck)allowControls = true;
    mapName = "map"
    map = this.creatMap(mapName);

    keypickup = this.sound.add('keypickup');
    hurt = this.sound.add('dmg');
    deathSound = this.sound.add('deathsound');
    step = this.sound.add('step');
    doorOpen = this.sound.add('dooropen');
    slash = this.sound.add('slash');
    coinpickup = this.sound.add('coinpickup');
    ost = this.sound.add('ost', {volume: 0.5, loop: true});

    let layers = this.creatLayer(map);
    let playerZone = this.getplayerZone(layers.playerZone)
    let enemySpawn = layers.enemyLayer;
    console.log(enemySpawn);
    // from playerZone  it gets x and y value of the object spesfied in the tile map 
    let x = playerZone.start.x;
    let y = playerZone.start.y;
    // gets the collectable object and display it 
    // const collecLayer = this.getCollectable(layers.collectLayer)
    player = new Player(this, x, y);
    //for each enemy object create:
    //enemy = new Enemy(this, 700, 500);
    //with position from tiled8

    enemySpawn.forEach((coordinates) => {
      enemyGroup.add(new Enemy(this, coordinates.x, coordinates.y));
    })

    
      

    this.physics.add.collider(player, layers.platforms)
    this.physics.add.collider(enemyGroup, layers.platforms)
    enemyGroup.getChildren().forEach((enemy) => {this.physics.add.overlap(player, enemy, () => {this.takeDamage(enemy)}, null, this)})




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


    this.anims.create({
      key: 'shine',
      frames: this.anims.generateFrameNumbers('spin', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    });

    collectable = this.getCollectable(layers.collectLayer);

    this.physics.add.overlap(player, collectable, this.oncollect)
    this.endOfLevel(playerZone.end, player);
    //this.physics.add.collider(this.enemy, this.player)
    //this.endOfLevel(playerZone.end, this.player)
    //---------------------- end ---------------------

    // animaition for dimond



    // ----------------score ------------
    // --------------- Adding Scroe----
    scoreText = this.add.text(1000, 240, 'score: 0', { fontSize: '20px', fill: 'lightgreen' });
    scoreText.setScrollFactor(0, 0).setScale(1.5).setDepth(99)
    // ------- end of score----------
    keyText = this.add.text(800, 240, 'Key', { fontSize: '20px', fill: 'lightgreen' });
    keyText.setScrollFactor(0, 0).setScale(1.5).setDepth(99);

    keyText.visible = false;

    doorText = this.add.text(800, 500, 'Key', { fontSize: '20px', fill: 'lightgreen' });


    //doorText.visible = false;


    //----- end------------
    //CREATE CAMERA IN THE BACKGROUND CLASS
    //NEED ONE CAMERA IN EACH CLASS BECAUSE THE BACKGROUND AND PLAYER CLASSES ARE SEPERATE SCENES

    this.cameras.main.setBounds(0, 0, window.width, window.height);
    this.cameras.main.setZoom(2);

    this.cameras.main.on('camerafadeoutcomplete', function () {
      console.log(player.body)
      animCheck = false;
      player.destroy();
      enemyGroup.getChildren().forEach((enemy) => {enemy.destroy()});
      console.log(player);
      this.scene.restart();// restart current scene
      console.log(player.body)  
  
    }, this);

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
    enemyGroup.getChildren().forEach((enemy) => {enemy.destroy()})
    collectable.getChildren().forEach((collect) => {collect.destroy()})

  }

  levelChange() {
    this.scene.pause();
    this.destroyMap();
    mapName = "map2";
    map = this.creatMap(mapName);
    let layers = this.creatLayer(map);
    let playerZone = this.getplayerZone(layers.playerZone)
    let enemySpawn = layers.enemyLayer;
    // from playerZone  it gets x and y value of the object spesfied in the tile map 
    let x = playerZone.start.x;
    let y = playerZone.start.y;
    player.x = x;
    player.y = y;

    enemySpawn.forEach((coordinates) => {
      enemyGroup.add(new Enemy(this, coordinates.x, coordinates.y));
    })

    this.physics.world.setBounds(0, 0, 3200, 1600);
    this.physics.add.collider(player, layers.platforms)
    enemyGroup.getChildren().forEach((enemy) => {this.physics.add.collider(enemy, layers.platforms); this.physics.add.overlap(player, enemy, () => {this.takeDamage(enemy)}, null, this)})
    // gets the collectable object and display it 

    let doorLayer = this.getDoorLayer(layers.doorLayer)
    const collectable = this.getCollectable(layers.collectLayer);
    const collectKey = this.addkeys(layers.keyLayer)
    const collectDoor = this.adddoor(doorLayer.door)

    this.physics.add.overlap(player, collectable, this.oncollect)

    this.physics.add.overlap(player, collectKey, this.keyCollect)
    this.physics.add.collider(player, collectDoor, this.doorCollect)

    this.scene.resume();
    player.anims.play('idle');
    allowControls = true;
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
    const keyLayer = map.getObjectLayer('keys').objects
    const doorLayer = map.getObjectLayer('door').objects
    const enemyLayer = map.getObjectLayer('enemies').objects;
    platforms.setCollisionByExclusion(-1, true);


    return {
      background,
      platforms,
      playerZone,
      collectLayer,
      doorLayer,
      keyLayer,
      enemyLayer
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

    collectables.playAnimation('shine')

    return collectables
  }
  addkeys(keyLayer) {
    const keys = this.physics.add.staticGroup();
    keyLayer.forEach((key) => {
      keys.get(key.x, key.y, "key")
    })
    return keys
  }
  adddoor(doorLayer) {
    const doors = this.physics.add.sprite(doorLayer.x, doorLayer.y, "door");
    doors.body.allowGravity = false;
    doors.setImmovable(true)

    return doors

  }

  // the first true will dsiable game object 
  // the second true will deactivate object 
  oncollect(player, collectable) {
    collectable.destroy();
    score += 10;
    coinpickup.play();

    scoreText.setText('Score: ' + score);

  }
  keyCollect(player, collectKey) {
    keypickup.play();
    collectKey.disableBody(true, true)
    key++;
    keyText.setText('Key: ' + key);
    keyText.visible = true;

  }
  doorCollect(player, doorLayer) {
    if (key == 2 && key != 0) {
      console.log(" all keyes have been collected")
      doorLayer.destroy();
      doorOpen.play();

    }
    else {
      console.log(" you need two keyes to pass")
    }
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
  getDoorLayer(doorLayer) {
    let doorLayers = doorLayer
    return {
      door: doorLayers[0],


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


  takeDamage(enemy) {
    
    if(player.alpha == 1 && enemy.active && enemy.alpha == 1) {
      player.hb.decrease(50);
      if(player.hb.value == 0) {
        deathSound.play();
        player.anims.play("death");
        animCheck = true;
        allowControls = false;
        /*enemy.active = false;
        enemy.alpha = 0;*/
        player.setVelocityX(0);
        this.cameras.main.fade(2000, "#ffffff");
        console.log("got hit")
      }
      else {
        hurt.play();
        player.alpha = 0.5;
        damageCheck = true;
        setTimeout(() => { player.alpha = 1; damageCheck = false }, 1000)
      }
    }
  }





  update() {


    if(allowControls) {
      //WHEN THE PLAYER CLASS EXISTS MAKE THE CAMERA FOLLOW THE PLAYER (BUGFIX)
      if (this.player) this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

      if (player.body.velocity.x != 0 && player.body.onFloor() && !soundInterval && !animCheck) step.play(), soundInterval = setInterval(() => {step.play(), console.log("check")}, 300);
      else if (player.body.velocity.x == 0 || !player.body.onFloor() || animCheck) {step.pause()}
      if ((player.body.velocity.y != 0 || animCheck || player.body.velocity.x == 0) && soundInterval != false) clearInterval(soundInterval), soundInterval = false;

      enemyGroup.getChildren().forEach((enemy) => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), box.getBounds()) && box.active && enemy.enemySituation == 1) {
          enemy.enemySituation = 0;
          enemy.anims.play('enemy_die', true)
          enemy.setVelocity(0);
          enemy.alpha = 0.9;
          setTimeout(() => {enemy.destroy()}, 1500)
          // enemy.setActive(false).setVisible(false);
          slash.play();
        }
        
        if (enemy.enemySituation == 1) {
          // see if this and player within 400px of each other
          if (enemy && Phaser.Math.Distance.Between(player.x, null, enemy.x, null) < 300 && Phaser.Math.Distance.Between(null, player.y, null, enemy.y) < 100) {

            // if player to left of this AND this moving to right (or not moving)
            if (enemy.body.velocity.x >= 0) {
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
            if (Phaser.Math.Distance.Between(player.x, null, enemy.x, null) < 80) {
              enemy.anims.play('enemy_slash', true)
            }
            else{
              enemy.anims.play('enemy_run', true)
            }
          }
          else { 
            enemy.anims.play('enemy_walk', true)
          }
        }
      });
    }
    
  
  else if(!allowControls && menuCheck) { 
      player.anims.play('idle', true);
      enemyGroup.getChildren().forEach((enemy) => {
        enemy.anims.play('enemy_idle', true)
        enemy.body.velocity.x = 0;
        enemy.flipX = false
      })
  }
  }
}


function render() {
  game.debug.inputInfo(32, 32);
}

