// Конфигурация игры
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

// Создаем игру
const game = new Phaser.Game(config);

let player;
let platforms;
let cursors;

function preload() {
    // Загружаем "виртуальные" ассеты (настоящие добавим позже)
    this.load.setBaseURL('https://labs.phaser.io');
    
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('ground', 'assets/platforms/platform.png');
    this.load.image('star', 'assets/games/starstruck/star.png');
    this.load.spritesheet('dude', 'assets/spritesheets/dude.png', {
        frameWidth: 32,
        frameHeight: 48
    });
}

function create() {
    // Добавляем фон
    this.add.image(400, 300, 'sky');

    // Платформы
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Игрок
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Анимации
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Коллизии
    this.physics.add.collider(player, platforms);

    // Курсор
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
