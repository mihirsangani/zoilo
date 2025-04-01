const { Router } = require("express")
const middleware = require("../../middleware")
const storageController = require("./storage.controller")
const router = Router()
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        const date = new Date()
        var picName = `${path.parse(file.originalname.split(" ").join("_")).name}_${date.getTime()}${path.parse(file.originalname).ext}`
        cb(null, picName)
    }
})

const fileFilter = function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.indexOf("image/") > -1 || file.mimetype.indexOf("pdf") > -1) {
        cb(null, true)
    } else {
        cb(new Error("Only image/pdf files are allowed!"), false)
    }
}

const upload = multer({
    storage: storage
    // fileFilter: fileFilter
})

router.post("/upload", middleware.checkAccessToken, upload.array("file", 10), storageController.uploadFileController)
// router.get("/file", storageController.getFileController)
// router.delete("/file", middleware.checkAccessToken, storageController.deleteFileController)
// router.post("/refresh-signed-url", middleware.checkAccessToken, storageController.refreshSignedUrlController)

module.exports = router
