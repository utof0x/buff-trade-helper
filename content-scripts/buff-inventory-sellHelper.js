{
    const sellTab = document.querySelector('#popup-container');
    const sellButton = document.querySelector('#change-price')  // select 'change price' button on sale tab
        || document.querySelector('#shelve');  // or select 'sell' button on inventory tab

    sellButton.addEventListener('click', addSellHelperTab);

    async function addSellHelperTab() {
        const data = new Promise(function(resolve, reject){  // get user settings(buffSellHelper)
            chrome.storage.local.get('buffSellHelper', function(result){
                resolve(result.buffSellHelper);
            })
        });
        
        const enableSellHelper = await data;
        if (!enableSellHelper) return;  // if user disable function -> return

        try {
            setTimeout(() => {  // set delay before all lots will load
                const sellTabContent = sellTab.querySelector('.popup-cont');
                const itemsToSale = sellTabContent.querySelectorAll('tr.assets-item');  // select all lots
                const allItemsInfo = collectItemsInfo(itemsToSale);  // get info about lots
    
                createBigItemsTab(allItemsInfo);  // create new sell tab w/ info about items
            }, 5000);
        } catch (error) {
            console.error(error);
        }
    }

    function setItemPrice(event, currentItem, customSellLots) {  // set price on default sell lot 
        const defaultSellLots = document.querySelectorAll('tr.assets-item');
        const inputEvent = new Event('input', {  // create input event
            bubbles: true,
            cancelable: true,
        });

        const sameItems = customSellLots.filter( (elem) => (  // get all same items
            elem.name === currentItem.name  // if same names
            && elem.float === currentItem.float  // and same floats
            && elem.stickers === currentItem.stickers  // and same stickers
        ));

        sameItems.forEach( (item) => {  // set price for each same item
            // select input w/ price without fee
            const priceInput = defaultSellLots[item.index].querySelector('input[name="price"]');
            priceInput.value = event.target.value;  // set user value 
            priceInput.dispatchEvent(inputEvent);  // generate input event
        });
    }

    function getUniqueItems(itemsArray) {  // return array w/ unique items params
        let uniqueItems = [];  // empy array for adding unique items

        for (let i = 0; i < itemsArray.length; i++) {
            if (i === 0) {  // push first item by default
                uniqueItems.push(itemsArray[0]);
                continue;
            }

            const notUniqueCondition = (element) => (  // compare unique items w/ current item
                element.name === itemsArray[i].name  // if have same names
                && element.float === itemsArray[i].float  // if have same floats
                && element.stickers === itemsArray[i].stickers  // if have same stickers
            );

            let itemNotUnique = uniqueItems.find(notUniqueCondition);  // find item by cond in unique items 
            if (itemNotUnique) {
                itemNotUnique.quantity += 1;  // increase quantity for 1
                itemsArray[i].isHidden = true;  // change prop to hide item in future
            } else {
                uniqueItems.push(itemsArray[i]);  // if item is unique -> add to array
            }
        }
        return uniqueItems;  // return array w/ unique items w/ updated quantity
    }

    function getItemRoundedFloat(floatString) {  // returns string w/ item float and exterior
        if (floatString === 'none') return 'Float: none';  // if not gun -> return 'none'

        const itemFloat = Number(floatString.replace(/[^0-9.]/g, '')).toFixed(4);  // get number w/
        let itemExterior;

        if (itemFloat < 0.07) {  // get text of exterior by float
            itemExterior = '(Factory New)';
        } else if (itemFloat > 0.07 && itemFloat < 0.15) {
            itemExterior = '(Minimal Wear)';
        } else if (itemFloat > 0.15 && itemFloat < 0.38) {
            itemExterior = '(Field-Tested)';
        } else if (itemFloat > 0.38 && itemFloat < 0.44) {
            itemExterior = '(Well-Worn)';
        } else if (itemFloat > 0.44) {
            itemExterior = '(Battle-Scarred)';
        }

        return `Float: ${itemFloat}  ${itemExterior}`;
    }

    function getItemNameWithoutExterior(itemName) {  // returns name without exterior text
        // array of all possible items exteriors
        const possibleExteriors = ['(Factory New)', '(Minimal Wear)', '(Field-Tested)', '(Well-Worn)', '(Battle-Scarred)'];

        for (let ext of possibleExteriors) {
            if (itemName.includes(ext)) {  // if item name contains exterior text 
                itemName = itemName.replace(ext, '');  // replace exterior text
            }
        }
        return itemName;
    }

    function createBigItemsTab(itemsObjInfo) {
        const bigItemsTab = document.createElement('div');
            bigItemsTab.className = 'big-items-tab';

            for (let item of getUniqueItems(itemsObjInfo)) {  // for each unique item
                let itemBlock = document.createElement('div');
                itemBlock.className = 'item-block';
                if (item.isHidden === true) {  // hide not unique items
                    itemBlock.classList.add('hidden');
                }

                const imageTab = document.createElement('div');
                imageTab.className = 'item-image';
                imageTab.innerHTML = item.image.innerHTML;
                itemBlock.insertAdjacentElement('beforeend', imageTab);

                if (item.stickers != 'none') {  // if item has stickers
                    const stickersTab = document.createElement('div');
                    stickersTab.className = 'item-stickers';
                    stickersTab.innerHTML = item.stickers.innerHTML;
                    itemBlock.insertAdjacentElement('beforeend', stickersTab);
                }

                const nameTab = document.createElement('div');
                nameTab.className = 'item-name';
                nameTab.innerHTML = getItemNameWithoutExterior(item.name);  // replace exterior from name
                itemBlock.insertAdjacentElement('beforeend', nameTab);

                const floatTab = document.createElement('div');
                floatTab.className = 'item-float';
                floatTab.innerHTML = getItemRoundedFloat(item.float);  // get item float w/ exterior
                itemBlock.insertAdjacentElement('beforeend', floatTab);

                const currentSalePriceTab = document.createElement('div');
                currentSalePriceTab.className = 'item-current-sale-price';
                currentSalePriceTab.innerHTML = 'Current: ' + (item.currentSalePrice || 'not listed');
                itemBlock.insertAdjacentElement('beforeend', currentSalePriceTab);

                const lowestMarketPriceTab = document.createElement('div');
                lowestMarketPriceTab.className = 'item-lowest-market-price';
                lowestMarketPriceTab.innerHTML = 'Lowest: ' + item.lowestMarketPrice;
                itemBlock.insertAdjacentElement('beforeend', lowestMarketPriceTab);

                const itemPriceInput = document.createElement('input');
                itemPriceInput.className = 'item-price-input';
                itemPriceInput.type = 'number';
                if (item.isListed) {  // if sell tab and item listed -> set price
                    itemPriceInput.value = item.currentSalePrice;
                }
                // for each price input add listener to change price on default lot w/ same item
                itemPriceInput.addEventListener('input', () => { setItemPrice(event, item, itemsObjInfo); });
                itemBlock.insertAdjacentElement('beforeend', itemPriceInput);

                const itemQantityTab = document.createElement('div');
                itemQantityTab.className = 'item-qantity-tab';
                itemQantityTab.innerHTML = '×' + item.quantity;
                itemBlock.insertAdjacentElement('beforeend', itemQantityTab);

                bigItemsTab.insertAdjacentElement('beforeend', itemBlock);
            }

            document.querySelector('.cover').insertAdjacentElement('beforeend', bigItemsTab);
    }

    function collectItemsInfo(items) {  // return array of objects w/ info about all items
        let itemsObjInfo = [];  // create empty array
        let index = 0;

        for (let item of items) {
            let obj = {};  // create empty object
            obj.name = item.querySelector('.textOne').innerHTML;  // save item name
            obj.index = index++;  // save item index (count starts from 0)
            obj.image = item.querySelector('.pic-cont');  // save all img elements to show info when hovered
            obj.isListed = item.querySelector('input.i_Text.j_filter').value ? true : false;
            // if gun item -> save it float else -> save 'none value'
            obj.float = item.querySelector('.paint-wear') ? item.querySelector('.paint-wear').innerHTML : 'none';
            obj.stickers = item.querySelector('.csgo_sticker_inline') || 'none';  // save full stickers elem
            obj.lowestMarketPrice = item.querySelector('input.i_Text.j_filter').getAttribute('data-price');
            obj.currentSalePrice = item.querySelector('input.i_Text.j_filter').value;
            obj.quantity = 1;  // default quantity is 1
            obj.isHidden = false;  // by default item visible
            itemsObjInfo.push(obj);  // push item information into array
        }
        return itemsObjInfo;
    }
}