import Settings from './Global.js';

export default class Spike extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, isLast = false, fruitChance, canSpawnFruit = true) {
        super(scene, x, y, 'spike');
        this.fruitChance = fruitChance;
        this.isLast = isLast;
        this.canSpawnFruit = canSpawnFruit;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(time, delta) {
        if (!this.body.checkCollision.none){
            this.setVelocityX(-Settings.speed * !Settings.gameOver)
        }

        if(this.isLast && this.x < 400 - (this.width * 0.6) && this.fruitChance > 0.5 && this.canSpawnFruit){
            this.scene.spawnFruits();
            this.canSpawnFruit = false;
        }

        if((this.x < -(this.width * 0.6) || this.y < -(this.height * 0.6))){
            if (this.isLast){
                Settings.score += 1
                this.scene.addObstacle();
            }
            this.destroy();
        }

    }
}