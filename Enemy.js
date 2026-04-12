import Settings from "./Global.js";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spikeEnemy = false) {
        super(scene, x, y, 'enemy_000')
        this.spikeEnemy = spikeEnemy;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }   
    update() {
        if (!this.body.checkCollision.none){
            this.setVelocityX(-Settings.speed * !Settings.gameOver)
        }

        if(this.x < -(this.width * 0.6) || this.y < -(this.height * 0.6)){
            if (!this.spikeEnemy) this.scene.addObstacle();
            this.destroy();
        }

    }
}