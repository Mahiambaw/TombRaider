
let animCheck = 0;
let dbJump = 0;
let thingCheck = 0;
let box;

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "dude")
    scene.add.existing(this)
    scene.physics.add.existing(this)



    this.init()
    this.updateEvents()
  }


  init() {
    this.gravity = 700;
    this.jumpCount = 0;
    this.nextJumps = 1;
    this.health = 100;
    // creat a new object of the healthBar 
    // provide each of the values
    this.hb = new HealthBar(this.scene, 500, 250, 1.5, 100)


    this.body.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);

    this.setBodySize(20, 30);
    this.body.setOffset(18, 13);
    //this.box = this.creatBox();
    // creat animation 
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.ctrl = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    //ONLY SINGLE PRESS NOT HOLD
    // adding a box

    box = this.scene.add.rectangle(null, null, 30, 30, 0xffffff)
    box.active = false;
    //this.scene.add.existing(box);
    box.alpha = 0.2;
    //------------ end ---------------------

    // scene creation for the player 
    this.scene.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
      frameRate: 8
    });
    //RUNNING
    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNumbers('dude', { start: 6, end: 13 }),
      frameRate: 10,
      repeat: -1
    });
    //JUMPING
    this.scene.anims.create({
      key: 'jump',
      frames: this.scene.anims.generateFrameNumbers('dude', { start: 41, end: 48 }),
      frameRate: 10
    });
    //ATTACK
    this.scene.anims.create({
      key: 'slash',
      frames: this.scene.anims.generateFrameNumbers('dude', { start: 75, end: 83 }),
      frameRate: 20,
      repeat: 0
    });
    //GLIDE
    this.scene.anims.create({
      key: "glide",
      frames: this.scene.anims.generateFrameNumbers('dude', { start: 85, end: 90 }),
      frameRate: 10,
      repeat: 0
    });
    //FALL
    this.scene.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers('dude', { start: 46, end: 48 }),
      frameRate: 10,
      repeat: 0
    })
    // ------------------- end animation -----------------------------
    this.scene.cameras.main.setBounds(0, 0, window.width, window.height);
    this.scene.cameras.main.setZoom(2);
    //MAKE CAMERA FOLLOW PLAYER
    this.scene.cameras.main.startFollow(this, true, 0.5, 0.5);
    //---------- scene ending---------------
  }



  // listens to events happening on the update  

  updateEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update() {
    const isUpDown = Phaser.Input.Keyboard.JustDown(this.cursors.up)
    //CHECKS IF THE PLAYER HAS TOUCHED THE PLATFORM COLLIDER
    const onFloor = this.body.onFloor();
    //LOAD KEYBINDS


    //MAKING SLIDING AND SLASHING ANIMATIONS END
    this.on('animationcomplete', () => { animCheck = false });

    //----------------PLAY ANIMATIONS------------------
    //HOLDING LEFT
    if (this.cursors.left.isDown) {
      //SET RUNNING SPEED TO 300 TO LEFT
      this.setVelocityX(-300);
      //IF WE ARE TOUCHING THE GROUND AND NOT ATTACKING DO "RUN" ANIMATION
      if (this.body.blocked.down && !animCheck) this.anims.play('run', true);
      //FLIP SPRITE TO THE LEFT
      this.flipX = true;
    }


    //HOLDING RIGHT, SEE ABOVE
    else if (this.cursors.right.isDown) {
      this.setVelocityX(300);
      if (this.body.blocked.down && !animCheck) this.anims.play('run', true);
      this.flipX = false;
    }


    //IF WE ARE NOT DOING ANYTHING DO THE IDLE ANIMATION
    else {
      //SET IT SO CHARACTER STOPS
      this.setVelocityX(0);
      if (this.body.blocked.down && !animCheck) this.anims.play('idle', true);
    }

    //IF YOU PRESS DOWN
    if (isUpDown && (onFloor || this.jumpCount < this.nextJumps) && !animCheck) {
      //SETS SPEED GOING DOWN
      this.setVelocityY(-600);
      this.jumpCount++
      if (!animCheck) this.anims.play('jump', true);
      console.log(this.jumpCount)
    }

    //FALLING FAST
    if (this.body.velocity.y != 0 && this.cursors.down.isDown) {
      this.setVelocityY(600);
    }

    //FALLING
    if (this.body.velocity.y > 0 && this.jumpCount == 0) {
      if (!animCheck) this.anims.play('e', true);
    }

    //RESET JUMPCOUNT ON TOUCHING THE FLOOR
    if (onFloor) {
      this.jumpCount = 0;
    }

    //GLIDING
    if (this.ctrl.isDown && onFloor && this.body.velocity.x != 0) {
      this.anims.play('glide', true)
      animCheck = true;
    }


    // //ATTACK ANIMATION IF YOU PRESS DOWN ARROW
    if (this.space.isDown) {
      this.anims.play('slash', true);
      //MAKE HITBOX FOR WEAPON ACTIVE
      box.active = true
      //MAKE SURE THE ANIMATION GETS TO RUN
      animCheck = true;
    }

    //ENABLE ATTACK WHEN SLASHING
    if (this.anims.currentAnim !== null) {
      if (this.anims.currentAnim.key == "slash") {
        box.active = true;
      }
      //DISABLE ATTACKING WHEN NOT SLASHING
      else {
        box.active = false;
      }

      // //GLIDING ANIMATION
      if (this.anims.currentAnim.key == "glide") {
        this.setBodySize(20, 15);
        if (!this.flipX) this.player.body.setOffset(18, 28);
        else this.body.setOffset(30, 28);
      }

      //SET SIZE BACK TO NORMAL AFTER SLIDE
      else {
        this.setBodySize(20, 30);
      }

      //IF PLAYER IS TURNED TO THE RIGHT
      if (!this.flipX) {
        box.x = this.x + 20;
        box.y = this.y + 5;
        //     //SET POSITION OF SPRITE HITBOX TO CENTER OF SPRITE
        if (this.anims.currentAnim.key != "glide") this.body.setOffset(18, 13);
      }
      //   //IF PLAYER IS TURNED TO THE LEFT
      if (this.flipX) {
        box.x = this.x - 20;
        box.y = this.y + 5;
        //     //SET POSITION OF SPRITE HITBOX TO CENTER OF SPRITE
        if (this.anims.currentAnim.key != "glide") this.body.setOffset(30, 13);
      }

      //   //CHECK ORDER OF LOADING FUNCTIONS
      if (thingCheck == 0) console.log("player update");
      thingCheck = 1;



    }
  }
}