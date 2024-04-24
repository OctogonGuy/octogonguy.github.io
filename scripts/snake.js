const ROWS = 15;
const COLUMNS = 15;
const OUTER_COLOR = "#cacbc8";
const BACKGROUND_COLOR = "#323330";
const SNAKE_COLOR = "#f0db4f";
const FOOD_COLOR = "white";
const GAME_OVER_TITLE_FONT_SIZE = "42px";
const GAME_OVER_SUBTITLE_FONT_SIZE = "26px";
const GAME_OVER_COLOR = "black";
const START_ROW = ROWS - 2;
const START_COLUMN = Math.ceil(COLUMNS / 2) - 1;
const INITIAL_DIRECTION = "up";
const EASY_SPEED = 300;
const MEDIUM_SPEED = 150;
const HARD_SPEED = 50;
const EASY_FOOD = 6;
const MEDIUM_FOOD = 3;
const HARD_FOOD = 1;

let snake;
let interval;
let foods;
let speed;
let numFood;

function startGame() {
    // Set difficulty
    const form = document.getElementById("config");
    const formData = new FormData(form);
    const difficulty = formData.get("difficulty")
    switch (difficulty) {
        case "easy":
            speed = EASY_SPEED;
            numFood = EASY_FOOD;
            break;
        case "medium":
            speed = MEDIUM_SPEED;
            numFood = MEDIUM_FOOD;
            break;
        case "hard":
            speed = HARD_SPEED;
            numFood = HARD_FOOD;
            break;
    }
    // Start game
    gameArea.start();
    snake = new Snake();
    foods = [];
    // Spawn food
    for (let i = 0; i < numFood; i++) {
        spawnFood();
    }
    // Start game timer
    interval = setInterval(updateGameArea, speed);
    updateGameArea();
}

let gameArea = {
    canvas : document.getElementById("canvas"),
    img : new Image(),
    start : function() {
        this.context = this.canvas.getContext("2d");
        // Determine the maximum size of squares that will fit in the canvas
        let squareSize;
        if (this.canvas.width / COLUMNS > this.canvas.height / ROWS) {
            squareSize = Math.floor(this.canvas.width / COLUMNS);
        }
        else {
            squareSize = Math.floor(this.canvas.height / ROWS);
        }
        this.xGap = (this.canvas.width - squareSize * COLUMNS) / 2;
        this.yGap = (this.canvas.height - squareSize * ROWS) / 2;
        // Make a grid of squares
        this.grid = new Array();
        for (let i = 0; i < ROWS; i++) {
            this.grid[i] = new Array();
            for (let j = 0; j < COLUMNS; j++) {
                this.grid[i][j] = {
                    x : j * squareSize + this.xGap,
                    y : i * squareSize + this.yGap,
                    size : squareSize
                }
            }
        }
        // Open texture image
        this.clear();
    },
    clear : function() {
        this.context.fillStyle = OUTER_COLOR;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(this.xGap, this.yGap, this.canvas.width - this.xGap * 2, this.canvas.height - this.yGap * 2);
        const pattern = this.context.createPattern(this.img, "repeat");
        this.context.fillStyle = pattern;
        this.context.fillRect(this.xGap, this.yGap, this.canvas.width - this.xGap * 2, this.canvas.height - this.yGap * 2);
    }
}
gameArea.img.src = "images/snake-bg-texture.png";

class Segment {
    constructor(row, column, direction) {
        this.row = row;
        this.column = column;
        this.direction = direction;
    }
    draw() {
        let ctx = gameArea.context;
        let square = gameArea.grid[this.row][this.column];
        let x = square.x;
        let y = square.y;
        let width = square.size;
        let height = square.size;
        x += 2;
        width -= 4;
        y += 2;
        height -= 4;
        if (this != snake.tail) {
            switch (this.direction) {
                case Direction.RIGHT:
                    x -= 5;
                case Direction.LEFT:
                    width += 5;
                    break;
                case Direction.DOWN:
                    y -= 5;
                case Direction.UP:
                    height += 5;
                    break;
            }
        }
        ctx.fillStyle = SNAKE_COLOR;
        ctx.fillRect(x, y, width, height);
    }
    update() {
        switch (this.direction) {
            case Direction.LEFT:
                this.column--;
                break;
            case Direction.RIGHT:
                this.column++;
                break;
            case Direction.UP:
                this.row--;
                break;
            case Direction.DOWN:
                this.row++;
                break;
        }
    }
}

const Direction = {
    LEFT : "left",
    RIGHT : "right",
    UP : "up",
    DOWN : "down"
}

class Snake {
    constructor() {
        this.segments = [new Segment(START_ROW, START_COLUMN)];
        this.head = this.segments[0];
        this.head.direction = this.direction = INITIAL_DIRECTION;
        this.tail = this.head;
        this.alive = true;
    }
    update() {
        this.tail = this.segments[this.segments.length - 1];
        let tailRow = this.tail.row;
        let tailColumn = this.tail.column;
        // Move body
        for (let i = this.segments.length - 1; i >= 1; i--) {
            const currentSegment = this.segments[i];
            const nextSegment = this.segments[i - 1];
            currentSegment.direction = nextSegment.direction;
            currentSegment.update();
        }
        // Move head
        this.head.direction = this.direction;
        this.head.update();
        // If landed on food, eat it
        for (const food of foods) {
            if (food.row == this.head.row && food.column == this.head.column) {
                this.eat(food);
                this.grow(tailRow, tailColumn);
            }
        }
        // If out of bounds, kill snake
        if (this.head.row < 0 || this.head.row >= ROWS || this.head.column < 0 || this.head.column >= COLUMNS) {
            snake.kill();
        }
        // If collided into itself, kill snake
        else {
            for (let i = 1; i < this.segments.length; i++) {
                const segment = this.segments[i];
                if (this.head.row == segment.row && this.head.column == segment.column) {
                    snake.kill();
                    break;
                }
            }
        }
    }
    draw() {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw();
        }
    }
    grow(row, column) {
        snake.segments.push(new Segment(row, column, this.segments[this.segments.length - 1].direction));
        this.tail = this.segments[this.segments.length - 1];
    }
    eat(food) {
        food.kill();
        spawnFood();
    }
    kill() {
        this.alive = false;
        clearInterval(interval);
    }
}

class Food {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.draw();
    }
    draw() {
        let ctx = gameArea.context;
        let square = gameArea.grid[this.row][this.column];
        ctx.fillStyle = FOOD_COLOR;
        ctx.beginPath();
        ctx.ellipse(square.x + square.size / 2, square.y + square.size / 2, square.size * 3/8, square.size * 3/8, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    kill() {
        foods.splice(foods.indexOf(this), 1);
    }
}

function spawnFood() {
    const validSquares = [];
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (!squareOccupied(i, j)) {
                validSquares.push({
                    row : i,
                    column : j
                });
            }
        }
    }
    square = validSquares[randInt(validSquares.length)];
    foods.push(new Food(square.row, square.column));
}

function randInt(upperLimit) {
    return Math.floor(Math.random() * upperLimit)
}

function squareOccupied(row, column) {
    // Check snake
    for (const segment of snake.segments) {
        if (segment.row == row && segment.column == column) {
            return true;
        }
    }
    // Check food
    for (const food of foods) {
        if (food.row == row && food.column == column) {
            return true;
        }
    }
    return false;
}

function updateGameArea() {
    snake.update();
    if (snake.alive) {
        gameArea.clear();
        for (const food of foods) {
            food.draw();
        }
        snake.draw();
    }
    else {
        // Show game over message
        ctx = gameArea.context;
        ctx.fillStyle = "#FFFFFFE0";
        ctx.fillRect(gameArea.canvas.width / 16, gameArea.canvas.height / 8, gameArea.canvas.width * 7/8, gameArea.canvas.height * 3/4);
        ctx.fillStyle = GAME_OVER_COLOR;
        ctx.textAlign = "center";
        ctx.font = "bold " + GAME_OVER_TITLE_FONT_SIZE + " Ubuntu";
        ctx.fillText("Game Over", gameArea.canvas.width / 2, gameArea.canvas.height * 5/16);
        ctx.font = GAME_OVER_SUBTITLE_FONT_SIZE + " Ubuntu";
        ctx.fillText("Your final length: " + snake.segments.length, gameArea.canvas.width / 2, gameArea.canvas.height / 2);
        ctx.fillText("Press any button to play again.", gameArea.canvas.width / 2, gameArea.canvas.height * 11/16);
    }
}

function turnUp() {
    document.getElementById("canvas").focus();
    if (snake.alive) {
        if (snake.head.direction == Direction.UP || snake.head.direction == Direction.DOWN) return;
        snake.direction = Direction.UP;
    }
    else {
        startGame();
    }
}

function turnDown() {
    document.getElementById("canvas").focus();
    if (snake.alive) {
        if (snake.head.direction == Direction.UP || snake.head.direction == Direction.DOWN) return;
        snake.direction = Direction.DOWN;
    }
    else {
        startGame();
    }
}

function turnLeft() {
    document.getElementById("canvas").focus();
    if (snake.alive) {
        if (snake.head.direction == Direction.LEFT || snake.head.direction == Direction.RIGHT) return;
        snake.direction = Direction.LEFT;
    }
    else {
        startGame();
    }
}

function turnRight() {
    document.getElementById("canvas").focus();
    if (snake.alive) {
        if (snake.head.direction == Direction.LEFT || snake.head.direction == Direction.RIGHT) return;
        snake.direction = Direction.RIGHT;
    }
    else {
        startGame();
    }
}

document.getElementById("canvas").onkeydown = function(event) {
    event.preventDefault();
    if (snake == undefined) return;
    if (snake.alive) {
        switch (event.key) {
            case "ArrowLeft":
                turnLeft();
                break;
            case "ArrowRight":
                turnRight();
                break;
            case "ArrowUp":
                turnUp();
                break;
            case "ArrowDown":
                turnDown();
                break;
        }
    }
    else {
        startGame();
    }
}

function startFirstGame() {
    for (const button of document.getElementById("arrow-buttons").getElementsByTagName("button")) {
        if (button == document.getElementById("snake-button")) {
            button.hidden = true;
        }
        else {
            button.hidden = false;
        }
    }
    document.getElementById("canvas").focus();
    startGame();
}