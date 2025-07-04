// pages/masterPage.js
const { expect } = require('@playwright/test');

exports.MasterPage = class MasterPage {
    constructor(page) {
        this.page = page;
        
        // Master page elements
        this.recentActivityHeader = page.locator('#appHist').getByText('Recent Activity');
        this.globalSearchField = page.getByPlaceholder('Use CTRL+S to search');
        this.logoutButton = page.locator('#wMnuTitle').getByTitle('Log Out');
    }

    async waitForPageLoad() {
        // Wait for page to stabilize after login with extended timeout
        await this.page.waitForTimeout(3000);
        
        // Check for Recent Activity with extended timeout
        await expect(this.recentActivityHeader).toBeVisible({ timeout: 15000 });
        await expect(this.globalSearchField).toBeVisible({ timeout: 10000 });
        
        // Additional wait to ensure page is fully loaded
        await this.page.waitForTimeout(2000);
    }

    async searchAndNavigateToApplication(searchTerm) {
        await expect(this.globalSearchField).toBeVisible({ timeout: 10000 });
        await this.globalSearchField.click();
        
        // Wait for search field to be ready
        await this.page.waitForTimeout(1000);
        await this.globalSearchField.fill(searchTerm);
        
        // Wait for search results to appear with extended timeout
        await this.page.waitForTimeout(2000);
        
        // Click on the matching application with extended timeout
        const searchResult = this.page.getByText(`${searchTerm} (PDMPART)`);
        await expect(searchResult).toBeVisible({ timeout: 15000 });
        await searchResult.click();
        
        // Wait for navigation to complete
        await this.page.waitForTimeout(3000);
    }

    async logout() {
        await this.logoutButton.click();
    }
};