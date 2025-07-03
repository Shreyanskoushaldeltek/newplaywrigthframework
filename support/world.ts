import { setWorldConstructor, World as CucumberWorld } from '@cucumber/cucumber';
import { Browser, chromium, Page } from 'playwright';

export class World extends CucumberWorld {
  browser!: Browser;
  page!: Page;

  constructor(options: any) {
    super(options);
  }
}

setWorldConstructor(World);