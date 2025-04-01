const express = require("express")
const middleware = require("../../middleware.js")
const userController = require("./user.controller.js")
const router = express.Router()

router.get("/", middleware.checkAccessToken, userController.getUserDetailController)
router.put("/", middleware.checkAccessToken, middleware.blockSystemUser, userController.updateUserDetailController)
router.delete("/", middleware.checkAccessToken, middleware.blockSystemUser, userController.deleteUserAccountController)

module.exports = router
