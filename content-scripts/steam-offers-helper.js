{
    try {
        createFastAcceptButtons();  // call main function
    } catch (error) {
        console.error(error);
    }

    async function createFastAcceptButtons() {
        const data = new Promise(function(resolve, reject){  // get user settings(offersHelper)
            chrome.storage.local.get('offersHelper', function(result){
                resolve(result.offersHelper);
            })
        });
        const offersHelper = await data;
        if (!offersHelper) return;  // if user disable function -> return

        const tradeOffers = document.querySelectorAll('.tradeoffer');

        for (let tradeOffer of getActiveOffers(tradeOffers)) {  // add buttons on active tradeoffers 
            const currentTradeOfferArray = [tradeOffer];
            const acceptButton = document.createElement('button');
            acceptButton.innerHTML = 'Accept';
            acceptButton.className = 'accept-button';
            const rejectButton = document.createElement('button');
            rejectButton.innerHTML = 'Reject';
            rejectButton.className = 'reject-button';

            acceptButton.addEventListener('click', () => { acceptTradeOffers(currentTradeOfferArray); });
            rejectButton.addEventListener('click', () => { rejectTradeOffers(currentTradeOfferArray); });
            
            tradeOffer.insertAdjacentElement('afterbegin', acceptButton);
            tradeOffer.insertAdjacentElement('afterbegin', rejectButton);
        }

        const rightOffersTab = document.querySelector('.profile_rightcol');
        const acceptAllButton = document.createElement('button');
        acceptAllButton.innerHTML = 'Accept all';
        acceptAllButton.className = 'accept-all-button';
        const rejectAllButton = document.createElement('button');
        rejectAllButton.innerHTML = 'Reject all';
        rejectAllButton.className = 'reject-all-button';

        rightOffersTab.insertAdjacentElement('beforeend', acceptAllButton);
        rightOffersTab.insertAdjacentElement('beforeend', rejectAllButton);

        acceptAllButton.addEventListener('click', () => { acceptTradeOffers(getActiveOffers(tradeOffers)); });
        rejectAllButton.addEventListener('click', () => { rejectTradeOffers(getActiveOffers(tradeOffers)); });
    }


    function acceptTradeOffers(tradeOffers) {
        for (let tradeOffer of tradeOffers) {
            const tradeOfferId = Number(tradeOffer.id.replace(/[^0-9]/g, ''));
            const offerUrl = `https://steamcommunity.com/tradeoffer/${tradeOfferId}/`;

            const acceptTradeOfferWindow = window.open(offerUrl, '_blank', 'height=750,width=360');

            acceptTradeOfferWindow.addEventListener('load', () => {
                const yourItemsTab = acceptTradeOfferWindow.document.querySelectorAll('.trade_item_box')[1];
                const partnerItemsTab = acceptTradeOfferWindow.document.querySelectorAll('.trade_item_box')[2];
                const yourSideEmptyTrade = yourItemsTab.querySelector('.has_item') ? false : true;
                const yourSiteGiftTrade = partnerItemsTab.querySelector('.has_item') ? false : true;

                setTimeout( () => {
                    const confirmOfferButton = acceptTradeOfferWindow.document.querySelector('#you_notready');
                    if (yourSiteGiftTrade) {
                        const acceptGiftTradeObserver = new MutationObserver( () => {
                            setTimeout( () => {
                            const giftButton = acceptTradeOfferWindow.document.querySelector('.btn_green_steamui');

                            generateButtonClickInRandomPosition(acceptTradeOfferWindow, giftButton);

                            acceptGiftTradeObserver.disconnect();

                            }, getRandomNumberInRange(1000, 3000));
                        });
                        acceptGiftTradeObserver.observe(acceptTradeOfferWindow.document, {childList: true, subtree: true});
                    }
                    generateButtonClickInRandomPosition(acceptTradeOfferWindow, confirmOfferButton);

                    setTimeout( () => {
                        const acceptOfferButton = acceptTradeOfferWindow.document.querySelector('.trade_confirmbtn');
                        generateButtonClickInRandomPosition(acceptTradeOfferWindow, acceptOfferButton);

                    }, getRandomNumberInRange(3000, 6000));

                    setTimeout( () => {
                        acceptTradeOfferWindow.close();
                    }, getRandomNumberInRange(6000, 8000));

                }, getRandomNumberInRange(1000, 5000));
            });
        }
    }

    function rejectTradeOffers(tradeOffers) {
        for (let tradeOffer of tradeOffers) {
            const tradeOfferId = Number(tradeOffer.id.replace(/[^0-9]/g, ''));
            const offerUrl = `https://steamcommunity.com/tradeoffer/${tradeOfferId}/`;
            
            const rejectTradeOfferWindow = window.open(offerUrl, '_blank', 'height=840,width=360');
            
            rejectTradeOfferWindow.addEventListener('load', () => {
                setTimeout( () => {
                    const rejectOfferButton = rejectTradeOfferWindow.document.querySelector('#btn_decline_trade_offer');
                    
                    const rejectTradeObserver = new MutationObserver( () => {
                        setTimeout( () => {
                            const declineButton = rejectTradeOfferWindow.document.querySelector('.btn_green_steamui');

                            generateButtonClickInRandomPosition(rejectTradeOfferWindow, declineButton);

                            rejectTradeObserver.disconnect();

                        }, getRandomNumberInRange(2000, 4000));
                    });
                    rejectTradeObserver.observe(rejectTradeOfferWindow.document, {childList: true, subtree: true});

                    generateButtonClickInRandomPosition(rejectTradeOfferWindow, rejectOfferButton);

                    setTimeout( () => {
                        rejectTradeOfferWindow.close();
                    }, getRandomNumberInRange(4000, 6000));

                }, getRandomNumberInRange(1000, 5000));
            });
        }
    }

    function generateButtonClickInRandomPosition(window, buttonElem) {
            const buttonCoords = buttonElem.getBoundingClientRect();
            
            const buttonXCoords = getRandomNumberInRange(Math.ceil(buttonCoords.x), Math.floor(buttonCoords.right));
            const buttonYCoords = getRandomNumberInRange(Math.ceil(buttonCoords.y), Math.floor(buttonCoords.bottom));

            const customClickEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'screenX': buttonXCoords,
                'screenY': buttonYCoords
            });

            buttonElem.dispatchEvent(customClickEvent);
    }

    function getActiveOffers(tradeOffers) {
        const uniqueTradeOffers = [];
        for (let tradeOffer of tradeOffers) {
            if (tradeOffer.querySelector('.tradeoffer_items_ctn').classList.contains('active')) {
                uniqueTradeOffers.push(tradeOffer);
            }
        }

        return uniqueTradeOffers;
    }

    function getRandomNumberInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}