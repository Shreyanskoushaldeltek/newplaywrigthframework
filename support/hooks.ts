import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { World } from './world';
import dotenv from 'dotenv';


let browser: Browser | null = null;

BeforeAll(async () => {
  browser = await chromium.launch({ headless: false });
  dotenv.config();
});

Before(async function (this: World) {
  if (!browser) throw new Error('Browser is not initialized!');
  const context = await browser.newContext();
  this.page = await context.newPage();
});

After(async function (this: World) {
  await this.page?.close();
});

AfterAll(async () => {
  await browser?.close();
});