let animCheck = 0;
let dbJump = 0;
let thingCheck = 0;

class Player extends Phaser.Scene {
    constructor(config) {
        super({ key: "Player" })
        this.config = config;
      }

    preload () {
        this.load.spritesheet('dude', '../assets/sprites/warrior.png', { frameWidth: 69, frameHeight: 44 });
        console.log("player preload")
    }

    
    create () {  
        
    this.player = this.physics.add.sprite(0, 0, 'dude');

    //let player = this.physics.add.sprite(1410, 500, 'dude');
    //console.log(start.x, start.y, "this is start")
    this.player.body.setGravityY(700);
    this.player.setCollideWorldBounds(true);
    console.log(this.player.body.collideWorldBounds)
    this.player.setBodySize(20, 30);
    this.player.body.setOffset(18, 13);
    
    //----------------------ANIMATIONS---------------------
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

      //ADD ATTACK BOX
      this.box = Phaser.GameObjects.Rectangle
      this.box = this.add.rectangle(null, null, 30, 30, 0xffffff);
      this.add.existing(this.box);
      this.box.active = false;
      this.box.alpha = 0.2;
      //this.creatCamera()
      //this.input.keyboard.on('keydown-UP', pressCheck);
  
      //SETTING DOUBLEJUMP
      this.jumpCount = 0;
      this.nextJumps = 1;

      //ERRORHANDLING
      this.player.anims.play('idle', true);
      console.log("player create")

      //CREATE COLLIDER BETWEEN PLAYER AND PLATFORMS
      this.physics.add.collider(this.player, layers.platforms);
      //SETTING PLAYER POSITIONING TO SET POSITION FROM TILED
      this.player.x = playerZone.start.x;
      this.player.y = playerZone.start.y;

      //CAMERA FOR THE PLAYER CLASS
      this.cameras.main.setBounds(0, 0, window.width, window.height);
      this.cameras.main.setZoom(2);
      //MAKE CAMERA FOLLOW PLAYER
      this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
    }

    update () {
        //CHECKS IF THE PLAYER HAS TOUCHED THE PLATFORM COLLIDER
        const onFloor = this.player.body.onFloor(); 
        //LOAD KEYBINDS
        const cursors = this.input.keyboard.createCursorKeys();
        const space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        //ONLY SINGLE PRESS NOT HOLD
        const isUpDown = Phaser.Input.Keyboard.JustDown(cursors.up)
    
        //MAKING SLIDING AND SLASHING ANIMATIONS END
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
    
        //GLIDING ANIMATION
        if (this.player.anims.currentAnim.key == "glide") {
          this.player.setBodySize(20, 15);
          if(!this.player.flipX)this.player.body.setOffset(18, 28);
          else this.player.body.setOffset(30, 28);
        }
    
        //SET SIZE BACK TO NORMAL AFTER SLIDE
        else {
          this.player.setBodySize(20, 30);
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
    
        //CHECK ORDER OF LOADING FUNCTIONS
        if(thingCheck == 0)console.log("player update");
        thingCheck = 1;

        
        
    }

}