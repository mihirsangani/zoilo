const express = require("express")
const globalController = require("./global.controller.js")
const middleware = require("../../middleware.js")
const router = express.Router()

router.get("/privacy-policy", globalController.getPrivacyPolicyController)
router.get("/terms-and-condition", globalController.getTermsNConditionController)
router.get("/banner", globalController.getBannerController)
router.get("/states", globalController.getStatesController)
router.get("/cities", globalController.getCitiesController)
router.get("/market-types", globalController.getMarketTypeController)
router.get("/product-types", globalController.getProductTypeController)
router.get("/product-price-types", globalController.getProductPriceTypeController)
router.get("/getCities", globalController.getCitiesListController)
router.get("/getTaluka", globalController.getTalukaListController)
router.get("/cityImage/:city_name", globalController.getCityImgController)
router.get("/plans", globalController.getPlansController)

router.get("/search", middleware.checkAccessToken, globalController.searchController)
router.get("/search/category", middleware.checkAccessToken, globalController.searchCategoryController)

router.post("/create-order", middleware.checkAccessToken, globalController.createOrderController)
router.post("/save-payment", (req, res, next) => {
    if (req.headers['x-user-type'] === 'admin') {
        middleware.checkAccessTokenAdmin(req, res, next);
    } else {
        middleware.checkAccessToken(req, res, next);
    }
}, globalController.savePaymentController)
router.get("/order-status", middleware.checkAccessToken, globalController.orderStatusController)

module.exports = router
