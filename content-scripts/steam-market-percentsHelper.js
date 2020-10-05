{
    async function createPercentsHelper() {
        const data = new Promise(function(resolve, reject){ // get user settings(all)
            chrome.storage.local.get(null, function(result){
                resolve(result);
            })
        });

        const userSettings = await data; 
        const percentsHelper = userSettings.steamPercentsHelper;
        const cnyPrice = userSettings.cnyPrice;

        if (!percentsHelper) return;  // if user disable this function -> return

        const percentsTab = document.createElement('div');
        percentsTab.innerHTML = `
            <style>${getStyles()}</style>
            <input class="steam-price-input" type="number" placeholder="steam price">
            <input class="buff-price-input" type="number" placeholder="buff price">
            <span class="steam-buff-percents-output"></span>
            <span class="buff-steam-percents-output"></span>`;

        percentsTab.style.cssText = `
            display: flex; 
            flex-direction: row; 
            justify-content: space-between;
            width: 550px;
            position: fixed; 
            margin: 350px 0 0 0;`;

            percentsTab.querySelector('.steam-price-input').value = getSteamItemPrice();

            percentsTab.querySelector('.steam-price-input').addEventListener('input', () => { changePercents(cnyPrice); });
            percentsTab.querySelector('.buff-price-input').addEventListener('input', () => { changePercents(cnyPrice); });

        document.querySelector('#global_header').insertAdjacentElement('beforeend', percentsTab);
    }

    function getSteamItemPrice() {
        const listTypeLotsItems = [  // items that have list type lots 
            'Sticker', 
            'Case', 
            'Graffiti', 
            'Pin', 
            'Pass', 
            'Music', 
            'Patch',
            'Capsule',
            '(Holo/Foil)',  // for holo/foil team capsules
            'Box'
        ];

        const currentUrl = window.location.href;  // current steam page
        let isListType = false;  // by default not list type lots (guns/knifes/agents/etc)
        let itemPrice;

        if (currentUrl === 'https://steamcommunity.com/market/') return;  // if start market page -> return

        if (listTypeLotsItems.some((itemType) => currentUrl.includes(itemType))) {  // compare current url w/ item that got list lots
            isListType = true;  // if has matches -> set value to 'true'
        }

        if (isListType) {
            const priceTable = document.querySelector('.market_commodity_orders_table');  // get table with item prices

            if (priceTable === null) {
                window.location.reload();  // steam return null first time after page loads, after reloading returns correct data
            }

            const firstLot = priceTable.querySelector('td');  // select first 'td' that contains lowest item price
            itemPrice = Number(firstLot  // convert string to number
                .innerHTML               // get string with number from innerHTML
                .replace('₴', '')        // delete currency symbol
                .replace(' ', '')        // delete all spaces
                .replace(',', '.'));     // replace comma by dot for correct converting

        } else {
            const lotsTab = document.querySelector('#searchResultsTable');
            const lots = lotsTab.querySelectorAll('.market_recent_listing_row');

            for (let lot of lots) {
                const lotPrice = lot.querySelector('.market_listing_price_with_fee');

                if (lotPrice.innerHTML.trim() === 'Sold!') continue;  // if first item was sold -> skip and search next item

                itemPrice = Number(lotPrice  // convert string to number
                    .innerHTML               // get string with number from innerHTML
                    .replace('₴', '')        // delete currency symbol
                    .replace(' ', '')        // delete all spaces
                    .replace(',', '.'));     // replace comma by dot for correct converting

                break;  // if item with lowest price was finded -> stop searching
            }
        }
        return itemPrice;
    }

    function changePercents(cnyPrice) {
        const steamPrice = document.querySelector('.steam-price-input').value;
        const buffPrice = document.querySelector('.buff-price-input').value;
        const steamComission = 13;  // steam comission - 13.03%
        const buffComission = 2.5;  // dota2 has commision 1.8%, cs:go - 2.5%

        // more about formula on 'https://tradeback.io/ru/faq#p-pricebase2'
        const depositePercents = 100 - ( (steamPrice / cnyPrice * 100) / (buffPrice * (1 - buffComission / 100)) );
        const outputPercents = ( (steamPrice / cnyPrice * (100 - steamComission)) / buffPrice ) - 100;

        document.querySelector('.steam-buff-percents-output').innerHTML = depositePercents.toFixed(2);
        document.querySelector('.buff-steam-percents-output').innerHTML = outputPercents.toFixed(2);
    }

    function getStyles() {
        return `
            input[type=number]::-webkit-inner-spin-button,
            input[type=number]::-webkit-outer-spin-button {  /* delete right arrows from inputs */ 
                -webkit-appearance: none; 
                margin: 0; 
            }

            ::-webkit-input-placeholder {  /* change pleceholder text proporties */
                font-size: 23px;
                text-align: center;
            }

            .steam-price-input, .buff-price-input{
                height: 50px;
                width: 130px;
                font-size: 30px;
                text-align: center;
            }

            .steam-buff-percents-output, .buff-steam-percents-output {
                height: 52px; 
                width: 130px;
                line-height: 52px;
                font-size: 30px;
                text-align: center;
                background-color: rgba( 0, 0, 0, 0.2 ); 
                border: 1px solid #000;
            }
        `;
    }

    createPercentsHelper();  // call main function
}