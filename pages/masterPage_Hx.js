// // Inlcude playwright module


const { expect } = require('@playwright/test');
import BasePage from '../utils/BasePage';

export class masterPage_Hx extends BasePage {
    
  constructor(page) {
    super(page);

    // Page instance
    this.page = page;
       // // Elements//
        this.searchTextbox = page.locator('#APjFqb');
      //  this.Notification = page.locator("//div[text()='Allow Notifications?']");
       // this.MaybeLater = page.locator("#pdlgNo");
       // this.ImproveUserExperience = page.locator("//div[text()='Improve User Experience']");
        this.Search = page.locator("//span[text()='Menu Search']");
        this.SearchBox = page.getByRole('textbox', { name: 'Search...' })
        this.SearchResult = page.locator('xpath=//*[@class="uxxAppMenuList" and contains(., "PJMBASIC")]');
        this.recentActivityHeader = page.locator('#uxxAppHist').getByText('Recent Activity');

    }

     async waitForPageLoad() {
        // Wait for page to stabilize after login with extended timeout
        await this.page.waitForTimeout(20000);
        
        // Check for Recent Activity with extended timeout
        await this.page.waitForSelector('text="Recent Activity"');        // Additional wait to ensure page is fully loaded
        await this.page.waitForTimeout(15000);
    }

    //async searchKeywords(param1: string){
    async searchApplication_MenuSearch(SearchApp){
        console.log("searching the app")
        await this.Search.click();
        await this.SearchBox.click();
        await this.SearchBox.fill(SearchApp);
        await this.SearchResult.nth(1).click();        
    }

}
module.exports = { masterPage_Hx };