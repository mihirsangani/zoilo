const crud = require("../../crud")
const businessDb = require("../business/business.db")

const getFeedDataDb = async(userId, userCity) => {
    if (userCity) {
        userCity = `AND bf.city = '${userCity}'`
    } else {
        userCity = ""
    }

    const sql = `
    select bf.*,bfi.business_feed_image_id,bfi.business_feed_image_url,business.business_logo_url,business.business_name,bfl.business_feed_like_id,bfl.user_id,bfl.flag_like from 
	business_feed as bf
    join business_feed_image as bfi
        on bf.business_feed_id = bfi.business_feed_id
    join (	select b.business_id,bd.business_logo_url,bd.business_name from business as b 
            join business_data as bd
            on b.business_id = bd.business_id
            where b.history_id is null and b.flag_deleted = false
            and bd.history_id is null and bd.flag_deleted = false
            and b.business_status_id = 1
    ) as business
    on business.business_id = bf.business_id
    left join business_feed_like as bfl
        on bfl.business_feed_id = bf.business_feed_id and user_id = '${userId}' and flag_like = true
    where bf.history_id is null and bf.flag_deleted = false and bf.expire_time >= (CURRENT_DATE) ${userCity}
    and bfi.history_id is null and bfi.flag_deleted = false
    ORDER BY bf.created_time desc
    `
    const result = await crud.executeQuery(sql)
    return result
} 

const createFeedDb = async(feedObj) => {
    const sql = crud.makeInsertQueryString("business_feed",feedObj,[],true)
    const result = await crud.executeQuery(sql)
    return result
}

const createFeedImageDb = async(feedId,feedImageObj,changeLogId) => {
    feedImageObj = feedImageObj.map( x => {return `('${feedId}','${x.business_feed_image_url}',false,null,'${changeLogId}')`}  )
    const sql = `Insert into business_feed_image ("business_feed_id","business_feed_image_url","flag_deleted","history_id","change_log_id") values ${feedImageObj.join(',')}`
    const result = await crud.executeQuery(sql)
    return result 
}

const updateFeedDb = async(feedObj,businessFeedId) => {
    const sql =  crud.makeUpdateQueryString("business_feed",feedObj,`business_feed_id = '${businessFeedId}'`)
    const result = await crud.executeQuery(sql)
    return result
}

const deleteFeddImageDb = async(businessFeedId,flagDeleted) => {
    const sql = `update business_feed_image set flag_deleted = ${flagDeleted} where business_feed_id = '${businessFeedId}'`
    const result = await crud.executeQuery(sql)
    return result
}

const getUserFeedLikeDb = async (userId,businessFeedId) => {
    const sql = `select * from business_feed_like where user_id = '${userId}' and business_feed_id = '${businessFeedId}'`
    const result = await crud.executeQuery(sql)
    return result
}

const createFeedLikeDb = async(businessFeedObj) => {
    const sql =  crud.makeInsertQueryString("business_feed_like",businessFeedObj,undefined,true)
    const result = await crud.executeQuery(sql)
    return result
}

const updateFeedLikeDb = async(businessFeedId,flagLike,timestamp) => {
    const sql =  `update business_feed_like set flag_like = '${flagLike}',timestamp = '${timestamp}' where business_feed_like_id ='${businessFeedId}'`
    const result = await crud.executeQuery(sql)
    return result
}

const deleteFeedDb = async(businessFeedId) => {
    const sql =  `update business_feed set flag_deleted = 'true' where history_id is null and flag_deleted = 'false' and business_feed_id = '${businessFeedId}'`
    const result = await crud.executeQuery(sql)
    return result
}

const countFeeds = async (id) => {
    const sql = `SELECT 
                cl.user_id, 
                COUNT(CASE 
                        WHEN bf.timestamp >= DATE_TRUNC('month', CURRENT_DATE)
                        AND bf.timestamp < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' 
                        THEN bf.business_feed_id 
                    END) AS total_feeds_last_month
                FROM change_log cl 
                JOIN business_feed bf  
                ON cl.change_log_id = bf.change_log_id 
                WHERE cl.user_id = ${id}
                GROUP BY cl.user_id;`

    const result = await crud.executeQuery(sql);
    return result;
}

module.exports = {
    getFeedDataDb:getFeedDataDb,
    createFeedDb:createFeedDb,
    createFeedImageDb:createFeedImageDb,
    updateFeedDb:updateFeedDb,
    deleteFeddImageDb:deleteFeddImageDb,
    getUserFeedLikeDb:getUserFeedLikeDb,
    createFeedLikeDb:createFeedLikeDb,
    updateFeedLikeDb:updateFeedLikeDb,
    deleteFeedDb:deleteFeedDb,
    countFeeds: countFeeds
}