const constant = require("../../../helpers/constant")
const libfunction = require("../../../helpers/libfunction")
const newsDb = require("./news.db")

const getNewsModule = async (req) => {
    const userId = req.user_id

    let news = await newsDb.getNewsDb()

    if (news.status == false) {
        return {
            status: false,
            errro: constant.requestMessages.ERR_GENERAL
        }
    }

    if (news.data.length == 0) {
        return {
            status: true,
            data: []
        }
    }

    const newsImage = await newsDb.getNewsImageDb(news.data.map((x) => x.daily_news_id).join("','"))

    if (newsImage.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    // const newsTeg = await newsDb.getNewsTegDb(news.data.map((x) => x.daily_news_id).join("','"))

    // if (newsTeg.status == false) {
    //     return {
    //         status: false,
    //         error: constant.requestMessages.ERR_GENERAL
    //     }
    // }

    // const newsLike = await newsDb.getNewsUserLikeDb(news.data.map((x) => x.daily_news_id).join("','"), userId)

    // if (newsLike.status == false) {
    //     return {
    //         status: false,
    //         error: constant.requestMessages.ERR_GENERAL
    //     }
    // }

    const result = news.data.map((x) => {
        const newsImageFilter = newsImage.data.filter((y) => parseInt(y.daily_news_id) == parseInt(x.daily_news_id))
        x["news_image"] = newsImageFilter
        // const newsTagFilter = newsTeg.data.filter((y) => parseInt(y.daily_news_id) == parseInt(x.daily_news_id))
        // x["news_tag"] = newsTagFilter
        // const newsLikeFilter = newsLike.data.filter((y) => parseInt(y.daily_news_id) == parseInt(x.daily_news_id))
        // x["flag_like"] = newsLikeFilter.length == 0 ? false : true
        return x
    })

    return { status: true, data: result }
}

const getNewsDetailModule = async (req) => {
    var userId = req.user_id
    var newsId = req.query.news_id
    var news = await newsDb.getNewsByIdDb(newsId)

    if (news.status == false) {
        return {
            status: false,
            errro: constant.requestMessages.ERR_GENERAL
        }
    }

    if (news.data.length == 0) {
        return {
            status: true,
            data: []
        }
    }

    var newsImage = await newsDb.getNewsImageDb(news.data.map((x) => x.daily_news_id).join("','"))

    if (newsImage.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    var newsTeg = await newsDb.getNewsTegDb(news.data.map((x) => x.daily_news_id).join("','"))

    if (newsTeg.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    var newsLike = await newsDb.getNewsUserLikeDb(news.data.map((x) => x.daily_news_id).join("','"), userId)

    if (newsLike.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    var similerNews = await newsDb.getSimilerNewsDb(newsTeg.data.map((x) => x.daily_news_tag_name))

    if (similerNews.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }
    var resultData = []
    if (similerNews.data.length != 0) {
        var newsData = await newsDb.getNewsByIdDb(newsId)

        if (newsData.status == false) {
            return {
                status: false,
                errro: constant.requestMessages.ERR_GENERAL
            }
        }

        if (newsData.data.length == 0) {
            return {
                status: true,
                data: []
            }
        }

        var newsImageData = await newsDb.getNewsImageDb(news.data.map((x) => x.daily_news_id).join("','"))

        if (newsImageData.status == false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        resultData = newsData.data.map((x) => {
            var newsImageFilter = newsImageData.data.filter((y) => parseInt(y.daily_news_id) == parseInt(x.daily_news_id))
            x["news_image"] = newsImageFilter
            return x
        })
    }

    var result = news.data.map((x) => {
        var newsImageFilter = newsImage.data.filter((y) => parseInt(y.daily_news_id) == parseInt(x.daily_news_id))
        x["news_image"] = newsImageFilter
        var newsTagFilter = newsTeg.data.filter((y) => parseInt(y.daily_news_id) == parseInt(x.daily_news_id))
        x["news_tag"] = newsTagFilter
        var newsLikeFilter = newsLike.data.filter((y) => parseInt(y.daily_news_id) == parseInt(x.daily_news_id))
        x["flag_like"] = newsLikeFilter.length == 0 ? false : true
        x["similer_news"] = resultData.filter((y) => parseInt(y.daily_news_id) != parseInt(x.daily_news_id))
        return x
    })
    return { status: true, data: result[0] }
}

const likeNewsModule = async (req) => {
    try {
        const newsId = req.query?.id;
        if (!newsId) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        await newsDb.updateLikeNewsDb(newsId);
        return {
            success: true,
            message: "Like added successfully."
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error
        }
    }
}

module.exports = {
    getNewsModule: getNewsModule,
    getNewsDetailModule: getNewsDetailModule,
    likeNewsModule: likeNewsModule
}
