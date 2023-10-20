"use strict"

const MAX_ANIMATION_DELAY = 11000;
const TRANSITION_LENGTH = 2000;
const TRANSITION_FPS = 60;

// Put all arrows in an array
let arrows = []
for (let arrow of document.getElementsByClassName("arrow")) {
    arrows.push(arrow);
}

// Create the toggle opacity animation
let amount = 1000 / TRANSITION_LENGTH / TRANSITION_FPS;
function toggleOpacityAnimation(arrow, on) {
    let opacity = (on ? 0 : 1);
    arrow.style.opacity = opacity;
    let randDuration = Math.floor(Math.random() * MAX_ANIMATION_DELAY);
    let id = setTimeout(frame, randDuration);
    function frame() {
        if (opacity > 1 || opacity < 0) {
            opacity = (opacity > 1 ? 1 : 0);
            on = !on;
            arrow.style.opacity = opacity;
            clearInterval(id);
            toggleOpacityAnimation(arrow, on);
        }
        else {
            if (opacity == 1 || opacity == 0) {
                clearTimeout(id);
                id = setInterval(frame, 1000 / TRANSITION_FPS);
            }
            opacity = opacity + (on ? +amount : -amount);
            arrow.style.opacity = opacity;
        }
    }
}

// Start the animation for each arrow (random chance to start on or off)
for (let arrow of arrows) {
    let randBool = Math.random() < 0.5
    toggleOpacityAnimation(arrow, randBool);
}