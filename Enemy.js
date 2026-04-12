import Settings from "./Global.js";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spikeEnemy = false, fruitChance, canSpawnFruit = true) {
        super(scene, x, y, 'enemy_000'),
        this.canSpawnFruit = canSpawnFruit
        this.fruitChance = fruitChance
        this.spikeEnemy = spikeEnemy;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }   
    update() {
        if (!this.body.checkCollision.none){
            this.setVelocityX(-Settings.speed * !Settings.gameOver)
        }
        
        if(!this.spikeEnemy && this.x < 400 - (this.width * 0.6) && this.fruitChance > 0.5 && this.canSpawnFruit){
            this.scene.spawnFruits();
            this.canSpawnFruit = false;
        }
        if(this.x < -(this.width * 0.6) || this.y < -(this.height * 0.6)){
            if (!this.spikeEnemy){
                this.scene.addObstacle();
                if (!this.body.checkCollision.none) Settings.score += 1;
            }
            this.destroy();
        }

    }
}