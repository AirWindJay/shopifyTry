import Router from 'koa-router'
import integController from "../controller/integController"
import shopifyController from '../controller/shopifyController';
import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()
const router = new Router()

router.post('/ecomm/shopify/billing', async (ctx, next) => {
  const storeName = ctx.request.body["storeName"]
  const interval = ctx.request.body["interval"]
  const amount = ctx.request.body["amount"]
  const chargeName = ctx.request.body["chargeName"]
  let userId
    if(ctx.get('maskedId')) { 
        userId = ctx.get('maskedId')
        userId = parseInt(userId);
    }
    else { userId = await integController.getUserId(ctx)}
  //get integration
  const integId = await integController.getIntegId(userId, storeName)
  //get integration settings
  const url = await prisma.integration_settings.findFirst({
    where: {
        integration_id: integId,
        name: 'store_url'
    },
  })
  const nounce = await prisma.integration_settings.findFirst({
    where: {
        integration_id: integId,
        name: 'nounce'
    },
  })
  const access_token = await prisma.integration_settings.findFirst({
    where: {
        integration_id: integId,
        name: 'access_token'
    },
  })
  ctx.body = await shopifyController.shopifyBilling(ctx, amount, chargeName, url.value, interval);
  return next()
})

// router.post('/ecomm/shopify/fulfillment',async (ctx, next) => {
//   get user via x-auth-token for dev2 or maskedId via legacy
  
//   get integration via userId and integration_id

//   get integration settings via integration_id
//   const integration_settings = await prisma.integration_settings.findMany({
//     where:{
      
//     }
//   })

//   get order/s to be fulfilled via ctx.req.body


//   //integration settings for shopify
//   const shopify = shopifyApi({
//     apiKey: 'APIKeyFromPartnersDashboard',
//     apiSecretKey: 'APISecretFromPartnersDashboard',
//     scopes: ['read_merchant_managed_fulfillment_orders', 'write_merchant_managed_fulfillment_orders'],
//     hostName: 'ngrok-tunnel-address',
//     isEmbeddedApp: true,
//     apiVersion: LATEST_API_VERSION
//   })

//   const {session} = await shopify.auth.callback({
//     rawRequest: ctx.request,
//     rawResponse: ctx.response,
//   })

//   const fulfillment = new shopify.rest.Fulfillment({session: session});
//   fulfillment.line_items_by_fulfillment_order = [
//     {
//       "fulfillment_order_id": 1046000780
//     }
//   ]

//   fulfillment.tracking_info = {
//     "number": "MS1562678",
//     "url": "https://www.my-shipping-company.com?tracking_number=MS1562678"
//   }
//   await fulfillment.save({
//     update: true,
//   })
  
// })

router.get('/ecomm/shopify/ping', async (ctx, next) => {
  ctx.body = 'pong'
  return next()
})

export default {router}