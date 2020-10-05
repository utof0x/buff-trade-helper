{
    async function createPercentsHelper() {
        const data = new Promise(function(resolve, reject){ // get user settings(all)
            chrome.storage.local.get(null, function(result){
                resolve(result);
            })
        });

        const userSettings = await data; 
        const percentsHelper = userSettings.buffPercentsHelper;
        const cnyPrice = userSettings.cnyPrice;

        if (!percentsHelper) return;  // if user disable this function -> return

        const currentUrl = document.location.href;
        const percentsHelperTab = document.createElement('div');
        percentsHelperTab.innerHTML = `
            <div class="main-content">
                <input class="steam-price-input" type="number" placeholder="steam price">
                <input class="buff-price-input" type="number" placeholder="buff price">
                <span class="steam-buff-percents-output"></span>
                <span class="buff-steam-percents-output"></span>
            </div>
        `;

        document.querySelector('.market-list').insertAdjacentElement('afterbegin', percentsHelperTab);  // append percents tab

        percentsHelperTab.querySelector('.steam-price-input').addEventListener('input', () => { changePercents(cnyPrice); });
        percentsHelperTab.querySelector('.buff-price-input').addEventListener('input', () => { changePercents(cnyPrice); });

        if (!currentUrl.includes('https://buff.163.com/market/?')) {  // if not market main page
            roundedPercentsTab = document.createElement('div');
            roundedPercentsTab.innerHTML = `
                <div class="get-price-content">
                    <button class="get-price-content__button">Rounded percents</button>
                    <div class="rounded-steam-buff-percents-output"></div>
                    <div class="rounded-buff-steam-percents-output"></div>
                </div>
            `;

            document.querySelector('.market-list').insertAdjacentElement('afterbegin', roundedPercentsTab);
            document.querySelector('.get-price-content__button').addEventListener('click', calculateRoundedPercents);

            setTimeout(function() {  // generate click on button to calculate percents
                document.querySelector('.get-price-content__button').click();
            }, 1000);
        }
    }

    function calculateRoundedPercents() {
        const steamComission = 13;  // steam comission - 13.03%
        const buffComission = 2.5;  // dota2 has commision 1.8%, cs:go - 2.5%
        const table = document.querySelector('.detail-tab-cont');  // select table with all lots
        const itemDatails = document.querySelector('.detail-header');  // select header w/ img/name/price/etc
        const buffPrice = table
            .querySelectorAll('strong.f_Strong')[0]  // select first lot
            .innerHTML                               // select text
            .replace(/[^0-9.]/g, '');                // delete all chars except for numbers
        const priceElements = itemDatails.querySelector('strong.f_Strong').childNodes;
        let roundedSteamPrice;  // create variable to save stem price from buff item page
        if (priceElements.length === 3) {  // if item has int price 
            roundedSteamPrice =  Number(priceElements[1].innerHTML);
        } else if (priceElements.length === 4) {  // if item has float price 
            roundedSteamPrice =  Number(priceElements[1].innerHTML + priceElements[2].textContent);
        }

        const depositePercents = 100 - ( (roundedSteamPrice * 100) / (buffPrice * (1 - buffComission / 100)) );
        const outputPercents = ( (roundedSteamPrice * (100 - steamComission)) / buffPrice ) - 100;

        document.querySelector('.rounded-steam-buff-percents-output').innerHTML = depositePercents.toFixed(2);
        document.querySelector('.rounded-buff-steam-percents-output').innerHTML = outputPercents.toFixed(2);
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
    createPercentsHelper();  // call main function
}