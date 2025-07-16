import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { masterPage_Hx } from '../pages/masterPage_Hx.js';
import { PJMBasicPage } from '../pages/pjmbasicPage.js';
import testData from '../test-data/qa/pjmbasic.json';

let loginPage: LoginPage;
let masterPage: masterPage_Hx;
let pjmBasicPage: PJMBasicPage;

test.describe('PJMBASIC - Project Basic Information Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    masterPage = new masterPage_Hx(page);
    pjmBasicPage = new PJMBasicPage(page);
    
    // Navigate to login page
    await loginPage.goto();
  });

  test('PJMBASIC - Create Project with Basic Information', async ({ page }) => {
    
    await test.step('Login to Costpoint', async () => {
      await loginPage.login();
      await masterPage.waitForPageLoad();
    });

    await test.step('Navigate to PJMBASIC Application', async () => {
      await masterPage.searchApplication_MenuSearch('PJMBASIC');
      await pjmBasicPage.verifyPageLoaded();
    });

    await test.step('Create Project with Basic Information', async () => {
      await pjmBasicPage.createProject(testData);
    });

    await test.step('Verify Project Creation Success', async () => {
      await expect(pjmBasicPage.resultMessage).toContainText(
        testData.validationData.expectedSuccessMessage
      );
      
      // Take screenshot for verification
      await page.screenshot({ 
        path: `screenshots/pjmbasic-success-${Date.now()}.png`, 
        fullPage: true 
      });
    });
  });

  test('PJMBASIC - Create Project with Minimal Required Fields', async ({ page }) => {
    
    const minimalData = {
      basicInfo: {
        projectId: 'MIN001',
        projectName: 'Minimal Test Project',
        description: 'Minimal test description'
      },
      characteristics: {
        active: true,
        billing: false,
        timesheet: false
      }
    };

    await test.step('Login to Costpoint', async () => {
      await loginPage.login();
      await masterPage.waitForPageLoad();
    });

    await test.step('Navigate to PJMBASIC Application', async () => {
      await masterPage.searchApplication_MenuSearch('PJMBASIC');
      await pjmBasicPage.verifyPageLoaded();
    });

    await test.step('Create Project with Minimal Data', async () => {
      await pjmBasicPage.fillProjectBasicInfo(minimalData.basicInfo);
      await pjmBasicPage.setProjectCharacteristics(minimalData.characteristics);
      await pjmBasicPage.saveProject();
    });
  });

  test('PJMBASIC - Field Validation Tests', async ({ page }) => {
    
    await test.step('Login to Costpoint', async () => {
      await loginPage.login();
      await masterPage.waitForPageLoad();
    });

    await test.step('Navigate to PJMBASIC Application', async () => {
      await masterPage.searchApplication_MenuSearch('PJMBASIC');
      await pjmBasicPage.verifyPageLoaded();
    });

    await test.step('Test Project ID Field', async () => {
      // Test project ID field is visible and enabled
      await expect(pjmBasicPage.projectId).toBeVisible();
      await expect(pjmBasicPage.projectId).toBeEnabled();
      
      // Test filling project ID
      await pjmBasicPage.projectId.fill('TEST123');
      await expect(pjmBasicPage.projectId).toHaveValue('TEST123');
    });

    await test.step('Test Project Name Field', async () => {
      // Test project name field functionality
      await expect(pjmBasicPage.projectName).toBeVisible();
      await pjmBasicPage.projectName.fill('Test Project Name');
      await expect(pjmBasicPage.projectName).toHaveValue('Test Project Name');
    });
  });

  test.afterEach(async ({ page }) => {
    // Clean up actions if needed
    await page.waitForTimeout(2000);
  });
});