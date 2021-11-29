

class HealthBar {
  constructor(scene, x, y, scale = 1, health) {
    // creat an  object from the pahser 
    this.bar = new Phaser.GameObjects.Graphics
      (scene);

    // allows the bar to follow the camera

    this.x = x / scale;
    this.y = y / scale;
    this.scale = scale;
    this.value = health;
    this.depth = 100;
    this.size = {
      width: 50,
      height: 10

    }
    // defines what each heatlth will have per pixel 
    this.pixlePerHealth = this.size.width / this.value;
    // addes the bar to the existing scene 
    scene.add.existing(this.bar);
    this.draw(this.x, this.y, this.scale);
  }

  //-----------------draw------------------------
  // draws the healthbar at the top
  draw(x, y, scale) {
    this.bar.clear();
    // get the size from the constructor
    const { width, height } = this.size;
    const margin = 2;
    //creats a black bar 
    this.bar.fillStyle(0x0000);
    this.bar.fillRect(x, y, width + margin, height + margin)
    // creat a whilte bar
    this.bar.fillStyle(0xFFFFFF);
    this.bar.fillRect(x + margin, y + margin, width - margin, height - margin)
    // fill the green bar 
    const healthWidth = Math.floor(this.value * this.pixlePerHealth)
    this.bar.fillStyle(0x00FF00);
    if (healthWidth > 0) {
      this.bar.fillRect(x + margin, y + margin, healthWidth - margin, height - margin)
    }

    return this.bar.setScrollFactor(0, 0).setScale(scale).setDepth(99);
  }
  // ---------------- end of draw-----------

  // decrease health

  decrease(amount) {
    this.value -= amount;
    if (this.value == 0) {
      this.value = 0;
      console.log("dead");
    }
    else {
      this.draw(this.x, this.y, this.scale)
    }


  }

}