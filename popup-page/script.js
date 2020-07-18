const popupDiv = document.body.querySelector('.main');

document.addEventListener('DOMContentLoaded', () => setInputValues());
popupDiv.addEventListener('change', () => saveInputValue(event));

function setInputValues() { // set value for evry input on popup page
    const inputs = document.querySelectorAll('input');

    for (let input of inputs) {
        input.value = localStorage.getItem(input.className);
    }
}

function saveInputValue(event) { // save new input values to chrome sync storage
    const target = event.target;

    if (!target.value) return;  
    if (target.nodeName != 'INPUT') return;

    const key = target.className;
    const value = target.value;

    localStorage.setItem(key, value);
}

function getValue(element) { // returns value from chrome sync storage
    const name = element.className;

    localStorage.getItem(name);
}