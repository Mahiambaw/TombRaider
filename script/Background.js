let emitter, particles, animCheck = 0
let attackBox, dbJump = 0;
let box;
let stepLimit = 100;
let center;
let clickStart = false;

class Background extends Phaser.Scene {


  constructor(config) {
    super({ key: "Background" })

    this.config = config;


  }


  preload() {
    this.load.image('tile', './assets/dungeoun/tileset.png')

    this.load.tilemapTiledJSON('map', './assets/dungeoun/level1.json')
    this.load.spritesheet('dude', '../assets/sprites/warrior.png', { frameWidth: 69, frameHeight: 44 });
    this.load.spritesheet('enemy', '../assets/sprites/enemy.png', { frameWidth: 41.4, frameHeight: 41.4 });
    
    this.load.image('button', '../assets/btn/a.png')
    this.load.image('helpBox', '../assets/btn/help.png')
    this.load.image('closeHelpBox', '../assets/btn/close.png')
  }

  create() {
    const map = this.creatMap();
    const layers = this.creatLayer(map);

    const playerZone = this.getplayerZone(layers.playerZone)

    this.player = this.creatPlayer(playerZone);
    this.enemy = this.creatEnemy()
    this.menu = this.createMenu()
    
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
      frames: this.anims.generateFrameNumbers('dude', { start: 46, end: 48 }),
      frameRate: 10,
      repeat: 0
    })
    //----------------------END---------------------


    // enemy animation --------------------
    this.anims.create({
      key: 'enemy_idle',
      frames: this.anims.generateFrameNumbers('enemy', { start: 66, end: 67 }),
      frameRate: 8,
      repeat: -1

    })

    this.anims.create({
      key: 'enemy_run',
      frames: this.anims.generateFrameNumbers('enemy', { start: 80, end: 88 }),
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
    /////////////////////////////////////////////////////
    //  // enemy weapon properties
    //  enemyWeapon = game.add.weapon(5, 'enemy-bullet');
    //  enemyWeapon.fireRate = 250;
    //  enemyWeapon.bulletSpeed = 400;
    //  enemyWeapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;

    //  enemyWeapon.onFire.add(function() {
    //      enemyFireSound.play();
    //  });
    enemy.body.velocity.x = 100;
    // game.rnd.integerInRange(125, 175) * game.rnd.sign();
    enemy.stepCount = 0
    // game.rnd.integerInRange(0, stepLimit);

    enemy.body.bounce.x = 1;
    // platforms.setAll('body.immovable', true);
    
/////////////////////////////////////////////////////////////////////


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

  createMenu() {
    center = {
      x:this.physics.world.bounds.width / 2.5,
      y:this.physics.world.bounds.height / 1.5
    }
  //creat a menu
      // this.add.image(center.x , center.y  * 0.20, 'title')
      //---------------------start
      let startButton = this.add.image(center.x , center.y -150 , 'button')
      startButton.setScale(1 , 2)
      this.startText = this.add.text(center.x, center.y -150,  ' START ' , {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: 30
        });
        this.startText.setOrigin(0.5, 0.5);
      //-----------------------help
      let helpButton = this.add.image(center.x , center.y , 'button')
      helpButton.setScale(1 , 2)
      this.helpText = this.add.text(center.x, center.y ,  ' HELP ' , {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: 30
        });
        this.helpText.setOrigin(0.5, 0.5);
      // ---------------------quit
      let quitButton = this.add.image(center.x , center.y + 150 , 'button')
      quitButton.setScale(1 , 2)
      this.quitText = this.add.text(center.x, center.y + 150 ,  ' QUIT ' , {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: 30
        });
        this.quitText.setOrigin(0.5, 0.5);

      
      // this.sound.play('title-music', {
      //     loop :  true
      // })

      //----------------------help Box
      let helpBox = this.add.image(center.x , center.y , 'helpBox')
      helpBox.setScale(6 , 11)
      helpBox.visible = false;
      this.helpBoxText = this.add.text(center.x, center.y ,  ' helpBox ' , {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: 30
        });
        this.helpBoxText.setOrigin(0.5, 0.5);
        this.helpBoxText.visible = false;

        let closeHelpBox = this.add.image(center.x , center.y  , 'closeHelpBox')
        // closeHelpBox.setScale(1 , 2)
        closeHelpBox.setOrigin(-2.2, 5.7);
        closeHelpBox.visible = false;

      

      //-------------click on buttons-------------
        //----------------start
      startButton.setInteractive();
      startButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER,()=> {
          startButton.setScale (0.9 ,1.9)
          this.startText.setScale(.8)
      })
      startButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT,()=> {
          startButton.setScale(1 , 2)
          this.startText.setScale(1)
      })
      
      startButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN ,() => {
          clickStart = true 
          startButton.visible = false;
          this.startText.visible = false;
          helpButton.visible = false;
          this.helpText.visible = false;
          quitButton.visible = false;
          this.quitText.visible = false;
          })

          //------------------help
      helpButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER,()=> {
          helpButton.setScale (0.9 ,1.9)
          this.helpText.setScale(.8)
      })
      helpButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT,()=> {
          helpButton.setScale(1 , 2)
          this.helpText.setScale(1)
      })

      helpButton.setInteractive();
      helpButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN ,() => {
        helpBox.visible =true
        this.helpBoxText.visible = true
        closeHelpBox.visible = true
      })

      //------------------quit
      quitButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER,()=> {
          quitButton.setScale (0.9 ,1.9)
          this.quitText.setScale(.8)
      })
      quitButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT,()=> {
          quitButton.setScale(1 , 2)
          this.quitText.setScale(1)
      })
      quitButton.setInteractive();
      quitButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN ,() => {
          window.close()
      })


      //------------------close of helpBox
      closeHelpBox.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER,()=> {
        closeHelpBox.setScale (0.99 , 0.99)
      })
      closeHelpBox.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT,()=> {
        closeHelpBox.setScale(1 , 1)
      })
      closeHelpBox.setInteractive();
      closeHelpBox.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN ,() => {
        this.helpBoxText.visible = false;
        closeHelpBox.visible = false;
        helpBox.visible =false;
      })

  }





  update() {

    // if (clickStart = false) { 
    //   this.player.anims.play('idle', true);
    //   this.enemy.anims.play('enemy_idle', true)
    // }
    // else 
    if (clickStart)
    { 

    const onFloor = this.player.body.onFloor(); // checks if the player has touched the platform collider 
    const cursors = this.input.keyboard.createCursorKeys();
    const space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    const isUpDown = Phaser.Input.Keyboard.JustDown(cursors.up)

    this.player.on('animationcomplete', () => { animCheck = false });

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
      if (!animCheck) this.player.anims.play('jump', true);
      console.log(this.jumpCount)
    }

    //FALLING FAST
    if (this.player.body.velocity.y != 0 && cursors.down.isDown) {
      this.player.setVelocityY(600);
    }

    //FALLING
    if (this.player.body.velocity.y > 0 && this.jumpCount == 0) {
      if (!animCheck) this.player.anims.play('fall', true);
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
    if (this.player.anims.currentAnim.key == "slash") {
      this.box.active = true;
    }
    //DISABLE ATTACKING WHEN NOT SLASHING
    else {
      this.box.active = false;
    }

    if (this.player.anims.currentAnim.key == "glide") {
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
      if (this.player.anims.currentAnim.key != "glide") this.player.body.setOffset(18, 13);
    }
    //IF PLAYER IS TURNED TO THE LEFT
    if (this.player.flipX) {
      this.box.x = this.player.x - 20;
      this.box.y = this.player.y + 5;
      //SET POSITION OF SPRITE HITBOX TO CENTER OF SPRITE
      if (this.player.anims.currentAnim.key != "glide") this.player.body.setOffset(30, 13);
    }



    if (this.player.body.blocked.down) dbJump = 0;
    //console.log(player.y);
 
    // game.physics.arcade.collide(enemy, platforms);
    // this.physics.add.collide(enemy, platforms);
    // this.physics.add.overlap(player, enemy, touchEnemy, null, this);
    // game.physics.arcade.overlap(player, enemy, touchEnemy, null, this);
    // this.physics.add.collider(enemy, platforms, patrolPlatform, null, this);

        
    // console.log(Phaser.Math.Distance.Between(this.player.x, null, this.enemy.x, null))
    // see if enemy and player within 400px of each other
    if (Phaser.Math.Distance.Between(this.player.x, null, this.enemy.x, null) < 300 && Phaser.Math.Distance.Between(null, this.player.y, null, this.enemy.y) < 100) {

        // if player to left of enemy AND enemy moving to right (or not moving)
        if (this.enemy.body.velocity.x >= 0){               
            //  enemy.anims.play('enemy-run-left')
            if (this.player.x < this.enemy.x ) {
                // move enemy to left
                this.enemy.body.velocity.x = -150;
        }}
        // if player to right of enemy AND enemy moving to left (or not moving)
        else if (this.enemy.body.velocity.x <= 0) {                 
                // enemy.anims.play('enemy-run-right')
                if (this.player.x > this.enemy.x){
                    // move enemy to right
                    this.enemy.body.velocity.x = 150;
        }}
    }
           
    // enemyGroup.forEachAlive(function (enemy) {
        // if bottom positions equal (could be on same platform) AND player within 300px
        if (this.player.y == this.enemy.y && Phaser.Math.Distance.Between(this.player.x, null, this.enemy.x, null) < 300) {    
            // if player to left of enemy AND enemy moving to right
            if (this.player.x < this.enemy.x && this.enemy.body.velocity.x > 0) {
                // move enemy to left            
                this.enemy.body.velocity.x *= -1; // reverse direction
                // or could set directly: enemy.body.velocity.x = -150;        
                // could add other code - change enemy animation, make enemy fire weapon, etc.
                // enemyWeapon.fireAngle = -180;
                // enemyWeapon.fire();
            }
            // if player to right of enemy AND enemy moving to left
            else if (this.player.x > this.enemy.x && this.enemy.body.velocity.x < 0) {
                // move enemy to right
                this.enemy.body.velocity.x *= -1; // reverse direction
                // or could set directly: enemy.body.velocity.x = 150;
                // could add other code - change enemy animation, make enemy fire weapon, etc.
                // enemyWeapon.fireAngle = 0;
                // enemyWeapon.fire();
            }
        }
    // });
  
  // enemyGroup.forEachAlive(function (enemy) {
        // increase enemy's step counter
        this.enemy.stepCount++;
        // check if enemy's step counter has reach limit
        if (this.enemy.stepCount > stepLimit) {
            // reverse enemy direction
            this.enemy.body.velocity.x *= -1;
            // reset enemy's step counter
            this.enemy.stepCount = 0;
            // can add other code - change enemy animation, etc.
        }
      // });

  // enemyWeapon.trackSprite(enemy); // give weapon to this enemy
  // enemyWeapon.fireAngle = 0; // if necessary, change fire angle
  // enemyWeapon.fire();


  // this.enemy.enemyObject.setVelocityX(50*this.enemy.direction)

  // enemy.setVelocityX (200);


  if (this.enemy.body.velocity.x > 1){
    this.enemy.anims.play('enemy_run', true)
    this.enemy.flipX = true
   //  this.enemy.anims.play('enemy-run-right', true)
 }
 else if(this.enemy.body.velocity.x < -1){
    this.enemy.anims.play('enemy_run', true)
    this.enemy.flipX = false
   //  this.enemy.anims.play('enemy-run-left', true)
 }
 else {
   this.enemy.anims.play('enemy_idle', true)
  //  if (this.enemy.flipX){
  //   this.enemy.flipX =true
  //  this.enemy.anims.play('enemy_idle', true)
  // }
  // else {
  //   this.enemy.anims.play('enemy_idle', true)
  // }
 }
//......................
      
 
}
else { 
    this.player.anims.play('idle', true);
    this.enemy.anims.play('enemy_idle', true)
    this.enemy.body.velocity.x = 0;
  }
}

}


function render() {
  game.debug.inputInfo(32, 32);
}

// function loading()
// {
//   window.open (url);
//  //  onload= "loading()"
// }

