import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
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
}