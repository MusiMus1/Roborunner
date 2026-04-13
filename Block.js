import Settings from "./Global.js";

export default class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, lastBlock = false, blockFamily = []) {
        super(scene, x, y, 'stone')
        this.lastBlock = lastBlock;
        this.blockFamily = blockFamily;
        this.alreadyBroke = false;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }   
    update() {
        if (this.blockFamily.length === 0 || !this.body) return;
        //console.log(this.blockFamily);
        for (let i = 0; i < this.blockFamily.length; i++){
            if (this.blockFamily[i].body.checkCollision.none && !this.body.checkCollision.none){
                this.throwBlock();
            }
        }

        this.body.velocity.y += 30 * this.body.checkCollision.none;

        if (!this.body.checkCollision.none){
            this.setVelocityX(-Settings.speed * !Settings.gameOver);
        } else {
            if(!this.alreadyBroke){
                this.scene.sound.play('block_break');
                this.alreadyBroke = true;
            }
        }

        if(this.x < -(this.width * 0.6) || this.y > 600){
            if (this.lastBlock){
                this.scene.addObstacle();
                Settings.score += 1;
            }   
            const index = this.blockFamily.indexOf(this);
            if (index > -1) this.blockFamily.splice(index, 1);
            
            this.destroy();
        }

    }

    throwBlock() {
            this.body.checkCollision.none = true;
            this.body.setAngularVelocity(50);
            this.body.setVelocity(this.scene.getRandomRange(50, 100), -300);
    }
    
}