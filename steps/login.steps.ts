import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { HomePage } from '../pages/homepage';
import { World } from '../support/world';

let homePage: HomePage;

Given('I navigate to the login page', async function (this: World) {
  homePage = new HomePage(this.page);
  await homePage.goto();
});

/*When('I login with username {string} and password {string}', async function (this: World, username: string, password: string) {
  await homePage.login(username, password);
});

Then('I should see the error message {string}', async function (this: World, expected: string) {
  const message = await homePage.getError();
  expect(message).to.include(expected);
});*/