// ----- 1. Grab the display from the page -----
const display = document.getElementById('display');

// ----- 2. The calculator's memory -----
let currentInput = '0';   // the number being typed (as text)
let previousValue = null; // the number before the operator
let operator = null;      // +, −, × or ÷
let resetNext = false;    // true = next digit starts a fresh number

// ----- 3. Show the current number on screen -----
function updateDisplay() {
  display.textContent = currentInput;
}

// ----- 4. A digit button was pressed -----
function inputNumber(digit) {
  if (currentInput === 'Error' || resetNext) {
    currentInput = digit;       // start a fresh number
    resetNext = false;
  } else if (currentInput === '0') {
    currentInput = digit;       // replace the starting 0
  } else {
    currentInput += digit;      // add the digit to the end
  }
}

// ----- 5. The decimal point was pressed -----
function inputDecimal() {
  if (currentInput === 'Error' || resetNext) {
    currentInput = '0.';
    resetNext = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';        // only allow one decimal point
  }
}

// ----- 6. Do the maths (no eval!) -----
function calculate(a, b, op) {
  if (op === '+') return a + b;
  if (op === '−') return a - b;
  if (op === '×') return a * b;
  if (op === '÷') {
    if (b === 0) return null;   // null means "division by zero"
    return a / b;
  }
}

// Fix tiny errors like 0.1 + 0.2 = 0.30000000000000004
function roundResult(number) {
  return parseFloat(number.toFixed(10));
}

// ----- 7. Show an error instead of crashing -----
function showError() {
  currentInput = 'Error';
  previousValue = null;
  operator = null;
  resetNext = true;
}

// ----- 8. An operator button was pressed -----
function chooseOperator(nextOperator) {
  if (currentInput === 'Error') return;

  const value = parseFloat(currentInput);

  if (operator !== null && !resetNext) {
    // An operator is already waiting, so finish that calculation first
    const result = calculate(previousValue, value, operator);
    if (result === null) {
      showError();
      return;
    }
    previousValue = roundResult(result);
    currentInput = String(previousValue);
  } else {
    previousValue = value;
  }

  operator = nextOperator;
  resetNext = true;
}

// ----- 9. The = button was pressed -----
function evaluate() {
  if (operator === null || resetNext) return;

  const result = calculate(previousValue, parseFloat(currentInput), operator);
  if (result === null) {
    showError();
    return;
  }

  currentInput = String(roundResult(result));
  previousValue = null;
  operator = null;
  resetNext = true;
}

// ----- 10. Clear and Backspace -----
function clearAll() {
  currentInput = '0';
  previousValue = null;
  operator = null;
  resetNext = false;
}

function backspace() {
  if (currentInput === 'Error' || resetNext) return;

  const isSingleDigit = currentInput.length === 1;
  const isSingleNegative = currentInput.length === 2 && currentInput.startsWith('-');

  if (isSingleDigit || isSingleNegative) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
}

// ----- 11. Connect every button to its job -----
const allButtons = document.querySelectorAll('.btn');

allButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    if (button.dataset.number !== undefined) {
      inputNumber(button.dataset.number);
    } else if (button.dataset.operator !== undefined) {
      chooseOperator(button.dataset.operator);
    } else if (button.dataset.action === 'decimal') {
      inputDecimal();
    } else if (button.dataset.action === 'equals') {
      evaluate();
    } else if (button.dataset.action === 'clear') {
      clearAll();
    } else if (button.dataset.action === 'backspace') {
      backspace();
    }

    updateDisplay();
  });
});