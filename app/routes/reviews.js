import express from "express";
import { shopify, createShopifyGraphQLClient } from "../utils/shopify-api";

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const { file } = req.files;
    const { shop, accessToken } = req.session;

    // 验证文件类型
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "仅允许图片文件" });
    }

    // 创建 GraphQL 客户端
    const client = await createShopifyGraphQLClient(shop, accessToken);

    // 执行文件上传 Mutation
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
            originalSource: `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          }]
        }
      }
    });

    // 返回文件 URL
    const uploadedFile = response.body.data.fileCreate.files[0];
    res.json({ url: uploadedFile.url });
  } catch (error) {
    console.error("文件上传失败:", error);
    res.status(500).json({ error: "上传失败" });
  }
});

export default router;