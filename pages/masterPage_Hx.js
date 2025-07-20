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
        this.Search = page.locator("//span[text()='Menu Search']/parent::div");
        this.SearchBox = page.locator("//input[@id='uxxSearchInput']");
      //  this.SearchResult = page.locator('xpath=//*[@class="uxxAppMenuList" and contains(., "PJMBASIC")]');
        this.recentActivityHeader = page.locator('#uxxappHist').getByText('Recent Activity');
 
    }
 
     async waitForPageLoad() {
        // Wait for page to stabilize after login with extended timeout
        await this.page.waitForTimeout(10000);
        await this.page.waitForLoadState('load');
        // Check for Recent Activity with extended timeout
        //await expect(this.recentActivityHeader).toBeVisible({ timeout: 15000 });
        await this.page.waitForTimeout(10000);
    }
 
    //async searchKeywords(param1: string){
    async searchApplication_MenuSearch(SearchApp){
        console.log("searching the app")
        // Wait for Menu Search to be visible and click it
        //await this.Search.waitFor({ state: 'visible', timeout: 15000 });
        await this.Search.waitFor({ state: 'visible' });
        await this.Search.hover();
        await this.Search.click();
        await this.page.waitForTimeout(5000);
        // Click on the SVG icons as shown in codegen
        await this.SearchBox.fill(SearchApp);
        const locator = await this.getDynamicXPathLocator(SearchApp);
        await this.page.waitForTimeout(2000);
        await locator.first().click();
        // Click on the search input
        // await this.page.locator('#uxxAppSearch').click();
        // await this.SearchBox.fill(SearchApp);
        // await this.SearchResult.nth(1).click();        
    }
 
}
module.exports = { masterPage_Hx };
 