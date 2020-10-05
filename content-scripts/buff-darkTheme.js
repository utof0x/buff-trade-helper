{
    async function enableDarkTheme() {
        const data = new Promise(function(resolve, reject){ // get user settings(darkTheme)
            chrome.storage.local.get('darkTheme', function(result){
                resolve(result.darkTheme);
            })
        });

        const darkTheme = await data;
        if(!darkTheme) return; // if user disabled function -> return

        const steamThemeStyles = document.createElement('style');

        steamThemeStyles.innerHTML = `  
            * {
                color: #d2d2c8 !important;
            }

            body, .csgo {
                background-image: none;
            }

            .header, .blank20, .cru.black.l_Layout,
            #loading-cover, .market-list, 
            .market-card, l_Layout, .csgo, .dota2 {
                background: #1b2838;
            }

            .cru {
                margin: 0 auto;
                padding: 0 30% 0 29.1%;
            }

            .list_card li {
                background: #16202d;
                border: none;
            }

            .c_Gray{
                color: #d2d2c8 !important;
            }

            .list_card li:hover, .list_card h3 a:hover, 
            .list_card h3:hover, .list_card p:hover,
            .pager li, .pager li.disabled *,
            .detail-tab-cont, .stickers img, 
            .list_tb tr:hover, .list_tb th {
                background: #16202d !important;
            }

            .stickers {
                height: 40px;
                width: 50px; 
            }

            .csgo_sticker .stickers img, 
            .csgo_sticker_inline .stickers img {
                height: 40px;
                width: 50px;
            }

            .list_card li.on {
                background: #53a567ff; 
            }

            .f_Strong, big, small {
                color: #da291cff !important;
            }

            .textOne {
                color: #53a567ff !important;
            }

            .popup-header,
            .list_tb-body,
            .list_tb-body input,
            .list_tb-body input:focus,
            .popup_common, .popup,
            .popup .popup-tip, .popup-cont,
            .popup-good-summary, 
            .popup-cont input,
            .popup-cont input:focus, 
            .popup-cont .i_Btn_hollow,
            .epay ul li:hover {
                background: #1b2838 !important;
            }
        `;

        document.querySelector('head').insertAdjacentElement('beforeend', steamThemeStyles);  // append styles to head tag
    }

    enableDarkTheme(); // call main function
}