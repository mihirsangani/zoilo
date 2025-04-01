const express = require("express")
const middleware = require("../../middleware.js")
const authController = require("./auth.controller.js")
const router = express.Router()

router.post("/send-authentication-code", authController.sendAuthenticationCodeController)
router.post("/login", authController.loginController)
router.post("/logout", middleware.checkAccessToken, authController.logoutController)

module.exports = router
