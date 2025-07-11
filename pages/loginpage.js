// import { Page,expect } from '@playwright/test';

// // create class
// export class LoginPage{
//     Username: any;
//     EnterPassword: any;
//     Password: any;
//     LoginButton: any;
//     page: Page;

//     /**
//      * 
    
//      */
//     constructor(page: Page){
        // Init page object

const { expect } = require('@playwright/test');

export class LoginPage {
  constructor(page) {        
        this.page = page;

        // Elements
        this.Username = page.locator('#USER');
        this.EnterPassword = page.locator('#btnPromptPwd');
        this.Password = page.locator('#CLIENT_PASSWORD');
        this.LoginButton = page.locator('#loginBtn')
    }

    async goto(){
        await this.page.setViewportSize({width: 1720, height: 1080})
        await this.page.goto(process.env.URL);
    }

    async login(){
        await this.EnterPassword.click();
        await this.Username.fill(process.env.USER_NAME);
        await this.Password.fill(process.env.PASSWORD);
        await this.LoginButton.click();
    }
}