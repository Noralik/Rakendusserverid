class Door {
    constructor(scene, x, y, width = 100, height = 200, color = 0x00ff00) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
        this.isHighlighted = false; // ← отслеживаем, находится ли игрок рядом

        // Физическое тело
        this.blocker = scene.physics.add.staticGroup().create(x, y, null);
        this.blocker.body.setSize(width, height);
        this.blocker.body.setOffset(-width / 2, -height / 2);

        // Визуальное представление
        this.graphic = scene.add.rectangle(x, y, width, height, color)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x00aa00);
    }

    open() {
        if (!this.active) return;
        this.active = false;
        this.blocker.destroy();
        this.graphic.destroy();
        console.log('Дверь открыта!');
    }

    isNear(x, y, distance = 60) {
        if (!this.active) return false;

        const dx = x - this.x;
        const dy = y - this.y;
        const isClose = Math.hypot(dx, dy) < distance;

        // Обновляем визуальное состояние только при изменении
        if (isClose !== this.isHighlighted) {
            this.isHighlighted = isClose;
            this.graphic.setAlpha(isClose ? 0.5 : 1); // ← полупрозрачность при приближении
        }

        return isClose;
    }

    blocksPoint(testObject) {
        return this.active && this.scene.physics.overlap(testObject, this.blocker);
    }
}
