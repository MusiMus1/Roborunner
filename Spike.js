import Settings from './Global.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, isLast = false) {
        super(scene, x, y, 'spike')
        this.isLast = isLast;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(time, delta) {
        if (!this.body.checkCollision.none){
            this.setVelocityX(-Settings.speed * !Settings.gameOver)
        }

        if((this.x < -(this.width * 0.6) || this.y < -(this.height * 0.6))){
            if (this.isLast){
                this.scene.addObstacle();
            }
            this.destroy();
        }

    }
}