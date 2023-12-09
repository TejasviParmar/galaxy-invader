$(document).ready(showStartScreen);

// global vars
const GAME_CANVAS_WIDTH = window.innerWidth;
const GAME_CANVAS_HEIGHT = window.innerHeight;
const GAME_CANVAS_ID = '#game-canvas';

let player;
let playerProjectiles = [];
let invaderArmies = [];
let invaderProjectiles = [];
let scoreBoard;
let frameInterval;
let audioPlayer;

let frames = 0;

let keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};

let game = {
    over: false,
};

function main() {
    player = null;
    playerProjectiles = [];
    invaderArmies = [];
    invaderProjectiles = [];
    scoreBoard = null;

    frames = 0;

    keys = {
        a: {
            pressed: false,
        },
        d: {
            pressed: false,
        },
    };

    game = {
        over: false,
    };
    $(document).off();
    clearInterval(frameInterval);
    hideStartScreen();
    hideGameOverScreen();
    hideGameWonScreen();
    $(GAME_CANVAS_ID).remove();

    const gameCanvas = $('<div>', {
        id: 'game-canvas',
    }).appendTo('body');
    setSize(gameCanvas, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);

    audioPlayer?.stop();
    audioPlayer = new AudioPlayer('../assets/game_audio.mp3');
    audioPlayer.play();

    scoreBoard = new ScoreBoard();

    player = new Player();
    setPlayerInputEvents(player);

    invaderArmies.push(new InvaderArmy());
    frameInterval = setInterval(animate, 1000 / 60);
}

function animate() {
    if (game.over) return;

    // update player projectiles
    for (
        let playerProjectileIndex = 0;
        playerProjectileIndex < playerProjectiles.length;
        playerProjectileIndex++
    ) {
        const playerProjectile = playerProjectiles[playerProjectileIndex];
        playerProjectile.update();

        invaderArmies.forEach((invaderArmy, invaderArmyIndex) => {
            invaderArmy.invaders.forEach((invader, index) => {
                if (rectangularCollision(invader, playerProjectile)) {
                    invader.remove();
                    playerProjectile.remove();
                    invaderArmy.invaders.splice(index, 1);
                    playerProjectiles.splice(playerProjectileIndex, 1);
                    scoreBoard.addScore(100);
                    if (invaderArmy.invaders.length === 0) {
                        invaderArmies.splice(invaderArmyIndex, 1);
                    }
                }
            });
        });

        if (playerProjectile.position.y + playerProjectile.height <= 0) {
            playerProjectile.remove();
            playerProjectiles.splice(playerProjectileIndex, 1);
        }
    }

    if (invaderArmies.length === 0) {
        showGameWonScreen();
    }

    // update player velocity
    if ((keys.a.pressed && keys.d.pressed) || (!keys.a.pressed && !keys.d.pressed)) {
        player.velocity.x = 0;
    } else if (keys.a.pressed && player.position.x - 10 >= 0) {
        player.velocity.x = -7;
    } else if (keys.d.pressed && player.position.x + 10 + player.width <= GAME_CANVAS_WIDTH) {
        player.velocity.x = 7;
    } else {
        player.velocity.x = 0;
    }
    player.update();

    // update invader armies
    invaderArmies.forEach((invaderArmy, invaderArmyIndex) => {
        invaderArmy.update();

        for (let i = invaderArmy.invaders.length - 1; i >= 0; i--) {
            const invader = invaderArmy.invaders[i];
            invader.update({ velocity: invaderArmy.velocity });

            // if invader touches player - stop game
            if (rectangularCollision(invader, player)) {
                showGameOverScreen();
            }
        }

        // spawn projectiles
        if (frames % 100 === 0 && invaderArmy.invaders.length > 0) {
            invaderArmy.invaders[Math.floor(Math.random() * invaderArmy.invaders.length)].shoot(
                invaderProjectiles,
            );
        }
    });

    // update invader projectiles
    for (
        let invaderProjectileIndex = 0;
        invaderProjectileIndex < invaderProjectiles.length;
        invaderProjectileIndex++
    ) {
        const invaderProjectile = invaderProjectiles[invaderProjectileIndex];
        invaderProjectile.update();

        if (rectangularCollision(invaderProjectile, player)) {
            if (scoreBoard.lives > 1) {
                invaderProjectile.remove();
                invaderProjectiles.splice(invaderProjectileIndex, 1);
                scoreBoard.subtractLife();
            } else {
                showGameOverScreen();
            }
        }

        if (invaderProjectile.position.y + invaderProjectile.height > GAME_CANVAS_HEIGHT) {
            invaderProjectile.remove();
            invaderProjectiles.splice(invaderProjectileIndex, 1);
        }
    }

    frames++;
}

//player movement
function setPlayerInputEvents(player) {
    $(document).on('keydown', (event) => {
        switch (event.key) {
            case ' ':
                //if (playerProjectiles.length > 0) return; //fire single bullet at a time
                const projectile = new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y,
                    },
                    velocity: {
                        x: 0,
                        y: -10,
                    },
                });
                playerProjectiles.push(projectile);
                break;

            case 'a':
            case 'ArrowLeft':
                keys.a.pressed = true;
                break;

            case 'd':
            case 'ArrowRight':
                keys.d.pressed = true;
                break;
        }
    });
    // player moves with a & d or left & right arrow keys
    $(document).on('keyup', (event) => {
        switch (event.key) {
            case ' ':
                break;

            case 'a':
            case 'ArrowLeft':
                keys.a.pressed = false;
                break;

            case 'd':
            case 'ArrowRight':
                keys.d.pressed = false;
                break;
        }
    });
}

function showGameWonScreen() {
    game.over = true;
    const gameWonScreen = $('#game-won');
    $('#game-won-score').text(`Score: ${scoreBoard.score}`);
    gameWonScreen.css('display', 'block');
}

function hideGameWonScreen() {
    game.over = false;
    const gameWonScreen = $('#game-won');
    gameWonScreen.css('display', 'none');
}

function showGameOverScreen() {
    game.over = true;
    const gameOverScreen = $('#game-over');
    $('#game-over-score').text(`Score: ${scoreBoard.score}`);
    gameOverScreen.css('display', 'block');
}

function hideGameOverScreen() {
    game.over = false;
    const gameOverScreen = $('#game-over');
    gameOverScreen.css('display', 'none');
}

function showStartScreen() {
    const startScreen = $('#startScreen');
    startScreen.css('display', 'block');
}

function hideStartScreen() {
    const startScreen = $('#startScreen');
    startScreen.css('display', 'none');
}

// utility functions
function setPosition($element, x, y) {
    $element.css('left', x);
    $element.css('top', y);
}

function setSize($element, width, height = 'auto') {
    $element.width(width);
    $element.height(height);
}

// check if rectangle2 is within bounds of rectangle1
function rectangularCollision(rectangle1, rectangle2) {
    return (
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width
    );
}
