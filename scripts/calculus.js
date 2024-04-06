let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

function randomNumber(lowerBound, upperBound) {
    return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}

function randomLetter() {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function randomChoice(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function term(variable) {
    let coefficient = "";
    let exponent = "";
    // Chance for coefficient
    if (Math.random() < 0.5) {
        // Chance for negative
        if (Math.random() < 0.33) {
            coefficient = -randomNumber(2, 10)
        }
        else {
            coefficient = randomNumber(2, 10)
        }
        coefficient = coefficient.toString();
    }
    // Chance for exponent
    if (Math.random() < 0.5) {
        // Chance for negative
        if (Math.random() < 0.33) {
            exponent = -randomNumber(2, 10)
        }
        else {
            exponent = randomNumber(2, 10)
        }
        exponent = "^{" + exponent.toString() + "}";
    }
    // Chance to have just the coefficient if there is one
    if (coefficient && Math.random() < 0.33) {
        variable = "";
        exponent = "";
    }
    return coefficient + variable + exponent;
}

function sum(variable) {
    let numTerms = Math.random() < 0.33 ? 3 : 2;
    let exp = term(variable);
    for (let i = 1; i < numTerms; i++) {
        let t = term(variable);
        if (!(t.charAt(0) === '-')) {
            exp += "+";
        }
        exp += t;
    }
    return exp;
}

function product(variable) {
    let expression1 = Math.random() < 0.5 ? sum(variable) : term(variable);
    let expression2 = Math.random() < 0.5 ? sum(variable) : term(variable);
    let exp = `(${expression1})(${expression2})`;
    return exp;
}

function quotient(variable) {
    let expression1 = Math.random() < 0.5 ? sum(variable) : term(variable);
    let expression2 = Math.random() < 0.5 ? sum(variable) : term(variable);
    let exp = `\\frac{${expression1}}{${expression2}}`;
    return exp;
}

function innerFunction(variable) {
    let func;
    let expression = Math.random() < 0.5 ? sum(variable) : term(variable);
    let group = randomChoice([
        ['sqrt'],
        ['e', 'ln', 'exp', 'log'],
        ['sin', 'cos', 'tan', 'sec', 'csc', 'cot'],
        ['arcsin', 'arccos', 'arctan', 'arcsec', 'arccsc', 'arccot', 'sinh', 'cosh']]);
    let type = randomChoice(group);
    switch (type) {
        case 'sqrt':
            func = `\\sqrt{${expression}}`;
            break;
        case 'e':
            func = `e^{${expression}}`;
            break;
        case 'ln':
            func = `\\ln(${expression})`;
            break;
        case 'exp':
            func = `${randomNumber(-10, 10)}^{${expression}}`;
            break;
        case 'log':
            func = `\\log_{${randomNumber(-10, 10)}}(${expression})`;
            break;
        case 'sin':
            func = `\\sin(${expression})`;
            break;
        case 'cos':
            func = `\\cos(${expression})`;
            break;
        case 'tan':
            func = `\\tan(${expression})`;
            break;
        case 'sec':
            func = `\\sec(${expression})`;
            break;
        case 'csc':
            func = `\\csc(${expression})`;
            break;
        case 'cot':
            func = `\\cot(${expression})`;
            break;
        case 'arcsin':
            func = `\\sin^{-1}(${expression})`;
            break;
        case 'arccos':
            func = `\\cos^{-1}(${expression})`;
            break;
        case 'arctan':
            func = `\\tan^{-1}(${expression})`;
            break;
        case 'arcsec':
            func = `\\sec^{-1}(${expression})`;
            break;
        case 'arccsc':
            func = `\\csc^{-1}(${expression})`;
            break;
        case 'arccot':
            func = `\\cot^{-1}(${expression})`;
            break;
        case 'sinh':
            func = `\\sinh(${expression})`;
            break;
        case 'cosh':
            func = `\\cosh(${expression})`;
            break;
    }
    return func;
}

function func(variable) {
    let func;
    let func1 = randomChoice([sum, product, quotient, innerFunction])(variable);
    // Chance for compound function
    if (Math.random() < 0.5) {
        let func2 = randomChoice(['sum', 'product', 'quotient', 'innerFunction']);
        if (func2 === 'sum') {
            func2 = `\\left(${sum(variable)}\\right)`;
        }
        else if (func2 === 'product')
            func2 = product(variable);
        else if (func2 === 'quotient')
            func2 = quotient(variable);
        else if (func2 === 'innerFunction')
            func2 = innerFunction(variable);
        func = `${func1}+${func2}`;
    }
    else {
        func = func1;
    }
    return func;
}

function limit() {
    let variable = randomLetter();
    return `\\lim_{${variable} \\to ${randomNumber(-10, 10)}}\\left[${func(variable)}\\right]`;
}

function derivative() {
    let funcLetter = randomLetter();
    let variable = randomLetter();
    let prime;
    if (Math.random() < 0.01) {
        prime = "'''";
    }
    else if (Math.random() < 0.1) {
        prime = "''";
    }
    else {
        prime = "'";
    }
    return `\\text{Find }${funcLetter + prime}(${variable})\\text{.}\\quad ${funcLetter}(${variable})=${func(variable)}`;
}


document.querySelector("#limit-button").addEventListener("click", () => {
    document.querySelector("#problem").innerHTML = "\$\$" + limit() + "\$\$";
    MathJax.typeset();
});

document.querySelector("#derivative-button").addEventListener("click", () => {
    document.querySelector("#problem").innerHTML = "\$\$" + derivative() + "\$\$";
    MathJax.typeset();
});