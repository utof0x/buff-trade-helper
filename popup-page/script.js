const popupDiv = document.body.querySelector('.main');

document.addEventListener('DOMContentLoaded', changeSettingsTab);
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

function changeSettingsTab() {
    document.querySelectorAll('.main-tabs__item').forEach( (item) => 
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const id = event.target.getAttribute('href').replace('#', '');

            document.querySelectorAll('.main-tabs__item').forEach(
                (child) => child.classList.remove('main-tabs__item--active')
            );

            document.querySelectorAll('.main-content__item').forEach(
                (child) => child.classList.remove('main-content__item--active')
            );

            item.classList.add('main-tabs__item--active');
            document.getElementById(id).classList.add('main-content__item--active');
        })
    );
    document.querySelector('.main-tabs__item').click();
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
        case 'main-content-steam-helper__input':
            return 'steamPercentsHelper';

        case 'main-content-steam-fee__input':
            return 'itemPriceWithoutFee';

        case 'main-content-steam-offers__input':
            return 'offersHelper';

        case 'main-content-steam-inventory__input':
            return 'inventoryHelper';

        case 'main-content-steam-highlight__input':
            return 'historyPageHighlight';

        case 'main-content-steam-links__input':
            return 'historyPageLinks';

        case 'main-content-steam-quantity__input':
            return 'itemsQuantity';

        case 'main-content-buff-helper__input':
            return 'buffPercentsHelper';

        case 'main-content-buff-theme__input':
            return 'darkTheme';

        case 'main-content-buff-inspect__input':
            return 'inspectButton';

        case 'main-content-buff-sell__input':
            return 'buffSellHelper';

        case 'main-content-global-currency__input':
            return 'cnyPrice';

        case 'main-content-global-id__input':
            return 'steamID64';
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