const unaryOperators = ['+/-', '%'];
const binaryOperators = ['+', '-', '*', '/'];
const screen = document.querySelector('.screen');
screen.textContent = '0';

const currentDigits = [];
const currentOperators = [];
const currentValue = [''];
let result = 0;
let readyToCalculate = 1;//when the last input is binaryOperator, set it to 0

function unaryCalculate(a, operator) {
    if (operator == '+/-') {
        return -a;
    } else if (operator == '%') {
        return a / 100;
    }
}

function binaryCalculate(a, operator, b) {
    if (operator == '+') {
        return a + b;
    } else if (operator == '-') {
        return a - b;
    } else if (operator == '*') {
        return a * b;
    } else if (operator == '/') {
        return b !== 0 ? a / b : NaN;
    }
}

function removeTrailingZero(numString) {
    let part = numString.split('.');
    if (part[1]) {
        while (part[1].endsWith('0') && part[1].length > 1) {
            part[1] = part[1].substr(0, part[1].length - 1);
        }
        return part.join('.');
    }
    return part[0];
}

function showResult(num) {
    const absoluteValue = num >= 0 ? num : -num;
    const absoluteString = absoluteValue.toString();
    const position = absoluteString.indexOf('.');
    let numString = '';
    let part = [];
    if (absoluteValue >= 1000000000 || position >= 0 && absoluteValue < 0.000001) {
        numString = absoluteValue.toExponential();
        part = numString.split('e');
        if (part[0].length > 7) {
            part[0] = removeTrailingZero(Number(part[0]).toFixed(5));
            numString = part.join('e');
        }
    } else if (position >= 0 && absoluteString.length > 11) {
        part = absoluteString.split('.');
        numString = removeTrailingZero(Number(absoluteString).toFixed(10 - part[0].length));
    } else {
        numString = absoluteString;
    }
    return num < 0 ? '-' + numString : numString;
}

document.querySelector('.calculator').addEventListener('click', event => {
    const value = event.target.value;
    if (value >= '0' && value <= '9') {
        if (currentDigits.length == 1 && currentDigits[0] == '0') {
            currentDigits[0] = value;
        } else if (currentDigits.length < 9 && !currentDigits.includes('.') || currentDigits.length < 11 && currentDigits.includes('.')) {
            currentDigits.push(value);
        }
        screen.textContent = currentDigits.join('');
        readyToCalculate = 1;
    } else if (value == '.' && !currentDigits.includes('.')) {
        if (currentDigits.length == 0) {
            currentDigits.push('0', value);
            screen.textContent = '0.';
        } else {
            currentDigits.push(value);
            screen.textContent += '.';
        }
        readyToCalculate = 1;
    } else if (value == 'del' && currentDigits[0]) {
        currentDigits.pop();
        if (!currentDigits[0]) {
            currentDigits[0] = '0';
        }
        screen.textContent = currentDigits.join('');
    } else if (value == 'clear') {
        screen.textContent = '0';
        currentValue[0] = '';
        currentValue.length = 1;
        currentDigits.length = 0;
        currentOperators.length = 0;
        result = 0;
        readyToCalculate = 1;
    } else if (unaryOperators.includes(value) && readyToCalculate == 1) {//current input operator is '+/-'or'%'
        if (currentDigits.length > 0) {//use the input number as currentValue
            if (currentValue[0] == '') {
                currentValue[0] = Number(currentDigits.join(''));
            } else {
                currentValue.push(Number(currentDigits.join('')));
            }
            currentDigits.length = 0;
        } else if (currentValue[0] == '') {//use the result as currentValue
            currentValue[0] = result;
        }
        currentValue[currentValue.length - 1] = unaryCalculate(currentValue[currentValue.length - 1], value);
        screen.textContent = showResult(currentValue[currentValue.length - 1]);
    } else if (binaryOperators.toSpliced(2, 4).includes(value) && readyToCalculate == 1) {//current input operator is '+' or '-'
        if (currentDigits.length > 0) {//use the input number as currentValue
            if (binaryOperators.toSpliced(2, 4).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '+' or '-'
                currentValue[0] = Number(currentDigits.join(''));
                result = binaryCalculate(result, currentOperators[currentOperators.length - 1], currentValue[0]);
            } else if (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '*' or '/'
                currentValue.push(Number(currentDigits.join('')));
                currentValue[currentValue.length - 1] = binaryCalculate(currentValue[currentValue.length - 2], currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
                while (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {
                    currentOperators.pop();
                }
                if (currentOperators.length > 0) {
                    result = binaryCalculate(result, currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
                } else {
                    result = currentValue[currentValue.length - 1];
                }
            } else if (currentOperators.length == 0) {//no previous operator, input number is the first number to calculate
                currentValue[0] = Number(currentDigits.join(''));
                result = currentValue[0];
            }
        } else if (!(currentValue[0] == '')) {//no input number before current operator. Use the unary calculated value as the currentValue
            if (binaryOperators.toSpliced(2, 4).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '+' or '-'
                result = binaryCalculate(result, currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
            } else if (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '*' or '/'
                currentValue[currentValue.length - 1] = binaryCalculate(currentValue[currentValue.length - 2], currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
                while (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {
                    currentOperators.pop();
                }
                if (currentOperators.length > 0) {
                    result = binaryCalculate(result, currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
                } else {
                    result = currentValue[currentValue.length - 1];
                }
            } else if (currentOperators.length == 0) {//no previous operator, currentValue is the first number to calculate
                result = currentValue[0];
            }
        } else if (currentOperators.length == 0) {//no previous operator or input number, use result or initial value to start
            ;
        }
        currentOperators.push(value);
        readyToCalculate = 0;
        screen.textContent = showResult(result);
        currentValue[0] = '';
        currentValue.length = 1;
        currentDigits.length = 0;
    } else if (binaryOperators.toSpliced(0, 2).includes(value) && readyToCalculate == 1) {//current input operator is '*' or '/'
        if (currentDigits.length > 0) {//use the input number as currentValue
            if (binaryOperators.toSpliced(2, 4).includes(currentOperators[currentOperators.length - 1]) || currentOperators.length == 0) {//previous operator is '+' or '-' / no previous operator, input number is the first number to calculate
                currentValue[0] = Number(currentDigits.join(''));
            } else if (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '*' or '/'
                currentValue.push(Number(currentDigits.join('')));
                currentValue[currentValue.length - 1] = binaryCalculate(currentValue[currentValue.length - 2], currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
            }
        } else if (!(currentValue[0] == '')) {//no input number before current operator. Use the unary calculated value as the currentValue
            if (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '*' or '/'
                currentValue[currentValue.length - 1] = binaryCalculate(currentValue[currentValue.length - 2], currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
            }
        } else if (currentOperators.length == 0) {//no previous operator or input number, use result or initial value to start
            currentValue[0] = result;
        }
        currentOperators.push(value);
        readyToCalculate = 0;
        screen.textContent = showResult(currentValue[currentValue.length - 1]);
        currentDigits.length = 0;
    } else if (value == '=') {
        if (readyToCalculate == 1) {
            if (currentDigits.length > 0) {//use the input number as currentValue
                if (binaryOperators.toSpliced(2, 4).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '+' or '-'
                    currentValue[0] = Number(currentDigits.join(''));
                    result = binaryCalculate(result, currentOperators[currentOperators.length - 1], currentValue[0]);
                } else if (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '*' or '/'
                    currentValue.push(Number(currentDigits.join('')));
                    currentValue[currentValue.length - 1] = binaryCalculate(currentValue[currentValue.length - 2], currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
                    while (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {
                        currentOperators.pop();
                    }
                    if (currentOperators.length > 0) {
                        result = binaryCalculate(result, currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
                    } else {
                        result = currentValue[currentValue.length - 1];
                    }
                } else if (currentOperators.length == 0) {//no previous operator, input number is the first number to calculate
                    currentValue[0] = Number(currentDigits.join(''));
                    result = currentValue[0];
                }
            } else if (!(currentValue[0] == '')) {//no input number before current operator. Use the '*' or '/' or unary calculated value as the currentValue
                if (binaryOperators.toSpliced(2, 4).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '+' or '-'
                    result = binaryCalculate(result, currentOperators[currentOperators.length - 1], currentValue[0]);
                } else if (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {//previous operator is '*' or '/'
                    currentValue[currentValue.length - 1] = binaryCalculate(currentValue[currentValue.length - 2], currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
                    while (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {
                        currentOperators.pop();
                    }
                    if (currentOperators.length > 0) {
                        result = binaryCalculate(result, currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
                    } else {
                        result = currentValue[currentValue.length - 1];
                    }
                } else if (currentOperators.length == 0) {//no previous operator, input number is the first number to calculate
                    result = currentValue[0];
                }
            }
        } else if (readyToCalculate == 0 && binaryOperators.toSpliced(0, 2).includes(currentOperators.pop())) {
            while (binaryOperators.toSpliced(0, 2).includes(currentOperators[currentOperators.length - 1])) {
                currentOperators.pop();
            }
            if (currentOperators.length > 0) {
                result = binaryCalculate(result, currentOperators[currentOperators.length - 1], currentValue[currentValue.length - 1]);
            } else {
                result = currentValue[currentValue.length - 1];
            }
        }
        screen.textContent = showResult(result);
        currentValue[0] = '';
        currentValue.length = 1;
        currentDigits.length = 0;
        currentOperators.length = 0;
        readyToCalculate = 1;
    }
    console.log(currentValue);
    console.log(result);
})