class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 50;
        this.height = 50;
        this.position = {
            x: GAME_CANVAS_WIDTH / 2,
            y: GAME_CANVAS_HEIGHT - this.height,
        };
        this.player;
        this.draw();
    }

    draw() {
        this.player = $('<img>', {
            id: 'player-ship',
        }).appendTo(GAME_CANVAS_ID);
        this.player.css('position', 'absolute');

        this.player.attr('src', './assets/player.png');

        setSize(this.player, this.width, this.height);
        setPosition(this.player, this.position.x, this.position.y);
    }

    update() {
        this.position.x += this.velocity.x;
        setPosition(this.player, this.position.x, this.position.y);
    }
}
