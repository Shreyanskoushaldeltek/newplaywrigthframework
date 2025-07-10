import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homepage';

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  // Initialize your page objects here
  
  loginPage = new LoginPage(page);
  await loginPage.goto();
  homePage = new HomePage(page);

  // Optionally navigate or login automatically
});

test('Login to the System', async ({ page }) => {
    await loginPage.login();
    await homePage.ManageNotification();
});