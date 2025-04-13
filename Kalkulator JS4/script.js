const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";
let isInitial = true; 

display_output.innerHTML = ""; 
display_input.innerHTML = "0"; 

document.querySelector(".display .input").style.fontSize = "2.5rem"; 

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
                    display_output.innerHTML = RoundResult(result);
                    isInitial = true;
                } catch (e) {
                    display_output.innerHTML = "Error";
                }
            } else {
                display_output.innerHTML = "";
            }
        } else if (value == "brackets") {
            if (
                input.indexOf("(") == -1 || 
                (input.indexOf("(") != -1 && input.indexOf(")") != -1 && input.lastIndexOf("(") < input.lastIndexOf(")"))
            ) {
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
                .replace(/\+/g, '+')
                .replace(/-/g, '-')
                .replace(/\(/g, '(')
                .replace(/\)/g, ')')
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