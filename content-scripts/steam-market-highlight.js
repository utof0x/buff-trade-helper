const historyPage = document.querySelector('#tabContentsMyMarketHistory');
const historyButton = document.querySelector('#tabMyMarketHistory');

historyButton.addEventListener('click', () => highlightLots());

function highlightLots() {
    setTimeout(function() {

        const lots = historyPage.querySelectorAll('.market_listing_row');

        for (let lot of lots) {
            if (lot.querySelector('.market_listing_left_cell').innerHTML.includes('+')) {
                lot.style.backgroundColor = 'rgba(50, 205, 50, 0.3)';
            } else if (lot.querySelector('.market_listing_left_cell ').innerHTML.includes('-')) {
                lot.style.background = 'rgba(255, 77, 77, 0.4)';
            }
        }

    }, 1000);
}