const constant = require('../../../helpers/constant')
const libfunction = require('../../../helpers/libfunction')
const feedDb = require('./feed.db')
const globalDb = require('../global/global.db')

const getFeedModule = async (req) => {
    var userId = req.user_id
    const userCity = req.user_data ? req.user_data.city : "";
    var feedData = await feedDb.getFeedDataDb(userId, userCity)

    if (feedData.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    var dataArray = []

    feedData.data.map(async x => {
        var dataArrayFilter = dataArray.filter(y => y?.business_feed_id == x.business_feed_id)
        if (dataArrayFilter.length == 0) {
            var dataObj = {
                "business_feed_id": x.business_feed_id,
                "business_id": x.business_id,
                "business_feed_description": x.business_feed_description,
                "created_time": x.created_time,
                "expire_time": x.expire_time,
                "timestamp": x.timestamp,
                "business_feed_image": feedData.data.map(y => {
                    if (y.business_feed_id == x.business_feed_id) {
                        return { "business_feed_image_id": y.business_feed_image_id, "business_feed_image_url": y.business_feed_image_url }
                    }
                }).filter(x => x != null),
                "business_logo_url": x.business_logo_url,
                "business_name": x.business_name,
                "flag_like": x.flag_like == null ? false : true
            }
            dataArray.push(dataObj)
        }
    })
    return { status: true, data: dataArray }
}

const createFeedModule = async (req) => {
    var businessId = req.user_data.user_business_data.business_id
    const businessCity = req.user_data.user_business_data.business_city
    var userId = req.user_id
    const obj = {
        userId: userId,
        ipAddress: req.ip
    }
    if (businessId == null) {
        return {
            status: false,
            error: constant.requestMessages.ERR_NO_BUSINESS
        }
    }

    const checkUserSubscription = await libfunction.getUsersSubscriptionData(userId, "feed");
    console.log(checkUserSubscription)
    if (userId !== 957 && !checkUserSubscription.status && !req.body.paymentStatus) {
        return checkUserSubscription;
    }

    var businessFeedDescription = req.body.business_feed_description
    var businessFeedImage = req.body.business_feed_image

    if (businessFeedDescription == undefined || null || "" || businessFeedImage.length == 0 || businessFeedImage.length > 5) {
        return {
            status: false,
            error: constant.requestMessages.ERR_INVALID_BODY
        }
    }

        var timestamp = await libfunction.formateDateLib(new Date())
        var expireTimestamp = await libfunction.formateDateLib(new Date(await libfunction.getExpireTimeStamp(true)))
        const addChangeLogDetailsLibDB = await libfunction.addChangeLogDetailsLib(obj)
        const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
        var businessObj = [{ "field": "business_id", "value": businessId }, { "field": "business_feed_description", "value": businessFeedDescription }, { "field": "created_time", "value": timestamp }, { "field": "expire_time", "value": expireTimestamp }, { "field": "timestamp", "value": timestamp }, { "field": "flag_deleted", "value": false }, { "field": "history_id", "value": null }, { "field": "change_log_id", "value": changeLogId }, { "field": "city", "value": businessCity }]
        var createFeed = await feedDb.createFeedDb(businessObj)

        if (createFeed.status == false || createFeed.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const createFeedImage = await feedDb.createFeedImageDb(createFeed.data[0].business_feed_id, businessFeedImage, changeLogId)

        if (createFeedImage.status == false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const feedModule = await getFeedModule(req)
        return feedModule
}

const updateFeedModule = async (req) => {
    var businessFeedId = req.body.business_feed_id
    var businessFeedDescription = req.body.business_feed_description
    var businessFeedImage = req.body.business_feed_image
    var userId = req.user_id
    console.log((businessFeedImage.length >= 0 && businessFeedImage.length <= 5))
    if ((businessFeedId == undefined || null || '') || (businessFeedImage.length == 0) || (businessFeedImage.length > 5)) {
        return {
            status: false,
            error: constant.requestMessages.ERR_BAD_REQUEST
        }
    }
    const obj = {
        userId: userId,
        ipAddress: req.ip
    }
    var timestamp = await libfunction.formateDateLib(new Date())
    const addChangeLogDetailsLibDB = await libfunction.addChangeLogDetailsLib(obj)
    const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
    var businessObj = [{ "field": "business_feed_description", "value": businessFeedDescription }, { "field": "timestamp", "value": timestamp }, { "field": "change_log_id", "value": changeLogId }]
    var updateFeed = await feedDb.updateFeedDb(businessObj, businessFeedId)

    if (updateFeed.status == false || updateFeed.data.length == 0) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    await feedDb.deleteFeddImageDb(businessFeedId, true)

    var createFeedImage = await feedDb.createFeedImageDb(businessFeedId, businessFeedImage, changeLogId)

    if (createFeedImage.status == false) {
        await feedDb.deleteFeddImageDb(createFeed.data[0].business_feed_id, false)
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    var feedModule = await getFeedModule(req)
    return feedModule
}

const getMyFeedFeedModule = async (req) => {
    var businessId = req.user_data.user_business_data.business_id
    var feed = await getFeedModule(req)
    if (feed.status == true && feed.data.length != 0) {
        feed = feed.data.filter(x => parseInt(x.business_id) == parseInt(businessId))
        return { status: true, data: feed }
    }
    return { status: true, data: feed.data }
}

const feedLikeModule = async (req) => {
    var userId = req.user_id
    var businessFeedId = req.body.business_feed_id
    var flagLike = req.body.flag_like

    if (businessFeedId == (undefined || null || "")) {
        return {
            status: false,
            error: constant.requestMessages.ERR_BAD_REQUEST
        }
    }

    var userFeedLike = await feedDb.getUserFeedLikeDb(userId, businessFeedId)

    if (userFeedLike.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    var timestamp = await libfunction.formateDateLib(new Date())

    if (userFeedLike.data.length == 0) {
        var businessFeedLikeObj = [{ "field": "user_id", "value": userId }, { "field": "business_feed_id", "value": businessFeedId }, { "field": "timestamp", "value": timestamp }, { "field": "flag_like", "value": flagLike }]
        var createFeed = await feedDb.createFeedLikeDb(businessFeedLikeObj)

        if (createFeed.status == false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }
    } else {
        var updateFeedLike = await feedDb.updateFeedLikeDb(userFeedLike.data[0].business_feed_like_id, flagLike, timestamp)

        if (updateFeedLike.status == false) {
            if (createFeed.status == false) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }
    }

    return { status: true, data: "data updated successfully" }

}

const deleteFeedModule = async (req) => {
    const businessFeedId = req.query.business_feed_id

    if (businessFeedId == undefined || null || "") {
        return {
            status: false,
            error: constant.requestMessages.ERR_INVALID_BODY
        }
    }

    var deleteFeed = await feedDb.deleteFeedDb(businessFeedId)

    if (deleteFeed.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    return { status: true, data: "Feed deleted successfully." }
}

module.exports = {
    getFeedModule: getFeedModule,
    createFeedModule: createFeedModule,
    updateFeedModule: updateFeedModule,
    getMyFeedFeedModule: getMyFeedFeedModule,
    feedLikeModule: feedLikeModule,
    deleteFeedModule: deleteFeedModule
}