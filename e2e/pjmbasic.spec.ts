import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage.js';
import { masterPage_Hx } from '../pages/masterPage_Hx.js';
import { PJMBasicPage } from '../pages/pjmbasicPage.js';
import testData from '../test-data/qa/pjmbasic.json';

let loginPage: LoginPage;
let masterPage: masterPage_Hx;
let pjmBasicPage: PJMBasicPage;

test.beforeEach(async ({ page }) => {
  // Initialize page objects
  loginPage = new LoginPage(page);
  masterPage = new masterPage_Hx(page);
  pjmBasicPage = new PJMBasicPage(page);
  
  // Navigate to login page
  await loginPage.goto();
});

test('PJMBASIC - Complete Project Creation and Validation', async ({ page }) => {
  
  await test.step('Login to Costpoint', async () => {
    await loginPage.login();
    await masterPage.waitForPageLoad();
  });

  await test.step('Navigate to PJMBASIC Application', async () => {
    await masterPage.searchApplication_MenuSearch('Manage Project User Flow');
    await pjmBasicPage.verifyPageLoaded();
  });

  await test.step('Validate Page Elements', async () => {
    // Validate Project ID Field
    await expect(pjmBasicPage.projectId).toBeVisible();
    await expect(pjmBasicPage.projectId).toBeEnabled();
    
    // Validate Project Name Field
    await expect(pjmBasicPage.projectName).toBeVisible();
    await expect(pjmBasicPage.projectName).toBeEnabled();
    
    // Validate Project Type Dropdown
    await expect(pjmBasicPage.projectTypeDropdown).toBeVisible();
    await expect(pjmBasicPage.projectTypeDropdown).toBeEnabled();
    
    // Validate Checkboxes
    await expect(pjmBasicPage.billProjectCheckbox).toBeVisible();
    await expect(pjmBasicPage.allowChargesCheckbox).toBeVisible();
    
    console.log('All page elements validated successfully');
  });

  await test.step('Fill Basic Project Information', async () => {
    await pjmBasicPage.fillBasicProjectInfo(testData.basicInfo);
    
    // Take screenshot after basic info
    await page.screenshot({ 
      path: `screenshots/pjmbasic-basic-info-${Date.now()}.png`, 
      fullPage: true 
    });
  });

  await test.step('Configure Project Type and Settings', async () => {
    await pjmBasicPage.configureProjectType(testData.projectSettings);
    
    // Verify expected values
    await expect(pjmBasicPage.accountGroupCode).toHaveValue(testData.projectSettings.expectedAccountGroup);
    await expect(pjmBasicPage.organizationId).toHaveValue(testData.projectSettings.expectedOrganization);
  });

  await test.step('Navigate Additional Tabs', async () => {
    await pjmBasicPage.navigateAdditionalTabs();
    console.log('Additional tabs navigation completed');
  });

  await test.step('Configure User Defined Information', async () => {
    await pjmBasicPage.configureUserDefinedInfo();
    console.log('User defined information configured');
  });

  await test.step('Handle Project Levels with Dialog', async () => {
    await pjmBasicPage.handleProjectLevels();
    console.log('Project levels handled with dialog');
  });

  await test.step('Add Project Notes', async () => {
    await pjmBasicPage.addProjectNotes(testData.notes);
    
    // Verify notes were added
    await expect(pjmBasicPage.notesTextArea).toHaveValue(testData.notes);
  });

  await test.step('Save Project', async () => {
    await pjmBasicPage.saveProject();
    
    // Take screenshot after save
    await page.screenshot({ 
      path: `screenshots/pjmbasic-saved-${Date.now()}.png`, 
      fullPage: true 
    });
    
    console.log('Project saved successfully');
  });

  await test.step('Close Project Form', async () => {
    await pjmBasicPage.closeProject();
    console.log('Project form closed');
  });

  await test.step('Verify Project Creation Complete', async () => {
    // Take final screenshot
    await page.screenshot({ 
      path: `screenshots/pjmbasic-complete-${Date.now()}.png`, 
      fullPage: true 
    });
    
    console.log('PJMBASIC project creation workflow completed successfully');
  });
});