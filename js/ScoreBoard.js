class ScoreBoard {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.scoreElement = null;
        this.livesElement = null;

        this.init();
    }

    init() {
        this.scoreElement = $('#score');
        this.livesElement = $('#lives');
        this.scoreElement.text(this.score);
        this.livesElement.text(this.lives);
    }

    addScore(score) {
        this.score += score;
        this.scoreElement.text(this.score);
    }

    subtractScore(score) {
        this.score -= score;
        this.scoreElement.text(this.score);
    }

    addLife() {
        this.lives++;
        this.livesElement.text(this.lives);
    }

    subtractLife() {
        this.lives--;
        this.livesElement.text(this.lives);
    }
}
