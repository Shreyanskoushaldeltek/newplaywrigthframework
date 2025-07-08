import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { MasterPage } from '../pages/masterPage';
import { PDMPARTPage } from '../pages/pdmpartPage';
import { BasePage } from '../utils/BasePage';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import test data files
import qaTestData from '../test-data/qa/pdmpart.json';
import stageTestData from '../test-data/stage/pdmpart.json';

// Select test data based on environment
const testData = process.env.ENV === 'qa' ? qaTestData : stageTestData;

test.describe('PDMPART - Manage Parts Functionality', () => {
    let loginPage: any;
    let masterPage: any;
    let pdmpartPage: any;
    let basePage: BasePage;

    test.beforeEach(async ({ page }) => {
        // Initialize page objects
        loginPage = new LoginPage(page);
        masterPage = new MasterPage(page);
        pdmpartPage = new PDMPARTPage(page);
        basePage = new BasePage(page);

        // Setup dialog handler for unexpected dialogs
        page.on('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
    });

    test('Create and verify new part with full configuration', async ({ page }) => {
        await test.step('Login to Costpoint', async () => {
            await loginPage.goto();
            await loginPage.performLogin();
        });

        await test.step('Navigate to PDMPART application', async () => {
            await masterPage.waitForPageLoad();
            await masterPage.searchAndNavigateToApplication('Manage Parts');
        });

        await test.step('Verify PDMPART page loaded', async () => {
            await pdmpartPage.waitForPageLoad();
        });

        await test.step('Fill basic part information', async () => {
            const randomPartId = await basePage.generateRandomValue(10, 'PART');
            const partData = {
                ...testData.partData,
                partId: randomPartId
            };
            await pdmpartPage.fillBasicPartInfo(partData);
        });

        await test.step('Configure part characteristics', async () => {
            await pdmpartPage.configureCharacteristics(testData.characteristics);
        });

        await test.step('Configure serial lot information', async () => {
            await pdmpartPage.configureSerialLotInfo(testData.serialLotInfo);
            await pdmpartPage.handleLastLotLookup();
        });

        await test.step('Add part comments', async () => {
            await pdmpartPage.addComments(testData.partData.comments);
        });

        await test.step('Save part record', async () => {
            await pdmpartPage.saveRecord();
        });

        await test.step('Verify units of measure configuration', async () => {
            await pdmpartPage.verifyUnitsOfMeasure(testData.partData.unitOfMeasure);
        });

        await test.step('Verify user-defined information', async () => {
            await pdmpartPage.verifyUserDefinedInfo();
        });

        await test.step('Navigate to vendors tab', async () => {
            await pdmpartPage.navigateToVendorsTab();
        });

        await test.step('Configure item billings', async () => {
            await pdmpartPage.configureItemBillings('Inventory');
        });

        await test.step('Navigate to manufacturing BOM', async () => {
            await pdmpartPage.navigateToManufacturingBOM();
        });

        await test.step('Navigate through other tabs', async () => {
            await pdmpartPage.navigateToOtherTabs();
        });

        await test.step('Verify item billings data', async () => {
            await pdmpartPage.verifyItemBillings({
                description: testData.partData.description,
                notes: testData.partData.comments
            });
        });

        await test.step('Cleanup and close application', async () => {
            await pdmpartPage.closeAllDialogs();
        });

        await test.step('Logout from application', async () => {
            await masterPage.logout();
        });
    });

    test('Verify part search and query functionality', async ({ page }) => {
        await test.step('Login to Costpoint', async () => {
            await loginPage.goto();
            await loginPage.performLogin();
        });

        await test.step('Navigate to PDMPART application', async () => {
            await masterPage.waitForPageLoad();
            await masterPage.searchAndNavigateToApplication('Manage Parts');
        });

        await test.step('Test part search with no results', async () => {
            await pdmpartPage.waitForPageLoad();
            await pdmpartPage.performPartQuery(testData.queryTest.testValue);
        });

        await test.step('Logout from application', async () => {
            await pdmpartPage.closeAllDialogs();
            await masterPage.logout();
        });
    });

    test('Part creation with minimal data', async ({ page }) => {
        await test.step('Login to Costpoint', async () => {
            await loginPage.goto();
            await loginPage.performLogin();
        });

        await test.step('Navigate to PDMPART application', async () => {
            await masterPage.waitForPageLoad();
            await masterPage.searchAndNavigateToApplication('Manage Parts');
        });

        await test.step('Fill minimal part information', async () => {
            await pdmpartPage.waitForPageLoad();
            
            const randomPartId = await basePage.generateRandomValue(10, 'PART');
            const minimalPartData = {
                partId: randomPartId,
                description: `Minimal Part Test ${Date.now()}`
            };
            
            await pdmpartPage.fillBasicPartInfo(minimalPartData);
        });

        await test.step('Set minimal characteristics', async () => {
            const minimalCharacteristics = {
                unitOfMeasure: 'EA',
                active: true
            };
            
            await pdmpartPage.configureCharacteristics(minimalCharacteristics);
        });

        await test.step('Save minimal part record', async () => {
            await pdmpartPage.saveRecord();
        });

        await test.step('Cleanup and logout', async () => {
            await pdmpartPage.closeAllDialogs();
            await masterPage.logout();
        });
    });
});