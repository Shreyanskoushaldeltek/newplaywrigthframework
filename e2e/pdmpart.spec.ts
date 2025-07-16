import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import  { HomePage }  from '../pages/homepage';
import  { PDMPART }  from '../pages/pdmpart';
import {masterPage_Hx} from '../pages/masterPage_Hx';

let loginPage: LoginPage;
let homePage: HomePage;
let pdmpart: PDMPART;
let masterhx: masterPage_Hx;

test.beforeEach(async ({ page }) => {
  // Initialize your page objects here
  
  loginPage = new LoginPage(page);
  await loginPage.goto();
  homePage = new HomePage(page);
  pdmpart = new PDMPART(page);
  masterhx = new masterPage_Hx(page);

  // Optionally navigate or login automatically
});


test('PDMPART data creation', async ({ page }) => {
    await test.step('Login to Costpoint', async () => {
      await loginPage.login();
      await homePage.ManageNotification();
  });
    await test.step('Select the Application', async () => {
     // await homePage.searchKeywords("PDMPART");
      await masterhx.searchApplication_MenuSearch("PDMPART");
      await page.waitForTimeout(20000);
  });
    await test.step('Create Part', async () => {
      await pdmpart.FillDetails();
  });
});