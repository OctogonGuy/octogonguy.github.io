"use strict"



let cash = 0;

class Factory {
    constructor(name, cost, revenue, interval) {
        this.name = name;
        this.cost = cost;
        this.revenue = revenue;
        this.interval = interval;
        this.built = false;
    }

    build() {
        if (this.built || cash < this.cost) return;
        cash -= this.cost;
        updateCashLabel();
        this.built = true;
        setInterval(() => this.produce(), this.interval);
    }

    produce() {
        cash += this.revenue;
        updateCashLabel();
    }
}

const factories = [
    new Factory("Milk Chocolate", 0, 25, 1000),
    new Factory("Dark Chocolate", 100, 67, 900),
    new Factory("White Chocolate", 500, 178, 800)
];



function buildButtonText(factory) {
    let str = "Build " + factory.name + " Factory ";

    if (factory.cost == 0) {
        str += "(Free)";
    }
    else {
        str += "($" + factory.cost + ")";
    }

    return str;
}

function updateCashLabel() {
    cashLabel.textContent = "$" + cash;
}



const gameSpace = document.querySelector("#game-space");

const cashLabel = document.createElement("p");
updateCashLabel();
gameSpace.appendChild(cashLabel);

for (const factory of factories) {
    const buildFactoryButton = document.createElement("button");
    buildFactoryButton.textContent = buildButtonText(factory);
    buildFactoryButton.addEventListener("click", () => factory.build());
    gameSpace.appendChild(buildFactoryButton);
}