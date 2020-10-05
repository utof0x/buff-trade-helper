{
    try {
        addInspectAllButton();  // call main function 
    } catch (error) {
        console.error(error);
    }

    async function addInspectAllButton() {
        const data = new Promise(function(resolve, reject){  // get user settings(inspectButton)
            chrome.storage.local.get('inspectButton', function(result){
                resolve(result.inspectButton);
            })
        });
        
        const addInspectAllButton = await data;
        if (!addInspectAllButton) return;  // if user disable function -> return

        const header = document.querySelector('.block-header');
        const rightButtonsTab = header.querySelector('.l_Right');
        const currentUrl = document.location.href;  // get current url
        const inspectAllButton = document.createElement('button');
        inspectAllButton.className = 'inspect-all-button';
        inspectAllButton.innerHTML = 'Inspect all';

        if(!currentUrl.includes('game=csgo')) return;  // if not csgo market/inventory page
    
        rightButtonsTab.insertAdjacentElement('afterbegin', inspectAllButton);
        inspectAllButton.addEventListener('click', inspectItems)
    }

    function inspectItems() {
        const defaultInsectButtons = document.querySelectorAll('a.l_Right.shalow-btn.csgo-inspect');

        for (let button of defaultInsectButtons) {  // for all 'inspect' buttons
            button.click();  // generate click
        }
    }
}