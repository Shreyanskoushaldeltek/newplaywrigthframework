// Inlcude playwright module
const { expect } = require('@playwright/test')

// create class
exports.HomePage = class HomePage {

    /**
     * 
     * @param {import ('@playwright/test').Page} page 
     */
    constructor(page){
        // Init page object
        this.page = page;

        // Elements
        this.searchTextbox = page.locator('#APjFqb');
        this.Notification = page.locator("//div[text()='Allow Notifications?']");
        this.MaybeLater = page.locator("#pdlgNo");
        this.ImproveUserExperience = page.locator("//div[text()='Improve User Experience']");
    }

    async ManageNotification(){
           await this.Notification.waitFor({ state: 'visible' });
           await this.MaybeLater.click();
           try{
                await this.ImproveUserExperience.waitFor({ state: 'visible' , timeout: 5000});
                await this.MaybeLater.click();
           }
           catch(error){
                console.log(error.message);
           }
    }

    async searchKeywords(param1){
        await expect(this.searchTextbox).toBeEnabled();
        await this.searchTextbox.click();
        await this.searchTextbox.fill(param1);
        await this.searchTextbox.press('Enter');
    }

}