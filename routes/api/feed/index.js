const express = require("express")
const feedController = require("./feed.controller.js")
const router = express.Router()
const middleware = require("../../middleware.js")

router.get("/", middleware.checkAccessToken, feedController.getFeedController)
router.post("/", middleware.checkAccessToken, middleware.blockSystemUser, feedController.createFeedController)
router.put("/", middleware.checkAccessToken, middleware.blockSystemUser, feedController.updateFeedController)
router.get("/my-feed", middleware.checkAccessToken, feedController.getMyFeedController)
router.post("/like", middleware.checkAccessToken, middleware.blockSystemUser, feedController.feedLikeController)
router.delete("/", middleware.checkAccessToken, middleware.blockSystemUser, feedController.deleteFeedController)

module.exports = router
