const express = require("express")
const router = express.Router()

const adminAPI = require("./api/admin")
const authAPI = require("./api/auth")
const businessAPI = require("./api/business")
const categoryAPI = require("./api/category")
const globalAPI = require("./api/global")
const portalAPI = require("./api/portal")
const storageAPI = require("./api/storage")
const userAPI = require("./api/user")
const users = require("./users")
const feedAPI = require("./api/feed")
const newsAPI = require("./api/news")
const marketAPI = require("./api/market")

router.use("/api/admin", adminAPI)
router.use("/api/auth", authAPI)
router.use("/api/business", businessAPI)
router.use("/api/category", categoryAPI)
router.use("/api/global", globalAPI)
router.use("/api/portal", portalAPI)
router.use("/api/storage", storageAPI)
router.use("/api/user", userAPI)
router.use("/users", users)
router.use("/api/feed", feedAPI)
router.use("/api/news", newsAPI)
router.use("/api/market", marketAPI)

router.use("*", (req, res) => {
    return res.status(404).send({
        status: false,
        error: {
            code: 404,
            message: "Invalid! API request found."
        }
    })
})

module.exports = router
