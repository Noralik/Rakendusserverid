class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;
        this.slots = [];
        this.bg = null;
        this.title = null;

        this.createUI();
        this.hide();
    }

    createUI() {
        const { width, height } = this.scene.sys.game.config;
        const invWidth = 400;
        const invHeight = 300;
        const slotSize = 60;
        const slotsPerRow = 4;
        const padding = 20;

        // Фон
        this.bg = this.scene.add.graphics();
        this.bg.fillStyle(0x000000, 0.85);
        this.bg.fillRect(
            width / 2 - invWidth / 2,
            height / 2 - invHeight / 2,
            invWidth,
            invHeight
        );

        // Заголовок
        this.title = this.scene.add.text(width / 2, height / 2 - invHeight / 2 + 25, 'ИНВЕНТАРЬ', {
            font: '24px monospace',
            fill: '#0f0'
        }).setOrigin(0.5);

        // Слоты
        const startX = width / 2 - (slotsPerRow * (slotSize + padding) - padding) / 2;
        const startY = height / 2 - 20;

        for (let i = 0; i < 8; i++) {
            const x = startX + (i % slotsPerRow) * (slotSize + padding);
            const y = startY + Math.floor(i / slotsPerRow) * (slotSize + padding);
            const slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x333333)
                .setStrokeStyle(2, 0x555555);
            this.slots.push(slot);
        }
    }

    show() {
        this.isOpen = true;
        this.bg.setVisible(true);
        this.title.setVisible(true);
        this.slots.forEach(slot => slot.setVisible(true));
    }

    hide() {
        this.isOpen = false;
        this.bg.setVisible(false);
        this.title.setVisible(false);
        this.slots.forEach(slot => slot.setVisible(false));
    }

    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }
}
