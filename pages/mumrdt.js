const { expect } = require('@playwright/test');
import BasePage from '../utils/BasePage';

export class MUMRDTPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Search Criteria Elements
    this.exchangeRateType = page.locator('#basicField0');
    this.fromCurrency = page.locator('#basicField1');
    this.toCurrency = page.locator('#basicField2');
    
    // Action Buttons for Search
    this.countButton = page.getByRole('button', { name: 'Count' });
    this.findButton = page.getByRole('button', { name: 'Find' });
    
    // Exchange Rate Grid Elements
    this.exchangeRateRow = page.getByRole('row', { name: 'DAILY1 Daily 1 USD USD GBP U' });
    this.editIcon = page.locator('#EDIT_PIC__1_E');
    this.unselectButton = page.getByTitle('Control+Click to unselect');
    
    // New Record Creation Elements
    this.newButton = page.locator('[id="1"]').getByText('New');
    this.startDate = page.locator('#START_DT-_0_N');
    this.endDate = page.locator('#END_DT-_0_N');
    this.exchangeRate = page.locator('#EXCH_RT-_0_N');
    this.gridCell = page.getByRole('row', { name: '07/22/2025 Show Calendar 07/' }).getByRole('gridcell').nth(3);
    this.changeLabel = page.locator('#CHANGE_LABEL-_0_N');
    
    // Action Buttons
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.closeButton = page.getByRole('button', { name: 'Close' });
    
    // Status and Validation Elements
    this.toolbarContainer = page.locator('#uxxToolbarCont');
    this.successMessage = page.locator('#mLink208_0');
    this.loadingMessage = page.getByText('Loading...Manage Exchange');
    
    // Page Header Validation
    this.pageTitle = page.getByText('Manage Exchange Rates by Date').first();
  }

  /**
   * Process dynamic test data and replace placeholders
   * @param {Object} testData - Complete test data object
   * @returns {Object} - Processed test data with dynamic values
   */
  processDynamicTestData(testData) {
    const processedData = JSON.parse(JSON.stringify(testData)); // Deep clone
    
    if (testData.dynamicDateConfig && testData.dynamicDateConfig.useDynamicDates) {
      // Process exchangeRateData for dynamic dates
      if (processedData.exchangeRateData.startDate && processedData.exchangeRateData.startDate.includes('{{dynamicDate:')) {
        const offsetMatch = processedData.exchangeRateData.startDate.match(/{{dynamicDate:(\d+)}}/);
        const offset = offsetMatch ? parseInt(offsetMatch[1]) : 0;
        processedData.exchangeRateData.startDate = this.generateExchangeRateDate(offset);
      }
      
      if (processedData.exchangeRateData.endDate && processedData.exchangeRateData.endDate.includes('{{dynamicDate:')) {
        const offsetMatch = processedData.exchangeRateData.endDate.match(/{{dynamicDate:(\d+)}}/);
        const offset = offsetMatch ? parseInt(offsetMatch[1]) : 1;
        processedData.exchangeRateData.endDate = this.generateExchangeRateDate(offset);
      }
    }
    
    return processedData;
  }

  /**
   * Fill search criteria for exchange rates
   * @param {Object} searchData - Search criteria data
   */
  async fillSearchCriteria(searchData) {
    try {
      console.log('Filling exchange rate search criteria...');
      
      // Wait for page to load and fill exchange rate type
      await this.exchangeRateType.waitFor({ state: 'visible', timeout: 10000 });
      await this.exchangeRateType.click();
      await this.exchangeRateType.fill(searchData.exchangeRateType);
      await this.page.waitForTimeout(1000);
      
      // Fill from currency
      await this.fromCurrency.click();
      await this.fromCurrency.fill(searchData.fromCurrency);
      await this.page.waitForTimeout(1000);
      
      
      
      
      // Fill to currency
      await this.toCurrency.click();
      await this.toCurrency.fill(searchData.toCurrency);
      await this.page.waitForTimeout(1000);
      
      console.log('Search criteria filled successfully');
      
    } catch (error) {
      console.error('Error filling search criteria:', error);
      throw error;
    }
  }

  /**
   * Execute search for exchange rates
   */
  async searchExchangeRates() {
    try {
      console.log('Searching exchange rates...');
      
      // Click Count button
      await this.countButton.click();
      await this.page.waitForTimeout(2000);
      
      // Click Find button
      await this.findButton.click();
      await this.page.waitForTimeout(3000);
      
      console.log('Exchange rates search executed');
      
    } catch (error) {
      console.error('Error searching exchange rates:', error);
      throw error;
    }
  }

  /**
   * Select exchange rate record for editing
   */
  async selectExchangeRateRecord() {
    try {
      console.log('Selecting exchange rate record...');
      
      // Wait for results to load
      await this.exchangeRateRow.waitFor({ state: 'visible', timeout: 10000 });
      
      // Click edit icon
      await this.editIcon.click();
      await this.page.waitForTimeout(2000);
      
      // Click unselect button if needed
      await this.unselectButton.click();
      await this.page.waitForTimeout(1000);
      
      console.log('Exchange rate record selected');
      
    } catch (error) {
      console.error('Error selecting exchange rate record:', error);
      throw error;
    }
  }

  /**
   * Create new exchange rate entry with table structure preservation
   * @param {Object} exchangeRateData - Exchange rate entry data
   */
  async createNewExchangeRate(exchangeRateData) {
    try {
      console.log('Creating new exchange rate entry...');
      
      // Click New button
      await this.newButton.click();
      await this.page.waitForTimeout(2000);
      
      // Fill start date with table structure awareness
      await this.startDate.waitFor({ state: 'visible' });
      await this.startDate.click();
      await this.page.waitForTimeout(500); // Wait for cell focus
      await this.startDate.fill(exchangeRateData.startDate);
      await this.page.waitForTimeout(1000);
      
      // Fill end date with table structure awareness
      await this.endDate.click();
      await this.page.waitForTimeout(500); // Wait for cell focus
      await this.endDate.fill(exchangeRateData.endDate);
      await this.page.waitForTimeout(1000);
      
      // Fill exchange rate with table structure awareness
      await this.exchangeRate.click();
      await this.page.waitForTimeout(500); // Wait for cell focus
      await this.exchangeRate.fill(exchangeRateData.rate);
      await this.page.waitForTimeout(1000);
      
      // Click change label if needed (preserves table row structure)
      await this.changeLabel.click();
      await this.page.waitForTimeout(1000);
      
      console.log('New exchange rate entry created with table structure preserved');
      
    } catch (error) {
      console.error('Error creating new exchange rate entry:', error);
      throw error;
    }
  }

  /**
   * Validate table structure integrity after operations
   */
  async validateTableStructure() {
    try {
      // Check if table rows are properly structured
      const tableRows = this.page.locator('table tr, .grid-row, [role="row"]');
      const rowCount = await tableRows.count();
      
      console.log(`Table structure validated: ${rowCount} rows found`);
      
      // Ensure new entries maintain proper table formatting
      if (rowCount > 0) {
        const lastRow = tableRows.last();
        await lastRow.waitFor({ state: 'attached' });
        console.log('Table structure integrity maintained');
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Table structure validation warning:', error.message);
      return false;
    }
  }

  /**
   * Save exchange rate changes
   */
  async saveExchangeRate() {
    try {
      console.log('Saving exchange rate...');
      
      // Click Save button
      await this.saveButton.click();
      await this.page.waitForTimeout(2000);
      
      // Click on toolbar to ensure save is processed
      /*await this.toolbarContainer.click();
      await this.page.waitForTimeout(2000);*/
      
      // Verify success message
      await expect(this.successMessage).toContainText('Record modifications successfully completed.');
      
      console.log('Exchange rate saved successfully');
      
    } catch (error) {
      console.error('Error saving exchange rate:', error);
      throw error;
    }
  }

  /**
   * Close the exchange rate form
   */
  async closeForm() {
    try {
      console.log('Closing exchange rate form...');
      
      await this.closeButton.click();
      await this.page.waitForTimeout(1000);
      
      console.log('Exchange rate form closed');
      
    } catch (error) {
      console.error('Error closing form:', error);
      throw error;
    }
  }

  /**
   * Complete exchange rate management workflow
   * @param {Object} workflowData - Complete workflow data
   */
  async manageExchangeRates(workflowData) {
    try {
      console.log('Starting exchange rate management workflow...');
      
      // Step 1: Fill search criteria
      await this.fillSearchCriteria(workflowData.searchCriteria);
      
      // Step 2: Search exchange rates
      await this.searchExchangeRates();
      
      // Step 3: Select exchange rate record
      await this.selectExchangeRateRecord();
      
      // Step 4: Create new exchange rate entry
      await this.createNewExchangeRate(workflowData.exchangeRateData);
      
      // Step 5: Save changes
      await this.saveExchangeRate();
      
      // Step 6: Close form
      await this.closeForm();
      
      console.log('Exchange rate management workflow completed successfully');
      
    } catch (error) {
      console.error('Error in exchange rate management workflow:', error);
      throw error;
    }
  }

  /**
   * Verify MUMRDT page is loaded
   */
  async verifyPageLoaded() {
    try {
      // Wait for loading message and then page elements
      await this.loadingMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await this.exchangeRateType.waitFor({ state: 'visible', timeout: 15000 });
      console.log('MUMRDT page loaded successfully');
    } catch (error) {
      console.error('MUMRDT page failed to load:', error);
      throw error;
    }
  }

  /**
   * Handle any unexpected popups specific to MUMRDT
   */
  async handleUnexpectedPopups() {
    await this.handlePopups();
  }

  /**
   * Validate search results are displayed
   */
  async validateSearchResults() {
    try {
      await this.exchangeRateRow.waitFor({ state: 'visible', timeout: 10000 });
      console.log('Search results validated');
      return true;
    } catch (error) {
      console.warn('No search results found or results not loaded');
      return false;
    }
  }

  /**
   * Generate dynamic date for exchange rates
   * @param {number} daysFromToday - Number of days to add to current date
   * @returns {string} - Formatted date string (MM/DD/YYYY)
   */
  generateExchangeRateDate(daysFromToday = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return (date.getMonth() + 1).toString().padStart(2, '0') + '/' + 
           date.getDate().toString().padStart(2, '0') + '/' + 
           date.getFullYear();
  }
}