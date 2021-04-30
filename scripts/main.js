let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
let startBtn = document.querySelector('#start');
let resetBtn = document.querySelector('#reset');
let gameOverNotification = document.querySelector('#game-over');
let winNotification = document.querySelector('#win');
let scoreBlock = document.querySelector(".game-score .score-count");
let score = 0;

const config = {
    step: 0,
    maxStep: 6,
    sizeCell: 16,
    sizeBerry: 16 / 4,
}

const snake = {
    x: 160,
    y: 160,
    dx: config.sizeCell,
    dy: 0,
    tails: [],
    maxTails: 1,
    sDirection: 1

}
let direction = {
    1: 'right',
    2: 'down',
    3: 'left',
    4: 'up'
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomPositionBerry() {
    berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
    berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}

let berry = {
    x: 0,
    y: 0
}


drawScore();

let gameLoop = () => {
    let requestId = requestAnimationFrame(gameLoop);
    if (++config.step < config.maxStep) {
        return;
    }
    config.step = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBerry();
    drawSnake(requestId);
}

startBtn.addEventListener('click', (e) => {
    randomPositionBerry();
    requestAnimationFrame(gameLoop);
    startBtn.style = 'display: none;';
    resetBtn.style = 'display: flex;';
});

resetBtn.addEventListener('click', (e) => {
    location.reload();
    gameOverNotification.style = 'display: none;';
    winNotification.style = 'display: none;';
});

function drawSnake(requestId) {
    snake.x += snake.dx;
    snake.y += snake.dy;

    collisionBorder();

    snake.tails.unshift({x: snake.x, y: snake.y});

    if (snake.tails.length > snake.maxTails) {
        snake.tails.pop();
    }

    if (score == 499) {
        winNotification.style.display = 'flex';
        refreshGame();
        cancelAnimationFrame(requestId)
    }

    snake.tails.forEach(function (el, index) {
        if (index == 0) {
            context.fillStyle = "#FA0556";
        } else {
            context.fillStyle = "#A00034";
        }
        context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

        if (el.x === berry.x && el.y === berry.y) {
            snake.maxTails++;
            incScore();
            randomPositionBerry();
        }

        for (let i = index + 1; i < snake.tails.length; i++) {

            if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) {
                refreshGame();
                cancelAnimationFrame(requestId)
                gameOverNotification.style.display = 'flex';
            }

        }

    });
}

function collisionBorder() {
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
}

function refreshGame() {
    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tails = [];
    snake.maxTails = 1;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();
}

function drawBerry() {
    context.beginPath();
    context.fillStyle = "#A00034";
    context.arc(berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBerry, 0, 2 * Math.PI);
    context.fill();
}


function incScore() {
    score++;
    drawScore();
}

function drawScore() {
    scoreBlock.innerHTML = score;
}


document.addEventListener("keydown", function (e) {

    if (e.code == "ArrowUp" && snake.sDirection != 'down') {
        snake.dy = -config.sizeCell;
        snake.dx = 0;
        snake.sDirection = direction["4"];
    } else if (e.code == "ArrowLeft" && snake.sDirection != 'right') {
        snake.dx = -config.sizeCell;
        snake.dy = 0;
        snake.sDirection = direction["3"];
    } else if (e.code == "ArrowDown" && snake.sDirection != 'up') {
        snake.dy = config.sizeCell;
        snake.dx = 0;
        snake.sDirection = direction["2"];
    } else if (e.code == "ArrowRight" && snake.sDirection != 'left') {
        snake.dx = config.sizeCell;
        snake.dy = 0;
        snake.sDirection = direction["1"];
    }
});

