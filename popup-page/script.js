const popupDiv = document.body.querySelector('.main');

document.addEventListener('DOMContentLoaded', () => setInputValues());
popupDiv.addEventListener('change', () => saveInputValue(event));

function setInputValues() { // set value for evry input on popup page
    const inputs = document.querySelectorAll('input');

    for (let input of inputs) {
        if (input.type == 'number') {
            input.value = localStorage.getItem(input.className);
        } else if (input.type == 'checkbox') {
            const value = localStorage.getItem(input.className);
            if (value === 'true') {
                input.checked = true;
            } else {
                input.checked = false;
            }    
        }
    }
}

function saveInputValue(event) { // save new input values to chrome sync storage
    const target = event.target;

    if (target.nodeName != 'INPUT') return;
    if (target.type == 'number' && !target.value) return;

    const key = target.className;
    let value;

    if (target.type == 'number') {
        value = target.value;
    } else if (target.type == 'checkbox') {
        value = target.checked;
    }

    localStorage.setItem(key, value);
}

function getValue(element) { // returns value from chrome sync storage
    const name = element.className;

    localStorage.getItem(name);
}