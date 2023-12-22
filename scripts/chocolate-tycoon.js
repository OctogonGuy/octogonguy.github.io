"use strict"

// --- Variables ---
let cash = 0;   // Current money
let startedProduction = false;  // Whether player has started
let factories = []; // Built factories
let buyables = [];  // Factories and upgrades that can be bought
let buyableButtons = [] // Buttons for buyables



// --- Classes ---
// Factory class
class Factory {
    constructor(id) {
        this.id = id;
        this.inventoryLabel = document.querySelector("#" + this.id).querySelector("#inventory");
        this.sellButton = document.querySelector("#" + this.id).querySelector(".sell-button");
        this.button = document.querySelector("#" + this.id).querySelector(".build-button");

        this.cost = parseInt(this.button.dataset.cost);
        this.profit = parseInt(this.button.dataset.initialProfit);
        this.delay = parseInt(this.button.dataset.initialDelay);
        this.storage = parseInt(this.button.dataset.initialStorage);

        this.multiplier = 1;
        this.quantity = 1;
        this.inventory = 0;

        this.button.addEventListener("click", () => this.buy());
        this.sellButton.addEventListener("click", () => this.sell());

        this.bought = false;
        buyables.push(this);
    }

    buy() {
        if (this.bought || cash < this.cost) return;
        cash -= this.cost;
        this.bought = true;
        buyables.splice(buyables.indexOf(this), 1);
        factories.push(this);
        this.button.classList.add("bought");
        document.querySelector("#" + this.id).querySelector(".production").classList.remove("hidden");
        this.button.disabled = true;
        this.interval = setInterval(() => produce(this), this.delay);
        updateUI();
    }

    sell() {
        cash += this.profit * this.inventory * this.multiplier;
        this.inventory = 0;
        clearInterval(this.interval);
        this.interval = setInterval(() => produce(this), this.delay);
        updateUI();
    }

    produce() {
        this.inventory += this.quantity;
        if (this.inventory >= this.storage) {
            this.inventory = this.storage;
        }
        updateUI();
    }

    modifyRate(rate) {
        this.delay *= rate;
        clearInterval(this.interval);
        this.interval = setInterval(() => produce(this), this.delay);
    }
}

// Outer produce function so that setInterval can be called
function produce(factory) {
    factory.produce();
}

// Upgrade class
class Upgrade {
    constructor(factory, button, upgradeLine) {
        this.factory = factory;
        this.upgradeLine = upgradeLine != null ? upgradeLine : [];
        this.upgradeLine.push(this);
        this.button = button;
        this.cost = parseInt(this.button.dataset.cost),
        this.profit =  this.button.dataset.profit != null ? parseInt(this.button.dataset.profit) : undefined,
        this.multiplier = this.button.dataset.multiplier != null ? parseFloat(this.button.dataset.multiplier): undefined;
        this.quantity = this.button.dataset.quantity != null ? parseInt(this.button.dataset.quantity) : undefined;
        this.speed = this.button.dataset.speed != null ? parseFloat(this.button.dataset.speed) : undefined;
        this.storage = this.button.dataset.storage != null ? parseFloat(this.button.dataset.storage) : undefined;

        this.button.addEventListener("click", () => this.buy());

        this.bought = false;
        buyables.push(this);

        if (this.upgradeLine.indexOf(this) > 0) {
            this.button.classList.add("hidden");
        }
    }

    buy() {
        if (this.bought || cash < this.cost) return;
        cash -= this.cost;
        this.bought = true;
        updateUI();
        buyables.splice(buyables.indexOf(this), 1);
        this.button.classList.add("bought");
        this.button.disabled = true;
        if (this.upgradeLine.indexOf(this) < this.upgradeLine.length - 1) {
            this.button.classList.add("hidden");
            this.upgradeLine[this.upgradeLine.indexOf(this) + 1].button.classList.remove("hidden");
        }
        
        if (this.profit != undefined) this.factory.profit += this.profit;
        if (this.multiplier != undefined) this.factory.multiplier += this.multiplier;
        if (this.quantity != undefined) this.factory.quantity += this.quantity;
        if (this.speed != undefined) this.factory.modifyRate(1 / this.speed);
        if (this.storage != undefined) this.factory.storage = this.storage;
    }
}



// --- Buy buttons ---

for (const factoryDiv of document.querySelector("#game").querySelectorAll(".factory")) {
    const factory = new Factory(factoryDiv.id);
    const buildButton = factoryDiv.querySelector(".build-button");
    buyableButtons.push(buildButton);
    for (const upgradeButton of factoryDiv.querySelectorAll(".upgrades > button")) {
        new Upgrade(factory, upgradeButton);
        buyableButtons.push(upgradeButton);
    }
    for (const upgradeLine of factoryDiv.querySelectorAll(".upgrades > .upgrade-line")) {
        let upgradeLineArr = [];
        for (const upgradeButton of upgradeLine.querySelectorAll("button")) {
            new Upgrade(factory, upgradeButton, upgradeLineArr);
            buyableButtons.push(upgradeButton);
        }
    }
}

// Add text indicating price and result
for (const button of buyableButtons) {
    const name = button.textContent;
    const cost = parseInt(button.dataset.cost);
    const profit =  button.dataset.profit != null ? parseInt(button.dataset.profit) : undefined;
    const multiplier = button.dataset.multiplier != null ? parseFloat(button.dataset.multiplier): undefined;
    const quantity = button.dataset.quantity != null ? parseInt(button.dataset.quantity) : undefined;
    const speed = button.dataset.speed != null ? parseFloat(button.dataset.speed) : undefined;
    const storage = button.dataset.storage != null ? parseFloat(button.dataset.storage) : undefined;

    let text = "";
    text += name;
        
    if (profit != undefined) text += ` (+${profit} profit)`;
    if (multiplier != undefined) text += ` (x${multiplier.toFixed(1)} profit)`;
    if (quantity != undefined) text += ` (+${quantity} quantity)`;
    if (speed != undefined) text += ` (x${speed.toFixed(1)} speed)`;
    if (storage != undefined) text += ` (${storage.toLocaleString("en-US")} capacity)`;

    if (cost == 0) {
        text += " (Free)";
    }
    else {
        text += ` (${cost.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:0})})`;
    }

    button.textContent = text;
}



// --- Logging ---

function getStartingSpeed(factory) {
    const speed = (factory.profit * factory.quantity * factory.multiplier) / (factory.delay / 1000);
    return speed;
}

function getFullSpeed(factory) {
    let profit = factory.profit;
    let quantity = factory.quantity;
    let multiplier = factory.multiplier;
    let delay = factory.delay;

    for (const buyable of buyables) if (buyable instanceof Upgrade && buyable.factory === factory) { const upgrade = buyable;
        if (upgrade.profit != undefined) profit += upgrade.profit;
        if (upgrade.quantity != undefined) quantity += upgrade.quantity;
        if (upgrade.multiplier != undefined) multiplier *= upgrade.multiplier;
        if (upgrade.speed != undefined) delay /= upgrade.speed;
    }

    const speed = (profit * quantity * multiplier) / (delay / 1000);
    return speed;
}

function getTotalCost(factory) {
    let totalCost = 0;

    totalCost += factory.cost;

    for (const buyable of buyables) if (buyable instanceof Upgrade && buyable.factory == factory) { const upgrade = buyable;
        totalCost += upgrade.cost;
    }

    return totalCost;
}

function getEstimatedCompletionTime() {
    let completionTime = 0;
    const tempFactories = [];
    const factoryDict = {};
    let cheapestFactory;
    let lowestCost = Number.MAX_VALUE;
    for (const buyable of buyables) if (buyable instanceof Factory) { const factory = buyable;
        tempFactories.push(factory);
        const factoryFields = {
            "profit": factory.profit,
            "quantity": factory.quantity,
            "multiplier": factory.multiplier,
            "delay": factory.delay
        };
        factoryDict[factory.id] = factoryFields;
        if (factory.cost < lowestCost) {
            lowestCost = factory.cost;
            cheapestFactory = factory;
        }
    }
    const initialRate = getStartingSpeed(cheapestFactory);
    let curRate = initialRate;
    let tempBuyables = [];
    for (const buyable of buyables) {
        tempBuyables.push(buyable);
    }
    const numBuyables = tempBuyables.length;
    const builtFactories = [];

    while (tempBuyables.length > 0) {
        // Get cheapest buyable
        let cheapestBuyable;
        let lowestCost = Number.MAX_VALUE;
        for (const buyable of tempBuyables) {
            if (buyable.cost < lowestCost && !(buyable instanceof Upgrade && builtFactories.indexOf(buyable.factory) == -1)) {
                lowestCost = buyable.cost;
                cheapestBuyable = buyable;
            }
        }

        // Get factory of buyable
        const factory = cheapestBuyable instanceof Upgrade ? cheapestBuyable.factory : cheapestBuyable;
        const buyableNum = numBuyables - tempBuyables.length;
        const timeToGetCheapestBuyable = lowestCost / curRate;
        completionTime += timeToGetCheapestBuyable;

        let color;
        if (factory.id == "milk-chocolate") {
            color = "chocolate"
        } else if (factory.id == "dark-chocolate") {
            color = "saddlebrown"
        } else if (factory.id == "white-chocolate") {
            color = "navajowhite";
        }

        console.log(`%c\t\tBuyable ${buyableNum + 1}:
            \t${cheapestBuyable instanceof Upgrade ? cheapestBuyable.factory.id : cheapestBuyable.id}
            \t${cheapestBuyable.button.textContent}
            \t${timeToGetCheapestBuyable.toFixed(1)} seconds`,
            `color:${color}`);

        if (cheapestBuyable instanceof Upgrade) {
            const upgrade = cheapestBuyable;
            if (upgrade.profit != undefined) factoryDict[factory.id]["profit"] += upgrade.profit;
            if (upgrade.quantity != undefined) factoryDict[factory.id]["quantity"] += upgrade.quantity;
            if (upgrade.multiplier != undefined) factoryDict[factory.id]["multiplier"] *= upgrade.multiplier;
            if (upgrade.speed != undefined) factoryDict[factory.id]["delay"] /= upgrade.speed;
        }
        else {
            builtFactories.push(cheapestBuyable);
        }
        curRate = 0;
        for (const factory of builtFactories) {
            curRate += (factoryDict[factory.id]["profit"] * factoryDict[factory.id]["quantity"] * factoryDict[factory.id]["multiplier"]) / (factoryDict[factory.id]["delay"] / 1000);
        }

        tempBuyables.splice(tempBuyables.indexOf(cheapestBuyable), 1);
    }

    return completionTime;
}

function logStats() {
    console.log("Stats");
    for (const buyable of buyables) if (buyable instanceof Factory) { const factory = buyable;
        console.log(`\t${factory.id}`);

        console.log("\t\tStarting Speed");
        console.log(`\t\t\t${getStartingSpeed(factory).toFixed(1)} money/second`);

        console.log("\t\tFull Speed");
        console.log(`\t\t\t${getFullSpeed(factory).toFixed(1)} money/second`);

        console.log("\t\tTotal Cost");
        console.log(`\t\t\t${Math.round(getTotalCost(factory)).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:0})}`);
    }
    console.log("\tEstimated time to complete");
    console.log(`\t\tTotal:\t\t${Math.round(getEstimatedCompletionTime() / 60)} minutes`);
}




// --- Utilities ---

// Update the entire GUI
function updateUI() {
    updateCash();
    updateInventory();
    updateButtonsDisabled();
    if (buyables.length == 0) showCompletionMessage();
}

// Update money display
function updateCash() {
    document.querySelector("#cash").value = Math.round(cash).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:0});
}

// Update inventory display
function updateInventory() {
    for (const factory of factories) {
        factory.inventoryLabel.value = factory.inventory;
    }
}

// Update buttons depending on whether its factory or upgrade can be bought
function updateButtonsDisabled() {
    for (const factory of factories) {
        if (!factory.sellButton.disabled && factory.inventory == 0) {
            factory.sellButton.disabled = true;
        }
        else if (factory.sellButton.disabled && factory.inventory > 0) {
            factory.sellButton.disabled = false;
        }
    }
    for (const buyable of buyables) {
        if ((buyable instanceof Upgrade && buyable.factory.bought || !(buyable instanceof Upgrade)) &&
            buyable.button.disabled && cash >= buyable.cost) {
            buyable.button.disabled = false;
        }
        else if (!buyable.button.disabled && cash < buyable.cost) {
            buyable.button.disabled = true;
        }
    }
}

// Show a message if the player bought all of the factories and upgrades
function showCompletionMessage() {
    document.querySelector("#completion-message").textContent = "Congratulations! You monopolized the chocolate industry!";
}



// --- Initial things to do ---
updateUI();
//logStats();