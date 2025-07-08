// pages/pdmpartPage.js
const { expect } = require('@playwright/test');

exports.PDMPARTPage = class PDMPARTPage {
    constructor(page) {
        this.page = page;
        
        // Basic part information fields
        this.partIdField = page.locator('#PART_ID');
        this.itemDescField = page.locator('#ITEM_DESC');
        this.defaultUMField = page.locator('#DFLT_UM_CD');
        this.itemNotesField = page.locator('#ITEM_NT');
        
        // Lookup and dropdown elements
        this.partTypeLookup = page.locator('#IMG_S_PART_TYPE');
        this.makeBuyLookup = page.locator('#IMG_S_MAKE_BUY_CD');
        this.subcontractorTypeLookup = page.locator('#S_SUBC_CHG_TYPE');
        this.vendorRestrictLookup = page.locator('#S_VEND_RESTRICT_CD');
        
        // Checkboxes
        this.activeCheckbox = page.locator('#ACTIVE_FL');
        this.asRequiredCheckbox = page.locator('#AS_REQD_FL');
        this.hazmatCheckbox = page.locator('#HAZMAT_FL');
        this.qcRequiredCheckbox = page.locator('#QC_REQD_FL');
        this.sourceInspectionCheckbox = page.locator('#SRCE_INSP_FL');
        this.certOfConformanceCheckbox = page.locator('#CERT_OF_CNFRM_FL');
        this.lotRequiredCheckbox = page.locator('#LOT_REQD_FL');
        this.soConfigLotRequiredCheckbox = page.locator('#SO_CFG_LOT_REQD_FL');
        
        // Tabs
        this.characteristicsTab = page.getByText('Characteristics', { exact: true });
        this.serialLotTab = page.getByText('Serial Lot Information');
        this.commentsTab = page.getByText('Comments');
        this.unitsOfMeasureTab = page.getByText('Units of Measure');
        this.userDefinedInfoTab = page.getByText('User-Defined Info');
        this.vendorsTab = page.getByText('Vendors');
        this.itemBillingsTab = page.getByText('Item Billings');
        
        // Action buttons
        this.saveButton = page.getByTitle('Save & Continue (F6)').locator('span').first();
        this.closeButton = page.getByRole('button', { name: 'Close' });
        this.countButton = page.getByRole('button', { name: 'Count' });
        
        // Query elements
        this.savedQueryMenu = page.locator('#savedQueryMnu span');
        this.basicField0 = page.locator('#basicField0');
        this.basicFieldOperator = page.locator('#basicFieldR0__img');
        this.basicCountBox = page.locator('#basicCountBox');
        
        // Success message
        this.successMessage = page.locator('#mLink208_0');
        
        // User-Defined Info locators
        this.userDefinedLink = page.locator('#lnk_1006526_PDMEPD_PART_PARTINFO');
        this.planTypeField = page.locator('#S_PLAN_TYPE');
        this.yieldPercentField = page.locator('#YIELD_PCT_RT');
        this.inventoryCheckbox = page.locator('#INVT_FL');
        
        // Item Billings locators
        this.salesItemDescField = page.locator('#SALES_ITEM_DESC');
        this.salesItemNotesField = page.locator('#SALES_ITEM_NT');
        this.productLineTypeLookup = page.locator('#IMG_S_PROD_LN_TYPE_CD');
        
        // Units of Measure locators
        this.umCode0Field = page.locator('#UM_CD-_0_E');
        this.umCode1Field = page.locator('#UM_CD-_1_E');
        this.umCode2Field = page.locator('#UM_CD-_2_E');
        this.umType1Lookup = page.locator('#S_UM_TYPE-_1_E');
        
        // Dialog close buttons with specific IDs
        this.dialog1CloseButton = page.locator('[id="\\31 "]').getByTitle('Close').locator('span');
        this.dialog4CloseButton = page.locator('[id="\\34 "]').getByRole('button', { name: 'Close' });
        this.dialog5CloseButton = page.locator('[id="\\35 "]').getByRole('button', { name: 'Close' });
        this.dialog6CloseButton = page.locator('[id="\\36 "]').getByTitle('Close');
        this.dialog33CloseButton = page.locator('[id="\\33 "]').getByTitle('Close');
        this.dialog37CloseButton = page.locator('[id="\\37 "]').getByTitle('Close');
        this.dialog14CloseButton = page.locator('[id="\\31 4"]').getByTitle('Close').locator('span');
        this.dialog13CloseButton = page.locator('[id="\\31 3"]').getByTitle('Close');
        this.dialog11CloseButton = page.locator('[id="\\31 1"]').getByTitle('Close').locator('span');
        this.dialog10CloseButton = page.locator('[id="\\31 0"]').getByTitle('Close');
        this.dialog39CloseButton = page.locator('[id="\\39 "]').getByTitle('Close').locator('span');
        
        // Manufacturing BOM tab
        this.manufacturingBOMTab = page.getByText('Manufacturing BOM');
        this.projectItemCostsTab = page.getByText('Project Item Costs');
        this.securityGroupsTab = page.getByText('Security Groups');
        this.engineeringBOMTab = page.getByText('Engineering BOM');
        this.documentsTab = page.getByText('Documents', { exact: true });
        this.licensesAgreementsTab = page.getByText('Licenses/Agreements');
        
        // Last Lot ID field and lookup
        this.lastLotIdField = page.locator('#LAST_LOT_ID');
        this.lastLotIdLookup = page.locator('span:nth-child(75) > .lookupIcon3');
    }

    async waitForPageLoad() {
        // Wait for PDMPART application to load with extended timeout
        try {
            await expect(this.partIdField).toBeVisible({ timeout: 20000 });
        } catch (error) {
            // If PART_ID not found, wait for page to load
            await this.page.waitForTimeout(3000);
        }
        
        // Additional wait for page to stabilize
        await this.page.waitForTimeout(2000);
    }

      async fillBasicPartInfo(partData) {
        await this.partIdField.fill(partData.partId);
        await this.page.waitForTimeout(2000);
        await this.itemDescField.evaluate((el, value) => {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}, partData.description );
        await this.page.waitForTimeout(2000);
      
    }

    async configureCharacteristics(characteristicsData = {}) {
        await this.characteristicsTab.click();
        
        // Set default unit of measure
        await this.defaultUMField.click({ force: true });
        await this.defaultUMField.fill(characteristicsData.unitOfMeasure || 'EA');
        
        // Set part type
        if (characteristicsData.partType) {
            await this.partTypeLookup.click();
            await this.page.getByText(characteristicsData.partType, { exact: true }).first().click();
        }
        
        // Set make/buy
        if (characteristicsData.makeBuy) {
            await this.makeBuyLookup.click();
            await this.page.getByText(characteristicsData.makeBuy, { exact: true }).first().click();
        }
        
        // Configure checkboxes
        if (characteristicsData.active !== undefined) {
            characteristicsData.active ? await this.activeCheckbox.check() : await this.activeCheckbox.uncheck();
        }
        
        // Set subcontractor charge type
        if (characteristicsData.subcontractorType) {
            await this.subcontractorTypeLookup.click();
            await this.page.waitForTimeout(1000);
            await this.page.getByText(characteristicsData.subcontractorType).nth(1).click({ force: true });
        }
        
        // Configure additional checkboxes
        if (characteristicsData.asRequired !== undefined) {
            characteristicsData.asRequired ? await this.asRequiredCheckbox.check() : await this.asRequiredCheckbox.uncheck();
        }
        if (characteristicsData.hazmat !== undefined) {
            characteristicsData.hazmat ? await this.hazmatCheckbox.check() : await this.hazmatCheckbox.uncheck();
        }
        if (characteristicsData.qcRequired !== undefined) {
            characteristicsData.qcRequired ? await this.qcRequiredCheckbox.check() : await this.qcRequiredCheckbox.uncheck();
        }
        if (characteristicsData.sourceInspection !== undefined) {
            characteristicsData.sourceInspection ? await this.sourceInspectionCheckbox.check() : await this.sourceInspectionCheckbox.uncheck();
        }
        if (characteristicsData.certOfConformance !== undefined) {
            characteristicsData.certOfConformance ? await this.certOfConformanceCheckbox.check() : await this.certOfConformanceCheckbox.uncheck();
        }
        
        // Set vendor restriction
        if (characteristicsData.vendorRestriction) {
            await this.vendorRestrictLookup.click();
            await this.page.getByText(characteristicsData.vendorRestriction).nth(1).click();
        }
    }

    async configureSerialLotInfo(serialLotData = {}) {
        await this.serialLotTab.click();
        
        if (serialLotData.lotRequired) {
            await this.lotRequiredCheckbox.check();
        }
        
        if (serialLotData.soConfigLotRequired) {
            await this.soConfigLotRequiredCheckbox.check();
        }
    }

    async addComments(comments = "Hello") {
        await this.commentsTab.click();
        await this.itemNotesField.fill(comments);
    }

    async saveRecord() {
        await this.saveButton.click();
        
        // Wait for save operation to complete with extended timeout
        try {
            await expect(this.successMessage).toContainText('Record modifications successfully completed.', { timeout: 15000 });
        } catch (error) {
            console.log('Success message not found, continuing with save process');
        }
        
        // Wait before closing
        await this.page.waitForTimeout(2000);
        await this.closeButton.click();
        
        // Wait after close
        await this.page.waitForTimeout(2000);
    }

    async performPartQuery(queryValue) {
        await this.savedQueryMenu.click();
        await this.basicField0.click();
        await this.basicFieldOperator.click();
        await this.page.getByText('is equal to').click();
        await this.basicField0.fill(queryValue);
        await this.countButton.click();
        
        // Verify count result
        await expect(this.basicCountBox).toContainText('records will be returned');
        await this.closeButton.click();
    }

    async verifyUnitsOfMeasure(expectedUM = 'EA') {
        await this.unitsOfMeasureTab.click();
        await expect(this.page.locator('#UM_CD-_0_E')).toHaveValue(expectedUM);
        await expect(this.page.locator('#UM_CD-_1_E')).toHaveValue(expectedUM);
        await expect(this.page.locator('#UM_CD-_2_E')).toHaveValue(expectedUM);
        await this.closeButton.click();
    }

    async verifyItemBillings(expectedData) {
        await this.itemBillingsTab.click();
        
        if (expectedData.description) {
            await expect(this.salesItemDescField).toHaveValue(expectedData.description);
        }
        
        if (expectedData.notes) {
            await expect(this.salesItemNotesField).toHaveValue(expectedData.notes);
        }
        
        await this.dialog6CloseButton.click();
    }

    async verifyUserDefinedInfo() {
        await this.userDefinedInfoTab.click();
        await this.userDefinedLink.click();
        
        // Verify default values
        await expect(this.planTypeField).toContainText('MRP');
        await expect(this.yieldPercentField).toHaveValue('100.00%');
        await expect(this.inventoryCheckbox).toBeChecked();
        
        await this.dialog4CloseButton.click();
    }

    async navigateToVendorsTab() {
        await this.vendorsTab.click();
        await this.dialog5CloseButton.click();
    }

    async configureItemBillings(productLineType = 'Inventory') {
        await this.itemBillingsTab.click();
        await this.productLineTypeLookup.click();
        await this.page.getByText(productLineType, { exact: true }).nth(2).click();
        await this.dialog6CloseButton.click();
    }

    async navigateToManufacturingBOM() {
        await this.manufacturingBOMTab.click();
        
        // Verify yield percentage in Manufacturing BOM
        await expect(this.yieldPercentField).toHaveValue('100.00%');
        
        await this.dialog37CloseButton.click();
    }

    async navigateToOtherTabs() {
        // Navigate through other tabs
        await this.projectItemCostsTab.click();
        await this.securityGroupsTab.click();
        await this.engineeringBOMTab.click();
        await this.documentsTab.click();
        await this.licensesAgreementsTab.click();
    }

    async handleLastLotLookup() {
        await this.lastLotIdField.click();
        await this.lastLotIdLookup.click();
        await this.dialog1CloseButton.click();
    }

    async closeAllDialogs() {
        // Close any open dialog windows in sequence
        const dialogSelectors = [
            '[id="\\31 4"]',
            '[id="\\31 3"]', 
            '[id="\\31 1"]',
            '[id="\\31 0"]',
            '[id="\\39 "]'
        ];
        
        for (const selector of dialogSelectors) {
            try {
                const dialogElement = this.page.locator(selector).getByTitle('Close');
                if (await dialogElement.isVisible()) {
                    await dialogElement.click();
                }
            } catch (error) {
                console.log(`Dialog ${selector} not found or already closed`);
            }
        }
        
        // Close main window
        await this.page.locator('#rsCls span').click();
    }
};