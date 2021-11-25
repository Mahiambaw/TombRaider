let emitter, particles, animCheck = 0
let attackBox, dbJump = 0;
let box;

class Background extends Phaser.Scene {


  constructor(config) {
    super({ key: "Background" })

    this.config = config;


  }


  preload() {
    this.load.image('tile', './assets/dungeoun/tileset.png')

    this.load.tilemapTiledJSON('map', './assets/dungeoun/level1.json')
    this.load.spritesheet('dude', '../assets/sprites/warrior.png', { frameWidth: 69, frameHeight: 44 });
    this.load.spritesheet('enemy', '../assets/sprites/enemy.png', { frameWidth: 69, frameHeight: 44 });
  }

  create() {
    const map = this.creatMap();
    const layers = this.creatLayer(map);

    const playerZone = this.getplayerZone(layers.playerZone)

    this.player = this.creatPlayer(playerZone);
    this.enemy = this.creatEnemy()

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
      frameRate: 8
    });
    //RUNNING
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('dude', { start: 6, end: 13 }),
      frameRate: 10,
      repeat: -1
    });
    //JUMPING
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('dude', { start: 41, end: 48 }),
      frameRate: 10
    });
    //ATTACK
    this.anims.create({
      key: 'slash',
      frames: this.anims.generateFrameNumbers('dude', { start: 75, end: 83 }),
      frameRate: 20,
      repeat: 0
    });
    //GLIDE
    this.anims.create({
      key: "glide",
      frames: this.anims.generateFrameNumbers('dude', { start: 85, end: 90 }),
      frameRate: 10,
      repeat: 0
    });
    //FALL
    this.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers('dude', { start: 46, end: 48}),
      frameRate: 10,
      repeat: 0
    })
    //----------------------END---------------------


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
    this.enemy.setImmovable(true);
    this.enemy.setSize(this.player.width, this.player.height)
    this.endOfLevel(playerZone.end, this.player)
    this.physics.add.collider(this.player, layers.platforms)
    this.physics.add.collider(this.enemy, layers.platforms)
    this.physics.add.collider(this.enemy, this.player)

    //---------------------- end ---------------------

    this.box = Phaser.GameObjects.Rectangle


    this.box = this.add.rectangle(null, null, 30, 30, 0xffffff);
    this.add.existing(this.box);
    this.box.active = false;
    this.box.alpha = 0.2;
    //this.creatCamera()
    //this.input.keyboard.on('keydown-UP', pressCheck);


    this.jumpCount = 0;
    this.nextJumps = 1;

    this.cameraFollow(this.player)


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

  creatPlayer({ start }) {

    let player = this.physics.add.sprite(start.x, start.y, 'dude');

    //let player = this.physics.add.sprite(1410, 500, 'dude');
    //console.log(start.x, start.y, "this is start")
    player.body.setGravityY(700);
    player.setCollideWorldBounds(true);
    player.setBodySize(20, 30);
    player.body.setOffset(18, 13);

    return player;

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
  cameraFollow(player) {
    const { height, wdith, zoomFactor } = config;
    //this.physics.world.setBounds(0, 0, wdith + mapOffset, height)
    this.cameras.main.setBounds(0, 0, wdith, height).setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
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
    this.player.anims.play('idle', true);

  }



  update() {

    const onFloor = this.player.body.onFloor(); // checks if the player has touched the platform collider 
    const cursors = this.input.keyboard.createCursorKeys();
    const space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    const isUpDown = Phaser.Input.Keyboard.JustDown(cursors.up)

    this.player.on('animationcomplete', () => {animCheck = false});

    //----------------PLAY ANIMATIONS------------------
    //HOLDING LEFT
    if (cursors.left.isDown) {
      //SET RUNNING SPEED TO 300 TO LEFT
      this.player.setVelocityX(-300);
      //IF WE ARE TOUCHING THE GROUND AND NOT ATTACKING DO "RUN" ANIMATION
      if (this.player.body.blocked.down && !animCheck) this.player.anims.play('run', true);
      //FLIP SPRITE TO THE LEFT
      this.player.flipX = true;
    }


    //HOLDING RIGHT, SEE ABOVE
    else if (cursors.right.isDown) {
      this.player.setVelocityX(300);
      if (this.player.body.blocked.down && !animCheck) this.player.anims.play('run', true);
      this.player.flipX = false;
    }


    //IF WE ARE NOT DOING ANYTHING DO THE IDLE ANIMATION
    else {
      //SET IT SO CHARACTER STOPS
      this.player.setVelocityX(0);
      if (this.player.body.blocked.down && !animCheck) this.player.anims.play('idle', true);
    }

    //IF YOU PRESS DOWN
    if (isUpDown && (onFloor || this.jumpCount < this.nextJumps) && !animCheck) {
      //SETS SPEED GOING DOWN
      this.player.setVelocityY(-600);
      this.jumpCount++
      if(!animCheck)this.player.anims.play('jump', true);
      console.log(this.jumpCount)
    }

    //FALLING FAST
    if(this.player.body.velocity.y != 0 && cursors.down.isDown) {
      this.player.setVelocityY(600);
    }

    //FALLING
    if (this.player.body.velocity.y > 0 && this.jumpCount == 0) {
      if(!animCheck)this.player.anims.play('fall', true);
    }

    //RESET JUMPCOUNT ON TOUCHING THE FLOOR
    if (onFloor) {
      this.jumpCount = 0;
    }

    //GLIDING
    if (ctrl.isDown && onFloor && this.player.body.velocity.x != 0) {
      this.player.anims.play('glide', true)
      animCheck = true;
    }
 

    //ATTACK ANIMATION IF YOU PRESS DOWN ARROW
    if (space.isDown) {
      this.player.anims.play('slash', true);
      //MAKE HITBOX FOR WEAPON ACTIVE
      //this.box.active = true
      //MAKE SURE THE ANIMATION GETS TO RUN
      animCheck = true;
    }

    //ENABLE ATTACK WHEN SLASHING
    if(this.player.anims.currentAnim.key == "slash") {
      this.box.active = true;
    }
    //DISABLE ATTACKING WHEN NOT SLASHING
    else {
      this.box.active = false;
    }

    if(this.player.anims.currentAnim.key == "glide") {
      this.player.setBodySize(20, 15);
      this.player.body.setOffset(18, 28);
    }

    else {
      this.player.setBodySize(20, 30);
      this.player.body.setOffset(18, 13);
    }

    //IF PLAYER IS TURNED TO THE RIGHT
    if (!this.player.flipX) {
      this.box.x = this.player.x + 20;
      this.box.y = this.player.y + 5;
      //SET POSITION OF SPRITE HITBOX TO CENTER OF SPRITE
      if(this.player.anims.currentAnim.key != "glide")this.player.body.setOffset(18, 13);
    }
    //IF PLAYER IS TURNED TO THE LEFT
    if (this.player.flipX) {
      this.box.x = this.player.x - 20;
      this.box.y = this.player.y + 5;
      //SET POSITION OF SPRITE HITBOX TO CENTER OF SPRITE
      if(this.player.anims.currentAnim.key != "glide")this.player.body.setOffset(30, 13);
    }

    

    if (this.player.body.blocked.down) dbJump = 0;
    //console.log(player.y);
  }

}


function render() {
  game.debug.inputInfo(32, 32);
}

