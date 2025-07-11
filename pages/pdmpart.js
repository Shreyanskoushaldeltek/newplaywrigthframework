// import { Page, Locator, expect } from '@playwright/test';
// import BasePage from '../utils/BasePage';

// export class PDMPART extends BasePage {
//   readonly page: Page;
//   readonly partId: Locator;
//   readonly partdesc: Locator;
//   readonly defaultUMInput: Locator;
//   readonly partTypeIcon: Locator;
//   readonly makeBuyIcon: Locator;
//   readonly activeCheckbox: Locator;
//   readonly hazmatCheckbox : Locator;
//   readonly subChangeTypeDropdown : Locator;
//   readonly   qcRequiredCheckbox: Locator;
//   readonly  SerialLotInformation: Locator;
//   readonly  lotRequiredCheckbox: Locator;
//   readonly  saveContinueButton: Locator;
//   readonly  resultMessage: Locator;

//   constructor(page: Page) {
const { expect } = require('@playwright/test');
import BasePage from '../utils/BasePage';

export class PDMPART extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
        // Elements
        this.partId = page.locator('#PART_ID');
        this.partdesc = page.locator('#ITEM_DESC');
        this.defaultUMInput = page.locator('#DFLT_UM_CD');
        this.partTypeIcon = page.locator('#S_PART_TYPE');
        this.makeBuyIcon = page.locator('#IMG_S_MAKE_BUY_CD');
        this.activeCheckbox = page.locator('#ACTIVE_FL');
        this.subChangeTypeDropdown = page.locator('#S_SUBC_CHG_TYPE');
        this.hazmatCheckbox = page.locator('#HAZMAT_FL');
        this.qcRequiredCheckbox = page.locator('#QC_REQD_FL');
        this.SerialLotInformation = page.locator('#tabsp1');
        this.lotRequiredCheckbox = page.locator('#LOT_REQD_FL');
        this.saveContinueButton = page.locator("//div[@title='Save & Continue (F6)']");
        this.resultMessage = page.locator('#mLink208_0');

    }
    async FillDetails(){
        const runValue= this.generateRandomString(6);
        const partID= runValue + process.env.PartID
        const partDesc= runValue + process.env.PartDesc
        await this.partId.waitFor({ state: 'visible' , timeout: 5000});
        //await this.partId.fill(process.env.PartID!);
        await this.partId.fill(partID);
        await this.partdesc.click();
       // await this.partdesc.type(process.env.PartDesc!);
        await this.partdesc.type(partDesc);
        console.log(`the part id is ${process.env.PartDesc}`);
        await this.defaultUMInput.fill(process.env.UMInput);
        console.log(await this.makeBuyIcon.count()); // should be 1
        console.log(await this.makeBuyIcon.isVisible());// should be true
        await this.makeBuyIcon.hover();
        await this.makeBuyIcon.dblclick();
        await this.page.getByText(process.env.MakeBuy, { exact: true }).first().click();
       
        await this.partTypeIcon.hover();
        await this.partTypeIcon.click();
        await this.page.waitForTimeout(1000);
        await this.partTypeIcon.focus();
        await this.page.keyboard.press('Enter');
        const location = await this.ExactXPathLocator(process.env.PartType);
        await location.first().click();

        await this.subChangeTypeDropdown.hover();
        await this.subChangeTypeDropdown.click();
        await this.page.waitForTimeout(1000);
        await this.subChangeTypeDropdown.focus();
        const location2 = await this.ExactXPathLocator(process.env.SubpartType);
        await location2.first().click();

        const checkingState = await this.activeCheckbox.isChecked();
        const expectedState = process.env.Active?.toLowerCase() === 'true';
        if (checkingState === expectedState) {
            console.log('✅ Checkbox already in expected state');
                } else {
                    if (expectedState) {
                    await this.activeCheckbox.check();
                    console.log('☑️ Checkbox checked');
                    } else {
                    await this.activeCheckbox.uncheck();
                    console.log('☐ Checkbox unchecked');
                    }
        }

        const checkingState2 = await this.hazmatCheckbox.isChecked();
        const expectedState2 = process.env.hazmat?.toLowerCase() === 'true';
        if (checkingState2 === expectedState2) {
            console.log('✅ Checkbox already in expected state');
                } else {
                    if (expectedState2) {
                    await this.hazmatCheckbox.check();
                    console.log('☑️ Checkbox checked');
                    } else {
                    await this.hazmatCheckbox.uncheck();
                    console.log('☐ Checkbox unchecked');
                    }
        }

        const checkingState3 = await this.qcRequiredCheckbox.isChecked();
        const expectedState3 = process.env.qcRequired?.toLowerCase() === 'true';
        if (checkingState3 === expectedState3) {
            console.log('✅ Checkbox already in expected state');
                } else {
                    if (expectedState3) {
                    await this.qcRequiredCheckbox.check();
                    console.log('☑️ Checkbox checked');
                    } else {
                    await this.qcRequiredCheckbox.uncheck();
                    console.log('☐ Checkbox unchecked');
                    }
        }

        await this.SerialLotInformation.click();

        const checkingState4 = await this.lotRequiredCheckbox .isChecked();
        const expectedState4 = process.env.LotInventoryTracking?.toLowerCase() === 'true';
        if (checkingState4 === expectedState4) {
            console.log('✅ Checkbox already in expected state');
                } else {
                    if (expectedState4) {
                    await this.lotRequiredCheckbox.check();
                    console.log('☑️ Checkbox checked');
                    } else {
                    await this.lotRequiredCheckbox .uncheck();
                    console.log('☐ Checkbox unchecked');
                    }
        }

        await this.saveContinueButton.hover();
        await this.page.waitForTimeout(1000);
        await this.saveContinueButton.dblclick();
        await this.page.waitForTimeout(5000);
        await expect(this.resultMessage).toContainText('Record modifications successfully completed.');

        await this.page.waitForTimeout(1000);
    }






}