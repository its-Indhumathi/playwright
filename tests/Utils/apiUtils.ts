import { APIRequestContext } from "@playwright/test";

const apiLoginUrl = "https://rahulshettyacademy.com/api/ecom/auth/login";
const createOrderUrl = "https://rahulshettyacademy.com/api/ecom/order/create-order";

class ApiUtils {
    apiContext: APIRequestContext;
    loginPayload: any;
    sessionToken: any;
    orderId: any;
    constructor(apiContext: APIRequestContext, loginPayload: any) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;


    }

    async getToken() {
        const loginResponse = await this.apiContext.post(apiLoginUrl, {
            data: this.loginPayload,
        });
        const loginResponseJson = await loginResponse.json();
        this.sessionToken = loginResponseJson.token;
        console.log(this.sessionToken);
        return this.sessionToken;
    }

    async createOrder(createOrderPayload: any) {
        let response: any = {};
        response.sessionToken = await this.getToken();
        const createOrderResponse = await this.apiContext.post(createOrderUrl, {
            data: createOrderPayload,
            headers: {
                'Authorization': response.sessionToken,
                'Content-type': 'application/json',
            }
        });
        const createOrderResponseJson = await createOrderResponse.json();
        this.orderId = createOrderResponseJson.orders[0];
        response.orderId = this.orderId;
        console.log('Order Id => ', response.orderId);
        return response;
    }
}

export default ApiUtils;