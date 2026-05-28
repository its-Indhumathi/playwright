import { expect, test, request } from '@playwright/test';
import ApiUtils  from './Utils/apiUtils';

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

test('E2E journey with Web Api login', async function ({ page }) {
    const productList = page.locator('.card-body');
    let searchProduct = "ZARA COAT 3";
    let loginEmail = "testuser@yahoo.com";

    /* Verify if the order id is present in my orders page */
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const orderList = await page.locator('tbody tr');

    for (let i = 0; i < await orderList.count(); i++) {
        const rowOrderId = await orderList.nth(i).locator('th').textContent();
        console.log(rowOrderId);
        if (response.orderId.includes(rowOrderId)) {
            console.log('Inside');
            await orderList.nth(i).locator(".btn-primary").first().click();
            break;
        }
    }

    expect(response.orderId.includes(await page.locator('.col-text').textContent())).toBeTruthy();
});
