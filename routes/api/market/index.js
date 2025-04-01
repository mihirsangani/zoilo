const express = require("express")
const middleware = require("../../middleware.js")
const marketController = require("./market.controller.js")
const router = express.Router()

router.get("/product", middleware.checkAccessToken, marketController.getProductController)
router.post("/product", middleware.checkAccessToken, middleware.blockSystemUser, marketController.createProductController)
router.put("/product", middleware.checkAccessToken, middleware.blockSystemUser, marketController.updateProductController)
router.delete("/product", middleware.checkAccessToken, middleware.blockSystemUser, marketController.deleteProductController)

router.post("/job-opening", middleware.checkAccessToken, marketController.jobOpeningController)
router.put("/job-opening", middleware.checkAccessToken, marketController.updateJobOpeningController)
router.get("/job-opening", middleware.checkAccessToken, marketController.getJobOpeningController)
router.get("/job-opening-by-id", middleware.checkAccessToken, marketController.getJobOpeningByIdController)
router.put("/job-delete", middleware.checkAccessToken, marketController.deleteJobOpeningController)

router.post("/resume-opening", middleware.checkAccessToken, marketController.createResumeController)
router.put("/resume-opening", middleware.checkAccessToken, marketController.updateResumeController)
router.get("/resume-opening", middleware.checkAccessToken, marketController.getResumeController)
router.get("/resume-opening-by-id", middleware.checkAccessToken, marketController.getResumeByIdController)
router.put("/resume-delete", middleware.checkAccessToken, marketController.deleteResumeController)

module.exports = router
