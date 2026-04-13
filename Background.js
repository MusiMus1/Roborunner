export default class Background extends Phaser.GameObjects.TileSprite {
    constructor(scene, x, y,width, height, speed, bgTexture, zIndex){
        super(scene,x,y,width,height, bgTexture);
        this.speed = speed;
        this.setOrigin(0,0);
        this.setDepth(zIndex);
    }

    update(time, delta){
        this.tilePositionX += this.speed * delta / 1000; 
    }
}