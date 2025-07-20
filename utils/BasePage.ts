import { Page, Locator, expect } from '@playwright/test';

export default class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to a given URL */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /** Click an element by Locator or selector */
  async click(selector: string | Locator): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: 'visible' });
    await element.click();
  }

  /** Fill an input field */
  async fill(selector: string | Locator, value: string): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: 'attached' });
    await element.fill(value);
  }

  /** Get text content from element */
  async getText(selector: string | Locator): Promise<string> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: 'visible' });
    return await element.textContent() ?? '';
  }

  /** Assert text content */
  async expectText(locator: Locator, expected: string): Promise<void> {
  await expect(locator).toContainText(expected);
  }
  /** Check if element is visible */
  async isVisible(selector: string | Locator): Promise<boolean> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await element.isVisible();
  }

  /** Wait for element to be enabled */
  async waitForEnabled(selector: string | Locator): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(element).toBeEnabled();
  }

  /** Take screenshot with custom name */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /** Wait for navigation after click or action */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForNavigation({ waitUntil: 'load' });
  }

  /** Press keyboard key */
  async pressKey(selector: string | Locator, key: string): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.press(key);
  }

  /** Get attribute value */
  async getAttribute(selector: string | Locator, attr: string): Promise<string | null> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await element.getAttribute(attr);
  }

  async getDynamicXPathLocator(text: string) {
  return this.page.locator(`//*[contains(text(),"${text}")]`);
}
  async ExactXPathLocator(text: string) {
  return this.page.locator(`//*[text()="${text}"]`);
}

  generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }

  /** Wait for element to be stable (no movement) before interaction */
  async waitForStable(selector: string | Locator, timeout: number = 5000): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: 'attached', timeout });
    await this.page.waitForTimeout(500); // Brief pause for stability
  }

  /** Retry mechanism for flaky actions */
  async retryAction(action: () => Promise<void>, maxRetries: number = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await action();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        console.log(`Retrying action (attempt ${i + 1}/${maxRetries})`);
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /** Enhanced dropdown selection with retry logic */
  async selectFromDropdownWithRetry(dropdown: Locator, value: string, maxRetries: number = 3): Promise<void> {
    await this.retryAction(async () => {
      await dropdown.hover();
      await dropdown.click();
      await this.page.waitForTimeout(1000);
      await dropdown.focus();
      await this.page.keyboard.press('Enter');
      
      const option = await this.ExactXPathLocator(value);
      await option.first().click();
    }, maxRetries);
  }

  /** Safe checkbox interaction with state verification */
  async setCheckboxStateSafe(checkbox: Locator, expectedState: boolean): Promise<void> {
    await this.retryAction(async () => {
      const currentState = await checkbox.isChecked();
      
      if (currentState !== expectedState) {
        if (expectedState) {
          await checkbox.check();
        } else {
          await checkbox.uncheck();
        }
        
        // Verify state changed
        const newState = await checkbox.isChecked();
        if (newState !== expectedState) {
          throw new Error(`Checkbox state not changed as expected. Expected: ${expectedState}, Actual: ${newState}`);
        }
      }
    });
  }

  /** Enhanced fill with clear and validation */
  async fillWithValidation(selector: string | Locator, value: string): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: 'attached' });
    await element.clear();
    await element.fill(value);
    
    // Verify value was set correctly
    const actualValue = await element.inputValue();
    if (actualValue !== value) {
      throw new Error(`Value not set correctly. Expected: '${value}', Actual: '${actualValue}'`);
    }
  }

  /** Handle dialog boxes with custom message handling */
  async handleDialog(expectedMessage?: string, action: 'accept' | 'dismiss' = 'dismiss'): Promise<void> {
    this.page.once('dialog', dialog => {
      console.log(`Dialog appeared: ${dialog.message()}`);
      
      if (expectedMessage && !dialog.message().includes(expectedMessage)) {
        console.warn(`Unexpected dialog message. Expected: '${expectedMessage}', Actual: '${dialog.message()}'`);
      }
      
      if (action === 'accept') {
        dialog.accept().catch(() => {});
      } else {
        dialog.dismiss().catch(() => {});
      }
    });
  }

  /** Handle multiple popup patterns */
  async handlePopups(): Promise<void> {
    const popupSelectors = [
      '.modal-dialog',
      '.popup-container', 
      '[role="dialog"]',
      '.overlay',
      'curtain-overlay'
    ];
    
    for (const selector of popupSelectors) {
      try {
        const popup = this.page.locator(selector);
        if (await popup.isVisible()) {
          const closeButton = popup.locator('button:has-text("Close"), button:has-text("Cancel"), .close-btn, .close-button');
          if (await closeButton.isVisible()) {
            await closeButton.click();
            console.log(`Closed popup: ${selector}`);
            await this.page.waitForTimeout(500);
          }
        }
      } catch (error) {
        // Continue with next selector
      }
    }
  }

  /** Enhanced tab navigation with wait */
  async navigateToTab(tabLocator: Locator, waitForContent?: Locator): Promise<void> {
    await tabLocator.waitFor({ state: 'visible' });
    await tabLocator.click();
    
    if (waitForContent) {
      await waitForContent.waitFor({ state: 'visible', timeout: 10000 });
    }
    
    await this.page.waitForTimeout(1000); // Brief pause for tab content to load
  }

  /** Enhanced dropdown selection with better error handling */
  async selectDropdownOption(dropdown: Locator, optionText: string): Promise<void> {
    await this.retryAction(async () => {
      await dropdown.waitFor({ state: 'visible' });
      await dropdown.hover();
      await dropdown.click();
      await this.page.waitForTimeout(1000);
      
      const option = await this.ExactXPathLocator(optionText);
      await option.first().waitFor({ state: 'visible', timeout: 5000 });
      await option.first().click();
    });
  }

}