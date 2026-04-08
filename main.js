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
        
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Game Settings
let isGameOver = false;
let speed = 7.0;
let speedFactor = 0.1;

// Player Settings
const const_multiplier = 1.5;
let gravity_multiplier;
let gravity = 30.0;
let isGrounded = false;
let jumpForce = 700.0;

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

    //// Player Physics
    this.player.setBodySize(95, 116);
    this.player.setOffset(69, 87);

    // Ground
    this.ground = this.add.tileSprite(400, 460, 800, 76.8, 'grass');
    this.ground.tileScaleX = 0.6;
    this.ground.tileScaleY = 0.6;
    this.physics.add.existing(this.ground, true)

    //Collision Handling
    this.physics.add.collider(this.player, this.ground, (obj1, obj2) => {
        isGrounded = true;
    });

    // Input Keys
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.spinKeys = this.input.keyboard.addKeys('UP,W');
}

function update() {
    if (isGameOver) return;
    
    const spinAction = [this.spinKeys.UP, this.spinKeys.W];

    gravity_multiplier = (this.player.body.velocity.y > 0) ? const_multiplier : 1.0;
    this.ground.tilePositionX += speed;

    if (!isGrounded){
        this.player.body.velocity.y += gravity * gravity_multiplier;
        
    } else {
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)){
            console.log('oi');
            this.player.setVelocityY(-jumpForce);
            isGrounded = false;
        }
    }

    anim_manager(this.player);
    if (spinAction.some(key => Phaser.Input.Keyboard.JustDown(key))){
        this.player.play('player_spin').chain('player_fall')
    }
    
}

function anim_manager(obj){
    if (is_playing(obj, 'player_spin')) return;

    if (isGrounded){
        obj.play('player_run', true);
    } else {
        if (obj.body.velocity.y >= 0 && !is_playing(obj, 'player_fall')){ 
            obj.play('player_fall', true);
        
        } else if (obj.body.velocity.y < 0 && !is_playing(obj, 'player_jump')) {
            obj.play('player_jump', true)
        
        }
    }



}

function is_playing(obj, anim){
    return obj.anims.currentAnim?.key === anim;
}

