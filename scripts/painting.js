"use strict"

// Put all movable elements in an array
let movableElements = []
movableElements.push(document.getElementById("green-character"));
movableElements.push(document.getElementById("orange-character"));
movableElements.push(document.getElementById("cactuar"));
movableElements.push(document.getElementById("apple"));
movableElements.push(document.getElementById("piano"));
movableElements.push(document.getElementById("apple"));
movableElements.push(document.getElementById("drawer-1"));
movableElements.push(document.getElementById("drawer-2"));
movableElements.push(document.getElementById("drawer-3"));
movableElements.push(document.getElementById("drawer-4"));
movableElements.push(document.getElementById("drawer-5"));
movableElements.push(document.getElementById("table"));
movableElements.push(document.getElementById("rug"));
movableElements.push(document.getElementById("key"));
console.log(movableElements);

// Make each element movable on drag
let mouseDown = false;
let draggingElement;
let lastMouseX;
let lastMouseY;
for (let element of movableElements) {
    element.addEventListener("mousedown", event => {
        mouseDown = true;
        draggingElement = element;
        lastMouseX = event.pageX;
        lastMouseY = event.pageY;
    });
    element.addEventListener("mouseup", () => {
        mouseDown = false;
    });
}
addEventListener("mousemove", (event) => {
    if (!mouseDown) return;
    let deltaX = event.pageX - lastMouseX;
    let deltaY = event.pageY - lastMouseY;
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;
    draggingElement.style.top = draggingElement.offsetTop + deltaY + "px";
    draggingElement.style.left = draggingElement.offsetLeft + deltaX + "px";
});