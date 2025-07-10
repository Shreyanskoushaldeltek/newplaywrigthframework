const { expect } = require('@playwright/test')

// create class
exports.LoginPage = class LoginPage {

    /**
     * 
     * @param {import ('@playwright/test').Page} page 
     */
    constructor(page){
        // Init page object
        this.page = page;

        // Elements
        this.Username = page.locator('#USER');
        this.EnterPassword = page.locator('#btnPromptPwd');
        this.Password = page.locator('#CLIENT_PASSWORD');
        this.LoginButton = page.locator('#loginBtn')
    }

    async goto(){
        await this.page.setViewportSize({width:1366, height:728})
        await this.page.goto(process.env.URL);
    }

    async login(){
        await this.EnterPassword.click();
        await this.Username.fill(process.env.USER_NAME);
        await this.Password.fill(process.env.PASSWORD);
        await this.LoginButton.click();
    }
}