class GameScene extends Phaser.Scene {
    init() {
        this.currentFloor = 52; // начальный этаж
        this.entryPoint = { x: 200, y: 350 }; // начальная точка появления игрока
    }

    preload() {
        this.load.spritesheet('brawler', 'https://labs.phaser.io/assets/animations/brawler48x48.png',
            { frameWidth: 48, frameHeight: 48 });
        this.load.image('grid', 'https://labs.phaser.io/assets/textures/grid-ps2.png');
    }

    create() {
        this.setupLevel();
    }

    setupLevel() {
        // Очистка предыдущего уровня
        if (this.walls) this.walls.clear(true, true);
        if (this.doors) {
            this.doors.forEach(d => {
                if (d.blocker) d.blocker.destroy();
                if (d.graphic) d.graphic.destroy();
            });
        }
        if (this.chest) this.chest.destroy();
        if (this.stairs) this.stairs.destroy();

        const GAME_WIDTH = 1200;
        const GAME_HEIGHT = 700;
        const ROOM_V_CENTER = GAME_HEIGHT / 2;

        this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'grid');

        // Анимации (только при первом запуске)
        if (!this.anims.exists('walk')) {
            const make = (key, frames, rep = -1) =>
                this.anims.create({
                    key,
                    frames: this.anims.generateFrameNumbers('brawler', { frames }),
                    frameRate: 8,
                    repeat: rep
                });
            make('walk', [0, 1, 2, 3]);
            make('idle', [5, 6, 7, 8]);
            make('kick', [10, 11, 12, 13, 10], 0);
            make('punch', [15, 16, 17, 18, 17, 15], 0);
            make('die', [35, 36, 37], 0);
        }

        // Стены
        this.walls = this.physics.add.staticGroup();
        const addWall = (x, y, width, height) => {
            const rect = this.add.rectangle(x, y, width, height, 0xffffff);
            rect.setOrigin(0.5, 0.5);
            this.physics.add.existing(rect, true);
            this.walls.add(rect);
        };

        const TOP = 50;
        const BOTTOM = GAME_HEIGHT - 50;
        const WALL_THICK = 20;

        // === КОМНАТЫ (одинаковые на всех этажах) ===
        // Комната 1
        addWall(200, TOP, 300, 20);
        addWall(200, BOTTOM, 300, 20);
        addWall(50, ROOM_V_CENTER, 20, GAME_HEIGHT);
        addWall(350, TOP + 50, WALL_THICK, 200);
        addWall(350, BOTTOM - 50, WALL_THICK, 200);

        // Комната 2
        addWall(600, TOP, 200, 20);
        addWall(600, BOTTOM, 200, 20);
        addWall(850, TOP + 50, WALL_THICK, 200);
        addWall(850, BOTTOM - 50, WALL_THICK, 200);

        // Комната 3
        addWall(1000, TOP, 300, 20);
        addWall(1000, BOTTOM, 300, 20);
        addWall(1150, ROOM_V_CENTER, 20, GAME_HEIGHT);

        // === ДВЕРИ ===
        this.doors = [];
        this.doors.push(new Door(this, 400, ROOM_V_CENTER, 100, 200, 0x00ff00));
        this.doors.push(new Door(this, 800, ROOM_V_CENTER, 100, 200, 0x00ccff));

        // === СУНДУК (зависит от этажа) ===
        if (this.currentFloor === 52) {
            this.chest = new Chest(this, 600, ROOM_V_CENTER); // во 2 комнате
        } else if (this.currentFloor === 53) {
            this.chest = new Chest(this, 1000, ROOM_V_CENTER); // в правой комнате
            const originalOpen = this.chest.open.bind(this.chest);
            this.chest.open = () => {
                originalOpen();
                console.log('Выпал меч!');
            };
        }

        // === ЛЕСТНИЦА (только на 52 этаже) ===
        if (this.currentFloor === 52) {
            this.stairs = new Stairs(this, 770, ROOM_V_CENTER - 250, '↑ 53 этаж');
        }

        // === ИГРОК ===
        if (!this.player || !this.player.active) {
            this.player = new Fighter(this, this.entryPoint.x, this.entryPoint.y, 'brawler');
            this.player.play('idle');
        } else {
            this.player.setPosition(this.entryPoint.x, this.entryPoint.y);
            this.player.hp = 3; // или 100 — как нужно, но в Fighter по умолчанию 3
            this.player.setActive(true);
            this.player.setVisible(true);
            this.player.body.enable = true;
            this.player.play('idle');
        }

        // Инвентарь (создаём один раз)
        if (!this.inventory) {
            this.inventory = new Inventory(this);
        }

        // Клавиши
        this.keyE = this.input.keyboard.addKey('E');
        this.keyESC = this.input.keyboard.addKey('ESC');

        // UI
        this.ui = document.getElementById('ui');
        this.updateUI();

        // Клик мышью
        this.input.off('pointerdown');
        this.input.on('pointerdown', (pointer) => {
            if (this.inventory.isOpen) return;
            if (pointer.leftButtonDown()) {
                const tx = pointer.worldX;
                const ty = pointer.worldY;

                const test = this.add.rectangle(tx, ty, 1, 1, 0xff00ff);
                this.physics.add.existing(test, true);

                let blocked = false;
                this.walls.getChildren().forEach(wall => {
                    if (this.physics.overlap(test, wall)) blocked = true;
                });
                this.doors.forEach(door => {
                    if (door.blocksPoint(test)) blocked = true;
                });

                test.destroy();

                if (!blocked) {
                    this.player.moveTo(tx, ty);
                }
            }
        });
    }

    update(time, delta) {
        if (this.inventory.isOpen) {
            if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {
                this.inventory.toggle();
            }
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            this.inventory.toggle();
            return;
        }

        if (this.player.alive()) {
            // Двери — автоматически обновляют прозрачность внутри isNear()
            this.doors.forEach(door => {
                if (door.isNear(this.player.x, this.player.y)) {
                    door.open();
                }
            });

            // Сундук
            if (this.chest && !this.chest.opened) {
                if (this.chest.isNear(this.player.x, this.player.y)) {
                    this.ui.textContent = `Этаж ${this.currentFloor} | HP: ${this.player.hp} | [ЛКМ] — открыть сундук`;
                    if (this.input.activePointer.leftButtonDown()) {
                        this.chest.open();
                    }
                }
            }

            // Лестница
            if (this.currentFloor === 52 && this.stairs) {
                if (this.stairs.isNear(this.player.x, this.player.y)) {
                    this.ui.textContent = `Этаж ${this.currentFloor} | HP: ${this.player.hp} | [ЛКМ] — подняться на 53 этаж`;
                    if (this.input.activePointer.leftButtonDown()) {
                        // Устанавливаем точку входа на следующем этаже
                        this.entryPoint = { x: 800, y: 200 }; // безопасная зона в комнате 2
                        this.currentFloor = 53;
                        this.setupLevel();
                    }
                }
            }
        }

        // Обновляем UI, если не у интерактивного объекта
        const nearChest = this.chest && !this.chest.opened && this.chest.isNear(this.player.x, this.player.y);
        const nearStairs = this.currentFloor === 52 && this.stairs && this.stairs.isNear(this.player.x, this.player.y);
        if (!nearChest && !nearStairs) {
            this.updateUI();
        }

        this.player.updateMovement(this.walls, this.doors);
    }

    updateUI() {
        this.ui.textContent = `Этаж ${this.currentFloor} | HP: ${this.player.hp} | [E] — инвентарь`;
    }
}

new Phaser.Game({
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: GameScene
});
