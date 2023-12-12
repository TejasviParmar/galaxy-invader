class Projectile {
    constructor({ position, velocity, image }) {
        this.velocity = {
            x: velocity.x,
            y: velocity.y,
        };

        this.width = 15;
        this.height = 20;

        this.position = {
            x: position.x - this.width / 2,
            y: position.y,
        };
        this.projectile;
        this.image = image || './assets/bulletPlayer.png';
        this.draw();
    }

    draw() {
        this.projectile = $('<img>', {
            class: 'projectile',
        }).appendTo(GAME_CANVAS_ID);
        this.projectile.css('position', 'absolute');

        this.projectile.attr('src', this.image);

        setSize(this.projectile, this.width, this.height);
        setPosition(this.projectile, this.position.x, this.position.y);
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        setPosition(this.projectile, this.position.x, this.position.y);
    }

    remove() {
        this.projectile.remove();
    }
}
