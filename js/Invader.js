class Invader {
    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 50;
        this.height = 50;
        this.position = {
            x: position.x,
            y: position.y + 55,
        };

        this.invader;
        this.draw();
    }

    draw() {
        this.invader = $('<img>', {
            class: 'invader',
        }).appendTo(GAME_CANVAS_ID);
        this.invader.css('position', 'absolute');

        this.invader.attr('src', './assets/enemy.png');

        setSize(this.invader, this.width, this.height);
        setPosition(this.invader, this.position.x, this.position.y);
    }

    update({ velocity }) {
        this.position.x += velocity.x;
        this.position.y += velocity.y;
        setPosition(this.invader, this.position.x, this.position.y);
    }

    remove() {
        this.invader.remove();
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new Projectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height,
                },
                velocity: {
                    x: 0,
                    y: 5,
                },
                image: './assets/bulletEnemy.png',
            }),
        );
    }
}
