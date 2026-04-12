import Settings from './Global.js';
import Enemy from './Enemy.js';
import Spike from './Spike.js';

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
let gravity_multiplier;
let gravity = 30.0;
let isGrounded = false;
let jumpForce = 700.0;
let normalBodySize = [95,116];
let spinBodySize = [130, 145];

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


    }

    create() {
        // Player
        this.player = this.physics.add.sprite(120, 80, 'player_000',);
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
        this.ground = this.add.tileSprite(400, 460, 800, 76.8, 'grass');
        this.ground.tileScaleX = 0.6;
        this.ground.tileScaleY = 0.6;
        this.physics.add.existing(this.ground, true)

        this.underground = this.add.tileSprite(400, 526 + 76.8, 800, 76.8 * 3, 'dirt');
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

        this.physics.add.overlap(this.enemyGroup, this.player, (playerInstance, enemyInstance) => {
            if (this.is_playing(this.player, "player_spin")){
             enemyInstance.body.checkCollision.none = true;
             //enemyInstance.setVisible(false);
             enemyInstance.anims.play('enemy_die')
             enemyInstance.setAngularVelocity(700);
             enemyInstance.setVelocity(800, -800);
             this.player.setVelocityY(-jumpForce)
             console.log("Hit enemy:", enemyInstance.texture.key);
             console.log("Player visibility should be:", this.player.visible);
            } else {
                Settings.gameOver = true;
            }
        }, null, this)

        this.physics.add.overlap(this.spikeGroup, this.player, (playerInstance, enemyInstance) => {
            Settings.gameOver = true
        })

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
        
        gravity_multiplier = (this.player.body.velocity.y > 0) ? const_multiplier : 1.0;
        this.ground.tilePositionX += ((Settings.speed * delta) / 1000) / this.ground.tileScaleX;
        this.underground.tilePositionX += ((Settings.speed * delta) / 1000) / this.ground.tileScaleX;
        this.player.body.velocity.y += gravity * gravity_multiplier * !isGrounded;
        this.player.body.width = (this.is_playing(this.player, "player_spin"))? spinBodySize[0] : normalBodySize[0];
        
        if (this.actionJustDown(jumpAction) && isGrounded){
            console.log('oi');
            this.player.setVelocityY(-jumpForce)
            isGrounded = false;
        }

        this.anim_manager();

        if (this.actionJustDown(spinAction)){
            this.player.setVelocityY(jumpForce * !isGrounded);
            this.player.play('player_spin').chain('player_fall')
        }
        
    }

    anim_manager(){
        if (this.is_playing(this.player, 'player_spin')) return;

        if (isGrounded){
            this.player.play('player_run', true);
        } else {
            if (this.player.body.velocity.y >= 0 && !this.is_playing(this.player, 'player_fall')){ 
                this.player.play('player_fall', true);
            
            } else if (this.player.body.velocity.y < 0 && !this.is_playing(this.player, 'player_jump')) {
                this.player.play('player_jump', true)
            
            }
        }

    }

    is_playing(obj, anim){
        return obj.anims.getName() === anim;
    }

    actionJustDown(action){
        return action.some(key => Phaser.Input.Keyboard.JustDown(key));
    }

    addObstacle(incrementSpeed = true){
        Settings.speed += speedFactor
        let obstacleIdx = 0//this.getRandomIntInclusive(0, obstacleOptions.length - 1);
        let objectInstance;

        switch (obstacleIdx) {
            case 0:
                const specialSpikes = Math.random() > 0.5;
                const spacing = 128 * 0.6 / 2;  
                let spikesNumber = (specialSpikes) ? 10 : this.getRandomIntInclusive(3, 6)
                
                if (specialSpikes){
                    spikesNumber = 10;
                    const enemyInstance = this.enemyGroup.get(805 + (spacing * ((spikesNumber - 1)/2)), 305, true);
                    enemyInstance.anims.play('enemy_idle');
                    enemyInstance.setBodySize(60,50);
                    enemyInstance.setOffset(64, 66);
                    enemyInstance.setScale(0.6,0.6);
                }
                for(let i = 0; i < spikesNumber; i++){
                    objectInstance = this.spikeGroup.get(800 + spacing * i,399, i === spikesNumber - 1);
                    objectInstance.setBodySize(56, 70);
                    objectInstance.setOffset(48, 61);
                    objectInstance.setScale(0.6,0.6);
                };



                break;
            case 2:
                objectInstance = this.enemyGroup.get(800,344);
                objectInstance.anims.play('enemy_idle');
                objectInstance.setBodySize(60, 50);
                objectInstance.setOffset(64, 66);
                break;
        }
        objectInstance.setScale(0.6,0.6);
        
    }
    
    getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
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
