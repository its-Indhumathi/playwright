import { expect, test } from '@playwright/test';
import { describe } from 'node:test';

describe('Sample Test suite', () => {
    test('Test with new context', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("/AutomationPractice/");
        console.log(await page.title());
    });

    test('Test login', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        const USERNAME_INPUT = page.locator('#username');
        const PASSWORD_INPUT = page.locator('[type="password"]');
        const SIGNIN_BUTTON = page.locator('#signInBtn');
        const PHONE_HEADER_LIST = page.locator('.card-body a');

        await page.goto("/loginpagePractise/");
        console.log(await page.title());
        await USERNAME_INPUT.type("testuser");
        await PASSWORD_INPUT.type("Learning@830$3mK2");
        await SIGNIN_BUTTON.click();
        const errortxt = await page.locator("[style*='block']").textContent();
        console.log(errortxt);
        await expect(errortxt).toContain("Incorrect");

        await USERNAME_INPUT.fill('');
        await USERNAME_INPUT.fill('rahulshettyacademy');
        await SIGNIN_BUTTON.click();

        console.log(await PHONE_HEADER_LIST.first().textContent());
        console.log(await PHONE_HEADER_LIST.nth(2).textContent());
        console.log(await PHONE_HEADER_LIST.allTextContents());
    });
});