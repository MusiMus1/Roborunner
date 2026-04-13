import Settings from './Global.js';
import Enemy from './Enemy.js';
import Spike from './Spike.js';
import Block from './Block.js';
import Fruit from './Fruit.js';
import Background from './Background.js';

// Game Settings
let isGameOver = false;
let speedFactor = 5;
let obstacleOptions = [
    0, // Spikes
    1, // Breakable Blocks
    2, // Enemy
]

// Player Settings
const const_multiplier = 1.5;
let gravityMultiplier;
let gravity = 30.0;
let isGrounded = false;
let jumpForce = 700.0;
let normalBodySize = 85;
let spinBodySize = 85;

// Audio Settings
let alreadyGameOver = false;
let alreadyLanded = true;

export default class MainScene extends Phaser.Scene {
    constructor()
    {
        super('MainScene');
    }
    preload() {
        // Fruits
        this.load.image('apple', 'assets/apple.png');
        this.load.image('banana', 'assets/banana.png');
        this.load.image('cherry', 'assets/cherry.png');
        this.load.image('strawberry', 'assets/strawberry.png');
        
        // Environment
        this.load.image('grass', 'assets/patch_of_grass.png');
        this.load.image('dirt', 'assets/block_of_dirt.png')
        this.load.image('stone', 'assets/block_of_stone.png');
        this.load.image('spike', 'assets/spike.png');
        
        //Player frames
        this.load.image('player_000', 'assets/player/frame0000.png');
        this.load.image('player_001', 'assets/player/frame0001.png');
        this.load.image('player_002', 'assets/player/frame0002.png');
        this.load.image('player_003', 'assets/player/frame0003.png');
        this.load.image('player_004', 'assets/player/frame0004.png');
        this.load.image('player_005', 'assets/player/frame0005.png');
        this.load.image('player_006', 'assets/player/frame0006.png');
        this.load.image('player_007', 'assets/player/frame0007.png');
        this.load.image('player_008', 'assets/player/frame0008.png');
        this.load.image('player_009', 'assets/player/frame0009.png');
        this.load.image('player_010', 'assets/player/frame0010.png');
        this.load.image('player_011', 'assets/player/frame0011.png');
        this.load.image('player_012', 'assets/player/frame0012.png');
        this.load.image('player_013', 'assets/player/frame0013.png');
        this.load.image('player_014', 'assets/player/frame0014.png');
        this.load.image('player_015', 'assets/player/frame0015.png');

        //Enemy Frames
        this.load.image('enemy_000', 'assets/enemy/quadro0000.png');
        this.load.image('enemy_001', 'assets/enemy/quadro0001.png');
        this.load.image('enemy_002', 'assets/enemy/quadro0002.png');
        this.load.image('enemy_003', 'assets/enemy/quadro0003.png');
        this.load.image('enemy_004', 'assets/enemy/quadro0004.png');
        this.load.image('enemy_005', 'assets/enemy/quadro0005.png');

        // Backgronds
        this.load.image('sky', 'assets/sky_bg.png');
        this.load.image('clouds', 'assets/clouds_bg.png');
        this.load.image('clouds_2', 'assets/clouds_bg_2.png');
        this.load.image('mountains', 'assets/mountains_bg.png')

        //Sounds
        this.load.audio('theme', 'sounds/RunMusic.wav');
        this.load.audio('player_land', 'sounds/PlayerLand.wav');
        this.load.audio('player_spin', 'sounds/PlayerSpin.wav');
        this.load.audio('player_jump', 'sounds/SFX_Jump_08.wav');
        this.load.audio('enemy_hit', 'sounds/EnemyHit.wav');
        this.load.audio('collect_fruit', 'sounds/CollectFruit.wav');
        this.load.audio('block_break', 'sounds/BlockBreak.wav');
        this.load.audio('game_over', 'sounds/GameOver.wav');

    }

    create() {
        // Player
        this.player = this.physics.add.sprite(120, 380, 'player_000',).setDepth(5);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.6, 0.6);
        //// Player Animations
        // Player Running
        this.anims.create({
            key: 'player_run',
            frames: [
                {key : 'player_000'},
                {key : 'player_001'},
                {key : 'player_002'},
                {key : 'player_003'},
                {key : 'player_004'},
                {key : 'player_005'},
            ],
            frameRate: 10,
            repeat: -1

        }) 
        // Player Jumping
        this.anims.create({
            key: 'player_jump',
            frames: [
                {key : 'player_006'},
                {key : 'player_007'},
                {key : 'player_008'},
            ],
            frameRate: 12,
            repeat: 0
            
        }) 
        // Player Falling
        this.anims.create({
            key: 'player_fall',
            frames: [
                {key : 'player_009'},
                {key : 'player_010'},
                {key : 'player_011'},
            ],
            frameRate: 12,
            repeat: 0

        })
        // Player Spinning
        this.anims.create({
            key: 'player_spin',
            frames: [
                {key : 'player_012'},
                {key : 'player_013'},
                {key : 'player_014'},
            ],
            frameRate: 16,
            repeat: 1
        })
        // Player Die
        this.anims.create({
            key: 'player_die',
            frames: [{key : 'player_015'}],
            frameRate: 1,
            repeat: 0
        })

        // Enemy Animations
        // Enemy Idle
        this.anims.create({
            key: 'enemy_idle',
            frames: [
                {key : 'enemy_000'},
                {key : 'enemy_001'},
                {key : 'enemy_002'},
                {key : 'enemy_003'},
            ],
            frameRate: 10,
            repeat: -1
        })
        // Enemy Die
        this.anims.create({
            key : 'enemy_die',
            frames: [
                {key : 'enemy_004'},
                {key : 'enemy_005'}
            ],
            frameRate: 6,
            repeat: 0
        })

        //// Player Physics
        this.player.setBodySize(95, 116);
        this.player.setOffset(69, 87);

        // Ground
        this.ground = this.add.tileSprite(400, 460, 800, 76.8, 'grass').setDepth(9);
        this.ground.tileScaleX = 0.6;
        this.ground.tileScaleY = 0.6;
        this.physics.add.existing(this.ground, true)

        this.underground = this.add.tileSprite(400, 526 + 76.8, 800, 76.8 * 3, 'dirt').setDepth(10);
        this.underground.tileScaleX = 0.6;
        this.underground.tileScaleY = 0.6;     

        // Collision Handling
        this.physics.add.collider(this.player, this.ground, (obj1, obj2) => {
            isGrounded = true;
        });

        // Input Keys
        this.jumpKeys = this.input.keyboard.addKeys('UP,W,SPACE');
        this.spinKeys = this.input.keyboard.addKeys('DOWN,S');

        this.spikeGroup =  this.physics.add.group({
            classType: Spike,
            runChildUpdate: true
        })

        this.enemyGroup = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        })

        this.blockGroup = this.physics.add.group({
            classType: Block,
            runChildUpdate: true
        })

        this.fruitGroup = this.physics.add.group({
            classType: Fruit,
            runChildUpdate: true
        })

        // Enemy Overlap
        this.physics.add.overlap(this.enemyGroup, this.player, (playerInstance, enemyInstance) => {
            if (this.isPlaying(this.player, "player_spin")){
                this.sound.play('enemy_hit');
                enemyInstance.body.checkCollision.none = true;
                enemyInstance.anims.play('enemy_die')
                enemyInstance.setAngularVelocity(700);
                enemyInstance.setVelocity(800, -800);
                if (!isGrounded) this.player.setVelocityY(-jumpForce);
                Settings.score += 2;
            } else {
                this.kill();
            }
        }, null, this)

        // Spike Overlap
        this.physics.add.overlap(this.spikeGroup, this.player, () => {
            this.kill();
        })

        // Block Overlap
        this.physics.add.overlap(this.blockGroup, this.player, (playerInstance, blockInstance) =>{
            if (this.isPlaying(this.player, "player_spin")){
                blockInstance.body.checkCollision.none = true;
                blockInstance.throwBlock();
            } else{
                this.kill();
            }
        })

        // Fruit Overlap
        this.physics.add.overlap(this.fruitGroup, this.player, (playerInstance, fruitInstance) =>{
            this.sound.play('collect_fruit');
            Settings.score += 5;
            fruitInstance.body.checkCollision.none = true;
        })

        // Music Settings
        this.music = this.sound.add('theme');
        this.music.play({loop: true, volume: 0.5});
        this.gameOver = this.sound.add('game_over');

        // Background Settings
        this.sky = this.add.existing(new Background(this,0,0,0,0,0,'sky',0));
        this.mountains = this.add.existing(new Background(this,0,0,0,0,Settings.speed/10,'mountains',3));
        this.clouds = this.add.existing(new Background(this,0,0,0,0,Settings.speed/30,'clouds',2));
        this.farClouds = this.add.existing(new Background(this,0,0,0,0,Settings.speed/60,'clouds_2',1));
        this.addObstacle();
    }

    update(time, delta) {
        if (Settings.gameOver) {
            this.player.anims.play('player_die');
            this.player.setVelocity(0,0);
            return;
        }
        const spinAction = [this.spinKeys.DOWN, this.spinKeys.S];
        const jumpAction = [this.jumpKeys.UP, this.jumpKeys.W, this.jumpKeys.SPACE];
        
        gravityMultiplier = (this.player.body.velocity.y > 0) ? const_multiplier : 1.0;
        this.ground.tilePositionX += ((Settings.speed * delta) / 1000) / this.ground.tileScaleX;
        this.underground.tilePositionX += ((Settings.speed * delta) / 1000) / this.ground.tileScaleX;
        this.player.body.velocity.y += gravity * gravityMultiplier * !isGrounded;
        this.player.body.width = (this.isPlaying(this.player, "player_spin"))? spinBodySize : normalBodySize;
        
        if (this.actionJustDown(jumpAction) && isGrounded){
            this.sound.play('player_jump');
            console.log('oi');
            this.player.setVelocityY(-jumpForce);
            isGrounded = false;
            alreadyLanded = false;
        }

        this.anim_manager();

        if (this.actionJustDown(spinAction)){
            this.sound.play('player_spin');
            this.player.setVelocityY(jumpForce * !isGrounded);
            this.player.play('player_spin').chain('player_fall');
        }

        this.mountains.update(time, delta);
        this.clouds.update(time, delta);
        this.farClouds.update(time, delta);
        
    }

    anim_manager(){
        if (this.isPlaying(this.player, 'player_spin')) return;

        if (isGrounded){
            if(!alreadyLanded){
                this.sound.play('player_land');
                alreadyLanded = true;
            }
            this.player.play('player_run', true);
        } else {
            if (this.player.body.velocity.y >= 0 && !this.isPlaying(this.player, 'player_fall')){ 
                this.player.play('player_fall', true);
            
            } else if (this.player.body.velocity.y < 0 && !this.isPlaying(this.player, 'player_jump')) {
                this.player.play('player_jump', true)
            
            }
        }

    }

    isPlaying(obj, anim){
        return obj.anims.getName() === anim;
    }

    actionJustDown(action){
        return action.some(key => Phaser.Input.Keyboard.JustDown(key));
    }

    addObstacle(incrementSpeed = true){
        Settings.speed += speedFactor
        let obstacleIdx = this.getRandomRange(0, obstacleOptions.length - 1);
        let objectInstance;

        switch (obstacleIdx) {
            case 0:
                const specialSpikes = Math.random() > 0.5;  
                let spikesNumber = (specialSpikes) ? 10 : this.getRandomRange(3, 6)
                const spikeSpacing = 128 * 0.6/2;
                if (specialSpikes){
                    spikesNumber = 10;
                    const enemyInstance = this.enemyGroup.get(800 + (spikeSpacing * spikesNumber)/2, 305, true, 0.0);
                    enemyInstance.anims.play('enemy_idle');
                    enemyInstance.setBodySize(60,50);
                    enemyInstance.setOffset(64, 66);
                    enemyInstance.setScale(0.6,0.6);
                    enemyInstance.setDepth(6);
                }
                for(let i = 0; i < spikesNumber; i++){
                    objectInstance = this.spikeGroup.get(800 + spikeSpacing * i,399, i === spikesNumber - 1, Math.random());
                    objectInstance.setBodySize(56, 70);
                    objectInstance.setOffset(48, 61);
                    objectInstance.setScale(0.6,0.6);
                    objectInstance.setDepth(6);
                }
                break;

            case 1:
                let blockFamily = []
                const blockSpacing = 128 * 0.6
                for(let i = 0; i < 3; i++){
                    objectInstance = this.blockGroup.get(800 + 128 * 0.6, 389 - blockSpacing * i, i === 2, []);
                    console.log(objectInstance.y);
                    objectInstance.setScale(0.6,0.6);
                    blockFamily.push(objectInstance);
                    objectInstance.setDepth(6);
                }
                for(let i = 0; i < 3; i++){
                    blockFamily[i].blockFamily = blockFamily;
                }
                break;

            case 2:
                objectInstance = this.enemyGroup.get(800 + 128 * 0.6,360, false, Math.random());
                objectInstance.anims.play('enemy_idle');
                objectInstance.setBodySize(60, 50);
                objectInstance.setOffset(64, 66);
                break;
        }
        objectInstance.setScale(0.6,0.6);
        objectInstance.setDepth(6);
    }
    
    spawnFruits(){
        const fruitQuantity = this.getRandomRange(1, 4);
        const fruitSpacing = 128 * 0.6;
        for (let i = 0; i < fruitQuantity; i++){
            const objectInstance = this.fruitGroup.get(800 + fruitSpacing * i, 360 + this.getRandomRange(-100, 0), i === fruitQuantity - 1);
            objectInstance.setScale(0.65,0.65);
            objectInstance.setBodySize(87, 96);
        }
    }

    getRandomRange(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    }

    kill() {
        if (!alreadyGameOver){
            this.music.stop();
            this.gameOver.play({loop: false, volume: 0.3});
            alreadyGameOver = true;
        }
        Settings.gameOver = true;
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }},
        
    scene: MainScene
};

const game = new Phaser.Game(config);
