const path = require("path")
const validUrl = require("valid-url")
const validator = require("email-validator")
const marketDb = require("./market.db")
const LibFunction = require("../../../helpers/libfunction")
const constant = require("../../../helpers/constant")
const globalDb = require("../global/global.db")
const categoryDb = require("../category/category.db")
const libfunction = require("../../../helpers/libfunction")
const userDb = require("../user/user.db")

const getProductModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = req.user_id
        const userCity = req.user_data.city;

        const myProductFlag = req.query.my_product_flag == "true" || req.query.my_product_flag == true ? true : false
        const marketTypeId = req.query.market_type_id ? parseInt(req.query.market_type_id) : null
        const productDataId = req.query.product_data_id ? parseInt(req.query.product_data_id) : null
        const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null
        const productPriceTypeId = req.query.product_price_type_id ? parseInt(req.query.product_price_type_id) : null
        const productTypeId = req.query.product_type_id ? parseInt(req.query.product_type_id) : null

        if (!marketTypeId) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        const getMarketTypeDataDb = await globalDb.getMarketTypeDataInDB()
        if (getMarketTypeDataDb.data.filter((ele) => ele.market_type_id == marketTypeId).length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        if (!!productDataId) {
            if (!!categoryId || !!productPriceTypeId || !!productTypeId) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
                }
            }

            const getProductDataDb = await marketDb.getProductDataInDB(productDataId)
            if (getProductDataDb.data.length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
                }
            }
        }

        if (!!categoryId) {
            const getCategoryDataDb = await categoryDb.getMarketCategoryDataDB(categoryId)
            if (getCategoryDataDb.data.length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
                }
            }
        }

        if (!!productPriceTypeId) {
            const getProductPriceTypeDataDb = await globalDb.getProductPriceTypeDataInDB()
            if (getProductPriceTypeDataDb.data.filter((ele) => ele.product_price_type_id == productPriceTypeId).length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
                }
            }
        }

        if (!!productTypeId) {
            const getProductTypeDataDb = await globalDb.getProductTypeDataInDB()
            if (getProductTypeDataDb.data.filter((ele) => ele.product_type_id == productTypeId).length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
                }
            }
        }

        let result = []
        let getFilterProductDataDb = await marketDb.getFilteredProductDataInDB(marketTypeId, productDataId, categoryId, productPriceTypeId, productTypeId, userCity, myProductFlag)
        if (myProductFlag) {
            getFilterProductDataDb["data"] = getFilterProductDataDb.data.filter((element) => element.user_id == userId)
        }

        if (getFilterProductDataDb.data.length > 0) {
            const productDataIdArr = getFilterProductDataDb.data.map((ele) => ele.product_data_id)
            const getProductImageDataDb = await marketDb.getProductImageDataInDB(productDataIdArr.join(","))

            for (let i = 0; i < getFilterProductDataDb.data.length; i++) {
                let filterImageDataDB = getProductImageDataDb.data.filter((element) => element.product_data_id == getFilterProductDataDb.data[i].product_data_id)
                let priceData =
                    getFilterProductDataDb.data[i].market_type_name.toLowerCase() == "sell"
                        ? {
                            total_price: getFilterProductDataDb.data[i].product_price
                        }
                        : {
                            price_start: JSON.parse(getFilterProductDataDb.data[i].product_price)[0],
                            price_end: JSON.parse(getFilterProductDataDb.data[i].product_price)[1]
                        }
                result.push({
                    "product_data_id": getFilterProductDataDb.data[i].product_data_id,
                    "created_by_user_id": getFilterProductDataDb.data[i].user_id,
                    "created_by_username": getFilterProductDataDb.data[i].created_by_username,
                    "created_by_user_profile_icon": getFilterProductDataDb.data[i].profile_icon,
                    "market_type_id": getFilterProductDataDb.data[i].market_type_id,
                    "market_type_name": getFilterProductDataDb.data[i].market_type_name,
                    "product_status_id": getFilterProductDataDb.data[i].product_status_id,
                    "product_status_name": getFilterProductDataDb.data[i].product_status_name,
                    "product_category_id": getFilterProductDataDb.data[i].product_category_id,
                    "product_category_name": getFilterProductDataDb.data[i].product_category_name,
                    "product_sub_category_id": getFilterProductDataDb.data[i].product_sub_category_id,
                    "product_sub_category_name": getFilterProductDataDb.data[i].product_sub_category_name,
                    "product_name": getFilterProductDataDb.data[i].product_name,
                    "product_description": getFilterProductDataDb.data[i].product_description,
                    "product_price_type_id": getFilterProductDataDb.data[i].product_price_type_id,
                    "product_price_type_name": getFilterProductDataDb.data[i].product_price_type_name,
                    "product_price_data": priceData,
                    "product_address": getFilterProductDataDb.data[i].product_address,
                    "product_type_id": getFilterProductDataDb.data[i].product_type_id,
                    "product_type_name": getFilterProductDataDb.data[i].product_type_name,
                    "product_image_data": filterImageDataDB,
                    "city": getFilterProductDataDb.data[i].city,
                    "product_profile_details": {
                        "product_profile_detail_id": getFilterProductDataDb.data[i].product_profile_detail_id,
                        "username": getFilterProductDataDb.data[i].profile_detail_username,
                        "contact_number": getFilterProductDataDb.data[i].contact_number,
                        "whatsapp_number": getFilterProductDataDb.data[i].whatsapp_number,
                        "contact_preference_whatsapp_flag": getFilterProductDataDb.data[i].contact_preference_whatsapp_flag,
                        "contact_preference_call_flag": getFilterProductDataDb.data[i].contact_preference_call_flag,
                        "user_email": getFilterProductDataDb.data[i].profile_detail_user_email,
                        "user_address": getFilterProductDataDb.data[i].profile_detail_user_address
                    }
                })
            }
        }

        return {
            status: true,
            data: result
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const createProductModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = req.user_id

        const obj = {
            userId: userId,
            ipAddress: req.ip
        }

        const marketTypeId = req.body.market_type_id ? parseInt(req.body.market_type_id) : null

        const getMarketTypeDataDb = await globalDb.getMarketTypeDataInDB()
        const filterMarketData = getMarketTypeDataDb.data.filter((element) => element.market_type_id == marketTypeId)

        const checkUserSubscription = await LibFunction.getUsersSubscriptionData(userId, filterMarketData[0]?.market_type_name.toLowerCase());
        console.log(checkUserSubscription)
        if (userId !== 957 && !checkUserSubscription.status && !req.body.paymentStatus) {
            return checkUserSubscription;
        }

        const productCategoryId = req.body.product_category_id ? parseInt(req.body.product_category_id) : null
        const productSubCategoryId = req.body.product_sub_category_id ? parseInt(req.body.product_sub_category_id) : null
        const productName = req.body.product_name || null
        const productDescription = req.body.product_description || null
        const productPriceTypeId = req.body.product_price_type_id ? parseInt(req.body.product_price_type_id) : null
        const productPriceData = req.body.product_price_data || {}
        const productAddress = req.body.product_address || null
        const productTypeId = req.body.product_type_id ? parseInt(req.body.product_type_id) : null
        const productImageData = !req.body.product_image_data || req.body.product_image_data.length == 0 ? [] : req.body.product_image_data
        const productProfileDetail = req.body.product_profile_details || {}
        const userCity = req.body.city || ""

        console.log("--->>> ", req.body)

        if (!productName || Object.keys(productPriceData).length == 0 || !productAddress || !productTypeId) {
            console.log("1")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        if (productImageData?.length) {
            for (let i = 0; i < productImageData.length; i++) {
                if (!validUrl.isUri(productImageData[i].product_image_url)) {
                    console.log("2")
                    return {
                        status: false,
                        error: constant.requestMessages.ERR_INVALID_BODY
                    }
                }

                if (![".png", ".jpeg", ".jpg"].includes(path.extname(productImageData[i].product_image_url))) {
                    console.log("3")
                    return {
                        status: false,
                        error: constant.requestMessages.ERR_INVALID_BODY
                    }
                }
            }
        }

        const profileUsername = productProfileDetail.username || null
        const profileContactNum = productProfileDetail.contact_number || null
        const whatsappNum = productProfileDetail.whatsapp_number || null
        const whatsappPreferenceFlag = productProfileDetail.contact_preference_whatsapp_flag == true || productProfileDetail.contact_preference_whatsapp_flag == "true" ? true : false
        const callPreferenceFlag = productProfileDetail.contact_preference_call_flag == true || productProfileDetail.contact_preference_call_flag == "true" ? true : false
        const profileUserEmail = productProfileDetail.user_email || ""
        const profileUserAddress = productProfileDetail.user_address || null

        // console.log([!profileUsername, !profileContactNum, profileContactNum != userData.contact, !!whatsappPreferenceFlag && !whatsappNum, !whatsappPreferenceFlag && !callPreferenceFlag, !profileUserEmail, !profileUserAddress])
        if (!profileUsername || !profileContactNum || profileContactNum != userData.contact || !profileUserAddress) {
            console.log("4")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const getProductPriceTypeDataDb = await globalDb.getProductPriceTypeDataInDB()
        const filterProductPriceTypeData = getProductPriceTypeDataDb.data.filter((element) => element.product_price_type_id == productPriceTypeId)

        const getProductTypeDataDb = await globalDb.getProductTypeDataInDB()
        const filterProductTypeData = getProductTypeDataDb.data.filter((element) => element.product_type_id == productTypeId)

        if (filterMarketData.length == 0 || filterProductPriceTypeData.length == 0 || filterProductTypeData.length == 0) {
            console.log("5")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        if ((filterMarketData[0].market_type_name.toLowerCase() == "sell" && !productPriceData.total_price) || (filterMarketData[0].market_type_name.toLowerCase() == "demand" && (!productPriceData.price_start || !productPriceData.price_end))) {
            console.log("6")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        if (productCategoryId) {
            const getCategoryDataDb = await categoryDb.getMarketCategoryDataDB(productCategoryId)
            if (getCategoryDataDb.data.length == 0) {
                console.log("7")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }

            if (!productSubCategoryId) {
                console.log("8")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }

            const getSubCategoryDataDb = await categoryDb.getMarketSubCategoryDataDB(productSubCategoryId)
            if (getSubCategoryDataDb.data.length == 0) {
                console.log("9")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }

            if (getSubCategoryDataDb.data[0].parent_category_id != productCategoryId) {
                console.log("10")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }
        }

        const getActiveStatusDataDb = await globalDb.getStatusDataByNameInDB("Active")
        const productStatusId = getActiveStatusDataDb.data[0].status_id

        const productPrice = filterMarketData[0].market_type_name.toLowerCase() == "sell" ? productPriceData.total_price : JSON.stringify([productPriceData.price_start, productPriceData.price_end])

        const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
        const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id

        const addProductDataDb = await marketDb.addProductDataInDB(userId, changeLogId, marketTypeId, productStatusId, productCategoryId, productSubCategoryId, productName, productDescription, productPriceTypeId, productPrice, productAddress, productTypeId, userCity)
        const productDataId = addProductDataDb.data[0].product_data_id

        const addProductImageDataString = []
        for (let i = 0; i < productImageData.length; i++) {
            addProductImageDataString.push(`(${changeLogId}, ${productDataId}, '${productImageData[i].product_image_url}', ${false})`)
        }

        if (addProductImageDataString.length > 0) {
            const addProductImageDataDb = await marketDb.addProductImageDataInDB(addProductImageDataString.join(","))
            if (addProductImageDataDb.data.length != addProductImageDataString.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        const addProductProfileDetailDataDb = await marketDb.addProductProfileDetailsInDB(changeLogId, productDataId, profileUsername, profileContactNum, whatsappNum, whatsappPreferenceFlag, callPreferenceFlag, profileUserEmail, profileUserAddress)
        if (addProductProfileDetailDataDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        let reqObj = req
        reqObj["query"] = {
            "market_type_id": marketTypeId,
            "product_data_id": productDataId
        }
        return await getProductModule(reqObj)
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const updateProductModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = req.user_id

        const obj = {
            userId: userId,
            ipAddress: req.ip
        }

        const productDataId = req.body.product_data_id ? parseInt(req.body.product_data_id) : null
        const marketTypeId = req.body.market_type_id ? parseInt(req.body.market_type_id) : null
        const productCategoryId = req.body.product_category_id ? parseInt(req.body.product_category_id) : null
        const productSubCategoryId = req.body.product_sub_category_id ? parseInt(req.body.product_sub_category_id) : null
        const productName = req.body.product_name || null
        const productDescription = req.body.product_description || null
        const productPriceTypeId = req.body.product_price_type_id ? parseInt(req.body.product_price_type_id) : null
        const productPriceData = req.body.product_price_data || {}
        const productAddress = req.body.product_address || null
        const productTypeId = req.body.product_type_id ? parseInt(req.body.product_type_id) : null
        const productImageData = !req.body.product_image_data || req.body.product_image_data.length == 0 ? [] : req.body.product_image_data
        const productProfileDetail = req.body.product_profile_details || {}

        if (
            !productDataId ||
            !marketTypeId ||
            (!!productCategoryId && !productSubCategoryId) ||
            (!productCategoryId && !!productSubCategoryId) ||
            !productName ||
            !productPriceTypeId ||
            Object.keys(productPriceData).length == 0 ||
            !productAddress ||
            !productTypeId ||
            Object.keys(productProfileDetail).length == 0
        ) {
            console.log("1")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const getProductDataDb = await marketDb.getProductDataInDB(productDataId)
        if (getProductDataDb.data.length == 0) {
            console.log("5")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        if (getProductDataDb.data[0].user_id != userId) {
            console.log("8")
            return {
                status: false,
                error: constant.requestMessages.ERR_ACCESS_NOT_GRANTED
            }
        }

        if (getProductDataDb.data[0].market_type_id != marketTypeId) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        for (let i = 0; i < productImageData.length; i++) {
            if (!validUrl.isUri(productImageData[i].product_image_url)) {
                console.log("2")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }

            if (![".png", ".jpeg", ".jpg"].includes(path.extname(productImageData[i].product_image_url))) {
                console.log("3")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }
        }

        const productProfileDetailId = productProfileDetail.product_profile_detail_id || null
        const profileUsername = productProfileDetail.username || null
        const profileContactNum = productProfileDetail.contact_number || null
        const whatsappNum = productProfileDetail.whatsapp_number || null
        const whatsappPreferenceFlag = productProfileDetail.contact_preference_whatsapp_flag == true || productProfileDetail.contact_preference_whatsapp_flag == "true" ? true : false
        const callPreferenceFlag = productProfileDetail.contact_preference_call_flag == true || productProfileDetail.contact_preference_call_flag == "true" ? true : false
        const profileUserEmail = productProfileDetail.user_email || null
        const profileUserAddress = productProfileDetail.user_address || null

        console.log(userData.contact);
        console.log([!productProfileDetailId, !profileUsername, !profileContactNum, profileContactNum != userData.contact, !!whatsappPreferenceFlag && !whatsappNum, !whatsappPreferenceFlag && !callPreferenceFlag, !profileUserEmail, !profileUserAddress])
        if (!productProfileDetailId || !profileUsername || !profileContactNum || profileContactNum != userData.contact || (!!whatsappPreferenceFlag && !whatsappNum) || (!whatsappPreferenceFlag && !callPreferenceFlag) || !profileUserAddress) {
            console.log("4")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const getProductProfileDetailDb = await marketDb.getProductProfileDetailInDB(productProfileDetailId)
        if (getProductProfileDetailDb.data.length == 0) {
            console.log("6")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        if (getProductProfileDetailDb.data[0].product_data_id != productDataId) {
            console.log("7")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const getMarketTypeDataDb = await globalDb.getMarketTypeDataInDB()
        const filterMarketData = getMarketTypeDataDb.data.filter((element) => element.market_type_id == marketTypeId)

        const getProductPriceTypeDataDb = await globalDb.getProductPriceTypeDataInDB()
        const filterProductPriceTypeData = getProductPriceTypeDataDb.data.filter((element) => element.product_price_type_id == productPriceTypeId)

        const getProductTypeDataDb = await globalDb.getProductTypeDataInDB()
        const filterProductTypeData = getProductTypeDataDb.data.filter((element) => element.product_type_id == productTypeId)

        if (filterMarketData.length == 0 || filterProductPriceTypeData.length == 0 || filterProductTypeData.length == 0) {
            console.log("9")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        if ((filterMarketData[0].market_type_name.toLowerCase() == "sell" && !productPriceData.total_price) || (filterMarketData[0].market_type_name.toLowerCase() == "demand" && (!productPriceData.price_start || !productPriceData.price_end))) {
            console.log("10")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        if (productCategoryId) {
            const getCategoryDataDb = await categoryDb.getMarketCategoryDataDB(productCategoryId)
            if (getCategoryDataDb.data.length == 0) {
                console.log("11")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }

            if (!productSubCategoryId) {
                console.log("12")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }

            const getSubCategoryDataDb = await categoryDb.getMarketSubCategoryDataDB(productSubCategoryId)
            if (getSubCategoryDataDb.data.length == 0) {
                console.log("13")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }

            if (getSubCategoryDataDb.data[0].parent_category_id != productCategoryId) {
                console.log("14")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }
        }

        const productPrice = filterMarketData[0].market_type_name.toLowerCase() == "sell" ? productPriceData.total_price : JSON.stringify([productPriceData.price_start, productPriceData.price_end])

        const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
        const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id

        const addProductDataLogsDb = await marketDb.addProductDataLogsInDB(productDataId)
        if (addProductDataLogsDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const updateProductDataDb = await marketDb.updateProductDataInDB(productDataId, changeLogId, productCategoryId, productSubCategoryId, productName, productDescription, productPriceTypeId, productPrice, productAddress, productTypeId)
        if (updateProductDataDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const removeProductImageDataDb = await marketDb.removeProductImageDataInDB(productDataId)

        const addProductImageDataString = []
        for (let i = 0; i < productImageData.length; i++) {
            addProductImageDataString.push(`(${changeLogId}, ${productDataId}, '${productImageData[i].product_image_url}', ${false})`)
        }

        if (addProductImageDataString.length > 0) {
            const addProductImageDataDb = await marketDb.addProductImageDataInDB(addProductImageDataString.join(","))
            if (addProductImageDataDb.data.length != addProductImageDataString.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        const addProductProfileDetailDataLogsDb = await marketDb.addProductProfileDetailsLogsInDB(productProfileDetailId)
        if (addProductProfileDetailDataLogsDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const updateProductProfileDetailDb = await marketDb.updateProductProfileDetailsInDB(productProfileDetailId, changeLogId, profileUsername, profileContactNum, whatsappNum, whatsappPreferenceFlag, callPreferenceFlag, profileUserEmail, profileUserAddress)
        if (updateProductProfileDetailDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        let reqObj = req
        reqObj["query"] = {
            "market_type_id": marketTypeId,
            "product_data_id": productDataId
        }
        return await getProductModule(reqObj)
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const deleteProductModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = req.user_id
        const userCity = req.user_data.city;

        const obj = {
            userId: userId,
            ipAddress: req.ip
        }

        const marketTypeId = req.query.market_type_id ? parseInt(req.query.market_type_id) : null
        const productDataId = req.query.product_data_id ? parseInt(req.query.product_data_id) : null
        const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null
        const productPriceTypeId = req.query.product_price_type_id ? parseInt(req.query.product_price_type_id) : null
        const productTypeId = req.query.product_type_id ? parseInt(req.query.product_type_id) : null

        if (!marketTypeId || !productDataId) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        const getProductDataDb = await marketDb.getFilteredProductDataInDB(marketTypeId, productDataId, categoryId, productPriceTypeId, productTypeId, userCity)
        if (getProductDataDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        if (getProductDataDb.data[0].user_id != userId) {
            return {
                status: false,
                error: constant.requestMessages.ERR_ACCESS_NOT_GRANTED
            }
        }

        const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
        const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id

        const addProductProfileDetailsLogsDb = await marketDb.addProductProfileDetailsLogsInDB(getProductDataDb.data[0].product_profile_detail_id)
        if (addProductProfileDetailsLogsDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const removeProductProfileDetailDb = await marketDb.removeProductProfileDetailInDB(getProductDataDb.data[0].product_profile_detail_id, changeLogId)
        if (removeProductProfileDetailDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const removeProductImageDataDb = await marketDb.removeProductImageDataInDB(productDataId)

        const addProductDataLogsDb = await marketDb.addProductDataLogsInDB(productDataId)
        if (addProductDataLogsDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const removeProductDataDb = await marketDb.removeProductDataInDB(productDataId, changeLogId)
        if (removeProductDataDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return {
            status: true,
            data: constant.requestMessages.PRODUCT_DELETED
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const jobOpeningModule = async (req) => {
    var businessId = req.user_data.user_business_data.business_id
    const businessCity = req.body.cities;
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

    const checkUserSubscription = await LibFunction.getUsersSubscriptionData(userId, "job");
    console.log(checkUserSubscription)
    if (userId !== 957 && !checkUserSubscription.status && !req.body.paymentStatus) {
        return checkUserSubscription;
    }

    const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
    const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
    req.body.change_log_id = changeLogId
    req.body.business_id = businessId
    req.body.flag_deleted = false
    req.body.timestamp = await libfunction.formateDateLib(new Date())
    req.body.city = businessCity.join(", ");
    delete req.body.paymentStatus;
    delete req.body.cities;
    var jobOpeningObj = []
    Object.entries(req.body).map(x => jobOpeningObj.push({ "field": x[0], "value": x[1] }))
    var createJobOpening = await marketDb.createJobOpeningDb(jobOpeningObj)

    if (createJobOpening.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    return { status: true, data: createJobOpening.data[0] }
}

const updateJobOpeningModule = async (req) => {
    console.log(req.body, " <<<---")
    var businessId = req.user_data.user_business_data.business_id
    var userId = req.user_id
    const obj = {
        userId: userId,
        ipAddress: req.ip
    }
    if (businessId == null || req.body.job_opening_id == undefined || req.body.job_opening_id == null || req.body.job_opening_id == "") {
        return {
            status: false,
            error: constant.requestMessages.ERR_BAD_REQUEST
        }
    }
    const jobOpeningObjWhere = `job_opening_id = '${req.body.job_opening_id}'`
    delete req.body.job_opening_id
    const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
    const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
    req.body.change_log_id = changeLogId
    req.body.business_id = businessId
    req.body.timestamp = await libfunction.formateDateLib(new Date())
    req.body.city = req.body?.cities?.join(", ");
    delete req.body.cities;
    var jobOpeningObj = []
    Object.entries(req.body).map(x => jobOpeningObj.push({ "field": x[0], "value": x[1] }))
    var updateJobOpening = await marketDb.updateJobOpeningDb(jobOpeningObj, jobOpeningObjWhere)

    if (updateJobOpening.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    return { status: true, data: updateJobOpening.data[0] }
}

const deleteJobOpeningModule = async (req) => {
    const id = req.query.id || null;
    if (id) {
        let deleteJob = await marketDb.deleteRowDb('job_opening', 'job_opening_id', id);

        if (deleteJob.status == false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return { status: true, data: deleteJob.data[0] }
    }

    return { status: false, data: "ID not found !" }
}

const getJobOpeningModule = async (req, res) => {
    var flag_single = req.query.flag_single === "true" ? true : false
    var businessId = req.user_data.user_business_data.business_id
    const keyword = req.query?.keyword || ""
    const userCity = req.query?.cities || req.user_data.city;
    const education = req.query?.education || '';
    console.log("--->>> ", req.query)

    var jobOpening = await marketDb.getJobOpeningDb(flag_single, businessId, userCity?.trim(), education, keyword)

    if (jobOpening.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    if (jobOpening.data.length == 0) {
        return {
            status: true,
            data: []
        }
    }
    var businessId = jobOpening.data.map(x => x.business_id)
    var businessDetail = await marketDb.getBusinessDetailDb(businessId.join("','"))

    if (businessDetail.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    jobOpening = jobOpening.data.map(x => {
        x["business"] = businessDetail.data.filter(y => x.business_id == y.business_id)[0]
        return x
    })

    return { status: true, data: jobOpening }
}

const getJobOpeninByIdgModule = async (req, res) => {
    const id = req.query.id || "";
    var jobOpening = await marketDb.getJobOpeningByIdDb(id)

    if (jobOpening.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    if (jobOpening.data.length == 0) {
        return {
            status: true,
            data: []
        }
    }
    var businessId = jobOpening.data.map(x => x.business_id)
    var businessDetail = await marketDb.getBusinessDetailDb(businessId.join("','"))

    if (businessDetail.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    jobOpening = jobOpening.data.map(x => {
        x["business"] = businessDetail.data.filter(y => x.business_id == y.business_id)[0]
        return x
    })

    return { status: true, data: jobOpening }
}

const getResumeModule = async (req, res) => {
    var flag_single = req.query.flag_single === "true" ? true : false
    const education = req.query?.education || '';
    const role = req.query?.role || '';
    const user_id = req.user_id;
    const userCity = req.query?.cities || req.user_data?.city;
    console.log("--->>> ", req.query)

    var resumeDetail = await marketDb.getResumeDetailDb(flag_single, user_id, education, role, userCity?.trim())

    if (resumeDetail.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    if (resumeDetail.data.length == 0) {
        return {
            status: true,
            data: []
        }
    }

    // var businessId = resumeDetail.data.map( x => x.business_id )
    // var businessDetail = await marketDb.getBusinessDetailDb(businessId.join("','"))

    // if(businessDetail.status == false){
    //     return {
    //         status:false,
    //         error:constant.requestMessages.ERR_GENERAL
    //     } 
    // }

    // resumeDetail  = resumeDetail.data.map( x => {
    //     x["business"] = businessDetail.data.filter( y => x.business_id == y.business_id )[0]
    //     return x
    // })

    return { status: true, data: resumeDetail.data }
}

const getResumeByIdModule = async (req, res) => {
    const id = req.query.id || "";
    var resumeDetail = await marketDb.getResumeByIdDb(id)

    if (resumeDetail.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    if (resumeDetail.data.length == 0) {
        return {
            status: true,
            data: []
        }
    }

    // var businessId = resumeDetail.data.map( x => x.business_id )
    // var businessDetail = await marketDb.getBusinessDetailDb(businessId.join("','"))

    // if(businessDetail.status == false){
    //     return {
    //         status:false,
    //         error:constant.requestMessages.ERR_GENERAL
    //     } 
    // }

    // resumeDetail  = resumeDetail.data.map( x => {
    //     x["business"] = businessDetail.data.filter( y => x.business_id == y.business_id )[0]
    //     return x
    // })

    return { status: true, data: resumeDetail.data }
}

const createResumeModule = async (req) => {
    var businessId = req.user_data?.user_business_data?.business_id || null;
    var userId = req.user_id
    const obj = {
        userId: userId,
        ipAddress: req.ip
    }
    const businessCity = req.body.cities || []

    // if(businessId == null){
    //     return {
    //         status:false,
    //         error:constant.requestMessages.ERR_BAD_REQUEST
    //     }
    // }

    if (userId !== 957 && !req.body.paymentStatus) {
        return {
            status: false,
            error: constant.requestMessages.ERR_ACCESS_NOT_GRANTED
        }
    }

    const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
    const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
    req.body.change_log_id = changeLogId
    req.body.business_id = businessId
    req.body.flag_deleted = false
    req.body.timestamp = await libfunction.formateDateLib(new Date())
    req.body.cities = businessCity?.join(", ");
    delete req.body.paymentStatus;
    let resumeOpeningObj = []
    Object.entries(req.body).map(x => resumeOpeningObj.push({ "field": x[0], "value": x[1] }))
    let createResume = await marketDb.createResumeDb(resumeOpeningObj)

    if (createResume.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    return { status: true, data: createResume.data[0] }

}

const updateResumeModule = async (req) => {
    console.log(req.body, " <<<---")
    // var businessId = req.user_data.user_business_data.business_id
    var userId = req.user_id
    const obj = {
        userId: userId,
        ipAddress: req.ip
    }
    if (req.body.resume_detail_id == undefined || req.body.resume_detail_id == null || req.body.resume_detail_id == "") {
        return {
            status: false,
            error: constant.requestMessages.ERR_BAD_REQUEST
        }
    }
    const resumeOpeningObjWhere = `resume_detail_id = '${req.body.resume_detail_id}'`
    delete req.body.resume_detail_id
    const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
    const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
    req.body.change_log_id = changeLogId
    req.body.timestamp = await libfunction.formateDateLib(new Date())
    req.body.cities = req.body?.cities?.join(", ");
    var resumeOpeningObj = []
    Object.entries(req.body).map(x => resumeOpeningObj.push({ "field": x[0], "value": x[1] }))
    var updateResumeOpening = await marketDb.updateResumeOpeningDb(resumeOpeningObj, resumeOpeningObjWhere)

    if (updateResumeOpening.status == false) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }

    return { status: true, data: updateResumeOpening.data[0] }
}

const deleteResumeModule = async (req) => {
    const id = req.query.id || null;
    if (id) {
        let deleteResume = await marketDb.deleteRowDb('resume_detail', 'resume_detail_id', id);

        if (deleteResume.status == false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }
        return { status: true, data: deleteResume.data[0] }
    }

    return { status: false, data: "ID not found !" }
}

module.exports = {
    getProductModule: getProductModule,
    createProductModule: createProductModule,
    updateProductModule: updateProductModule,
    deleteProductModule: deleteProductModule,
    jobOpeningModule: jobOpeningModule,
    updateJobOpeningModule: updateJobOpeningModule,
    deleteJobOpeningModule: deleteJobOpeningModule,
    getJobOpeningModule: getJobOpeningModule,
    getJobOpeninByIdgModule: getJobOpeninByIdgModule,
    getResumeModule: getResumeModule,
    getResumeByIdModule: getResumeByIdModule,
    createResumeModule: createResumeModule,
    updateResumeModule: updateResumeModule,
    deleteResumeModule: deleteResumeModule
}
