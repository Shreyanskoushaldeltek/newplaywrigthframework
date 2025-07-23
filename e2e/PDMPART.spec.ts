import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import  { HomePage }  from '../pages/homepage';
import  { PDMPART }  from '../pages/pdmpart';

let loginPage: LoginPage;
let homePage: HomePage;
let pdmpart: PDMPART;

test.beforeEach(async ({ page }) => {
  // Initialize your page objects here
  
  loginPage = new LoginPage(page);
  await loginPage.goto();
  homePage = new HomePage(page);
  pdmpart = new PDMPART(page);

  // Optionally navigate or login automatically
});


test('PDMPART data creation', async ({ page }) => {
    await test.step('Login to Costpoint', async () => {
      await loginPage.login();
      await homePage.ManageNotification();
  });
    await test.step('Select the Application', async () => {
      await homePage.searchKeywords("PDMPART");
  });
    await test.step('Create Part', async () => {
      await pdmpart.FillDetails();
  });
});