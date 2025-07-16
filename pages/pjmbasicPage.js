const { expect } = require('@playwright/test');
import BasePage from '../utils/BasePage';

export class PJMBasicPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Project Basic Information Elements
    this.projectId = page.locator('#PROJ_ID');
    this.projectName = page.locator('#PROJ_NAME');
    this.projectDescription = page.locator('#PROJ_DESC');
    this.projectType = page.locator('#PROJ_TYPE');
    this.projectStatus = page.locator('#PROJ_STATUS');
    this.projectManager = page.locator('#PROJ_MGR');
    this.startDate = page.locator('#START_DT');
    this.endDate = page.locator('#END_DT');
    this.budgetAmount = page.locator('#BUDGET_AMT');
    this.customerCode = page.locator('#CUST_CD');
    
    // Dropdown and Selection Elements
    this.projectTypeDropdown = page.locator('#IMG_S_PROJ_TYPE');
    this.projectStatusDropdown = page.locator('#IMG_S_PROJ_STATUS');
    this.customerDropdown = page.locator('#IMG_S_CUST_CD');
    
    // Checkboxes
    this.activeCheckbox = page.locator('#ACTIVE_FL');
    this.billingCheckbox = page.locator('#BILLING_FL');
    this.timesheetCheckbox = page.locator('#TIMESHEET_FL');
    
    // Buttons
    this.saveButton = page.locator("//div[@title='Save & Continue (F6)']");
    this.saveContinueButton = page.getByRole('button', { name: 'Save' });
    this.closeButton = page.getByRole('button', { name: 'Close' });
    
    // Result/Status Messages
    this.resultMessage = page.locator('#mLink208_0');
    this.successMessage = page.locator("//div[contains(text(),'Record modifications successfully completed')]");
    
    // Page Header
    this.pageHeader = page.locator('#rsLevelToolbarBtns').getByText('Project Basic Information');
  }

  /**
   * Fill project basic information with provided data
   * @param {Object} projectData - Project data object
   */
  async fillProjectBasicInfo(projectData) {
    try {
      console.log('Starting to fill project basic information...');
      
      // Wait for page to load
      await this.projectId.waitFor({ state: 'visible', timeout: 10000 });
      
      // Generate unique identifier if needed
      const runValue = this.generateRandomString(6);
      const projectId = runValue + projectData.projectId;
      const projectName = runValue + projectData.projectName;
      
      // Fill basic project information
      await this.projectId.fill(projectId);
      await this.projectName.fill(projectName);
      await this.projectDescription.fill(projectData.description);
      
      // Handle project type selection
      if (projectData.projectType) {
        await this.selectFromDropdown(this.projectTypeDropdown, projectData.projectType);
      }
      
      // Handle project status selection
      if (projectData.projectStatus) {
        await this.selectFromDropdown(this.projectStatusDropdown, projectData.projectStatus);
      }
      
      // Fill project manager
      if (projectData.projectManager) {
        await this.projectManager.fill(projectData.projectManager);
      }
      
      // Fill dates
      if (projectData.startDate) {
        await this.startDate.fill(projectData.startDate);
      }
      
      if (projectData.endDate) {
        await this.endDate.fill(projectData.endDate);
      }
      
      // Fill budget amount
      if (projectData.budgetAmount) {
        await this.budgetAmount.fill(projectData.budgetAmount);
      }
      
      // Handle customer selection
      if (projectData.customerCode) {
        await this.selectFromDropdown(this.customerDropdown, projectData.customerCode);
      }
      
      console.log('Basic project information filled successfully');
      
    } catch (error) {
      console.error('Error filling project basic information:', error);
      throw error;
    }
  }

  /**
   * Set project characteristics (checkboxes)
   * @param {Object} characteristics - Project characteristics data
   */
  async setProjectCharacteristics(characteristics) {
    try {
      console.log('Setting project characteristics...');
      
      // Handle Active checkbox
      await this.setCheckboxState(this.activeCheckbox, characteristics.active);
      
      // Handle Billing checkbox
      await this.setCheckboxState(this.billingCheckbox, characteristics.billing);
      
      // Handle Timesheet checkbox
      await this.setCheckboxState(this.timesheetCheckbox, characteristics.timesheet);
      
      console.log('Project characteristics set successfully');
      
    } catch (error) {
      console.error('Error setting project characteristics:', error);
      throw error;
    }
  }

  /**
   * Helper method to select from dropdown
   * @param {Locator} dropdown - Dropdown element
   * @param {string} value - Value to select
   */
  async selectFromDropdown(dropdown, value) {
    await dropdown.hover();
    await dropdown.click();
    await this.page.waitForTimeout(1000);
    await dropdown.focus();
    await this.page.keyboard.press('Enter');
    
    const option = await this.ExactXPathLocator(value);
    await option.first().click();
  }

  /**
   * Helper method to set checkbox state
   * @param {Locator} checkbox - Checkbox element
   * @param {boolean} expectedState - Expected state
   */
  async setCheckboxState(checkbox, expectedState) {
    const currentState = await checkbox.isChecked();
    
    if (currentState === expectedState) {
      console.log('✅ Checkbox already in expected state');
    } else {
      if (expectedState) {
        await checkbox.check();
        console.log('☑️ Checkbox checked');
      } else {
        await checkbox.uncheck();
        console.log('☐ Checkbox unchecked');
      }
    }
  }

  /**
   * Save the project and verify success
   */
  async saveProject() {
    try {
      console.log('Saving project...');
      
      // Click save button
      await this.saveContinueButton.click();
      
      // Wait for save operation to complete
      await this.page.waitForTimeout(5000);
      
      // Verify success message
      await expect(this.resultMessage).toContainText('Record modifications successfully completed.');
      
      console.log('Project saved successfully');
      
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  }

  /**
   * Complete project creation workflow
   * @param {Object} projectData - Complete project data
   */
  async createProject(projectData) {
    try {
      console.log('Starting project creation workflow...');
      
      // Fill basic project information
      await this.fillProjectBasicInfo(projectData.basicInfo);
      
      // Set project characteristics
      await this.setProjectCharacteristics(projectData.characteristics);
      
      // Save the project
      await this.saveProject();
      
      console.log('Project creation workflow completed successfully');
      
    } catch (error) {
      console.error('Error in project creation workflow:', error);
      throw error;
    }
  }

  /**
   * Verify page is loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.pageHeader).toBeVisible({ timeout: 15000 });
    console.log('PJMBASIC page loaded successfully');
  }
}