import { expect, test } from '@playwright/test';
import { ApiUtils } from './Utils/apiUtils';

test('E2E journey', async function ({ page }) {
    const productList = page.locator('.card-body');
    let searchProduct = "ZARA COAT 3";
    let loginEmail = "testuser@yahoo.com";
    await page.goto("https://rahulshettyacademy.com/client/");

    await page.locator('#userEmail').fill(loginEmail);
    await page.locator('#userPassword').fill('Welcome@123');
    await page.locator('#login').click();

    /* Wait for page to load fully before performing any operations */
    await page.waitForLoadState('networkidle'); // Waits for all the network calls to get completed
    await page.locator(".card-body b").first().waitFor(); // Waits for first element of the list to get loaded

    console.log(await productList.allTextContents());
    let totalProducts = await productList.count();
    console.log(totalProducts);

    /* Iterate the product list and add the given product to cart */
    for (let i = 0; i < totalProducts; i++) {
        if (await productList.nth(i).locator("b").textContent() === searchProduct) {
            await productList.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    /* Verify the product is added to the cart */
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor(); // Wait for list of items to get loaded in cart page
    expect(await page.locator(`h3:has-text('${searchProduct}')`).isVisible()).toBeTruthy();

    await page.locator('text=Checkout').click();

    /* To press letters sequentially in order to load the search results */
    await page.locator("[placeholder*='Country']").pressSequentially('Ind', { delay: 150 });
    const searchCountryList = page.locator('.ta-results');
    await searchCountryList.waitFor();
    let searchCountryCount = await searchCountryList.locator("button").count();
    console.log(searchCountryCount);

    /* Iterate country dropdown to select the given country */
    for (let i = 0; i < searchCountryCount; i++) {
        let product = searchCountryList.locator("button").nth(i);
        if ((await product.textContent()).trim() === 'India') {
            await product.click();
            break;
        }
    }

    expect(await page.locator(".user__name [type='text']").first()).toHaveText(loginEmail);

    await page.locator(".action__submit").click();
    let orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log('Order Id: ', orderId);

    /* Verify if the order id is present in my orders page */
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const orderList = await page.locator('tbody tr');

    for (let i = 0; i < await orderList.count(); i++) {
        const rowOrderId = await orderList.nth(i).locator('th').textContent();
        console.log(rowOrderId);
        if (orderId.includes(rowOrderId)) {
            await orderList.nth(i).locator(".btn-primary").first().click();      
            break;
        }
    }

    expect(orderId.includes(await page.locator('.col-text').textContent())).toBeTruthy();
});
