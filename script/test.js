//USED TO TEST DIFFERENT WAYS TO EXPORT A CLASS

export default class test extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y);

        this.setTexture('brain');
        this.setPosition(x, y);
    }

    create () {  
        console.log("create i test")
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
    
          this.box = Phaser.GameObjects.Rectangle
    
    
          this.box = this.add.rectangle(null, null, 30, 30, 0xffffff);
          this.add.existing(this.box);
          this.box.active = false;
          this.box.alpha = 0.2;
          //this.creatCamera()
          //this.input.keyboard.on('keydown-UP', pressCheck);
      
      
          this.jumpCount = 0;
          this.nextJumps = 1;
    
          this.player.anims.play('idle', true);
          console.log("player create")
    
          this.physics.add.collider(this.player, layers.platforms);
          this.player.x = playerZone.start.x;
          this.player.y = playerZone.start.y;
    
          //this.cameras.main.setBounds(0, 0, window.width, window.height);
          //this.cameras.main.setZoom(2);
        }
    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        console.log("test")
        this.rotation += 0.01;
    }

}
