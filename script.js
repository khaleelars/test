// Simple calculator logic
const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let expression = ''; // expression string shown/evaluated

function updateDisplay(){
  display.textContent = expression === '' ? '0' : expression;
}

// sanitize expression to only allowed characters before eval
function isSafe(expr){
  // allow digits, whitespace, . (dot), parentheses, + - * / 
  // Note: This is a simple check for demo purposes and not a security sandbox.
  return /^[0-9+\-*/().\s]+$/.test(expr);
}

function evaluateExpression(){
  const trimmed = expression.trim();
  if(trimmed === '') return;
  if(!isSafe(trimmed)){
    display.textContent = 'Error';
    expression = '';
    return;
  }
  try{
    // Use Function instead of eval to be slightly safer
    // Replace any '×' or '÷' if present (UI uses symbols only)
    const sanitized = trimmed.replace(/×/g,'*').replace(/÷/g,'/');
    const result = Function(`"use strict"; return (${sanitized})`)();
    // avoid showing long fractions
    expression = (typeof result === 'number' && !Number.isInteger(result))
      ? parseFloat(result.toFixed(12)).toString()
      : String(result);
    updateDisplay();
  } catch (e) {
    display.textContent = 'Error';
    expression = '';
  }
}

keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if(!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if(action === 'clear'){
    expression = '';
    updateDisplay();
    return;
  }

  if(action === 'delete'){
    expression = expression.slice(0, -1);
    updateDisplay();
    return;
  }

  if(action === 'equals'){
    evaluateExpression();
    return;
  }

  // value buttons (numbers, ., operators)
  if(value){
    // prevent multiple leading zeros like "00"
    if(value === '0' && expression === '0') return;

    // prevent multiple dots in the current number
    if(value === '.'){
      // get last token since last operator
      const parts = expression.split(/[\+\-\*\/\s]+/);
      const last = parts[parts.length - 1] || '';
      if(last.includes('.')) return;
      if(last === '') {
        // if dot starts a number, prefix 0
        expression += '0';
      }
    }

    expression += value;
    updateDisplay();
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const allowed = '0123456789.+-*/()';
  if(allowed.includes(e.key)){
    e.preventDefault();
    expression += e.key;
    updateDisplay();
    return;
  }

  if(e.key === 'Enter' || e.key === '='){
    e.preventDefault();
    evaluateExpression();
    return;
  }

  if(e.key === 'Backspace'){
    e.preventDefault();
    expression = expression.slice(0, -1);
    updateDisplay();
    return;
  }

  if(e.key === 'Escape'){
    e.preventDefault();
    expression = '';
    updateDisplay();
    return;
  }
});

// initialize
updateDisplay();
