const newsModule = require("./news.module")

const getNewsController = async (req, res) => {
    const result = await newsModule.getNewsModule(req)
    return res.send(result)
}

const getNewsDetailController = async (req, res) => {
    const result = await newsModule.getNewsDetailModule(req)
    return res.send(result)
}

const likeNewsController = async (req, res) => {
    const result =  await newsModule.likeNewsModule(req)
    return res.send(result)
}

module.exports = {
    getNewsController: getNewsController,
    getNewsDetailController: getNewsDetailController,
    likeNewsController: likeNewsController
}