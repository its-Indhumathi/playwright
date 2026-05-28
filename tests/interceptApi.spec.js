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
const noOrdersResponsePayload = {
    data: [],
    count: 0,
    message: "Orders fetched for customer Successfully"
}
let response;

test.beforeAll(async () => {
    /* Login */
    const apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext, loginPayload);

    /* Create order */
    response = await apiUtils.createOrder(createOrderPayload);
});

test.beforeEach(async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.sessionToken);
    await page.goto("https://rahulshettyacademy.com/client/");
});

test('Verify my orders page if there are no orders', async function ({ page }) {
    /* Intercepting response for get all orders */
    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*', async route => {
        const getOrdersResponse = await page.request.fetch(route.request());
        let body = JSON.stringify(noOrdersResponsePayload);
        route.fulfill({
            response, body
        });
    })
    await page.locator("button[routerlink*='myorders']").click();
});

test('Verify my orders page if invalid order id is passed in request params', async function ({ page }) {
    /* Intercepting request of get all orders */
    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*', async route => {
        route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' });
    });
    await page.locator("button[routerlink*='myorders']").click();
    await page.pause();
});

test('Block css, image calls to load page faster', async function ({ page }) {
    /* Aborting requests */
    await page.route('**/*.{css,jpg,jpeg,png}', route => route.abort());
    await page.locator("button[routerlink*='myorders']").click();
    await page.pause();
});