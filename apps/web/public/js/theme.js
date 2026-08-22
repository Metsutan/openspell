(() => {
    try {

        const isSelectedClassName = 'is-selected';
        const siteThemeKey = 'site-theme2';
        const selectThemeButton = document.getElementById('select-theme-button');
        const selectThemeMenuList = document.getElementById('select-theme-menu__list');
        const bodyElement = document.getElementsByTagName('body')[0];
        const selectThemeMenuListItems = document.getElementsByClassName('select-theme-menu__list-item');

        let menuHeight = 0;
        let isShowingSelectThemeMenu = false;

        /**
         * Removes all theme classes from the body element.
         */
        const removeThemeFromBody = () => {
            if (selectThemeMenuListItems && bodyElement) {
                for (let i = 0; i < selectThemeMenuListItems.length; i++) {
                    let themeName = selectThemeMenuListItems[i].dataset.themeName;
                    if (bodyElement.classList && bodyElement.classList.contains(themeName)) {
                        bodyElement.classList.remove(themeName);
                    }
                }
            }
        };

        /**
         * removes the current theme from the class list of the <body> tag and menu items.
         */
        const removeTheme = () => {

            // Loop through all theme items in the theme dropdown list:
            for (let i = 0; i < selectThemeMenuListItems.length; i++) {

                // Get the name of the theme for this item in the theme dropdown list:
                let themeName = selectThemeMenuListItems[i].dataset.themeName;

                // If this item is currently selected, make sure it is no longer selected.
                if (selectThemeMenuListItems[i].classList && selectThemeMenuListItems[i].classList.contains(isSelectedClassName)) {
                    selectThemeMenuListItems[i].classList.remove(isSelectedClassName);
                }

                // If the body class list contains the name of theme from this item, remove it:
                if (bodyElement.classList && bodyElement.classList.contains(themeName)) {
                    bodyElement.classList.remove(themeName);
                }
            }
        };

        /**
         * Sets the theme in a cookie and localStorage.
         * @param {*} themeName The name of the theme to set.
         */
        const setThemeCookie = (themeName) => {
            try {
                // Use localStorage as primary storage (more reliable)
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem(siteThemeKey, themeName);
                }
                // Also save to cookie as fallback
                // Only use secure flag if we're on HTTPS
                const isSecure = window.location.protocol === 'https:';
                const secureFlag = isSecure ? ';secure' : '';
                document.cookie = siteThemeKey + '=' + themeName + ';path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT' + secureFlag;
            } catch (exception) {
                console.error('Error saving theme:', exception);
            }
        };

        /**
         * Gets the theme value from localStorage or cookie.
         */
        const getThemeCookieValue = () => {

            let themeName = '';

            try {
                // Try localStorage first (more reliable)
                if (typeof(Storage) !== "undefined") {
                    themeName = localStorage.getItem(siteThemeKey);
                    if (themeName) {
                        return themeName;
                    }
                }

                // Fallback to cookie
                if (document.cookie) {

                    let keyValues = document.cookie.split(';');
    
                    for (let i = 0; i < keyValues.length; i++) {
    
                        let trimmedKeyValuePair = keyValues[i].trim();

                        if (trimmedKeyValuePair.startsWith(siteThemeKey)) {
                            themeName = trimmedKeyValuePair.split('=')[1];
                            break;
                        }
                    }
                }
            } catch (exception) {
                console.error('Error reading theme:', exception);
            }

            return themeName;
        };

        /**
         * sets the new theme by adding the theme to the class list of the <body> tag, and saves the value in localStorage.
         * @param {*} themeName The name of the theme to set.
         */
        const setTheme = (themeName) => {

            // Remove the old theme:
            removeTheme();

            // Add the new theme:
            bodyElement.classList.add(themeName);

            // Save the theme:
            setThemeCookie(themeName);
            
            // Make sure the correct theme is selected in the theme dropdown list:
            for (let i = 0; i < selectThemeMenuListItems.length; i++) {

                if (selectThemeMenuListItems[i].dataset.themeName === themeName) {
                    selectThemeMenuListItems[i].classList.add(isSelectedClassName);
                }
            }
        };

        // get the theme from storage:
        let initialTheme = getThemeCookieValue();

        if (selectThemeMenuListItems) {

            // Loop through the theme list items:
            for (let i = 0; i < selectThemeMenuListItems.length; i++) {
                
                let themeName = selectThemeMenuListItems[i].dataset.themeName;

                // Set the initially selected theme item:
                if (themeName === initialTheme || (!initialTheme && i === 0)) {
                    selectThemeMenuListItems[i].classList.add(isSelectedClassName);
                    if (!initialTheme) {
                        initialTheme = themeName;
                    }
                }
                
                // calculate the height of this item to determine the full menu height:
                menuHeight += selectThemeMenuListItems[i].offsetHeight;

                // Add the onclick listener to change the theme:
                selectThemeMenuListItems[i].addEventListener('click', () => { setTheme(themeName); });
            }
        }

        // Apply the saved theme to the body element on page load
        if (initialTheme && bodyElement) {
            // Remove any existing theme classes first (without affecting menu selection)
            removeThemeFromBody();
            // Apply the saved theme
            bodyElement.classList.add(initialTheme);
        }

        if (selectThemeButton) {

            // Add the onclick listener for the Change Theme button:
            selectThemeButton.addEventListener('click', () => {
                try {

                    if (isShowingSelectThemeMenu) {
                        // Hide the select theme menu
                        selectThemeButton.classList.remove(isSelectedClassName);
                        selectThemeMenuList.style.height = '0';
                    } else {
                        // Show the select theme menu
                        selectThemeButton.classList.add(isSelectedClassName);
                        selectThemeMenuList.style.height = menuHeight + 'px';
                    }

                    isShowingSelectThemeMenu = !isShowingSelectThemeMenu;

                } catch (exception) {
                    console.error(exception);
                }
            });

        }

    } catch (exception) { console.error(exception); }
})();
