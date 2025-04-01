const express = require("express")
const newsController = require("./news.controller.js")
const router = express.Router()
const middleware = require("../../middleware.js")

router.get("/", middleware.checkAccessToken, newsController.getNewsController)
router.get("/news-detail", middleware.checkAccessToken, newsController.getNewsDetailController)
router.put("/like", newsController.likeNewsController)

module.exports = router
