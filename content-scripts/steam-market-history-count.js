{
    const historyPage = document.querySelector('#tabContentsMyMarketHistory');
    const historyButton = document.querySelector('#tabMyMarketHistory');

    document.addEventListener('click', () => { changeLotsCount(event); });
    historyButton.addEventListener('click', () => { changeLotsCount(event); });

    async function changeLotsCount(event) {
        const target = event.target;

        if (target.className != 'market_paging_pagelink'  // if not page numbers &&
            && target.className != 'market_tab_well_tab_contents'  // if not history button && 
            && target.className != 'pagebtn') {  // if not page links -> return
            return;
        }

        const data = new Promise(function(resolve, reject){  // get user settings(itemsQuantity)
            chrome.storage.local.get('itemsQuantity', function(result){
                resolve(result.itemsQuantity);
            })
        });
        
        const itemsQuantity = await data;
        if (!itemsQuantity) return;  // if user disable function -> return

        const activePage = getActivePage(target);

        getLotsData(activePage, itemsQuantity)
            .then(timeout(1500))  // after delay in 1.5 sec
            .then( (data) => {  // get steam response as data
                const historyRows = historyPage.querySelector('#tabContentsMyMarketHistoryRows');
                historyRows.innerHTML = data.results_html;  // replace old history rows by data
            })
            .then( () => {
                const start = document.querySelector('#tabContentsMyMarketHistory_start');
                const end = document.querySelector('#tabContentsMyMarketHistory_end');
        
                start.innerHTML = activePage * itemsQuantity - itemsQuantity;
                end.innerHTML = itemsQuantity * activePage;
            })
            .catch( (error) => {  // catch error
                console.error(error);
            });
    }

    async function getLotsData(currentPage, lotsCount) {  // returns json w/ item lots 
        const startFrom = currentPage * lotsCount - lotsCount;
        const url = `https://steamcommunity.com/market/myhistory/render/?start=${startFrom}&count=${lotsCount}`;

        const response = await fetch(url);

        return await response.json();
    }

    function getActivePage(target) {  // returns current page number
        let pageNumber = 1;  

        // this using so as not to catch error after first tap on 'My market history' button
        if (target.className === 'market_paging_pagelink') {  // if was clicked on link page
            pageNumber = Number(target.innerHTML);
        } else if (target.id === 'tabContentsMyMarketHistory_btn_prev') {
            pageNumber = Number(document.querySelector('.active').innerHTML) - 1;
        } else if (target.id === 'tabContentsMyMarketHistory_btn_next') {
            pageNumber = Number(document.querySelector('.active').innerHTML) + 1;
        }

        return pageNumber;
    }

    function timeout(ms) {  // returns promise w/ delay 
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}