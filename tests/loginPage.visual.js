import { expect, test } from '@playwright/test';

test('Verify login page', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client/");
    await page.screenshot({ path: 'screenshot.png'}); // Takes screenshot of entire page
    await page.locator('#userEmail').screenshot({ path: 'UsernameInputField.png'}); // Takes screenshot of the element
    expect(await page.screenshot()).toMatchSnapshot('loginpage.png');
});