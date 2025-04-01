const express = require("express")
const middleware = require("../../middleware.js")
const businessController = require("./business.controller.js")
const router = express.Router()

router.get("/business-type", middleware.checkAccessToken, businessController.getBusinessTypeController)
router.get("/week-day", middleware.checkAccessToken, businessController.getWeekDataController)
router.get("/list", middleware.checkAccessToken, businessController.getBusinessListController)
router.post("/", middleware.checkAccessToken, middleware.blockSystemUser, businessController.registerBusinessController)
router.get("/", middleware.checkAccessToken, businessController.getBusinessDetailController)
router.put("/", middleware.checkAccessToken, middleware.blockSystemUser, businessController.updateBusinessDetailController)
router.get("/get", businessController.getInactiveBusinessController)
router.put("/status", middleware.checkAccessTokenAdmin, businessController.activeBusinessController)

router.post("/bulk-upload", middleware.upload.single("file"), businessController.bulkUploadController)

module.exports = router
