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
eventBox.addEventListener("mouseover", evt => {
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
// Show corresponding image when user selects an item from the select
$("#food-select").addEventListener("change", event => {
    $("#food-image").src = event.target.value;
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



// --- Animation ---
// Create an animation that translates and rotates graphic
function move() {
    $("#animation-start-button").disabled = true;
    let duration = 2500;
    let intervalLength = 15;
    let frameNum = 0;
    let numFrames = duration / intervalLength;
    let animationSectionWidth = $("#animation-section").offsetWidth;
    let shapeSize = ($("#animation-shape").clientWidth + $("#animation-shape").clientHeight) / 2;
    let distance = animationSectionWidth - shapeSize;
    let rotations = Math.round(distance / (shapeSize * Math.PI));
    let reverse = $("#animation-shape").style.translate != "";
    function frame() {
        frameNum++;
        let translate = distance * frameNum / numFrames;
        let rotate = 360 * (rotations * frameNum / numFrames) % 360;
        if (reverse) {
            translate = distance - translate;
            rotate = 360 - rotate;
        }
        $("#animation-shape").style.translate = translate + "px 0px";
        $("#animation-shape").style.rotate = rotate + "deg";
        if (frameNum >= numFrames) {
            clearInterval(interval);
            $("#animation-shape").style.rotate = "";
            if (reverse) {
                $("#animation-shape").style.translate = "";
            }
            $("#animation-start-button").disabled = false;
        }
    }
    let interval = setInterval(frame, intervalLength);
}
$("#animation-start-button").addEventListener("click", move);



// --- Dance floor ---
// Colors
const danceFloorColors = ["red", "lime", "blue", "yellow", "magenta", "cyan"];
// Put dance floor squares in 2D array
const danceFloorSquares1D = $("#dance-floor").querySelectorAll(".dance-floor-square");
const danceFloorLen = Math.sqrt(danceFloorSquares1D.length);
const danceFloorSquares = []
for (let i = 0; i < danceFloorLen; i++) {
    danceFloorSquares[i] = [];
    for (let j = 0; j < danceFloorLen; j++) {
        danceFloorSquares[i].push(danceFloorSquares1D[i * danceFloorLen + j]);
    }
}
// Function to randomly change all dance floor squares' colors
// Make sure that no adjacent color is the same
function changeDanceFloorColors() {
    for (let i = 0; i < danceFloorLen; i++) {
        for (let j = 0; j < danceFloorLen; j++) {
            let availableColors = [];
            for (let color of danceFloorColors) {
                availableColors.push(color);
            }
            if (i > 0) {
                availableColors.splice(availableColors.indexOf(
                    (danceFloorSquares[i - 1][j].style.backgroundColor)), 1);
            }
            if (j > 0) {
                availableColors.splice(availableColors.indexOf(
                    (danceFloorSquares[i][j - 1].style.backgroundColor)), 1);
            }
            let color = availableColors[Math.floor(Math.random() * availableColors.length)];
            danceFloorSquares[i][j].style.backgroundColor = color;
        }
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
    $("#dance-floor-start-button").textContent = "Stop Dance Floor";
    danceFloorOn = true;
}
function turnDanceFloorOff() {
    clearInterval(danceFloorInterval);
    $("#dance-floor").classList.remove("on");
    $("#dance-floor").classList.add("off");
    $("#dance-floor-start-button").textContent = "Start Dance Floor";
    danceFloorOn = false;
}
// Start/stop the dance floor when the user clicks the button
$("#dance-floor-start-button").addEventListener("click", () => {
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



// --- Name ---
const getUserGreeting = firstLastName => {
    let firstName = firstLastName.split(" ")[0];
    firstName = firstName.substring(0, 1).toUpperCase() + firstName.substring(1);
    const greeting = `Nice to meet you, ${firstName}!`;
    return greeting;
}

$("#confirm-name-button").addEventListener("click", () => {
    const firstLastName = $("#name").value;
    const nameArray = firstLastName.split(" ");

    let isValid = true;
    if (firstLastName == "" || nameArray.length != 2) {
        isValid = false;
        $("#name").nextElementSibling.style.visibility = "visible";
    }
    else {
        $("#name").nextElementSibling.style.visibility = "hidden";
    }

    if (isValid) {
        const greeting = getUserGreeting(firstLastName);
        $("#greeting").textContent = greeting;
    }
});



// --- Countdown ---
$("#holiday-select").addEventListener("change", evt => {
    const today = new Date();
    today.setHours(0); today.setMinutes(0); today.setSeconds(0); today.setMilliseconds(0);
    const holiday = new Date($("#holiday-select").value + "/" + today.getFullYear());
    if (holiday.getTime() < today.getTime()) {
        holiday.setFullYear(holiday.getFullYear() + 1);
    }
    $("#holiday-date").value = (holiday.getMonth() + 1) + "/" + holiday.getDate() + "/" + holiday.getFullYear();
});
$("#countdown-button").addEventListener("click", () => {
    const holidayName = $("#holiday-select").options[$("#holiday-select").selectedIndex].textContent;
    const today = new Date();
    const holiday = new Date($("#holiday-date").value);

    // Input validation
    let isValid = !Number.isNaN(holiday.getTime());
    if (!isValid) {
        return;
    }

    const timeLeft = holiday.getTime() - today.getTime();
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysLeft = Math.ceil(timeLeft / msPerDay);
    let message = "";
    if (daysLeft == 0) {
        message = `Today is ${holidayName}!`;
    }
    else {
        message = `${daysLeft} days left until ${holidayName}`;
    }
    $("#countdown").textContent = message;
});



// --- Exchange rate ---
const convertCurrency = (currencyType, fromAmount, fromValue, toValue) => {
    const currencyFormat = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyType,
    });
    const value = fromAmount * (toValue / fromValue);
    return currencyFormat.format(value);
};
$("#convert-button").addEventListener("click", () => {
    const fromSelect = $("#from-currency-select");
    const fromInput = $("#currency-input");
    const toSelect = $("#to-currency-select");
    
    const fromAmount = parseFloat(fromInput.value);
    const fromCurrency = parseFloat(fromSelect.value);
    const toCurrency = parseFloat(toSelect.value);

    // Input validation
    let isValid = true;
    if (fromCurrency)
    if (isNaN(fromAmount)) {
        isValid = false;
        $("#convert-button").nextElementSibling.style.visibility = "visible";
    }
    else if (isNaN(fromCurrency) || isNaN(toCurrency)) {
        isValid = false;
        $("#convert-button").nextElementSibling.style.visibility = "hidden";
    }
    else {
        $("#convert-button").nextElementSibling.style.visibility = "hidden";
    }

    if (isValid) {
        const currency = toSelect.options[toSelect.selectedIndex].textContent;
        $("#currency-output").value = convertCurrency(currency, fromAmount, fromCurrency, toCurrency);
    }
});
for (const listOption of $("#currencies").children) {
    let option = document.createElement("option");
    option.textContent = listOption.textContent;
    option.value = listOption.value;
    $("#from-currency-select").appendChild(option);

    option = document.createElement("option");
    option.textContent = listOption.textContent;
    option.value = listOption.value;
    $("#to-currency-select").appendChild(option);
}



// --- Cookie jar ---
function setCookie(name, value, hours) {
    let cookie = name + "=" + encodeURIComponent(value);
    if (hours) {
        cookie += "; max-age=" + hours * 60 * 60;
    }
    cookie += "; path=/";
    document.cookie = cookie;
}
function getCookie(name) {
    const cookies = document.cookie;
    let start = cookies.indexOf(name + "=");
    if (start === -1) {
        return "";
    }
    else {
        start = start + (name.length + 1);
        let end = cookies.indexOf(";", start);
        if (end === -1) {
            end = cookies.length;
        }
        const cookieValue = cookies.substring(start, end);
        return decodeURIComponent(cookieValue);
    }
}
function getCookieHours(name) {
    const cookies = document.cookie;
    let start = cookies.indexOf(name + "; max-age=");
    if (start === -1) {
        return "";
    }
    else {
        start = start + (name.length + 1);
        let end = cookies.indexOf(";", start);
        if (end === -1) {
            end = cookies.length;
        }
        const cookieHours = cookies.substring(start, end);
        return decodeURIComponent(cookieHours);
    }
}

const cookieJars = $("#cookie-jars").querySelectorAll("pre");
const cookieJarCache = [];
for (const cookieJar of cookieJars) {
    cookieJarCache[cookieJarCache.length] = cookieJar.textContent;
}
let cookieIndex = getCookie("cookie") ? parseInt(getCookie("cookie")) : 0;
let hoursLeft = getCookie("cookie") ? parseInt(getCookieHours("cookie")) : 24;
$("#cookie-jar").textContent = cookieJarCache[cookieIndex];
function removeCookie() {
    if (cookieIndex >= cookieJarCache.length - 1) return;
    $("#cookie-jar").textContent = cookieJarCache[++cookieIndex];
    setCookie("cookies", cookieIndex, hoursLeft);
    if (cookieIndex >= cookieJarCache.length - 1) {
        $("label[for=\"remove-cookie-button\"]").textContent = "You ate all the cookies! The cookie jar will be replenished in " + hoursLeft + " hours.";
        $("#remove-cookie-button").hidden = true;
    }
}
$("#remove-cookie-button").addEventListener("click", removeCookie);