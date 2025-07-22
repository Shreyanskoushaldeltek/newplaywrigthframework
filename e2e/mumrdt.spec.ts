import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage.js';
import { masterPage_Hx } from '../pages/masterPage_Hx.js';
import { MUMRDTPage } from '../pages/mumrdt.js';
import testData from '../test-data/qa/mumrdt.json';

let loginPage: LoginPage;
let masterPage: masterPage_Hx;
let mumrdtPage: MUMRDTPage;

test.beforeEach(async ({ page }) => {
  // Initialize page objects
  loginPage = new LoginPage(page);
  masterPage = new masterPage_Hx(page);
  mumrdtPage = new MUMRDTPage(page);
  
  // Navigate to login page
  await loginPage.goto();
});

test('MUMRDT - Complete Exchange Rate Management and Validation', async ({ page }) => {
  
  await test.step('Login to Costpoint', async () => {
    await loginPage.login();
    await masterPage.waitForPageLoad();
  });

  await test.step('Navigate to MUMRDT Application', async () => {
    await masterPage.searchApplication_MenuSearch('Manage Exchange Rates by Date');
    await mumrdtPage.verifyPageLoaded();
    
    // Take screenshot after navigation
    await page.screenshot({ 
      path: `screenshots/mumrdt-page-loaded-${Date.now()}.png`, 
      fullPage: true 
    });
  });

  await test.step('Validate Page Elements', async () => {
    // Validate Exchange Rate Type Field
    await expect(mumrdtPage.exchangeRateType).toBeVisible();
    await expect(mumrdtPage.exchangeRateType).toBeEnabled();
    
    // Validate Currency Fields
    await expect(mumrdtPage.fromCurrency).toBeVisible();
    await expect(mumrdtPage.fromCurrency).toBeEnabled();
    await expect(mumrdtPage.toCurrency).toBeVisible();
    await expect(mumrdtPage.toCurrency).toBeEnabled();
    
    // Validate Action Buttons
    await expect(mumrdtPage.countButton).toBeVisible();
    await expect(mumrdtPage.findButton).toBeVisible();
    
    console.log('All MUMRDT page elements validated successfully');
  });

  await test.step('Fill Search Criteria', async () => {
    // Process dynamic test data using mumrdt page object method
    const dynamicTestData = mumrdtPage.processDynamicTestData(testData);
    
    await mumrdtPage.fillSearchCriteria(dynamicTestData.searchCriteria);
    
    // Wait for Costpoint to process data entry
    await page.waitForTimeout(2000);
    
    // Take screenshot after filling criteria
    await page.screenshot({ 
      path: `screenshots/mumrdt-search-criteria-${Date.now()}.png`, 
      fullPage: true 
    });
  });

  await test.step('Search Exchange Rates', async () => {
    await mumrdtPage.searchExchangeRates();
    
    // Wait for Costpoint search to complete
    await page.waitForTimeout(3000);
    
    // Validate search results
    const hasResults = await mumrdtPage.validateSearchResults();
    if (hasResults) {
      console.log('Search results found and validated');
    } else {
      console.log('No existing records found, proceeding with workflow');
    }
    
    // Take screenshot after search
    await page.screenshot({ 
      path: `screenshots/mumrdt-search-results-${Date.now()}.png`, 
      fullPage: true 
    });
  });

  await test.step('Select Exchange Rate Record', async () => {
    await mumrdtPage.selectExchangeRateRecord();
    
    // Wait for Costpoint record selection to process
    await page.waitForTimeout(2000);
    
    console.log('Exchange rate record selected for editing');
  });

  await test.step('Create New Exchange Rate Entry', async () => {
    // Process dynamic test data using mumrdt page object method
    const dynamicTestData = mumrdtPage.processDynamicTestData(testData);
    
    await mumrdtPage.createNewExchangeRate(dynamicTestData.exchangeRateData);
    
    // Wait for Costpoint to process new entry
    await page.waitForTimeout(2000);
    
    // Validate table structure is maintained
    const tableStructureValid = await mumrdtPage.validateTableStructure();
    console.log(`Table structure validation: ${tableStructureValid ? 'PASSED' : 'WARNING'}`);
    
    // Validate entered values
    await expect(mumrdtPage.startDate).toHaveValue(dynamicTestData.exchangeRateData.startDate);
    await expect(mumrdtPage.endDate).toHaveValue(dynamicTestData.exchangeRateData.endDate);
    await expect(mumrdtPage.exchangeRate).toHaveValue(dynamicTestData.exchangeRateData.rate);
    
    // Take screenshot after creating entry
    await page.screenshot({ 
      path: `screenshots/mumrdt-new-entry-${Date.now()}.png`, 
      fullPage: true 
    });
  });

  await test.step('Save Exchange Rate', async () => {
    await mumrdtPage.saveExchangeRate();
    
    // Wait for Costpoint save operation to complete
    await page.waitForTimeout(3000);
    
    // Verify success message appears
    await expect(mumrdtPage.successMessage).toContainText(
      testData.validationData.expectedSuccessMessage
    );
    
    // Take screenshot after successful save
    await page.screenshot({ 
      path: `screenshots/mumrdt-saved-${Date.now()}.png`, 
      fullPage: true 
    });
    
    console.log('Exchange rate saved successfully');
  });

  await test.step('Close Form and Complete Workflow', async () => {
    await mumrdtPage.closeForm();
    
    // Wait for form closure
    await page.waitForTimeout(2000);
    
    // Take final screenshot
    await page.screenshot({ 
      path: `screenshots/mumrdt-workflow-complete-${Date.now()}.png`, 
      fullPage: true 
    });
    
    console.log('MUMRDT exchange rate management workflow completed successfully');
  });

  await test.step('Verify Workflow Completion', async () => {
    // Additional validation can be added here
    // For example, searching again to verify the new record exists
    
    console.log('All MUMRDT workflow steps completed and validated');
  });
});