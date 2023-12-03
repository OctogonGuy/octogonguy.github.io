"use strict"

// --- Variables ---
let cash = 0;   // Current money
let startedProduction = false;  // Whether player has started
let factories = []; // Built factories
let buyables = [];  // Factories and upgrades that can be bought



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
    for (const upgradeButton of factoryDiv.querySelectorAll(".upgrades > button")) {
        new Upgrade(factory, upgradeButton);
    }
    for (const upgradeLine of factoryDiv.querySelectorAll(".upgrades > .upgrade-line")) {
        let upgradeLineArr = [];
        for (const upgradeButton of upgradeLine.querySelectorAll("button")) {
            new Upgrade(factory, upgradeButton, upgradeLineArr);
        }
    }
}



// --- Utilities ---

// Update the entire GUI
function updateUI() {
    updateCash();
    updateInventory();
    updateButtonsDisabled();
}

// Update money display
function updateCash() {
    document.querySelector("#cash").value = "$" + Math.round(cash);
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



// --- Initial things to do ---
updateUI();