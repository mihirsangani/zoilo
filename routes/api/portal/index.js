const express = require("express")
const middleware = require("../../middleware")
const portalController = require("./portal.controller")
const router = express.Router()

router.get("/category", middleware.checkPortalAccess, portalController.getCategoryController)
router.put("/update-category", middleware.checkPortalAccess, portalController.updateCategoryController)

module.exports = router
