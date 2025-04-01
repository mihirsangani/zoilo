const feedModule = require("./feed.module")

const getFeedController = async (req, res) => {
    const result = await feedModule.getFeedModule(req)
    return res.send(result)
}

const createFeedController = async(req,res) => {
    const result = await feedModule.createFeedModule(req)
    return res.send(result)
}

const updateFeedController = async(req,res) => {
    const result = await feedModule.updateFeedModule(req)
    return res.send(result)
}

const getMyFeedController = async(req,res) => {
    const result = await feedModule.getMyFeedFeedModule(req)
    return res.send(result)
}

const feedLikeController = async(req,res) => {
    const result = await feedModule.feedLikeModule(req)
    return res.send(result)
}

const deleteFeedController = async(req,res) => {
    const result = await feedModule.deleteFeedModule(req)
    return res.send(result)
}

module.exports = {
    getFeedController:getFeedController,
    createFeedController:createFeedController,
    updateFeedController:updateFeedController,
    getMyFeedController:getMyFeedController,
    feedLikeController:feedLikeController,
    deleteFeedController:deleteFeedController
}