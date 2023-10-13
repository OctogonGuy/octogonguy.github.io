"use strict"

const $ = function(selector) {
    return document.querySelector(selector);
}



// --- Alert button ---
// Alert the user on click
$("#alert-button").addEventListener("click", () => {
    alert("You have been alerted.");
})



// --- Insult button ---
// Adjectives
const adjs = [
    "loco", "artless", "rank", "goatish", "frobbing", "errant",
    "beslubbering", "churlish", "yeasty", "villainous", "tottering",
    "saucy", "qualling", "wayward", "vain", "loony", "rumbumptious",
    "spoony", "foppling", "flip-flopping", "loathly", "purblind", "old",
    "roguish", "unmuzzled", "spleeny", "puking"];
// First stems of compound adjective
const compAdjStarts = [
        "cotton", "yellow", "possum", "lily", "grass", "lead", "fiddle", "hot",
        "cow", "white", "thorough", "dog", "clay", "milk", "fat", "common",
        "ill", "chicken", "crooked"];
// Second stems of compound adjective
const compAdjEnds = [
        "headed", "bellied", "sniffin'", "booted", "footed", "handed",
        "livered", "paced", "hearted", "brained", "hewn", "witted", "biting",
        "kissing", "born", "nosed"];
// Nouns
const nouns = [
        "greenhorn", "half-wit", "bottom-feeder", "tenderfoot", "bluebelly",
        "redneck", "sidewinder", "son of a gun", "whippersnapper", "lunk",
        "bigmouth", "heeler", "high-binder", "windbag", "mongrel",
        "dunderhead", "fop-doodle", "ginger-snap", "nincompoop", "ruffian",
        "ignoramus", "scoundrel", "weakling", "hellion", "gollumpus",
        "afternoon farmer", "cad", "whiffle-whaffle"];
// Generates just the insult noun phrase
function generatePhrase() {
    // Randomly select each word in the phrase.
    let word1 = adjs[Math.floor(Math.random() * adjs.length)];
    let word2 = compAdjStarts[Math.floor(Math.random() * compAdjStarts.length)];
    let word3 = compAdjEnds[Math.floor(Math.random() * compAdjEnds.length)];
    let word4 = nouns[Math.floor(Math.random() * nouns.length)];
    // Put the phrase together and return it
    let phrase = `${word1} ${word2}-${word3} ${word4}`;
    // Return the phrase
    return phrase;
}
// Generates the whole insult sentence
function generateInsult() {
    // Generate the phrase.
    let phrase = generatePhrase();
    // Assign the appropriate article adjective depending on the first letter
    // of the phrase.
    let article;
    if (phrase.charAt(0) == 'a' || phrase.charAt(0) == 'A' ||
         phrase.charAt(0) == 'e' || phrase.charAt(0) == 'E' ||
         phrase.charAt(0) == 'i' || phrase.charAt(0) == 'I' ||
         phrase.charAt(0) == 'o' || phrase.charAt(0) == 'O' ||
         phrase.charAt(0) == 'u' || phrase.charAt(0) == 'U') {
        article = "an";
    }
    else {
        article = "a";
    }
    // Put the phrase together and return it
    let insult = `You're ${article} ${phrase}.`;
    return insult;
}
// Alert a random insult on click of the insult button
$("#insult-button").addEventListener("click", () => {
    alert(generateInsult());
});



// --- Count & random number button ---
// Keep track of a counter and count up when the user clicks the count button
const COUNT_START = 0;
let count = COUNT_START;
$("#count").textContent = count;
$("#count-button").addEventListener("click", () => {
    count++;
    $("#count").textContent = count;
});
// Generate a random number between 0 and the count when the user clicks the random button
$("#random-number-button").addEventListener("click", () => {
    $("#random-number-label").textContent = `Here is a random number between ${COUNT_START} and ${count}:`;
    let randNum = Math.floor(Math.random() * (count + 1));
    $("#random-number").textContent = randNum;
});



// --- Event handler fortune teller ---
// Display a different message depending on the mouse action
const eventBox = $("#event-handler-box");
eventBox.addEventListener("mouseover", () => {
    eventBox.textContent = "Your curiosity will lead you to new, exciting experiences.";
});
eventBox.addEventListener("mouseout", () => {
    eventBox.textContent = "You will be able to fend off misfortune as you know when to have restraint.";
});
eventBox.addEventListener("click", () => {
    eventBox.textContent = "You will be able to shape your destiny as you wish.";
});
eventBox.addEventListener("dblclick", () => {
    eventBox.textContent = "Your decisive actions will lead you to much success in life.";
});



// --- Form ---
const processEntries = () => {
    // Get form controls to check for validity
    const name = $("#name-field");
    const email = $("#email-field");
    const phone = $("#phone-field");
    const planet = $("#planet-field");
    const contactEmail = $("#contact-choice-1");
    const contactPhone = $("#contact-choice-2");
    const contactPigeon = $("#contact-choice-3");
    const terms = $("#terms-1");
    const policy = $("#terms-2");
    // Check user entries for validity and change the asterisk to an error message if not valid
    let valid = true;
    if (name.value == "") {
        name.nextElementSibling.textContent = "Please enter your name.";
        valid = false;
    } else {
        name.nextElementSibling.textContent = "*";
    }
    if (email.value == "") {
        email.nextElementSibling.textContent = "Please enter an email."; 
        valid = false;
    } else if (!email.checkValidity()) {
        email.nextElementSibling.textContent = "Email is not in valid format."; 
        valid = false;
    } else {
        email.nextElementSibling.textContent = "*";
    }
    if (phone.value == "") {
        phone.nextElementSibling.textContent = "Please enter a phone number.";
        valid = false;
    } else if (!phone.checkValidity()) {
        phone.nextElementSibling.textContent = "Phone number is not in valid format.";
        valid = false;
    } else {
        phone.nextElementSibling.textContent = "*";
    }
    if (planet.value == "") {
        planet.nextElementSibling.textContent = "Please select your home planet.";
        valid = false;
    } else {
        planet.nextElementSibling.textContent = "*";
    }
    if (!terms.checked) {
        terms.nextElementSibling.nextElementSibling.textContent = "You must agree to the terms of service."; 
        valid = false;
    } else {
        terms.nextElementSibling.nextElementSibling.textContent = "*";
    }
	if (!policy.checked) {
	    policy.nextElementSibling.nextElementSibling.textContent = "You must accept the privacy policy.";
        valid = false;
    } else {
        policy.nextElementSibling.nextElementSibling.textContent = "*";
    }
    // If all entries are valid, show a confirmation message to the user
    if (valid) {
        let message = `Thank you for registering, ${name.value}.`;
        if (contactEmail.checked) {
            message += ` A confirmation email will be sent to ${email.value} momentarily.`;
        }
        else if (contactPhone.checked) {
            message += ` A text message has been sent to ${phone.value}.`;
        }
        else if (contactPigeon.checked) {
            message += ` A confirmation scroll will be sent to ${planet.value} via the next available pigeon.`;
        }
        $("#form-confirmation-message").textContent = message;
    }
};
// Process entries when the user clicks the register button
$("#register-button").addEventListener("click", processEntries);



// --- Food image ---
// Images of food
const foodImageDict = {
    "pizza": "images/playground_pizza.jpg",
    "sushi": "images/playground_sushi.jpg",
    "chicken-wings": "images/playground_chicken_wings.jpg",
    "thai-curry": "images/playground_thai_curry.jpg",
    "candied-sweet-potatoes": "images/playground_candied_sweet_potatoes.jpg",
};
// Show corresponding image when user selects an item from the select
$("#food-select").addEventListener("change", event => {
    $("#food-image").src = foodImageDict[event.target.value];
});



// --- Simple color picker ---
// Function to convert hexidecimal number to string with padded zeros to two digits
function twoDigitHexStr(hexNumber) {
    return ("00" + hexNumber.toString(16)).slice(-2);
}
// Function to change color box based on selected colors
function changeColorPickerColor() {
    // Get colors
    let redSelected = $("#red-checkbox").checked;
    let greenSelected = $("#green-checkbox").checked;
    let blueSelected = $("#blue-checkbox").checked;
    // Make hex values for each color depending on whether or not it is checked
    let redHexVal = redSelected ? 0xFF : 0x00;
    let greenHexVal = greenSelected ? 0xFF : 0x00;
    let blueHexVal = blueSelected ? 0xFF : 0x00;
    // Combine each hex value into one color
    let color = '#' + twoDigitHexStr(redHexVal) + twoDigitHexStr(greenHexVal) + twoDigitHexStr(blueHexVal);
    // Change background of color box to this color
    $("#color-box").style.backgroundColor = color;
}
// Change color of box on item checked
$("#red-checkbox").addEventListener("change", changeColorPickerColor);
$("#green-checkbox").addEventListener("change", changeColorPickerColor);
$("#blue-checkbox").addEventListener("change", changeColorPickerColor);
// Set initial color
changeColorPickerColor();



// --- Dance floor ---
// Colors
const danceFloorColors = ["red", "lime", "blue", "yellow", "magenta", "cyan"];
// Function to randomly change all dance floor squares' colors
function changeDanceFloorColors() {
    for (let square of $("#dance-floor").querySelectorAll(".dance-floor-square")) {
        let color = danceFloorColors[Math.floor(Math.random() * danceFloorColors.length)];
        square.style.backgroundColor = color;
    }
}
// Animation that changes the dance floor colors after an interval
let danceFloorInterval;
function changeColorAnimation() {
    danceFloorInterval = setInterval(frame, 1000);
    function frame() {
        changeDanceFloorColors();
    }
}
// Functions to turn the dance floor on or off. on and off classes will be added to
// the dance floor so that it can be styled accordingly.
let danceFloorOn;
function turnDanceFloorOn() {
    changeColorAnimation();
    $("#dance-floor").classList.remove("off");
    $("#dance-floor").classList.add("on");
    $("#dance-floor-button").textContent = "Stop Dance Floor";
    danceFloorOn = true;
}
function turnDanceFloorOff() {
    clearInterval(danceFloorInterval);
    $("#dance-floor").classList.remove("on");
    $("#dance-floor").classList.add("off");
    $("#dance-floor-button").textContent = "Start Dance Floor";
    danceFloorOn = false;
}
// Start/stop the dance floor when the user clicks the button
$("#dance-floor-button").addEventListener("click", () => {
    if (danceFloorOn) {
        turnDanceFloorOff();
    }
    else {
        turnDanceFloorOn();
    }
});
// Set the dance floor's initial state
changeDanceFloorColors();
turnDanceFloorOff();