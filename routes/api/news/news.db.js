const crud = require("../../crud")
const businessDb = require("../business/business.db")

const getNewsDb = async () => {
    const sql = `select * from daily_news where flag_deleted = false and expire_time >= CURRENT_DATE ORDER BY created_time desc`
    const result = await crud.executeQuery(sql)
    return result
}

const getNewsImageDb = async (newsId) => {
    const sql = `select * from daily_news_image where flag_deleted = false and daily_news_id in ('${newsId}')`
    const result = await crud.executeQuery(sql)
    return result
}

const getNewsTegDb = async (newsId) => {
    const sql = `select * from daily_news_tag where flag_deleted = false and daily_news_id in ('${newsId}')`
    const result = await crud.executeQuery(sql)
    return result
}

const getNewsUserLikeDb = async (newsId, userId) => {
    const sql = `select * from daily_news_user_like where flag_like = true and daily_news_id in ('${newsId}') and user_id = '${userId}'`
    const result = await crud.executeQuery(sql)
    return result
}

const getNewsByIdDb = async (newsId) => {
    const sql = `select * from daily_news where flag_deleted = false and daily_news_id in ('${newsId}')`
    const result = await crud.executeQuery(sql)
    return result
}

const getSimilerNewsDb = async (tags) => {
    tags = tags.map(x => { return `daily_news_tag_name like '%${x}%'` })
    const sql = `select Distinct daily_news_id from daily_news_tag where flag_deleted = false and (${tags.join(' or ')})`
    const result = await crud.executeQuery(sql)
    return result
}

const updateLikeNewsDb = async (id) => {
    const sql = `UPDATE daily_news SET daily_news_like_count = daily_news_like_count + 1 WHERE daily_news_id = ${id}`
    const result = await crud.executeQuery(sql)
    return result
}

module.exports = {
    getNewsDb: getNewsDb,
    getNewsImageDb: getNewsImageDb,
    getNewsTegDb: getNewsTegDb,
    getNewsUserLikeDb: getNewsUserLikeDb,
    getNewsByIdDb: getNewsByIdDb,
    getSimilerNewsDb: getSimilerNewsDb,
    updateLikeNewsDb: updateLikeNewsDb
}