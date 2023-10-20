"use strict"

// --- Constants ---
const ROWS = 4;
const COLUMNS = 3;

// Position class
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Relative directions
const Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    UP_LEFT: 4,
    UP_RIGHT: 5,
    DOWN_RIGHT: 6,
    DOWN_LEFT: 7
}

// Absolute directions with changes in position as values
const OrdinalDirection = {
    NORTH: new Position(0, -1),
    SOUTH: new Position(0, 1),
    EAST: new Position(1, 0),
    WEST: new Position(-1, 0),
    NORTHWEST: new Position(-1, -1),
    NORTHEAST: new Position(1, -1),
    SOUTHWEST: new Position(-1, 1),
    SOUTHEAST: new Position(1, 1)
}

// Orientation
const Orientation = {
    UP: 0,
    DOWN: 1
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
    constructor(orientation, validDirections, imageFilename) {
        this.orientation = orientation;
        this.validDirections = validDirections;
        this.imageFilename = imageFilename;

        this.pieceElement = document.createElement("img");
        this.pieceElement.classList.add("piece")
        this.pieceElement.src = this.imageFilename;
        if (this.orientation == Orientation.DOWN) {
            this.pieceElement.style.transform = "rotate(0.5turn)";
        }
    }
    getPosition() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (animalGrid[i][j] == this) {
                    return new Position(j, i);
                }
            }
        }
    }
    getValidMovePositions() {
        let validMovePositions = [];
        for (let direction of this.validDirections) {
            let newPosChange = getOrdinalDirection(direction, this.orientation);
            let newX = this.getPosition().x + newPosChange.x;
            let newY = this.getPosition().y + newPosChange.y;
            if (newX < 0 || newX >= COLUMNS) continue;
            if (newY < 0 || newY >= ROWS) continue;
            if (animalGrid[newY][newX] != null) continue;
            console.log(new Position(newX, newY));
            validMovePositions.push(new Position(newX, newY));
        }
        return validMovePositions;
    }
}

// Animals
class Lion extends Animal {
    constructor(orientation) {
        super(orientation,
            [Direction.UP_LEFT, Direction.UP, Direction.UP_RIGHT,
                Direction.LEFT, Direction.RIGHT,
                Direction.DOWN_LEFT, Direction.DOWN, Direction.DOWN_RIGHT],
                "images/dobutsu_shogi_lion.png");
    }
}
class Elephant extends Animal {
    constructor(orientation) {
        super(orientation,
            [Direction.UP_LEFT, Direction.UP_RIGHT,
                Direction.DOWN_LEFT, Direction.DOWN_RIGHT],
                "images/dobutsu_shogi_elephant.png");
    }
}
class Giraffe extends Animal {
    constructor(orientation) {
        super(orientation,
            [Direction.UP, Direction.LEFT,
                Direction.RIGHT, Direction.DOWN],
                "images/dobutsu_shogi_giraffe.png");
    }
}
class Chick extends Animal {
    constructor(orientation) {
        super(orientation,
            [Direction.UP],
            "images/dobutsu_shogi_chick.png");
    }
}
class Chicken extends Animal {
    constructor(orientation) {
        super(orientation,
            [Direction.UP_LEFT, Direction.UP, Direction.UP_RIGHT,
                Direction.LEFT, Direction.RIGHT, Direction.DOWN],
                "images/dobutsu_shogi_chicken.png");
    }
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
animalGrid[0][0] = new Giraffe(Orientation.DOWN);
animalGrid[0][1] = new Lion(Orientation.DOWN);
animalGrid[0][2] = new Elephant(Orientation.DOWN);
animalGrid[1][1] = new Chick(Orientation.DOWN);
animalGrid[2][1] = new Chick(Orientation.UP);
animalGrid[3][0] = new Elephant(Orientation.UP);
animalGrid[3][1] = new Lion(Orientation.UP);
animalGrid[3][2] = new Giraffe(Orientation.UP);

// Function to check if a move is valid
function isValidMove(animal, toPosition) {
    let validMove = false;
    for (let validMovePosition of animal.getValidMovePositions()) {
        console.log(validMovePosition);
        if (validMovePosition.x != toPosition.x) continue;
        if (validMovePosition.y != toPosition.y) continue;
        validMove = true;
        break;
    }
    return validMove;
}

// Function to move animal
function move(animal, toPosition) {
    animalGrid[animal.getPosition().y][animal.getPosition().x] = null;
    animalGrid[toPosition.y][toPosition.x] = animal;
}

// Put table rows and cells into the DOM
// Also, put animals in animal array
const animals = []
let gridElement = document.getElementById("grid");
for (let i = 0; i < ROWS; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < COLUMNS; j++) {
        if (animalGrid[i][j] != null) {
            animals.push(animalGrid[i][j]);
            spaceGrid[i][j].appendChild(animalGrid[i][j].pieceElement);
        }
        row.appendChild(spaceGrid[i][j]);
    }
    gridElement.appendChild(row);
}

// Make each piece movable on drag
let mouseDown = false;
let draggingAnimal;
let draggingParent;
let hoveredSpace;
let lastMouseX;
let lastMouseY;
let elemMouseX;
let elemMouseY;
for (let animal of animals) {
    let element = animal.pieceElement;
    element.addEventListener("mousedown", event => {
        mouseDown = true;
        draggingAnimal = animal;
        let draggingElement = draggingAnimal.pieceElement;
        draggingParent = element.parentNode;
        lastMouseX = event.pageX;
        lastMouseY = event.pageY;
        elemMouseX = event.offsetX;
        elemMouseY = event.offsetY;
        draggingParent.removeChild(draggingElement);
        draggingElement.style.position = "absolute";
        document.body.appendChild(draggingElement);
        draggingElement.style.top = lastMouseY - (animal.orientation == Orientation.DOWN ? element.clientHeight - elemMouseY : elemMouseY) + "px";
        draggingElement.style.left = lastMouseX - (animal.orientation == Orientation.DOWN ? element.clientWidth - elemMouseX : elemMouseX) + "px";
    });
    element.addEventListener("mouseup", () => {
        if (!mouseDown) return;
        mouseDown = false;
        document.body.removeChild(draggingAnimal.pieceElement);
        draggingAnimal.pieceElement.style.position = "static";
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (hoveredSpace == spaceGrid[i][j] && isValidMove(draggingAnimal, new Position(j, i))) {
                    console.log(i + " " + j + " " + isValidMove(draggingAnimal, new Position(j, i)));
                    hoveredSpace.appendChild(draggingAnimal.pieceElement);
                    move(animal, new Position(j, i));
                    return;
                }
            }
        }

        draggingParent.appendChild(draggingAnimal.pieceElement);
    });
    element.addEventListener("dragstart", event => {
        event.preventDefault();
    });
}

// On mouse moved, do a couple things
const spaces = [];
for (let space of document.getElementsByTagName("td")) {
    spaces.push(space);
}
const highlightColor = getComputedStyle(document.body).getPropertyValue("--highlight-color");
addEventListener("mousemove", (event) => {

    // If the mouse is in the bounds of a space, change its color
    let hoveringOverSpace = false;
    for (let space of spaces) {
        let rect = space.getBoundingClientRect();
        if (event.clientX > rect.left && event.clientX < rect.right &&
            event.clientY > rect.top && event.clientY < rect.bottom) {
            space.style.backgroundColor = highlightColor;
            hoveringOverSpace = true;
            hoveredSpace = space;
        }
        else if (space.style.backgroundColor != "") {
            space.style.backgroundColor = "";
        }
    }
    if (!hoveringOverSpace) {
        hoveredSpace = null;
    }

    // Move a dragged image
    if (!mouseDown) return;
    elemMouseX = event.offsetX;
    elemMouseY = event.offsetY;
    let deltaX = event.pageX - lastMouseX;
    let deltaY = event.pageY - lastMouseY;
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;
    draggingAnimal.pieceElement.style.top = lastMouseY - (draggingAnimal.orientation == Orientation.DOWN ? draggingAnimal.pieceElement.clientHeight - elemMouseY : elemMouseY) + deltaY + "px";
    draggingAnimal.pieceElement.style.left = lastMouseX - (draggingAnimal.orientation == Orientation.DOWN ? draggingAnimal.pieceElement.clientWidth - elemMouseX : elemMouseX) + deltaX + "px";
});