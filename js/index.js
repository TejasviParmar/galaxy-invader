$(document).ready(main);

// global vars
const GAME_CANVAS_WIDTH = window.innerWidth;
const GAME_CANVAS_HEIGHT = window.innerHeight;
const GAME_CANVAS_ID = '#game-canvas';

let player;
let playerProjectiles = [];
let invaderArmies = [];
let invaderProjectiles = [];
let scoreBoard;

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
    const gameCanvas = $(GAME_CANVAS_ID);
    setSize(gameCanvas, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);

    scoreBoard = new ScoreBoard();

    player = new Player();
    setPlayerInputEvents(player);

    invaderArmies.push(new InvaderArmy());
    setInterval(animate, 1000 / 60);
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

        invaderArmies.forEach((invaderArmy) => {
            invaderArmy.invaders.forEach((invader, index) => {
                if (rectangularCollision(invader, playerProjectile)) {
                    invader.remove();
                    playerProjectile.remove();
                    invaderArmy.invaders.splice(index, 1);
                    playerProjectiles.splice(playerProjectileIndex, 1);
                    scoreBoard.addScore(100);
                }
            });
        });

        if (playerProjectile.position.y + playerProjectile.height <= 0) {
            playerProjectile.remove();
            playerProjectiles.splice(playerProjectileIndex, 1);
        }
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

            // if invader touches player stop game
            if (rectangularCollision(invader, player)) {
                endGame();
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
                endGame();
            }
        }

        if (invaderProjectile.position.y + invaderProjectile.height > GAME_CANVAS_HEIGHT) {
            invaderProjectile.remove();
            invaderProjectiles.splice(invaderProjectileIndex, 1);
        }
    }

    frames++;
}

function setPlayerInputEvents(player) {
    $(document).on('keydown', (event) => {
        switch (event.key) {
            case ' ':
                if (playerProjectiles.length > 0) return;
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

            default:
                break;
        }
    });

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

            default:
                break;
        }
    });
}

function endGame() {
    game.over = true;

    gameOverSplashScreen = $('<div>', {
        class: 'game-over-splash-screen',
    }).appendTo(GAME_CANVAS_ID);

    gameOverSplashScreen.text(`
        Game over Bud!
        Score: ${scoreBoard.score}`);

    setSize(gameOverSplashScreen, 600, 600);
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
