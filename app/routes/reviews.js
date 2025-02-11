// server/routes/reviews.js
import express from 'express';
import { shopify } from '../utils/shopify-api';
import { PrismaClient } from '@prisma/client';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const router = express.Router();
const prisma = new PrismaClient();
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// 图片上传到 Shopify Files API
router.post('/upload', async (req, res) => {
  try {
    const { file } = req.files;
    const { shop, accessToken } = req.session;

    // 1. 验证文件类型
    if (!file.mimetype.match(/image\/(jpeg|png)/)) {
      return res.status(400).json({ error: '仅允许 JPEG/PNG 格式' });
    }

    // 2. 使用 Shopify Admin API 上传
    const client = new shopify.clients.Graphql({
      session: { shop, accessToken }
    });

    const response = await client.query({
      data: {
        query: `
          mutation fileCreate($files: [FileCreateInput!]!) {
            fileCreate(files: $files) {
              files { id url }
            }
          }
        `,
        variables: {
          files: [{
            alt: "用户评论图片",
            contentType: "IMAGE",
            originalSource: `data:${file.mimetype};base64,${file.data.toString('base64')}`
          }]
        }
      }
    });

    res.json({ url: response.body.data.fileCreate.files[0].url });
  } catch (error) {
    console.error('[文件上传失败]', error);
    res.status(500).json({ error: '图片上传服务暂时不可用' });
  }
});

// 提交评论
router.post('/', async (req, res) => {
  try {
    const { productId, comment, mediaUrls } = req.body;
    const { session } = req;

    // 1. XSS 过滤
    const cleanComment = purify.sanitize(comment, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong'], // 允许的HTML标签
      FORBID_ATTR: ['style', 'class'] // 禁止的属性
    });

    // 2. 验证用户购买记录
    const hasPurchased = await verifyPurchase(session, productId);
    if (!hasPurchased) {
      return res.status(403).json({ error: '请先购买商品后再评论' });
    }

    // 3. 存储到数据库
    const review = await prisma.review.create({
      data: {
        productId,
        customerId: session.customer?.id,
        comment: cleanComment,
        mediaUrls: JSON.parse(mediaUrls),
        status: 'pending'
      }
    });

    res.json(review);
  } catch (error) {
    console.error('[评论提交失败]', error);
    res.status(500).json({ error: '评论提交失败，请稍后重试' });
  }
});

// 验证购买记录
async function verifyPurchase(session, productId) {
  const client = new shopify.clients.Rest({
    session: { shop: session.shop, accessToken: session.accessToken }
  });

  const orders = await client.get({
    path: 'orders',
    query: {
      status: 'any',
      fields: 'line_items'
    }
  });

  return orders.body.orders.some(order => 
    order.line_items.some(item => item.product_id == productId)
  );
}

export default router;