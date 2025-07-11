import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { HomePage } from '../pages/homepage';

test('Navigate to PJMBASIC via Menu Search', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  
  // Navigate to login page using .env URL
  await loginPage.goto();
  
  // Perform login using .env credentials
  await loginPage.login();
  
  // Wait for login to complete and page to load
  await page.waitForLoadState('networkidle');
  
  // Handle any notifications if they appear
  try {
    await homePage.ManageNotification();
  } catch (error) {
    console.log('No notifications to handle');
  }
  
  // Close Welcome to Harmony popup if it appears
  try {
    await page.locator("text=Welcome to Harmony").waitFor({ timeout: 5000 });
    await page.locator("button:has-text('Close'), button:has-text('X'), .close-button").first().click();
  } catch (error) {
    console.log('No Welcome to Harmony popup to close');
  }
  
  // Navigate to Menu and search for PJMBASIC
  await homePage.searchForPJMBASIC();
  
  // Wait for PJMBASIC page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot for verification
  await page.screenshot({ path: 'pjmbasic-navigation.png' });
  
  console.log('Successfully navigated to PJMBASIC');
});