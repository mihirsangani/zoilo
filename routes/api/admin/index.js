const express = require("express")
const middleware = require("../../middleware.js")
const adminController = require("./admin.controller.js")
const router = express.Router()

router.post("/register", adminController.registerAdminController)
router.post("/login", adminController.loginController)
router.post("/logout", middleware.checkAccessTokenAdmin, adminController.logoutController)

module.exports = router