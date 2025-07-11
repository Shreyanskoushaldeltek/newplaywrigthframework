// Inlcude playwright module

const { expect } = require('@playwright/test')
import { Page } from '@playwright/test';
import BasePage from '../utils/BasePage';
// create class
export class HomePage extends BasePage{
    searchTextbox: any;
    Notification: any;
    MaybeLater: any;
    ImproveUserExperience: any;
    Search: any;

    /**
     * 
     * @param {import ('@playwright/test').Page} page 
     */
    constructor(page: Page){
        // Init page object
        super(page);
        // Elements
        this.searchTextbox = page.locator('#APjFqb');
        this.Notification = page.locator("//div[text()='Allow Notifications?']");
        this.MaybeLater = page.locator("#pdlgNo");
        this.ImproveUserExperience = page.locator("//div[text()='Improve User Experience']");
        this.Search = page.locator("//input[@id='appFltrFld']");
    }

    async ManageNotification(){
           await this.Notification.waitFor({ state: 'visible' });
           await this.MaybeLater.click();
           try{
                await this.ImproveUserExperience.waitFor({ state: 'visible' , timeout: 5000});
                await this.MaybeLater.click();
           }
           catch(error){
                console.log((error as Error).message);
           }
    }

    async searchKeywords(param1: string){
        console.log("searching the app")
        await this.Search.click();
        await this.Search.fill(param1);
        const locator = await this.getDynamicXPathLocator(param1);
        await locator.click();
    }

}