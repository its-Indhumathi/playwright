import { expect, test, request } from '@playwright/test';
import ApiUtils from './Utils/apiUtils';

const loginPayload = { userEmail: "testuser@yahoo.com", userPassword: "Welcome@123" };
const createOrderPayload = {
    orders: [
        {
            country: "Canada",
            productOrderedId: "6960eac0c941646b7a8b3e68"
        }
    ]
};
let response;
let storedContext;
let page;
let searchProduct = "ZARA COAT 3";
let loginEmail = "testuser@yahoo.com";

test.beforeAll(async ({ browser }) => {
    /* Login */
    const context = await browser.newContext();
    const page = await context.newPage();
    let loginEmail = "testuser@yahoo.com";

    await page.goto("https://rahulshettyacademy.com/client/");

    await page.locator('#userEmail').fill(loginEmail);
    await page.locator('#userPassword').fill('Welcome@123');
    await page.locator('#login').click();
    await page.waitForLoadState('networkidle');
    await context.storageState({ path: 'state.json' }); // Stores session state
    storedContext = await browser.newContext({ storageState: 'state.json' });
});

test.beforeEach(async ({ browser }) => {
    page = await storedContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client/");
});

test('Add product to cart', async function () {
    //const page = await storedContext.newPage();

    const productList = await page.locator('.card-body');
    //await page.goto("https://rahulshettyacademy.com/client/");

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
});

test('Verify product is added to card', async () => {
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor(); // Wait for list of items to get loaded in cart page
    expect(await page.locator(`h3:has-text('${searchProduct}')`).isVisible()).toBeTruthy();
});