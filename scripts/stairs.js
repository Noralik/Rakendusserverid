// Stairs.js
class Stairs {
    constructor(scene, x, y, label = 'Лестница') {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // Визуал
        this.graphic = scene.add.rectangle(x, y, 60, 50, 0x8b4513) // коричневый
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x5a2e0a);

        this.label = scene.add.text(x, y - 40, label, {
            font: '16px monospace',
            fill: '#fff'
        }).setOrigin(0.5);
    }

    isNear(playerX, playerY, distance = 60) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        return Math.hypot(dx, dy) < distance;
    }

    destroy() {
        if (this.graphic) this.graphic.destroy();
        if (this.label) this.label.destroy();
    }
}
