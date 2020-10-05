{
    const historyPage = document.querySelector('#tabContentsMyMarketHistory');
    const historyButton = document.querySelector('#tabMyMarketHistory');
    const supportedItems = ['Sticker', 'Case', 'Graffiti', 'Pin', 'Pass', 'Music', 'Patch'];

    document.addEventListener('click', () => linkLots(event));
    historyButton.addEventListener('click', () => linkLots(event));

    async function linkLots(event) { // replace item name by item market link
        const target = event.target;

        if (target.className != 'market_paging_pagelink' 
            && target.className != 'market_tab_well_tab_contents'
            && target.className != 'pagebtn') {
            return;
        }

        const data = new Promise(function(resolve, reject){ // get user settings(historyPageLinks)
            chrome.storage.local.get('historyPageLinks', function(result){
                resolve(result.historyPageLinks);
            })
        });
        
        const historyPageLinks = await data;
        
        if(!historyPageLinks) return; // if user disabled function -> return

        setTimeout(function() { // delay before historyPage loads

            const lots = historyPage.querySelectorAll('.market_listing_row');

            for (let lot of lots) { // if lot item supported (see 'supportedItems') -> add link on item
                const lotItem = lot.querySelector('.market_listing_item_name');
                const lotName = lotItem.innerHTML;

                if (supportedItems.some((word) => lotName.includes(word))) {
                    lotItem.innerHTML = `<a href="https://steamcommunity.com/market/listings/730/${lotName}" target="_blank">${lotName}</a>`;
                }
            }
        }, 2000);
    }
}