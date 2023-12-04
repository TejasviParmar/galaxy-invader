class InvaderArmy {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
        };

        this.velocity = {
            x: 3,
            y: 0,
        };

        this.invaders = [];

        const columns = 8;
        const rows = 5;

        this.width = columns * 50;

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * 50,
                            y: y * 50,
                        },
                    }),
                );
            }
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;

        if (this.position.x + this.width >= GAME_CANVAS_WIDTH || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 50;
        }
    }
}
