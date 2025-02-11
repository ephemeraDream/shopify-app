// utils/shopify-api.js
import "@shopify/shopify-api/adapters/node";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

// 初始化 Shopify 客户端
export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  hostName: process.env.HOST_NAME,
  logger: {
    log: console.log,
    level: 'info',
    httpRequests: false,
    timestamps: false,
  },
});

// 创建 GraphQL 客户端
export async function createShopifyGraphQLClient(shop, accessToken) {
  return new shopify.clients.Graphql({
    session: {
      shop,
      accessToken,
    },
  });
}