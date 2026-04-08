const config = {
type: Phaser.AUTO,
width: 800,
height: 600,
backgroundColor: '#87CEEB',
physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 }
    }
}};

const game = new Phaser.Game(config);

function preload() {
    // Fruits
    this.Load.image('apple', 'assets/apple.png');
    this.Load.image('banana', 'assets/banana.png');
    this.Load.image('cherry', 'assets/cherry.png');
    this.Load.image('strawberry', 'assets/strawberry.png');
    
    // Environment
    this.Load.image('grass', 'assets/patch_of_grass.png');
    this.Load.image('stone', 'assets/block_of_stone.png');
    this.Load.image('spike', 'assets/spike.png');
    
    //Player frames
    this.Load.image('player_000', 'assets/player/frame0000.png');
    this.Load.image('player_001', 'assets/player/frame0001.png');
    this.Load.image('player_002', 'assets/player/frame0002.png');
    this.Load.image('player_003', 'assets/player/frame0003.png');
    this.Load.image('player_004', 'assets/player/frame0004.png');
    this.Load.image('player_005', 'assets/player/frame0005.png');
    this.Load.image('player_006', 'assets/player/frame0006.png');
    this.Load.image('player_007', 'assets/player/frame0007.png');
    this.Load.image('player_008', 'assets/player/frame0008.png');
    this.Load.image('player_009', 'assets/player/frame0009.png');
    this.Load.image('player_010', 'assets/player/frame0010.png');
    this.Load.image('player_011', 'assets/player/frame0011.png');
    this.Load.image('player_012', 'assets/player/frame0012.png');
    this.Load.image('player_013', 'assets/player/frame0013.png');
    this.Load.image('player_014', 'assets/player/frame0014.png');
    this.Load.image('player_015', 'assets/player/frame0015.png');

    //Enemy Frames
    this.Load.image('enemy_000', 'assets/enemy/frame0000.png');
    this.Load.image('enemy_001', 'assets/enemy/frame0001.png');
    this.Load.image('enemy_002', 'assets/enemy/frame0002.png');
    this.Load.image('enemy_003', 'assets/enemy/frame0003.png');
    this.Load.image('enemy_004', 'assets/enemy/frame0004.png');
    this.Load.image('enemy_005', 'assets/enemy/frame0005.png');


}

function create() {
    this.player = this.physics.add.sprite(120, 380, 'player_000');
    this.player.setCollideWorldBounds(true);

}