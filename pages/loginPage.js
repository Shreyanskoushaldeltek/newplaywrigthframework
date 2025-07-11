// pages/loginPage.js
const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
    constructor(page) {
        this.page = page;
        
        // Login form elements
        this.enterPasswordButton = page.getByRole('button', { name: 'ENTER PASSWORD' });
        this.usernameField = page.locator('#USER');
        this.passwordField = page.getByPlaceholder('Enter a valid password');
        this.additionalCriteriaButton = page.getByRole('button', { name: '+ ADDITIONAL CRITERIA' });
        this.loginButton = page.getByRole('button', { name: 'Log In' });
    }

    async goto() {
        const loginUrl = `${process.env.COSTPOINT_BASE_URL}/cploginform.htm?system=${process.env.SYSTEM_PARAM}`;
        await this.page.goto(loginUrl);
    }

    async performLogin(username = process.env.USERNAME, password = process.env.PASSWORD) {
        await expect(this.enterPasswordButton).toBeVisible({ timeout: 15000 });
        await this.enterPasswordButton.click();
        
        // Wait for login form to be ready
        await this.page.waitForTimeout(1000);
        
        await expect(this.usernameField).toBeVisible({ timeout: 10000 });
        await this.usernameField.fill(username);
        
        await expect(this.passwordField).toBeVisible({ timeout: 10000 });
        await this.passwordField.fill(password);
        
        // Wait before clicking additional criteria
        await this.page.waitForTimeout(500);
        await this.additionalCriteriaButton.click();
        
        // Wait before final login click
        await this.page.waitForTimeout(1000);
        await this.loginButton.click();
        
        // Wait for navigation to master page with extended timeout
        await this.page.waitForURL('**/masterPage.htm*', { timeout: 30000 });
        
        // Additional wait for page to fully load after navigation
        await this.page.waitForTimeout(3000);
    }
};