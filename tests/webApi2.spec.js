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
})

test('Place order', async () => {
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

    expect(page.locator(".user__name [type='text']").first()).toHaveText(loginEmail);

    await page.locator(".action__submit").click();
    expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    let orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log('Order Id: ', orderId);
});

test('Verify order in my orders page', async () => {
    /* Verify if the order id is present in my orders page */
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const orderList = page.locator('tbody tr');

    for (let i = 0; i < orderList.count(); i++) {
        const rowOrderId = await orderList.nth(i).locator('th').textContent();
        console.log(rowOrderId);
        if (orderId.includes(rowOrderId)) {
            console.log('Inside');
            await orderList.nth(i).locator(".btn-primary").first().click();      
            break;
        }
    }

    //expect(orderId.includes(await page.locator('.col-text').textContent())).toBeTruthy();
});