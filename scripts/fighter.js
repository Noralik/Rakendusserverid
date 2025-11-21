class Fighter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, scale = 4) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(scale).setCollideWorldBounds(true);
        this.hp = 3;
        this.isAttacking = false;
        this.lastHitTime = 0;

        this.targetX = x;
        this.targetY = y;
        this.speed = 220;
    }

    takeHit() {
        const now = this.scene.time.now;
        if (now - this.lastHitTime < 300) return;
        this.lastHitTime = now;
        this.hp--;
        if (this.hp <= 0) {
            this.play('die');
            this.body.enable = false;
        }
    }

    alive() {
        return this.hp > 0;
    }

    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.flipX = (x > this.x);
    }

    updateMovement(walls, doors) {
        if (!this.alive()) return;

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 10) {
            this.setVelocity(0, 0);
            if (!this.isAttacking) {
                this.play('idle', true);
            }
        } else {
            const norm = distance === 0 ? 0 : this.speed / distance;
            this.setVelocity(dx * norm, dy * norm);
            if (!this.isAttacking) {
                this.play('walk', true);
            }
        }

        this.scene.physics.collide(this, walls);
        doors.forEach(door => {
            if (door.active) {
                this.scene.physics.collide(this, door);
            }
        });
    }
}
