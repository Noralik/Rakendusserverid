class Chest {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.opened = false;

        this.graphic = scene.add.rectangle(x, y, 50, 40, 0xffd700)
            .setStrokeStyle(2, 0xffa500)
            .setOrigin(0.5);
        this.label = scene.add.text(x, y - 30, 'Сундук', {
            font: '14px monospace',
            fill: '#fff'
        }).setOrigin(0.5);
    }

    open() {
        if (this.opened) return;
        this.opened = true;
        console.log('Сундук открыт! Получено: Зелье здоровья');
        if (this.graphic) this.graphic.destroy();
        if (this.label) this.label.destroy();
    }

    isNear(playerX, playerY, distance = 60) {
        if (this.opened) return false;
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        return Math.hypot(dx, dy) < distance;
    }

    destroy() {
        if (this.graphic) this.graphic.destroy();
        if (this.label) this.label.destroy();
    }
}
