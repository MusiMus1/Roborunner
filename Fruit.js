import Settings from "./Global.js";

export default class Fruit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        const randomFruitOptions = ['apple','banana','cherry','strawberry'];
        const choosenFruit = Phaser.Utils.Array.GetRandom(randomFruitOptions);

        super(scene, x, y, choosenFruit);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(6)
    }   
    update(time, delta) {
        if (!this.body.checkCollision.none){
            this.setVelocityX(-Settings.speed * !Settings.gameOver)
        } else {
            this.y -= 600 * delta / 1000
            this.alpha -= 5 * delta / 1000
        }

        if(this.x < -(this.width * 0.65) || this.y < -(this.height * 0.65)){
            this.destroy();
        }

    }
}