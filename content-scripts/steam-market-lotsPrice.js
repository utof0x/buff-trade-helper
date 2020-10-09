{
    addPriceTabs();  // call main function

    async function addPriceTabs() {  // add listings and orders total prices tabs 
        const startFrom = 0;  // start count from 0 element

        getListingsInfo(startFrom)  // first request
            .then( (data) => {
                return data.results_html;  // return results
            })
            .then( (totalHtml) => {
                const temp = document.createElement('div');  // create temporary node 
                temp.innerHTML = totalHtml;
                const listingsTab = temp.querySelectorAll('.my_listing_section')[0];  // search in listings table (0 table)

                return calculateListingsPrices(listingsTab);  // get price w/ fee and without fee
            })  
            .then( (listingsPrices) => {  // create div and append prices to it
                const listingsHeader = document.querySelectorAll('.market_listing_table_header')[0];
                const customelistingsPriceTab = document.createElement('div');
                customelistingsPriceTab.className = 'total-listings-price';
                customelistingsPriceTab.innerHTML = `
                    <div class="listings-price-title">Total price:</div>
                    <div class="listings-price-content">
                        <div class="">${listingsPrices.totalListingsPriceWithFee}</div>
                        <div class="">(${listingsPrices.totalListingsPriceWithoutFee})</div>
                    </div>
                `;
                
                listingsHeader.insertAdjacentElement('afterend', customelistingsPriceTab);  // add div on page
            })  
            .then( () => {  // get total orders price
                return getBuyOrdersPrice();
            })
            .then( (ordersPrice) => {  // create div and append orders price to it 
                const ordersHeader = document.querySelectorAll('.market_listing_table_header')[1];
                const totalOrdersPriceTab = document.createElement('div');
                totalOrdersPriceTab.className = 'total-orders-price';
                totalOrdersPriceTab.innerHTML = `
                    <span class="title-text">Total orders price:</span>
                    <span class="price-text">${ordersPrice}</span>
                `;

                ordersHeader.insertAdjacentElement('afterend', totalOrdersPriceTab);  
            })
            .catch( (err) => {
                console.error(err);
            });  
    }

    function getBuyOrdersPrice() {  // return total orders price
        const ordersTab = document.querySelectorAll('.my_listing_section')[1];

        try {
            const orders = ordersTab.querySelectorAll('.market_listing_row.market_recent_listing_row');
            let totalOrdersPrice = 0;

            for (let order of orders) {
                const itemQantity = Number(order  // convert to number
                    .querySelector('.market_listing_inline_buyorder_qty')  // select order quantity tag 
                    .innerHTML
                    .replace(/[^1-9]/g, ''));  // replace all except numbers

                const itemPrice = Number(order
                    .querySelector('.market_listing_price')  // select 
                    .childNodes[2]  // select text after quantity tag (price)
                    .textContent  // select text
                    .replace(/[^0-9,.]/g, '')
                    .replace(',', '.'));  // replace comma by dot for correct convert

                const lotPrice = itemQantity * itemPrice;  // multiply quantity w/ price
                totalOrdersPrice += lotPrice;  // add current value to prev 
            }

            return totalOrdersPrice.toFixed(2);

        } catch (error) {
            console.error(error);
        }
    }

    async function getListingsInfo(startFrom) {  // return info about 100 listings
        const url = `https://steamcommunity.com/market/mylistings?query=&start=${startFrom}&count=100`;
        
        const response = await fetch(url);
        return await response.json();
    }

    function calculateListingsPrices(elem) {  // return price with and without fee
        const listings = elem.querySelectorAll('.market_listing_row.market_recent_listing_row');  // select all listings
        let totalListingsPriceWithFee = 0;
        let totalListingsPriceWithoutFee = 0;

        for (let listing of listings) {
            const currentListingPriceWithFee = Number(listing  // convert to number
                .querySelector('.market_listing_right_cell.market_listing_my_price')  // find price elem 
                .querySelector('span[title="This is the price the buyer pays."]')  // select span with price 
                .innerHTML
                .replace(/[^0-9.,]/g, '')  // replace all except float numbers
                .replace(',', '.'));  // replace comma by dot for correct converting

            const currentListingPriceWithoutFee = Number(listing
                .querySelector('.market_listing_right_cell.market_listing_my_price')
                .querySelector('span[title="This is how much you will receive."]')
                .innerHTML
                .replace(/[^0-9.,]/g, '')
                .replace(',', '.'));

            totalListingsPriceWithFee += currentListingPriceWithFee;  // add current value to sum of past value
            totalListingsPriceWithoutFee += currentListingPriceWithoutFee;  // add current value to sum of past value
        }

        return {  // return object with prices
            'totalListingsPriceWithFee': totalListingsPriceWithFee.toFixed(2),
            'totalListingsPriceWithoutFee': totalListingsPriceWithoutFee.toFixed(2)
        };
    }
}