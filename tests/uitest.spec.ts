import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { ResultPage } from '../pages/resultpage';
import { PlaylistPage } from '../pages/playlistpage';
import { qaTestData } from "../test-data/qa/google.json";
import { stageTestData } from "../test-data/stage/google.json";
import { BasePage } from '../utils/BasePage';

let testData: any;

test.beforeAll('Running before all tests', () => {
    if (process.env.ENV == 'qa') {
        testData = qaTestData;
    } else {
        testData = stageTestData;
    }
})
 
// Write a test
test('UI automation test using playwright', async ({ page }) => {

    const homepage = new HomePage(page);
    const resultpage = new ResultPage(page);
    const playlistpage = new PlaylistPage(page);
    const base = new BasePage(page);

    await test.step('Go to URL', async () => {
        await homepage.goto();
    });

    await test.step('Search with keywords', async () => {
        await homepage.searchKeywords(testData.skill1);
    });

    await test.step('Click on playlist', async () => {
        await resultpage.clickOnPlaylist();
        await page.waitForTimeout(4000);
    });

    await test.step('Click on video', async () => {
        await playlistpage.clickOnVideo();
        await page.waitForTimeout(8000);
    });
})