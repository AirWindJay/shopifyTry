
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/web-api';

async function shopifyBilling(ctx, amount, chargeName, url, interval) {
    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY,
      scopes: ['read_customer_payment_methods', 'write_own_subscription_contracts'],
      hostName: url,
      isEmbeddedApp: true,
      apiVersion: LATEST_API_VERSION
    })
    const {session} = await shopify.auth.callback({
      rawRequest: ctx.request,
      rawResponse: ctx.response,
    })
    
    const variables = {
      "name": chargeName,
      "returnUrl": "https://app.grandshipper.com/",
      "lineItems": [
        {
          "plan": {
            "appRecurringPricingDetails": {
              "price": {
                "amount": amount,
                "currencyCode": "USD"
              },
              "interval": interval
            }
          }
        }
      ]
    }

    const client = new shopify.clients.Graphql({session});
    const data = await client.query({
      data: {
        "query": `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!) {
          appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
            userErrors {
              field
              message
            }
            appSubscription {
              id
            }
            confirmationUrl
          }
        }`,
        "variables": variables
      },
    });
    
    // const application_charge = new shopify.rest.ApplicationCharge({session: session});
    // application_charge.name = chargeName;
    // application_charge.price = amount;
    // application_charge.return_url = "https://app.grandshipper.com/";
    // application_charge.test = true;
    // const body = await application_charge.save({
    //   update: true,
    // })
}

async function shopifyFullfilment() {

}



export default {shopifyBilling, shopifyFullfilment}