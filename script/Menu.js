
let clickStart = false;
let center;

class Menu extends Phaser.Scene {
        constructor(config) {
            super({ key: "Menu" })
        
        
        
          }
  // gets the dta that is being sent from the Background class
  init() {
  }

  preload() {
    this.load.image('button', '../assets/btn/a.png')
    this.load.image('helpBox', '../assets/btn/help.png')
    this.load.image('closeHelpBox', '../assets/btn/close.png')
  }



  create() {

    center = {
        x:this.physics.world.bounds.width / 2,
        y:this.physics.world.bounds.height / 2
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
            allowControls = true 
            startButton.visible = false;
            this.startText.visible = false;
            helpButton.visible = false;
            this.helpText.visible = false;
            quitButton.visible = false;
            this.quitText.visible = false;
            enemyGroup.getChildren().forEach((enemy) => {
              // enemy.anims.play('enemy_idle', true)
              // enemyIdle  = true;
              enemy.body.velocity.x = 50;
              // enemy.flipX = false
            })

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

}
