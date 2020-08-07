const popupDiv = document.body.querySelector('.main');

document.addEventListener('DOMContentLoaded', () => setInputValues());
popupDiv.addEventListener('change', () => saveInputValue(event));

function setInputValues() { // set value after popup page loading for every input
    const inputs = document.querySelectorAll('input');

    for (let input of inputs) {
        if (input.type == 'number') {
            getValue(input.className).then( (value) => {
                input.value = value[getName(input.className)];
            })

        } else if (input.type == 'checkbox') {
            getValue(input.className).then( (value) => {
                input.checked = value[getName(input.className)];
            })
        }
    }
}

function saveInputValue(event) { // save new input values to chrome local storage
    const target = event.target;

    if (target.nodeName != 'INPUT') return;
    if (target.type == 'number' && !target.value) return; // don't save zero values

    let value;

    if (target.type == 'number') {
        value = Number(target.value); // inputs with type number saves value as 'string' -> convert to 'number'
    } else if (target.type == 'checkbox') {
        value = target.checked;
    }

    chrome.storage.local.set({[getName(target.className)]: value}, () => {
        console.log('Value is set to ' + value);
    });
}

function getName(name) { // convert className to normal name
    switch (name) {
        case 'main-market-percents-content__input':
            return 'percentsHelper';

        case 'main-history-highlight-content__input':
            return 'historyPageHighlight';

        case 'main-history-links-content__input':
            return 'historyPageLinks';

        case 'main-history-quantity-content__input':
            return 'historyPageItemsQuantity';

        case 'main-data-currency-content__input':
            return 'cnyPrice';

        }
}

function getValue(name) { // get value from chrome local storage
    const valueName = getName(name);

    return new Promise(function(resolve, reject) {
        chrome.storage.local.get([valueName], (value) => {
            resolve(value);
        });
    });
}