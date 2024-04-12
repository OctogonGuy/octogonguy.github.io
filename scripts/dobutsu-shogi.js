"use strict"

// --- Constants ---
const ROWS = 4;
const COLUMNS = 3;
const CONSECUTIVE_MOVES_TILL_DRAW = 3;


// --- Variables ---
let curPlayer;
let aiMoving = false;
let ai = false;
let difficulty = 0.5;
let firstPlayer = "random";


// --- Enums, etc. ---

// Position class
class Position {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}


// Relative directions
const Direction = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    UP_LEFT: "UP_LEFT",
    UP_RIGHT: "UP_RIGHT",
    DOWN_RIGHT: "DOWN_RIGHT",
    DOWN_LEFT: "DOWN_LEFT"
}


// Absolute directions with changes in position as values
const OrdinalDirection = {
    NORTH: new Position(-1, 0),
    SOUTH: new Position(1, 0),
    EAST: new Position(0, 1),
    WEST: new Position(0, -1),
    NORTHWEST: new Position(-1, -1),
    NORTHEAST: new Position(-1, 1),
    SOUTHWEST: new Position(1, -1),
    SOUTHEAST: new Position(1, 1)
}


// Orientation
const Orientation = {
    UP: "UP",
    DOWN: "DOWN"
}


// Players
const Player = {
    TOP: "Sky",
    BOTTOM: "Forest"
}


// Converts a relative direction + orientation into an absolute direction
function getOrdinalDirection(direction, orientation) {
    let ordinalDirection;
    if (direction == Direction.UP && orientation == Orientation.UP ||
        direction == Direction.DOWN && orientation == Orientation.DOWN) {
        ordinalDirection = OrdinalDirection.NORTH;
    }
    else if (direction == Direction.DOWN && orientation == Orientation.UP ||
        direction == Direction.UP && orientation == Orientation.DOWN) {
        ordinalDirection = OrdinalDirection.SOUTH;
    }
    else if (direction == Direction.LEFT && orientation == Orientation.UP ||
        direction == Direction.RIGHT && orientation == Orientation.DOWN) {
        ordinalDirection = OrdinalDirection.WEST;
    }
    else if (direction == Direction.RIGHT && orientation == Orientation.UP ||
        direction == Direction.LEFT && orientation == Orientation.DOWN) {
        ordinalDirection = OrdinalDirection.EAST;
    }
    else if (direction == Direction.UP_LEFT && orientation == Orientation.UP ||
        direction == Direction.DOWN_RIGHT && orientation == Orientation.DOWN) {
        ordinalDirection = OrdinalDirection.NORTHWEST;
    }
    else if (direction == Direction.UP_RIGHT && orientation == Orientation.UP ||
        direction == Direction.DOWN_LEFT && orientation == Orientation.DOWN) {
        ordinalDirection = OrdinalDirection.NORTHEAST;
    }
    else if (direction == Direction.DOWN_LEFT && orientation == Orientation.UP ||
        direction == Direction.UP_RIGHT && orientation == Orientation.DOWN) {
        ordinalDirection = OrdinalDirection.SOUTHWEST;
    }
    else if (direction == Direction.DOWN_RIGHT && orientation == Orientation.UP ||
        direction == Direction.UP_LEFT && orientation == Orientation.DOWN) {
        ordinalDirection = OrdinalDirection.SOUTHEAST;
    }
    return ordinalDirection;
}


// Abstract animal class
class Animal {
    constructor(player, validDirections, imageFilename=null) {
        this.player = player;
        this.orientation = (player == Player.TOP ? Orientation.DOWN : Orientation.UP);
        this.validDirections = validDirections;
        this.imageFilename = imageFilename;

        if (this.imageFilename != null) {
            this.pieceElement = document.createElement("img");
            this.pieceElement.classList.add("piece")
            this.pieceElement.src = this.imageFilename;
            if (this.orientation == Orientation.DOWN) {
                this.pieceElement.style.transform = "rotate(0.5turn)";
            }
        }
    }
    getPosition(grid) {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (grid[i][j] == this) {
                    return new Position(i, j);
                }
            }
        }
        return null;
    }
    getValidMovePositions(grid) {
        let validMovePositions = [];
        if (this.getPosition(grid) != null) {
            for (let direction of this.validDirections) {
                let newPosChange = getOrdinalDirection(direction, this.orientation);
                let newRow = this.getPosition(grid).row + newPosChange.row;
                let newCol = this.getPosition(grid).col + newPosChange.col;
                if (newRow < 0 || newRow >= ROWS) continue;
                if (newCol < 0 || newCol >= COLUMNS) continue;
                if (grid[newRow][newCol] != null && grid[newRow][newCol].player == this.player) continue;
                validMovePositions.push(new Position(newRow, newCol));
            }
        }
        else {
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLUMNS; j++) {
                    if (grid[i][j] != null) continue;
                    validMovePositions.push(new Position(i, j));
                }
            }
        }
        return validMovePositions;
    }
    changePlayer(player) {
        this.player = player;
        this.orientation = (player == Player.TOP ? Orientation.DOWN : Orientation.UP);

        if (this.imageFilename != null) {
            if (this.orientation == Orientation.DOWN) {
                this.pieceElement.style.transform = "rotate(0.5turn)";
            }
            else {
                this.pieceElement.style.transform = "";
            }
        }
    }
}


// Animals
class Lion extends Animal {
    constructor(player, image=true) {
        super(player,
            [Direction.UP_LEFT, Direction.UP, Direction.UP_RIGHT,
                Direction.LEFT, Direction.RIGHT,
                Direction.DOWN_LEFT, Direction.DOWN, Direction.DOWN_RIGHT],
                !image ? null : "images/dobutsu_shogi_lion.png");
    }
    clone() {
        return new Lion(this.player, false);
    }
}
class Elephant extends Animal {
    constructor(player, image=true) {
        super(player,
            [Direction.UP_LEFT, Direction.UP_RIGHT,
                Direction.DOWN_LEFT, Direction.DOWN_RIGHT],
                !image ? null : "images/dobutsu_shogi_elephant.png");
    }
    clone() {
        return new Elephant(this.player, false);
    }
}
class Giraffe extends Animal {
    constructor(player, image=true) {
        super(player,
            [Direction.UP, Direction.LEFT,
                Direction.RIGHT, Direction.DOWN],
                !image ? null : "images/dobutsu_shogi_giraffe.png");
    }
    clone() {
        return new Giraffe(this.player, false);
    }
}
class Chick extends Animal {
    constructor(player, image=true) {
        super(player,
            [Direction.UP],
            !image ? null : "images/dobutsu_shogi_chick.png");
        this.type = "chick";
    }
    promote() {
        if (this.type != "chick") return;
        this.validDirections =
            [Direction.UP_LEFT, Direction.UP, Direction.UP_RIGHT,
            Direction.LEFT, Direction.RIGHT, Direction.DOWN];
            
        if (this.imageFilename != null) {
            this.imageFilename = "images/dobutsu_shogi_chicken.png";
            this.pieceElement.src = this.imageFilename;
        }
        this.type = "chicken";
    }
    demote() {
        if (this.type != "chicken") return;
        this.validDirections = [Direction.UP];

        if (this.imageFilename != null) {
            this.imageFilename = "images/dobutsu_shogi_chick.png";
            this.pieceElement.src = this.imageFilename;
        }
        this.type = "chick";
    }
    clone() {
        let chick = new Chick(this.player, false);
        if (this.type === "chicken") {
            chick.promote();
        }
        return chick;
    }
}


// Message elements
const topMessage = document.getElementsByClassName("top message")[0];
const bottomMessage = document.getElementsByClassName("bottom message")[0];
function showMessage(message) {
    topMessage.textContent = message;
    bottomMessage.textContent = message;
}


// New game buttons
for (let button of document.getElementsByClassName("new-game-button")) {
    button.addEventListener("click", () => {
        for (let button of document.getElementsByClassName("new-game-button")) {
            button.style.visibility = "hidden";
        }
        start();
    });
}


// Grid
const spaceGrid = new Array(ROWS);
for (let i = 0; i < ROWS; i++) {
    spaceGrid[i] = new Array(COLUMNS);
    for (let j = 0; j < COLUMNS; j++) {
        spaceGrid[i][j] = document.createElement("td");
    }
}
const animalGrid = new Array(ROWS);
for (let i = 0; i < ROWS; i++) {
    animalGrid[i] = new Array(COLUMNS);
}


// Grid history
let gridHistory = [];
let gridHistoryCounts = {};
function addToHistory(grid) {
    // Make a copy of the grid
    const gridCopy = new Array(ROWS);
    for (let i = 0; i < ROWS; i++) {
        gridCopy[i] = new Array(COLUMNS);
    }
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            gridCopy[i][j] = grid[i][j];
        }
    }
    // Push to grid history
    gridHistory.push(gridCopy);
    // Pop from grid history if max has been reached
    if (gridHistory.length > CONSECUTIVE_MOVES_TILL_DRAW * Object.keys(Player).length * 2) {
        gridHistory.pop();
    }
    // Check number of duplicates
    gridHistoryCounts = {};
    for (const hisGrid of gridHistory) {
        gridHistoryCounts[hisGrid] = gridHistoryCounts[hisGrid] ? gridHistoryCounts[hisGrid] + 1 : 1;
    }
}
addToHistory(animalGrid);


// Put table rows and cells into the DOM
let gridElement = document.getElementById("grid");
for (let i = 0; i < ROWS; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < COLUMNS; j++) {
        row.appendChild(spaceGrid[i][j]);
    }
    gridElement.appendChild(row);
}


// Hands
let hands;
let handElements;




// Make each piece movable on drag
let mouseDown = false;
let draggingAnimal;
let draggingParent;
let hoveredSpace;
let lastMouseX;
let lastMouseY;
let elemMouseX;
let elemMouseY;
addEventListener("mousemove", evt => { actionMove(evt) });
addEventListener("touchmove", evt => { actionMove(evt) });




// Action helper functions
// Down
function actionStart(animal, event) {
    if (aiMoving) return;
    let element = animal.pieceElement;

    // Only proceed if piece is of current player and game is not over
    if (animal.player != curPlayer || gameOver()) return;

    mouseDown = true;
    draggingAnimal = animal;
    let draggingElement = draggingAnimal.pieceElement;
    draggingParent = element.parentNode;
    let rect = element.getBoundingClientRect();
    let offsetLeft = rect.left + document.documentElement.scrollLeft;
    let offsetTop = rect.top + document.documentElement.scrollTop;
    if (event instanceof MouseEvent) {
        lastMouseX = event.pageX;
        lastMouseY = event.pageY;
        elemMouseX = event.pageX - offsetLeft;
        elemMouseY = event.pageY - offsetTop;
    }
    else if (event instanceof TouchEvent) {
        lastMouseX = event.touches[0].pageX;
        lastMouseY = event.touches[0].pageY;
        elemMouseX = event.touches[0].pageX - offsetLeft;
        elemMouseY = event.touches[0].pageY - offsetTop;
    }
    draggingParent.removeChild(draggingElement);
    draggingElement.style.position = "absolute";
    draggingElement.classList.add(draggingParent.classList.contains("hand") ? "fromHand" : "fromGrid");
    document.body.appendChild(draggingElement);
    draggingElement.style.top = lastMouseY - elemMouseY + "px";
    draggingElement.style.left = lastMouseX - elemMouseX + "px";
}
function actionRelease(animal) {
    //Only proceed if valid piece is selected
    if (!mouseDown) return;

    mouseDown = false;
    document.body.removeChild(draggingAnimal.pieceElement);
    draggingAnimal.pieceElement.style.position = "static";
    draggingAnimal.pieceElement.classList.remove("fromGrid");
    draggingAnimal.pieceElement.classList.remove("fromHand");
    draggingParent.appendChild(draggingAnimal.pieceElement);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (hoveredSpace == spaceGrid[i][j] && isValidMove(draggingAnimal, new Position(i, j))) {
                move(animal, new Position(i, j));
                return;
            }
        }
    }
}
// On mouse moved, do a couple things
function actionMove(event) {
    const spaces = [];
    for (let space of document.getElementsByTagName("td")) {
        spaces.push(space);
    }

    let clientX;
    let clientY;
    if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    else if (event instanceof TouchEvent) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }

    // If the mouse is in the bounds of a space, indicate hover
    let hoveringOverSpace = false;
    for (let space of spaces) {
        let rect = space.getBoundingClientRect();
        if (clientX > rect.left && clientX < rect.right &&
            clientY > rect.top && clientY < rect.bottom) {
            hoveringOverSpace = true;
            hoveredSpace = space;
        }
    }
    if (!hoveringOverSpace) {
        hoveredSpace = null;
    }

    // Move a dragged image
    if (!mouseDown) return;
    let deltaX;
    let deltaY;
    if (event instanceof MouseEvent) {
        deltaX = event.pageX - lastMouseX;
        deltaY = event.pageY - lastMouseY;
        lastMouseX = event.pageX;
        lastMouseY = event.pageY;
    }
    else if (event instanceof TouchEvent) {
        deltaX = event.touches[0].pageX - lastMouseX;
        deltaY = event.touches[0].pageY - lastMouseY;
        lastMouseX = event.touches[0].pageX;
        lastMouseY = event.touches[0].pageY;
    }
    draggingAnimal.pieceElement.style.top = draggingAnimal.pieceElement.offsetTop + deltaY + "px";
    draggingAnimal.pieceElement.style.left = draggingAnimal.pieceElement.offsetLeft + deltaX + "px";
}




// Function to start the game
function start() {

    // Reset grid
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            spaceGrid[i][j].innerHTML = "";
            animalGrid[i][j] = null;
        }
    }
    animalGrid[0][0] = new Giraffe(Player.TOP);
    animalGrid[0][1] = new Lion(Player.TOP);
    animalGrid[0][2] = new Elephant(Player.TOP);
    animalGrid[1][1] = new Chick(Player.TOP);
    animalGrid[2][1] = new Chick(Player.BOTTOM);
    animalGrid[3][0] = new Elephant(Player.BOTTOM);
    animalGrid[3][1] = new Lion(Player.BOTTOM);
    animalGrid[3][2] = new Giraffe(Player.BOTTOM);
    // Also, put animals in animal array
    const animals = []
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (animalGrid[i][j] != null) {
                animals.push(animalGrid[i][j]);
                spaceGrid[i][j].appendChild(animalGrid[i][j].pieceElement);
            }
        }
    }
    // So that event handlers can be attached
    for (let animal of animals) {
        let element = animal.pieceElement;
        element.addEventListener("mousedown", evt => { actionStart(animal, evt) });
        element.addEventListener("touchstart", evt => { actionStart(animal, evt) });
        element.addEventListener("mouseup", () => { actionRelease(animal) });
        element.addEventListener("touchend", () => { actionRelease(animal) });
        element.addEventListener("dragstart", evt => {
            evt.preventDefault();
        });
    }

    // Reset hands
    hands = {
        [Player.TOP]: [],
        [Player.BOTTOM]: []
    }
    handElements = {
        [Player.TOP]: document.getElementsByClassName("hand top")[0],
        [Player.BOTTOM]: document.getElementsByClassName("hand bottom")[0]
    }
    document.getElementsByClassName("hand top")[0].innerHTML = "";
    document.getElementsByClassName("hand bottom")[0].innerHTML = "";

    // Reset grid history
    gridHistory = [];
    gridHistoryCounts = {};
    addToHistory(animalGrid);
    
    // Pick player to go first
    if (firstPlayer === "forest") {
        curPlayer = Player.BOTTOM;
    }
    else if (firstPlayer === "sky") {
        curPlayer = Player.TOP;
    }
    else {
        let rand = Math.floor(Math.random()*Object.keys(Player).length);
        curPlayer = Player[Object.keys(Player)[rand]];
    }
    showMessage(curPlayer + "'s turn");

    // AI move
    if (curPlayer === Player.TOP) {
        aiMove();
    }
}




// Function to move animal
function move(animal, toPosition) {

    let capturedAnimal = animalGrid[toPosition.row][toPosition.col];
    if (capturedAnimal != null && capturedAnimal.player == curPlayer) {
        capturedAnimal = null;
    }

    const fromPosition = animal.getPosition(animalGrid);

    // Move animal on UI
    if (capturedAnimal != null) {
        spaceGrid[toPosition.row][toPosition.col].removeChild(capturedAnimal.pieceElement);
    }
    spaceGrid[toPosition.row][toPosition.col].appendChild(animal.pieceElement);

    // Move animal on animal grid
    animalGrid[toPosition.row][toPosition.col] = animal;
    if (fromPosition == null) {
        hands[curPlayer].splice(hands[curPlayer].indexOf(animal), 1);
    }
    else {
        animalGrid[fromPosition.row][fromPosition.col] = null;

        // Promote chick if possible
        promoteChick(animal);
    }

    // Add grid to grid history
    addToHistory(animalGrid);

    // Stop if game over
    if (gameOver()) {
        // Show game over message
        showGameOverMessage(winner());
        // Show new game buttons
        for (let button of document.getElementsByClassName("new-game-button")) {
            button.style.visibility = "visible";
        }
        return;
    }

    // Move captured animal to hand if applicable
    if (capturedAnimal != null) {

        // Demote chicken
        demoteChicken(capturedAnimal);

        capturedAnimal.changePlayer(curPlayer);
        hands[curPlayer].push(capturedAnimal);
        handElements[curPlayer].appendChild(capturedAnimal.pieceElement);
    }
    
    // Move to next player
    nextPlayer();
}


// Function to check if a move is valid
function isValidMove(animal, toPosition) {
    let validMove = false;
    for (let validMovePosition of animal.getValidMovePositions(animalGrid)) {
        if (validMovePosition.row != toPosition.row) continue;
        if (validMovePosition.col != toPosition.col) continue;
        validMove = true;
        break;
    }
    return validMove;
}


// Function to go to next player
function nextPlayer() {
    curPlayer = curPlayer == Player.TOP ? Player.BOTTOM : Player.TOP;
    showMessage(curPlayer + "'s turn");

    // AI move
    if (curPlayer === Player.TOP) {
        aiMove();
    }
}


// Function to check if a chick can be promoted and, if possible, promote it
function promoteChick(animal) {
    if (animal == null || !(animal instanceof Chick && animal.type == "chick")) return false;
    if (animal.getPosition(animalGrid) == null) return false;
    if (!(animal.getPosition(animalGrid).row == (animal.player == Player.TOP ? ROWS - 1 : 0))) return false;
    
    animal.promote();
    return true;
}


// Function to check if a chicken should be demoted and, if so, do it
function demoteChicken(animal) {
    if (animal == null || !(animal instanceof Chick && animal.type == "chicken")) return false;
    if (animal.getPosition(animalGrid) != null) return false;

    animal.demote();
    return true;
}


// Function to check if a lion has been captured. If found, returns the player who captured it. If
// not found, returns null
function capturedLion() {
    let foundLion = null;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (animalGrid[i][j] instanceof Lion) {
                if (foundLion) {
                    return null;
                }
                else {
                    foundLion = animalGrid[i][j];
                }
            }
        }
    }
    return foundLion;
}


// Function to check if a lion has made it to the furthest rank. Returns the lion who made it or
// null if not the case
function lionInLastRank() {
    let row = (curPlayer == Player.TOP ? ROWS - 1 : 0);
    for (let col = 0; col < COLUMNS; col++) {
        if (animalGrid[row][col] instanceof Lion && animalGrid[row][col].player == curPlayer) {
            return animalGrid[row][col];
        }
    }
    row = (curPlayer == Player.TOP ? 0 : ROWS - 1);
    for (let col = 0; col < COLUMNS; col++) {
        if (animalGrid[row][col] instanceof Lion && animalGrid[row][col].player != curPlayer) {
            return animalGrid[row][col];
        }
    }
    return null;
}


// Whether the given lion is not in check
function noCheck(lion) {
    for (let posChange of Object.values(OrdinalDirection)) {
        let newRow = lion.getPosition(animalGrid).row + posChange.row;
        let newCol = lion.getPosition(animalGrid).col + posChange.col;
        if (newRow < 0 || newRow >= ROWS) continue;
        if (newCol < 0 || newCol >= COLUMNS) continue;
        if (animalGrid[newRow][newCol] != null && animalGrid[newRow][newCol].player != lion.player) {
            for (let position of animalGrid[newRow][newCol].getValidMovePositions(animalGrid)) {
                if (position.row != lion.getPosition(animalGrid).row) continue;
                if (position.col != lion.getPosition(animalGrid).col) continue;
                return false;
            }
        }
    }
    return true;
}


// Function to check if a draw has been reached by consecutive moves
function maxConsecutiveMoves() {
    return Math.max.apply(null, Object.values(gridHistoryCounts));
}


// Returns whether the game is over
function gameOver() {
    const lionCaptured = capturedLion();
    const lastRankLion = lionInLastRank();
    const consecutiveMoves = maxConsecutiveMoves();

    if (lionCaptured != null) {
        return true;
    }
    else if (lastRankLion != null && noCheck(lastRankLion)) {
        return true;
    }
    else if (consecutiveMoves >= CONSECUTIVE_MOVES_TILL_DRAW) {
        return true;
    }
    return false;
}


// Returns the winner of a game
function winner() {
    const lionCaptured = capturedLion();
    const lastRankLion = lionInLastRank();

    if (lionCaptured != null) {
        return lionCaptured.player;
    }
    else if (lastRankLion != null) {
        return lastRankLion.player;
    }
    return null;
}


// Shows a different message depending on who the winner is
function showGameOverMessage(winner) {
    if (winner != null) {
        showMessage(winner + " wins!");
    }
    else {
        showMessage("It is a draw.");
    }
}


// Game class representing game state to copy in minimax algorithm
class Game {
    constructor(grid, hands, curPlayer) {
        this.animalGrid = new Array(ROWS);
        for (let i = 0; i < ROWS; i++) {
            let columns = new Array(COLUMNS)
            for (let j = 0; j < COLUMNS; j++) {
                if (grid[i][j] != null && grid[i][j] != undefined) {
                    columns[j] = grid[i][j].clone();
                }
                else {
                    columns[j] = null;
                }
            }
            this.animalGrid[i] = columns;
        }

        this.hands = {
            [Player.TOP]: [],
            [Player.BOTTOM]: []
        }
        for (let i = 0; i < hands[Player.TOP].length; i++) {
            this.hands[Player.TOP].push(hands[Player.TOP][i].clone());
        }
        for (let i = 0; i < hands[Player.BOTTOM].length; i++) {
            this.hands[Player.BOTTOM].push(hands[Player.BOTTOM][i].clone());
        }

        this.animals = [];
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (this.animalGrid[i][j] != null) {
                    this.animals.push(this.animalGrid[i][j]);
                }
            }
        }
        for (let i = 0; i < this.hands[Player.TOP].length; i++) {
            this.animals.push(this.hands[Player.TOP][i]);
        }
        for (let i = 0; i < this.hands[Player.BOTTOM].length; i++) {
            this.animals.push(this.hands[Player.BOTTOM][i]);
        }

        this.gridHistory = [];
        this.handHistory = [];

        this.curPlayer = curPlayer;
    }

    addToHistory(grid) {
        // Make a copy of the grid
        const gridCopy = new Array(ROWS);
        for (let i = 0; i < ROWS; i++) {
            gridCopy[i] = new Array(COLUMNS);
        }
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (grid[i][j] != null)
                    gridCopy[i][j] = grid[i][j].clone();
                else {
                    gridCopy[i][j] = null;
                }
            }
        }
        // Push to grid history
        this.gridHistory.push(gridCopy);
        // Make a copy of the hands
        const handsCopy = {
            [Player.TOP]: [],
            [Player.BOTTOM]: []
        }
        for (let i = 0; i < hands[Player.TOP.length]; i++) {
            handsCopy[Player.TOP].push(this.hands[Player.TOP][i].clone());
        }
        for (let i = 0; i < hands[Player.BOTTOM.length]; i++) {
            handsCopy[Player.BOTTOM].push(this.hands[Player.BOTTOM][i].clone());
        }
        // Push to grid history
        this.handHistory.push(handsCopy);
        // Pop from grid history if max has been reached
        //if (this.gridHistory.length > CONSECUTIVE_MOVES_TILL_DRAW * Object.keys(Player).length * 2) {
        //    this.gridHistory.pop();
        //}
        // Check number of duplicates
        //this.gridHistoryCounts = {};
        //for (const hisGrid of gridHistory) {
        //    gridHistoryCounts[hisGrid] = gridHistoryCounts[hisGrid] ? gridHistoryCounts[hisGrid] + 1 : 1;
        //}
    }


    numPieces(player) {
        let numPieces = 0;
        for (const animal of this.animals) {
            if (animal.player === player) {
                if (animal instanceof Lion)
                    numPieces += 100;
                else if (animal instanceof Chick && animal.type === "chicken")
                    numPieces += 18;
                else if (animal instanceof Chick)
                    numPieces += 3;
                else if (animal instanceof Giraffe)
                    numPieces += 12;
                else if (animal instanceof Elephant)
                    numPieces += 12;
            }
        }
        return numPieces;
    }


    validMoves(player) {
        let validMoves = [];
        for (const animal of this.animals) {
            if (animal.player === player) {
                for (const move of animal.getValidMovePositions(this.animalGrid)) {
                    validMoves.push([animal, move]);
                }
            }
        }
        return validMoves;
    }


    // Function to check if a move is valid
    isValidMove(animal, toPosition) {
        let validMove = false;
        for (let validMovePosition of animal.getValidMovePositions(this.animalGrid)) {
            if (validMovePosition.row != toPosition.row) continue;
            if (validMovePosition.col != toPosition.col) continue;
            validMove = true;
            break;
        }
        return validMove;
    }
    

    // Function to move animal
    move(fromPosition, toPosition) {

        let capturedAnimal = this.animalGrid[toPosition.row][toPosition.col];
        if (capturedAnimal != null && capturedAnimal.player == this.curPlayer) {
            capturedAnimal = null;
        }

        let animal;

        // Move animal on animal grid
        if (!(fromPosition instanceof Position)) {
            animal = this.hands[this.curPlayer][fromPosition];
        }
        else {
            animal = this.animalGrid[fromPosition.row][fromPosition.col];
        }
        if (!(fromPosition instanceof Position)) {
            this.hands[this.curPlayer].splice(fromPosition, 1);
        }
        else {
            this.animalGrid[fromPosition.row][fromPosition.col] = null;
            // Promote chick if possible
            this.promoteChick(animal);
        }
        this.animalGrid[toPosition.row][toPosition.col] = animal;

        // Move captured animal to hand if applicable
        if (capturedAnimal != null) {

            // Demote chicken
            this.demoteChicken(capturedAnimal);

            capturedAnimal.changePlayer(this.curPlayer);
            this.hands[this.curPlayer].push(capturedAnimal);
        }
        
        // Move to next player
        this.nextPlayer();
    }


    undoMove() {

        this.animalGrid = this.gridHistory.pop();
        this.hands = this.handHistory.pop();
        
        // Move to next player
        this.nextPlayer();
    }

    
    // Function to go to next player
    nextPlayer() {
        this.curPlayer = this.curPlayer == Player.TOP ? Player.BOTTOM : Player.TOP;
    }
    
    
    // Function to check if a chick can be promoted and, if possible, promote it
    promoteChick(animal) {
        if (animal == null || !(animal instanceof Chick && animal.type == "chick")) return false;
        if (animal.getPosition(this.animalGrid) == null) return false;
        if (!(animal.getPosition(this.animalGrid).row == (animal.player == Player.TOP ? ROWS - 1 : 0))) return false;
        
        animal.promote();
        return true;
    }
    
    
    // Function to check if a chicken should be demoted and, if so, do it
    demoteChicken(animal) {
        if (animal == null || !(animal instanceof Chick && animal.type == "chicken")) return false;
        if (animal.getPosition(this.animalGrid) != null) return false;
    
        animal.demote();
        return true;
    }
    
    // Function to check if a lion has been captured. If found, returns the player who captured it. If
    // not found, returns null
    capturedLion() {
        let foundLion = null;
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (this.animalGrid[i][j] instanceof Lion) {
                    if (foundLion != null) {
                        return null;
                    }
                    else {
                        foundLion = this.animalGrid[i][j];
                    }
                }
            }
        }
        return foundLion;
    }
    
    // Function to check if a lion has made it to the furthest rank. Returns the lion who made it or
    // null if not the case
    lionInLastRank() {
        let row = 0;
        for (let col = 0; col < COLUMNS; col++) {
            if (this.animalGrid[row][col] instanceof Lion && this.animalGrid[row][col].player === Player.BOTTOM) {
                return this.animalGrid[row][col];
            }
        }
        row = ROWS - 1;
        for (let col = 0; col < COLUMNS; col++) {
            if (this.animalGrid[row][col] instanceof Lion && this.animalGrid[row][col].player === Player.TOP) {
                return this.animalGrid[row][col];
            }
        }
        return null;
    }
    
    // Whether the given lion is not in check
    noCheck(lion) {
        for (let posChange of Object.values(OrdinalDirection)) {
            let newRow = lion.getPosition(this.animalGrid).row + posChange.row;
            let newCol = lion.getPosition(this.animalGrid).col + posChange.col;
            if (newRow < 0 || newRow >= ROWS) continue;
            if (newCol < 0 || newCol >= COLUMNS) continue;
            if (this.animalGrid[newRow][newCol] != null && this.animalGrid[newRow][newCol].player != lion.player) {
                for (let position of this.animalGrid[newRow][newCol].getValidMovePositions(this.animalGrid)) {
                    if (position.row != lion.getPosition(this.animalGrid).row) continue;
                    if (position.col != lion.getPosition(this.animalGrid).col) continue;
                    return false;
                }
            }
        }
        return true;
    }
    
    // Returns whether the game is over
    gameOver() {
        const lion = this.lionInLastRank();
        if (this.capturedLion() != null || (lion != null && this.noCheck(lion))) {
            return true;
        }
        return false;
    }
    
    // Returns the winner of a game
    winner() {
        const lionCaptured = this.capturedLion();
        const lastRankLion = this.lionInLastRank();
        if (lionCaptured != null) {
            return lionCaptured.player;
        }
        else if (lastRankLion != null) {
            return lastRankLion.player;
        }
        return null;
    }
}


// --- AI ---

const MAX_DEPTH = 5;	// Maximum search depth for minimax


function randomInteger(max) {
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * maxFloored);
}

// Makes AI move
function aiMove() {
    if (!ai || curPlayer !== Player.TOP) return;
    aiMoving = true;
    setTimeout(() => {
        const start = Date.now();
        let themove = getMove();
        const end = Date.now();
        const time = end - start;
        let animal = themove[0];
        let toPosition = themove[1];
        setTimeout(() => {
            move(animal, toPosition);
            aiMoving = false;
        }, Math.max(950 - time, 1));
    }, 50);
}

// Returns a move for AI to make
function getMove() {
    let gameCopy = new Game(animalGrid, hands, curPlayer);

    let move;
	let randomVal = Math.random() < -0.5*Math.log10(0.99*difficulty + 0.01);
    // Chance for random move depending on difficulty.
    if (randomVal) {
        move = randomMove(gameCopy);
        if (!(move[0] instanceof Position)) {
            return [hands[curPlayer][move[0]], move[1]];
        }
        return [animalGrid[move[0].row][move[0].col], move[1]];
    }
    else {
        move = minimaxMove(gameCopy);
        if (!(move[0] instanceof Position)) {
            return [hands[curPlayer][move[0]], move[1]];
        }
        return [animalGrid[move[0].row][move[0].col], move[1]];
    }
}


function randomMove(game) {
    const move = game.validMoves(game.curPlayer)[randomInteger(game.validMoves(game.curPlayer).length)];
    return [move[0].getPosition(game.animalGrid), move[1]];
}


function minimaxMove(game) {
    let bestValue = Number.MIN_SAFE_INTEGER;
    let value = Number.MIN_SAFE_INTEGER;
    
    let movedPlayer = game.curPlayer;
    let bestMoves = [];
    for (let move of game.validMoves(movedPlayer)) {
        let frompos = move[0].getPosition(game.animalGrid);
        if (frompos == null) {
            frompos = game.hands[movedPlayer].indexOf(move[0]);
        }
        let gameCopy = new Game(animalGrid, hands, curPlayer);
        gameCopy.move(frompos, move[1]);
        value = minimax(gameCopy, MAX_DEPTH - 1, false);
        move = [frompos, move[1]];
        if (bestMoves.length == 0) {
            bestValue = value;
            bestMoves.push(move);
        }
        else if (value > bestValue) {
            bestValue = value;
            bestMoves = [];
            bestMoves.push(move);
        }
        else if (value == bestValue) {
            bestMoves.push(move);
        }
        // TODO - Alpha-beta pruning method may be faulty
    }
    
    // Make a random choice from the list of best moves
    let bestMove = bestMoves[randomInteger(bestMoves.length)];
    
    return bestMove;
}

function minimax(game, depth, maximizingPlayer) {
    // FOR SOME REASON GAME OVER IS NOT DETECTED PROPERLY
    // Base case
    if (game.gameOver() || depth == 0)			// Reached maximum search depth
    {
        const val = staticEvaluation(game, maximizingPlayer);
        return val;
    }
    
    // Maximizing player
    else if (maximizingPlayer) {
        let value = Number.MIN_SAFE_INTEGER;
        for (const move of game.validMoves(game.curPlayer)) {
            let frompos = move[0].getPosition(game.animalGrid);
            if (frompos == null) {
                frompos = game.hands[game.curPlayer].indexOf(move[0]);
            }
            let gameCopy = new Game(game.animalGrid, game.hands, game.curPlayer);
            gameCopy.move(frompos, move[1]);
            value = Math.max(value, minimax(gameCopy, depth - 1, false));
        }
        return value;
    }
    
    // Minimizing player
    else {
        let value = Number.MAX_SAFE_INTEGER;
        for (const move of game.validMoves(game.curPlayer)) {
            let frompos = move[0].getPosition(game.animalGrid);
            if (frompos == null) {
                frompos = game.hands[game.curPlayer].indexOf(move[0]);
            }
            let gameCopy = new Game(game.animalGrid, game.hands, game.curPlayer);
            gameCopy.move(frompos, move[1]);
            value = Math.min(value, minimax(gameCopy, depth - 1, true));
        }
        return value;
    }
}


function staticEvaluation(game, maximizingPlayer) {
    let maximizer, minimizer;
    maximizer = Player.TOP;
    minimizer = Player.BOTTOM;

    const lion = game.lionInLastRank();

    if (game.capturedLion() != null) {
        if (maximizingPlayer)
            return Number.MIN_SAFE_INTEGER;
        else
            return Number.MAX_SAFE_INTEGER;
    }

    else if (lion != null && game.noCheck(lion)) {
        if (maximizingPlayer)
            return Number.MIN_SAFE_INTEGER;
        else
            return Number.MAX_SAFE_INTEGER;
    }
    
    return game.numPieces(maximizer) - game.numPieces(minimizer);
}


let radios = document.configForm.topPlayer;
for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', () => {
        if (radios[i].value === "human") {
            ai = false;
        }
        else {
            ai = true;
        }
    });
}
if (document.querySelector("#human").checked) {
    ai = false;
}
else if (document.querySelector("#computer").checked) {
    ai = true;
}
document.configForm.difficulty.addEventListener('change', () => {
    difficulty = document.configForm.difficulty.value;
});
document.configForm.difficulty.value = difficulty;
radios = document.configForm.firstPlayer;
for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', () => {
        if (radios[i].value === "sky") {
            firstPlayer = "sky";
        }
        else if (radios[i].value === "forest") {
            firstPlayer = "forest";
        }
        else {
            firstPlayer = "random";
        }
    });
    if (radios[i].value === "sky") {
        firstPlayer = "sky";
    }
    else if (radios[i].value === "forest") {
        firstPlayer = "forest";
    }
    else {
        firstPlayer = "random";
    }
}
if (document.querySelector("#sky").checked) {
    firstPlayer = "sky";
}
else if (document.querySelector("#forest").checked) {
    firstPlayer = "forest";
}
else if (document.querySelector("#random").checked) {
    firstPlayer = "random";
}
document.querySelector("#reset-button").addEventListener('click', () => {
    for (let button of document.getElementsByClassName("new-game-button")) {
        button.style.visibility = "hidden";
    }
    start();
});



// Start the game
start();