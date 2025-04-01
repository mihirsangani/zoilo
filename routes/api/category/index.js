const express = require("express")
const middleware = require("../../middleware.js")
const categoryController = require("./category.controller.js")
const router = express.Router()

router.get("/", middleware.checkAccessToken, categoryController.getCategoryListController)
router.get("/get-sub-category-list", middleware.checkAccessToken, categoryController.getSubCategoryListController)

router.get("/market", middleware.checkAccessToken, categoryController.getMarketCategoryController)
router.get("/market/sub-category", middleware.checkAccessToken, categoryController.getMarketSubCategoryController)

module.exports = router
