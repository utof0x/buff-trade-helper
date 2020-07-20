{
    const steamPage = document.querySelector('.pagecontent')
    const historyPage = document.querySelector('#tabContentsMyMarketHistory');
    const historyButton = document.querySelector('#tabMyMarketHistory');
    const supportedItems = ['Sticker', 'Case', 'Graffiti', 'Pin', 'Pass', 'Music', 'Patch']

    steamPage.addEventListener('click', () => linkLots(event));
    historyButton.addEventListener('click', () => linkLots(event));

    function linkLots() { // replace item name by item market link
        const target = event.target;

        if (target.className != 'market_paging_pagelink' && target.className != 'market_tab_well_tab_contents') return;

        setTimeout(function() { // delay before historyPage loads

            const lots = historyPage.querySelectorAll('.market_listing_row');

            for (let lot of lots) { // if lot item supported (see 'supportedItems') -> add link on item
                const lotItem = lot.querySelector('.market_listing_item_name');
                const lotName = lotItem.innerHTML;

                if (supportedItems.some((word) => lotName.includes(word))) {
                    lotItem.innerHTML = `<a href="https://steamcommunity.com/market/listings/730/${lotName}" target="_blank">${lotName}</a>`;
                }
            }

        }, 1000);
    }
}