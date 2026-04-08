const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }},
        
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let isGameOver = false;
let speed = 5.0;
let speed_factor = 0.1;

function preload() {
    // Fruits
    this.load.image('apple', 'assets/apple.png');
    this.load.image('banana', 'assets/banana.png');
    this.load.image('cherry', 'assets/cherry.png');
    this.load.image('strawberry', 'assets/strawberry.png');
    
    // Environment
    this.load.image('grass', 'assets/patch_of_grass.png');
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

function create() {
    // Player
    this.player = this.physics.add.sprite(120, 380, 'player_000',);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.6, 0.6);
    //// Player Animations
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
    }
    )
    //// Player Physics
    this.player.setBodySize(95, 116);
    this.player.setOffset(69, 87);

    // Ground
    this.ground = this.add.tileSprite(400, 460, 800, 76.8, 'grass');
    this.ground.tileScaleX = 0.6;
    this.ground.tileScaleY = 0.6;
    this.physics.add.existing(this.ground, true)

    //Collision Handling
    this.physics.add.collider(this.player, this.ground);
}

function update() {
    if (isGameOver) return;

    this.ground.tilePositionX += speed;
    this.player.play('player_run', true);
}