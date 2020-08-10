
async function showItemPriceWithoutFee() {  // make visible item price without fee and change it color
    const data = new Promise(function(resolve, reject){ // get user settings(itemPriceWithoutFee)
        chrome.storage.local.get('itemPriceWithoutFee', function(result){
            resolve(result.itemPriceWithoutFee);
        })
    });

    const itemPriceWithoutFee = await data;

    if(!itemPriceWithoutFee) return; // if user disabled function -> return

    const styles = document.createElement('style');

    styles.innerHTML = `
    .market_listing_price_with_fee {  /* change default item price text color to red */
        color: #E10505
    }

    .market_listing_price_without_fee {
        display: block;  /* make item prie withiut fee block visible */
        color: #08B032   /* change color to green */
    }
    `;

    document.head.insertAdjacentElement('beforeend', styles);  // append styles to head element
}

function showFullBuyOrdersBlock() {  // make buy orders block wisible by default (usally need click 'more inf' button)
    const style = document.createElement('style');

    style.innerHTML = `
        #market_buyorder_info_details {  /* make buy orders block wisible */
            display: block !important;
    }
    `;

    document.head.insertAdjacentElement('beforeend', style);  // append style to head element
}

showItemPriceWithoutFee();  // call function
showFullBuyOrdersBlock();  // call function