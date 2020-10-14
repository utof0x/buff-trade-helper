{
    try {
        createPercentsHelper();  // call main function
    } catch (error) {
        console.error(error);
    }

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
        percentsHelperTab.className = 'main-content';
        percentsHelperTab.innerHTML = `
            <input class="steam-price-input" type="number" placeholder="steam price">
            <input class="buff-price-input" type="number" placeholder="buff price">
            <span class="steam-buff-percents-output"></span>
            <span class="buff-steam-percents-output"></span>
        `;

        percentsHelperTab.querySelector('.steam-price-input').addEventListener('input', () => { changePercents(cnyPrice); });
        percentsHelperTab.querySelector('.buff-price-input').addEventListener('input', () => { changePercents(cnyPrice); });

        document.querySelector('.market-list').insertAdjacentElement('afterbegin', percentsHelperTab);  // append percents tab

        const roundedPercentsTab = document.createElement('div');
        roundedPercentsTab.className = 'get-price-content';

        document.querySelector('.market-list').insertAdjacentElement('afterbegin', roundedPercentsTab);

        const openAllLinksOnSellPageButton = document.createElement('button');
        openAllLinksOnSellPageButton.className = 'open-all__button';
        openAllLinksOnSellPageButton.innerHTML = 'Open all on sell page';
        openAllLinksOnSellPageButton.addEventListener('click', openAllListingsOnSellPage);

        const openAllLinksOnPurchasePageButton = document.createElement('button');
        openAllLinksOnPurchasePageButton.className = 'open-all__button';
        openAllLinksOnPurchasePageButton.innerHTML = 'Open all on purchase page';
        openAllLinksOnPurchasePageButton.addEventListener('click', openAllListingsOnPurchasePage);

        // add puttons to open all listings from current page
        roundedPercentsTab.insertAdjacentElement('beforeend', openAllLinksOnSellPageButton);
        roundedPercentsTab.insertAdjacentElement('beforeend', openAllLinksOnPurchasePageButton);

        if (!currentUrl.includes('https://buff.163.com/market/?')) {  // if not market main page
            const priceContentButton = document.createElement('button');
            priceContentButton.className = 'get-price-content__button';
            priceContentButton.innerHTML = 'Rounded percents';

            const steamToBuffPercentsTab = document.createElement('div');
            steamToBuffPercentsTab.className = 'rounded-steam-buff-percents-output';
            const buffToSteamPercentsTab = document.createElement('div');
            buffToSteamPercentsTab.className = 'rounded-buff-steam-percents-output';
            
            // remove previously created buttons and increase tab width up to 600px
            roundedPercentsTab.removeChild(openAllLinksOnSellPageButton);
            roundedPercentsTab.removeChild(openAllLinksOnPurchasePageButton);
            roundedPercentsTab.style.width = '600px';

            // add button to calc rounded percents and fields to display percents
            roundedPercentsTab.insertAdjacentElement('beforeend', priceContentButton);
            roundedPercentsTab.insertAdjacentElement('beforeend', steamToBuffPercentsTab);
            roundedPercentsTab.insertAdjacentElement('beforeend', buffToSteamPercentsTab);

            priceContentButton.addEventListener('click', calculateRoundedPercents);
            document.addEventListener('readystatechange', calculateRoundedPercentsAfterPageLoads);
        }
    }

    function calculateRoundedPercentsAfterPageLoads() { // after page full loads -> calc rounded percents
        if (document.readyState === 'complete') {
            const timer = setInterval(() => {
                if (document.querySelector('.detail-tab-cont').querySelectorAll('strong.f_Strong')[0]) {
                    calculateRoundedPercents();
                    clearInterval(timer);
                }
            }, 200);
        }
    }

    function openAllListingsOnSellPage() {  // selects all listings on page and opens their sell tabs
        const listingsTab = document.querySelector('.list_card');
        const listings = listingsTab.querySelectorAll('li');

        for (let listing of listings) {
            setTimeout( () => {  // after delay in 0.1sec
                const listingName = listing.querySelector('h3');
                const listingLink = listingName.querySelector('a');
                listingLink.target = '_blank';  // set target to open link in new tab
                listingLink.click();  // generate click to open
            }, 100);
        }
    }

    function openAllListingsOnPurchasePage() {  // selects all listings on page and opens their purchase tabs
        const listingsTab = document.querySelector('.list_card');
        const listings = listingsTab.querySelectorAll('li');

        for (let listing of listings) {
            setTimeout( () => {
                const listingName = listing.querySelector('h3');
                const listingLink = listingName.querySelector('a');
                listingLink.href = listingLink.href.replace('selling', 'buying');  // set href to open purchase tab
                listingLink.target = '_blank';
                listingLink.click();
            }, 200);
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
}