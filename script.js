const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

let current = '0';
let previous = null;
let operator = null;
let shouldReset = false;
let expression = '';

function updateDisplay(val) {
  resultEl.textContent = val;
  const len = val.length;
  resultEl.className = 'result' + (len > 12 ? ' xsmall' : len > 9 ? ' small' : '');
}

function setActiveOp(op) {
  document.querySelectorAll('.btn.op').forEach(b => b.classList.remove('active'));
  if (op) {
    document.querySelectorAll('.btn.op').forEach(b => {
      if (b.dataset.value === op) b.classList.add('active');
    });
  }
}

function calculate(a, op, b) {
  a = parseFloat(a); b = parseFloat(b);
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b !== 0 ? a / b : 'Error';
  }
}

function format(n) {
  if (n === 'Error') return 'Error';
  const s = parseFloat(n.toPrecision(12));
  return String(s);
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === 'num') {
      if (current === '0' || shouldReset) {
        current = value;
        shouldReset = false;
      } else {
        if (current.replace('-', '').replace('.', '').length >= 9) return;
        current += value;
      }
      updateDisplay(current);

    } else if (action === 'decimal') {
      if (shouldReset) { current = '0.'; shouldReset = false; }
      else if (!current.includes('.')) current += '.';
      updateDisplay(current);

    } else if (action === 'op') {
      if (operator && !shouldReset) {
        const res = calculate(previous, operator, current);
        current = format(res);
        expression = current + ' ' + value;
        previous = current;
      } else {
        expression = current + ' ' + value;
        previous = current;
      }
      operator = value;
      shouldReset = true;
      expressionEl.textContent = expression;
      updateDisplay(current);
      setActiveOp(operator);

    } else if (action === 'equals') {
      if (!operator || !previous) return;
      const res = calculate(previous, operator, current);
      expressionEl.textContent = expression + ' ' + current + ' =';
      current = format(res);
      updateDisplay(current);
      operator = null;
      previous = null;
      shouldReset = true;
      setActiveOp(null);

    } else if (action === 'clear') {
      current = '0'; previous = null; operator = null;
      shouldReset = false; expression = '';
      expressionEl.textContent = '';
      updateDisplay('0');
      setActiveOp(null);

    } else if (action === 'sign') {
      current = String(parseFloat(current) * -1);
      updateDisplay(current);

    } else if (action === 'percent') {
      current = String(parseFloat(current) / 100);
      updateDisplay(current);
    }
  });
});
