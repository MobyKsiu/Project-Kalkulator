document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const keys = document.querySelectorAll('.key');
    const display_input = document.querySelector('.display .input');
    const display_output = document.querySelector('.display .output');
    const historyContent = document.getElementById('history-content');
    const clearHistoryBtn = document.getElementById('clear-history');
    
    let input = "";
    let isInitial = true; 

    display_output.innerHTML = ""; 
    display_input.innerHTML = "0"; 

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'pink') {
        document.body.classList.add('pink-mode');
    }

    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('pink-mode')) {
            document.body.classList.remove('pink-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('pink-mode');
            localStorage.setItem('theme', 'pink');
        }
    });

    loadHistory();

    clearHistoryBtn.addEventListener('click', clearHistory);

    for (let key of keys) {
        const value = key.dataset.key;

        key.addEventListener('click', () => {
            if (value == "clear") {
                input = "";
                isInitial = true;
                display_input.innerHTML = "0";
                display_output.innerHTML = ""; 
            } else if (value == "backspace") {
                input = input.slice(0, -1);
                if (input === "") {
                    isInitial = true;
                    display_input.innerHTML = "0";
                    display_output.innerHTML = "";
                } else {
                    display_input.innerHTML = CleanInput(input);
                }
            } else if (value == "=") {
                if (input) {
                    try {
                        let result = eval(PerpareInput(input));
                        if (!isFinite(result)) {
                            throw new Error("Error");
                        }
                        const roundedResult = RoundResult(result);
                        display_output.innerHTML = roundedResult;
                        
                        if (input && roundedResult !== undefined) {
                            addToHistory(CleanInput(input), roundedResult);
                        }
                        
                        isInitial = true;
                    } catch (e) {
                        display_output.innerHTML = "Error";
                    }
                } else {
                    display_output.innerHTML = "";
                }
            } else if (value == "brackets") {
                if (input.indexOf("(") == -1 || 
                    (input.indexOf("(") != -1 && input.indexOf(")") != -1 && 
                     input.lastIndexOf("(") < input.lastIndexOf(")"))) {
                    input += "(";
                } else {
                    input += ")";
                }
                display_input.innerHTML = CleanInput(input);
                isInitial = false;
            } else {
                if (ValidateInput(value)) {
                    if (isInitial) {
                        input = value;
                        isInitial = false;
                    } else {
                        input += value;
                    }
                    display_input.innerHTML = CleanInput(input);
                }
            }
        });
    }

    function CleanInput(input) {
        return input.replace(/\*/g, 'x')
                   .replace(/\//g, '÷')
                   .replace(/%/g, '%');
    }

    function ValidateInput(value) {
        let last_input = input.slice(-1);
        let operators = ["+", "-", "*", "/"];
        if (value == "." && last_input == ".") return false;
        if (operators.includes(value) && operators.includes(last_input)) return false;
        return true;
    }

    function PerpareInput(input) {
        return input.replace(/%/g, '/100');
    }

    function RoundResult(result) {
        return parseFloat(result.toFixed(10));
    }

    function addToHistory(equation, result) {
        if (!equation || result === undefined || result === null) return;
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-equation">${equation}</div>
            <div class="history-result">= ${result}</div>
        `;
        historyContent.prepend(historyItem);
        
        if (historyContent.children.length > 10) {
            historyContent.removeChild(historyContent.lastChild);
        }
        
        saveHistory();
    }

    function saveHistory() {
        const items = Array.from(document.querySelectorAll('.history-item')).slice(0, 10);
        const historyData = items.map(item => {
            return {
                equation: item.querySelector('.history-equation').textContent,
                result: item.querySelector('.history-result').textContent.replace('= ', '')
            };
        });
        localStorage.setItem('calculatorHistory', JSON.stringify(historyData));
    }

    function clearHistory() {
        historyContent.innerHTML = '';
        localStorage.removeItem('calculatorHistory');
    }

    function loadHistory() {
        try {
            const historyData = localStorage.getItem('calculatorHistory');
            if (!historyData) return;
            
            const history = JSON.parse(historyData);
            if (!Array.isArray(history)) return;
            
            historyContent.innerHTML = '';
            
            history.forEach(item => {
                if (item && item.equation && item.result) {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = `
                        <div class="history-equation">${item.equation}</div>
                        <div class="history-result">= ${item.result}</div>
                    `;
                    historyContent.appendChild(historyItem);
                }
            });
        } catch (e) {
            console.error("Error loading history:", e);
            localStorage.removeItem('calculatorHistory');
        }
    }
});

function calculatePythagoras() {
    const a = parseFloat(document.getElementById('sideA').value);
    const b = parseFloat(document.getElementById('sideB').value);
    const c = parseFloat(document.getElementById('sideC').value);
    const resultElement = document.getElementById('pythagoras-result');
    
    if (isNaN(a) && !isNaN(b) && !isNaN(c)) {
        if (b >= c) {
            resultElement.textContent = "Błąd: b nie może być ≥ c";
            return;
        }
        const calculatedA = Math.sqrt(c*c - b*b);
        document.getElementById('sideA').value = calculatedA.toFixed(2);
        updateLabels(calculatedA, b, c);
        resultElement.textContent = `a = ${calculatedA.toFixed(2)}`;
    } 
    else if (isNaN(b) && !isNaN(a) && !isNaN(c)) {
        if (a >= c) {
            resultElement.textContent = "Błąd: a nie może być ≥ c";
            return;
        }
        const calculatedB = Math.sqrt(c*c - a*a);
        document.getElementById('sideB').value = calculatedB.toFixed(2);
        updateLabels(a, calculatedB, c);
        resultElement.textContent = `b = ${calculatedB.toFixed(2)}`;
    } 
    else if (isNaN(c) && !isNaN(a) && !isNaN(b)) {
        const calculatedC = Math.sqrt(a*a + b*b);
        document.getElementById('sideC').value = calculatedC.toFixed(2);
        updateLabels(a, b, calculatedC);
        resultElement.textContent = `c = ${calculatedC.toFixed(2)}`;
    } 
    else {
        resultElement.textContent = "Wprowadź 2 wartości aby obliczyć trzecią";
    }
}

function clearPythagoras() {
    document.getElementById('sideA').value = '';
    document.getElementById('sideB').value = '';
    document.getElementById('sideC').value = '';
    document.getElementById('pythagoras-result').textContent = '';
    document.querySelector('#a-label').textContent = 'a';
    document.querySelector('#b-label').textContent = 'b';
    document.querySelector('#c-label').textContent = 'c';
}

function updateLabels(a, b, c) {
    if (!isNaN(a)) document.querySelector('#a-label').textContent = `a = ${a.toFixed(2)}`;
    if (!isNaN(b)) document.querySelector('#b-label').textContent = `b = ${b.toFixed(2)}`;
    if (!isNaN(c)) document.querySelector('#c-label').textContent = `c = ${c.toFixed(2)}`;
}

themeToggle.addEventListener('click', function() {
    if (document.body.classList.contains('pink-mode')) {
        document.body.classList.remove('pink-mode');
        localStorage.setItem('theme', 'light');
        document.querySelector('.pythagoras-container svg polygon').setAttribute('fill', '#3498db');
        document.querySelector('.pythagoras-container svg polygon').setAttribute('stroke', '#2c3e50');
    } else {
        document.body.classList.add('pink-mode');
        localStorage.setItem('theme', 'pink');
        document.querySelector('.pythagoras-container svg polygon').setAttribute('fill', '#ff9ec6');
        document.querySelector('.pythagoras-container svg polygon').setAttribute('stroke', '#d6006e');
    }
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'pink') {
    document.body.classList.add('pink-mode');
    document.querySelector('.pythagoras-container svg polygon').setAttribute('fill', '#ff9ec6');
    document.querySelector('.pythagoras-container svg polygon').setAttribute('stroke', '#d6006e');
} else {
    document.querySelector('.pythagoras-container svg polygon').setAttribute('fill', '#3498db');
    document.querySelector('.pythagoras-container svg polygon').setAttribute('stroke', '#2c3e50');
}