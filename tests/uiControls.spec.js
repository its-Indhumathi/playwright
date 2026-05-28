import { expect, test } from '@playwright/test';

test('Test login with UI controls', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const USERNAME_INPUT = page.locator('#username');
    const PASSWORD_INPUT = page.locator('[type="password"]');
    const USERTYPE_SELECT = page.locator('select.form-control');
    const SIGNIN_BUTTON = page.locator('#signInBtn');
    const PHONE_HEADER_LIST = page.locator('.card-body a');
    const ACCESS_TYPE_RADIO = page.locator('span.radiotextsty');

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());
    await USERNAME_INPUT.type("rahulshettyacademy");
    await PASSWORD_INPUT.type("Learning@830$3mK2");
    /* Radio button */
    console.log(await ACCESS_TYPE_RADIO.last().isChecked());
    await ACCESS_TYPE_RADIO.last().click();
    await page.locator('#okayBtn').click();
    await expect(ACCESS_TYPE_RADIO.last()).toBeChecked();

    /* Checkbox */
    await USERTYPE_SELECT.selectOption('consult');
    await expect(page.locator('#terms')).not.toBeChecked();
    expect(await page.locator('#terms').isChecked()).toBeFalsy();
    await SIGNIN_BUTTON.click();
    await page.waitForLoadState('networkidle');
    console.log(await PHONE_HEADER_LIST.allTextContents());
});

test('Child window handles', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage] = await Promise.all([
        context.waitForEvent('page'), // Listens for any new page to return promise pending, rejected or fulfilled
        documentLink.click(),
    ]);
    let text = await newPage.locator(".red").textContent();
    let domainText = text.split("@")[1].split(" ")[0].split(".")[0];
    console.log(domainText);
    await page.locator('#username').fill(domainText);

    expect((await page.locator('#username').inputValue())).toContain(domainText);
});