{
    const historyPage = document.querySelector('#tabContentsMyMarketHistory');
    const historyButton = document.querySelector('#tabMyMarketHistory');
    
    document.addEventListener('click', () => highlightLots(event));
    historyButton.addEventListener('click', () => highlightLots(event));

    async function highlightLots(event) { // set hightlight to lots on history page
        const target = event.target;

        if (target.className != 'market_paging_pagelink' // if not page numbers &&
            && target.className != 'market_tab_well_tab_contents' // if not history button && 
            && target.className != 'pagebtn') { // if not page links -> return
            return;
        }

        const data = new Promise(function(resolve, reject){ // get user settings(historyPageHighlight)
            chrome.storage.local.get('historyPageHighlight', function(result){
                resolve(result.historyPageHighlight);
            })
        });
        
        const historyPageHighlight = await data;
        
        if(!historyPageHighlight) return; // if user disabled function -> return

        setTimeout(function() { // delay before historyPage loads

            const lots = historyPage.querySelectorAll('.market_listing_row');

            for (let lot of lots) { // if buy lot('+') -> green highlight, if sold lot('-') -> red highlight  
                const actionTab = lot.querySelector('.market_listing_whoactedwith');
                if (actionTab.innerHTML.includes('Buyer:')) {  // -> red highlight  

                    lot.style.backgroundColor = 'rgba(255, 77, 77, 0.4)';

                } else if(actionTab.innerHTML.includes('Seller:')) {  // -> green highlight  

                    lot.style.background = 'rgba(50, 205, 50, 0.3)';

                } else if(actionTab.innerHTML.includes('Listing canceled')) {  // -> yellow highlight  

                    lot.style.background = 'rgba(255, 255, 0, 0.25)';

                } else if(actionTab.innerHTML.includes('Listing created')) {  // -> blue highlight  

                    lot.style.background = 'rgba(0, 0, 255, 0.2)';

                }
            }
        }, 2000);
    }
}