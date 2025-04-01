const storageModule = require("./storage.module")

const uploadFileController = async (req, res) => {
    const result = await storageModule.uploadFileModule(req)
    return res.send(result)
}

const getFileController = async (req, res) => {
    const result = await storageModule.getFileModule(req)
    return res.send(result)
}

const deleteFileController = async (req, res) => {
    const result = await storageModule.deleteFileModule(req)
    return res.send(result)
}

const refreshSignedUrlController = async (req, res) => {
    const result = await storageModule.refreshSignedUrlModule(req)
    return res.send(result)
}

module.exports = {
    uploadFileController: uploadFileController,
    getFileController: getFileController,
    deleteFileController: deleteFileController,
    refreshSignedUrlController: refreshSignedUrlController
}
