let stepLimit = 100;

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy")
    scene.add.existing(this)
    scene.physics.add.existing(this)



    this.init()
    this.updateEvents()
  }


  init() {

    // this animation --------------------
    this.scene.anims.create({
        key: 'enemy_idle',
        frames: this.scene.anims.generateFrameNumbers('enemy', { start: 66, end: 67 }),
        frameRate: 8,
        repeat: -1
  
      })
  
      this.scene.anims.create({
        key: 'enemy_run',
        frames: this.scene.anims.generateFrameNumbers('enemy', { start: 80, end: 88 }),
        FrameRate: 8,
        repeat: -1
  
      })
      this.scene.anims.create({
        key: 'enemy_Back',
        frames: this.scene.anims.generateFrameNumbers('enemy', { start: 39, end: 46 }),
        FrameRate: 8,
        repeat: -1
  
      })
      this.scene.anims.create({
        key: 'enemy_Front',
        frames: this.scene.anims.generateFrameNumbers('enemy', { start: 47, end: 54 }),
        FrameRate: 8,
        repeat: -1
  
      })
      //-------- end-----------------


    //let player = this.physics.add.sprite(1410, 500, 'dude');
    //console.log(start.x, start.y, "this is start")

    this.body.setGravityY(700);
    this.setCollideWorldBounds(true);

    //this.body.setOffset(18, 13);
    /////////////////////////////////////////////////////
    //  // this weapon properties
    //  thisWeapon = game.add.weapon(5, 'this-bullet');
    //  thisWeapon.fireRate = 250;
    //  thisWeapon.bulletSpeed = 400;
    //  thisWeapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;

    //  thisWeapon.onFire.add(function() {
    //      thisFireSound.play();
    //  });
    this.body.velocity.x = 100;
    // game.rnd.integerInRange(125, 175) * game.rnd.sign();
    this.stepCount = 0
    // game.rnd.integerInRange(0, stepLimit);

    this.body.bounce.x = 1;
    // platforms.setAll('body.immovable', true);
  }



  // listens to events happening on the update  

  updateEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update() {
  
  if(allowControls && this.body) {
    // thisGroup.forEachAlive(function (this) {
          // increase this's step counter
          this.stepCount++;
          // check if this's step counter has reach limit
          if (this.stepCount > stepLimit) {
              // reverse this direction
              this.body.velocity.x *= -1;
              // reset this's step counter
              this.stepCount = 0;
              // can add other code - change this animation, etc.
          }
        // });



      if (this.body.velocity.x > 1){
        this.anims.play('enemy_run', true)
        this.flipX = true
    }
    else if(this.body.velocity.x < -1){
        this.anims.play('enemy_run', true)
        this.flipX = false
    }
    else {
      this.anims.play('enemy_idle', true)
    }
    //......................

  }
    }
}
