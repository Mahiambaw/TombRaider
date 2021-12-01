let enemy;
let stepLimit = 100;
let center;
let stepCount;
let enemyGroup;
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
      frames: this.scene.anims.generateFrameNumbers('enemy', { start: 67, end: 68 }),
      frameRate: 8,
      repeat: -1

    })

    this.scene.anims.create({
      key: 'enemy_walk',
      frames: this.scene.anims.generateFrameNumbers('enemy', { start: 80, end: 88 }),
      FrameRate: 8,
      repeat: -1

    })
    // this.scene.anims.create({
    //   key: 'enemy_Back',
    //   frames: this.scene.anims.generateFrameNumbers('enemy', { start: 39, end: 46 }),
    //   FrameRate: 8,
    //   repeat: -1

    // })
    // this.scene.anims.create({
    //   key: 'enemy_Front',
    //   frames: this.scene.anims.generateFrameNumbers('enemy', { start: 47, end: 54 }),
    //   FrameRate: 8,
    //   repeat: -1

    // })

    this.scene.anims.create({
      key: 'enemy_slash',
      frames: this.scene.anims.generateFrameNumbers('enemy', { start: 20, end: 24 }),
      FrameRate: 8,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'enemy_run',
      frames: this.scene.anims.generateFrameNumbers('enemy', { start: 90, end: 99 }),
      FrameRate: 8,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'enemy_die',
      frames: this.scene.anims.generateFrameNumbers('enemy', { start: 30, end: 35 }),
      FrameRate: 8,
      repeat: -1
    })
      //-------- end-----------------


    // this.body.setGravityY(700);
    // this.setCollideWorldBounds(true);
    // this.body.velocity.x = 100;
    // this.stepCount = 0
    // this.body.bounce.x = 1;
    // // platforms.setAll('body.immovable', true);

    enemyGroup.getChildren().forEach(function(this) {
      this.setCollideWorldBounds(true);
      this.body.setGravityY(700);
      this.body.velocity.x = 50
      //  Phaser.Math.Between(125, 175)* game.rnd.sign();
      this.stepCount =  Phaser.Math.Between(0, stepLimit)
      enemy.body.bounce.x = 1;
      // physics.add.collider(enemy, platforms);
  });

  }



  // listens to events happening on the update  

  updateEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update() {
  
    enemyGroup.getChildren().forEach(function(this) {
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
     

        if (this.body.velocity.x > 0){
          // this.anims.play('enemy_run', true)
          this.flipX = true
       }
       else if(this.body.velocity.x < 0){
          // this.anims.play('enemy_run', true)
          this.flipX = false
       }
       else {
         this.anims.play('enemy_idle', true)
       } 
    });
    //......................
  }
}
