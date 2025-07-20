const { expect } = require('@playwright/test');
import BasePage from '../utils/BasePage';

export class PJMBasicPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Project Basic Information Elements
    this.projectId = page.locator('#PROJ_ID');
    this.projectName = page.locator('#PROJ_NAME');
    this.projectAbbreviation = page.locator('#PROJ_ABBRV_CD');
    this.projectTypeDropdown = page.locator('#IMG_TC_PROJ_FL');
    this.projectTypeDisplay = page.locator('#S_PROJ_RPT_DC');
    this.projectTypeCode = page.locator('#PROJ_TYPE_DC');
    
    // Project Flags/Checkboxes
    this.billProjectCheckbox = page.locator('#BILL_PROJ_FL');
    this.allowChargesCheckbox = page.locator('#ALLOW_CHARGES_FL');
    
    // Account and Organization Info
    this.accountGroupCode = page.locator('#ACCT_GRP_CD');
    this.organizationId = page.locator('#ORG_ID');
    
    // Navigation Elements
    this.basicInfoTab = page.getByText('Basic Info');
    this.userDefinedInfoTab = page.getByText('User-Defined Info');
    this.projLevelsTab = page.getByText('Proj Levels');
    this.notesTab = page.getByText('Notes', { exact: true });
    this.deliverablesTab = page.locator('a').filter({ hasText: 'Deliverables' });
    this.govtContractTab = page.locator('a').filter({ hasText: 'Gov\'t Contract' });
    
    // More Button and Overlay
    this.moreButton = page.getByRole('button', { name: 'More' });
    this.curtainOverlay = page.locator('curtain-overlay');
    
    // User Defined Info Elements
    this.newButton = page.locator('[id="1"]').getByText('New', { exact: true });
    this.lookupIcon = page.locator('#lookup_icon');
    this.udefLabel = page.locator('#UDEF_LBL-_0_E');
    this.selectButton = page.getByRole('button', { name: 'Select' });
    this.track1 = page.locator('[id="1"] #track1');
    this.mainFormArea = page.locator('[id="1"] > #mainForm > #tblvw > #hScrCnt > #hScr1 > #hp2');
    
    // Proj Levels Elements
    this.loadDataButton = page.getByRole('button', { name: 'Load Data' });
    
    // Notes Section
    this.notesTextArea = page.locator('#NOTES');
    
    // Action Buttons
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.closeButton = page.locator('[id="0"]').getByTitle('Close').locator('span');
    
    // User Menu
    this.userMenuIcon = page.locator('#uxxUserPicDiv use');
    this.logOutButton = page.getByRole('button', { name: 'Log Out' });
    
    // Page Header Validation
    this.pageHeader = page.locator('#rsLevelToolbarBtns');

  }

  /**
   * Fill basic project information
   * @param {Object} projectData - Project data object
   */
  async fillBasicProjectInfo(projectData) {
    try {
      console.log('Filling basic project information...');
      
      // Generate unique project ID if needed
      const runValue = this.generateRandomString(4);
      const projectId = projectData.projectId.replace('{{random}}', runValue);
      
      // Fill Project ID
      await this.projectId.waitFor({ state: 'visible', timeout: 10000 });
await this.projectDescription.fill(projectData.description);

      await this.projectId.click();
      await this.projectId.fill(projectId);

      
      // Fill Project Name
      await this.projectName.click();
      await this.projectName.fill(projectData.projectName.replace('{{random}}', runValue));
      
      // Fill Project Abbreviation
      await this.projectAbbreviation.click();
      await this.projectAbbreviation.fill(projectData.projectAbbreviation.replace('{{random}}', runValue));
      
      console.log(`Project basic info filled: ID=${projectId}`);
      
    } catch (error) {
      console.error('Error filling basic project info:', error);
      throw error;
    }
  }

  /**
   * Configure project type and settings
   * @param {Object} projectSettings - Project settings object
   */
  async configureProjectType(projectSettings) {
    try {
      console.log('Configuring project type...');
      
      // Navigate to Basic Info tab
      await this.navigateToTab(this.basicInfoTab);
      
      // Select project type using enhanced method
      await this.selectDropdownOption(this.projectTypeDropdown, projectSettings.projectType);
      
      // Verify project type display
      await expect(this.projectTypeDisplay).toContainText(projectSettings.expectedProjectDisplay);
      
      // Verify project type code is visible
      await expect(this.projectTypeCode).toBeVisible();
      
      // Configure billing project flag
      await this.setCheckboxStateSafe(this.billProjectCheckbox, projectSettings.billProject);
      
      // Configure allow charges flag
      await this.setCheckboxStateSafe(this.allowChargesCheckbox, projectSettings.allowCharges);
      
      // Verify account group and organization
      await expect(this.accountGroupCode).toHaveValue(projectSettings.expectedAccountGroup);
      await expect(this.organizationId).toHaveValue(projectSettings.expectedOrganization);
      
      console.log('Project type configured successfully');
      
    } catch (error) {
      console.error('Error configuring project type:', error);
      throw error;
    }
  }

  /**
   * Navigate through additional tabs and configure settings
   */
  async navigateAdditionalTabs() {
    try {
      console.log('Navigating additional tabs...');
      
      // Access More menu
      await this.moreButton.click();
      
      // Navigate to Deliverables
      await this.deliverablesTab.click();
      
      // Navigate to Gov't Contract
      await this.govtContractTab.click();
      
      // Close overlay
      await this.curtainOverlay.click();
      
      console.log('Additional tabs navigation completed');
      
    } catch (error) {
      console.error('Error navigating additional tabs:', error);
      throw error;
    }
  }

  /**
   * Configure user-defined information
   */
  async configureUserDefinedInfo() {
    try {
      console.log('Configuring user-defined info...');
      
      // Navigate to User-Defined Info tab
      await this.userDefinedInfoTab.click();
      
      // Click New button
      await this.newButton.click();
      
      // Click lookup icon
      await this.lookupIcon.click();
      
      // Select label
      await this.udefLabel.click();
      await this.selectButton.click();
      
      // Configure tracking
      await this.track1.click();
      await this.mainFormArea.dblclick();
      
      console.log('User-defined info configured');
      
    } catch (error) {
      console.error('Error configuring user-defined info:', error);
      throw error;
    }
  }

  /**
   * Handle project levels with dialog
   */
  async handleProjectLevels() {
    try {
      console.log('Handling project levels...');
      
      // Navigate to Proj Levels tab
      await this.navigateToTab(this.projLevelsTab);
      
      // Set up dialog handler using enhanced method
      await this.handleDialog();
      
      // Click Load Data button
      await this.loadDataButton.click();
      
      console.log('Project levels handled');
      
    } catch (error) {
      console.error('Error handling project levels:', error);
      throw error;
    }
  }

  /**
   * Add project notes
   * @param {string} notes - Project notes text
   */
  async addProjectNotes(notes) {
    try {
      console.log('Adding project notes...');
      
      // Navigate to Notes tab
      await this.navigateToTab(this.notesTab, this.notesTextArea);
      
      // Fill notes using enhanced method
      await this.fillWithValidation(this.notesTextArea, notes);
      
      console.log('Project notes added');
      
    } catch (error) {
      console.error('Error adding project notes:', error);
      throw error;
    }
  }

  /**
   * Save project
   */
  async saveProject() {
    try {
      console.log('Saving project...');
      
      await this.saveButton.click();
      
      // Wait for save to complete
      await this.page.waitForTimeout(2000);
      
      console.log('Project saved successfully');
      
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  }

  /**
   * Close project form
   */
  async closeProject() {
    try {
      console.log('Closing project form...');
      
      await this.closeButton.click();
      
      console.log('Project form closed');
      
    } catch (error) {
      console.error('Error closing project form:', error);
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
      
      // Step 1: Fill basic project information
      await this.fillBasicProjectInfo(projectData.basicInfo);
      
      // Step 2: Configure project type and settings
      await this.configureProjectType(projectData.projectSettings);
      
      // Step 3: Navigate additional tabs
      await this.navigateAdditionalTabs();
      
      // Step 4: Configure user-defined info
      await this.configureUserDefinedInfo();
      
      // Step 5: Handle project levels
      await this.handleProjectLevels();
      
      // Step 6: Add project notes
      await this.addProjectNotes(projectData.notes);
      
      // Step 7: Save project
      await this.saveProject();
      
      // Step 8: Close project form
      await this.closeProject();
      
      console.log('Project creation workflow completed successfully');
      
    } catch (error) {
      console.error('Error in project creation workflow:', error);
      throw error;
    }
  }

  /**
   * Verify PJMBASIC page is loaded
   */
  async verifyPageLoaded() {
    try {
      await this.projectId.waitFor({ state: 'visible'});
      console.log('PJMBASIC page loaded successfully');
    } catch (error) {
      console.error('PJMBASIC page failed to load:', error);
      throw error;
    }
  }

  /**
   * Handle any unexpected popups or dialogs
   */
  async handleUnexpectedPopups() {
    await this.handlePopups();
  }
}