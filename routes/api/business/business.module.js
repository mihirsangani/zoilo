const moment = require("moment-timezone")
const fs = require("fs");
const csvParser = require("csv-parser");
const businessDb = require("./business.db")
const constant = require("../../../helpers/constant")
const categoryDb = require("../category/category.db")
const globalDb = require("../global/global.db")
const LibFunction = require("../../../helpers/libfunction");
const authDb = require("../auth/auth.db");
const userDb = require("../user/user.db");

const getBusinessTypeModule = async (req) => {
    try {
        const getBusinessTypeDb = await businessDb.getBusinessTypeDataInDB()
        let result = []
        for (let i = 0; i < getBusinessTypeDb.data.length; i++) {
            result.push({
                business_type_id: getBusinessTypeDb.data[i].business_type_id,
                business_type_name: getBusinessTypeDb.data[i].business_type_name,
                gujarati_business_type_name: getBusinessTypeDb.data[i].gujarati_business_type_name
            })
        }

        return {
            status: true,
            data: result
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }
}

const getWeekDataModule = async (req) => {
    try {
        const getWeekDaysDataDb = await businessDb.getWeekDayDataInDB()
        let result = []
        for (let i = 0; i < getWeekDaysDataDb.data.length; i++) {
            result.push({
                week_day_id: getWeekDaysDataDb.data[i].week_day_id,
                week_day_name: getWeekDaysDataDb.data[i].week_day_name
            })
        }

        return {
            status: true,
            data: result
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }
}

const getBusinessListModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = userData.user_id
        const userTaluka = userData?.taluka ?? "";

        const subCategoryId = req.query.sub_category_id
        if (!subCategoryId) {
            console.log("1")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        const getSubCategoryDataDb = await categoryDb.getSubCategoryDataInDB(subCategoryId)
        if (getSubCategoryDataDb.data.length == 0) {
            console.log("2")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        if (!getSubCategoryDataDb.data[0].parent_category_id) {
            console.log("3")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        let result = []
        const getBusinessDataDb = await businessDb.getBusinessDataByCIdInDB(subCategoryId)
        if (getBusinessDataDb.data.length == 0) {
            return {
                status: true,
                data: result
            }
        }

        const currWeekDay = new Date().getDay() + 1
        const businessIdArr = getBusinessDataDb.data.map((element) => element.business_id)
        const getBusinessScheduleDb = await businessDb.getBusinessScheduleDataInDB(businessIdArr.join(","))
        const getBusinessProductTagDb = await businessDb.getBusinessProductTagDataInDB(businessIdArr.join(","))
        const getBusinessCatalogDataDb = await businessDb.getBusinessCatalogDataInDB(businessIdArr.join(","))
        const getBusinessContactDb = await businessDb.getBusinessContactDataInDB(businessIdArr.join(","))
        const getBusinessAddressDb = await businessDb.getBusinessAddressDataInDB(businessIdArr.join(","), userTaluka)

        for (let i = 0; i < getBusinessDataDb.data.length; i++) {
            let filterScheduleDataDB = getBusinessScheduleDb.data.filter((element) => element.business_id == getBusinessDataDb.data[i].business_id && element.week_day_id == currWeekDay)
            // console.log(getBusinessDataDb.data[i].business_id, filterScheduleDataDB, currWeekDay)
            let businessOpenFlag = filterScheduleDataDB.length > 0 ? filterScheduleDataDB[0].flag_open : false
            let businessOpenTime = filterScheduleDataDB.length > 0 ? convertISTtoGMT(filterScheduleDataDB[0].open_time) : null
            let businesCloseTime = filterScheduleDataDB.length > 0 ? convertISTtoGMT(filterScheduleDataDB[0].close_time) : null
            let businessOpenStatus = !businessOpenFlag ? false : LibFunction.isBusinessOpen(businessOpenTime, businesCloseTime)
            let businessScheduleHours = !businessOpenStatus ? `Closed` : `Open until ${filterScheduleDataDB[0].close_time}`

            let filterProductTagDataDB = getBusinessProductTagDb.data.filter((element) => element.business_id == getBusinessDataDb.data[i].business_id)
            let businessProductTags = filterProductTagDataDB.map((element) => {
                return {
                    business_product_tag_id: element.business_product_tag_id,
                    business_product_tag_name: element.business_product_tag_name
                }
            })

            let filterContactDataDB = getBusinessContactDb.data.filter((element) => element.business_id == getBusinessDataDb.data[i].business_id)
            let filterAddressDataDB = getBusinessAddressDb.data.filter((element) => element.business_id == getBusinessDataDb.data[i].business_id)
            let address = `${filterAddressDataDB[0]?.address_line_one} - ${filterAddressDataDB[0]?.city}`

            userTaluka == filterAddressDataDB[0]?.taluka && result.push({
                business_id: getBusinessDataDb.data[i].business_id,
                business_uuid: getBusinessDataDb.data[i].business_uuid,
                business_name: getBusinessDataDb.data[i].business_name,
                business_logo_url: getBusinessDataDb.data[i].business_logo_url,
                business_description: getBusinessDataDb.data[i].business_description,
                category_id: getBusinessDataDb.data[i].category_id,
                category_name: getBusinessDataDb.data[i].category_name,
                business_status_id: getBusinessDataDb.data[i].business_status_id,
                business_status_name: getBusinessDataDb.data[i].business_status_name,
                business_type_id: getBusinessDataDb.data[i].business_type_id,
                business_type_name: getBusinessDataDb.data[i].business_type_name,
                business_schedule_hours: businessScheduleHours,
                business_product_tags: businessProductTags,
                business_catalog_details: getBusinessCatalogDataDb.data.map((element) => {
                    delete element.added_by_change_log_id
                    delete element.business_id
                    delete element.history_id
                    delete element.flag_deleted

                    return {
                        ...element
                    }
                }),
                business_contact_details: {
                    business_contact_id: filterContactDataDB[0].business_contact_id,
                    business_email_address: filterContactDataDB[0].business_email_address,
                    business_contact: filterContactDataDB[0].business_contact,
                    business_website_url: filterContactDataDB[0].business_website_url,
                    business_address: address
                }
            })
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

const registerBusinessModule = async (req) => {
    try {
        console.log(req.body, "<<<<<<========")
        const userData = req.user_data
        const userId = userData.user_id
        const timestamp = await LibFunction.formateDateLib()

        const { cashPayment, cashAmount } = req.body;

        if (userId !== 957 && !cashPayment && !userData?.plan_active) {
            return {
                status: false,
                error: constant.requestMessages.ERR_NO_PLAN
            }
        }

        const obj = {
            userId: userId,
            ipAddress: req.ip
        }

        const businessName = req.body.business_name || null
        const businessDescription = req.body.business_description || null
        const businessLogo = req.body.business_logo_url || null
        const businessTypeId = req.body.business_type_id || null
        const businessCategoryId = req.body.category_id || null
        const businessSubCategoryId = req.body.sub_category_id || null
        const businessSchedule = !req.body.business_schedule || req.body.business_schedule.length == 0 ? [] : req.body.business_schedule
        const businessCoverPhotos = !req.body.business_cover_photos || req.body.business_cover_photos.length == 0 ? [] : req.body.business_cover_photos
        const businessProductTags = !req.body.business_product_tags || req.body.business_product_tags.length == 0 ? [] : req.body.business_product_tags
        const businessCatalogDetails = !req.body.business_catalog_details || req.body.business_catalog_details.length == 0 ? [] : req.body.business_catalog_details
        const businessContactDetails = req.body.business_contact_details

        // ----------------------------------------------- Validation Start -----------------------------------------------

        if (!businessName || !businessTypeId || !businessCategoryId || !businessSubCategoryId) {
            console.log("1")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        // const checkBusinessNameValidationDb = await businessDb.getBusinessDataByNameInDB(businessName)
        // if (checkBusinessNameValidationDb.data.length > 0) {
        //     return {
        //         status: false,
        //         error: constant.requestMessages.ERR_BUSINESS_ALREADY_REGISTERED
        //     }
        // }

        const getBusinessTypeDataDb = await businessDb.getBusinessTypeDataInDB(businessTypeId)
        if (getBusinessTypeDataDb.data.length == 0) {
            console.log("3")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const getSubCategoryDataDb = await categoryDb.getSubCategoryDataInDB(businessCategoryId)
        if (getSubCategoryDataDb.data.length == 0) {
            console.log("4")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        // if (!getSubCategoryDataDb.data[0].parent_category_id) {
        //     console.log("5")
        //     return {
        //         status: false,
        //         error: constant.requestMessages.ERR_INVALID_BODY
        //     }
        // }

        // const getWeekDaysDataDb = await businessDb.getWeekDayDataInDB()
        // for (let i = 0; i < businessSchedule.length; i++) {
        //     if (getWeekDaysDataDb.data.filter((element) => element.week_day_id == businessSchedule[i].week_day_id).length != 1) {
        //         console.log("6")
        //         return {
        //             status: false,
        //             error: constant.requestMessages.ERR_INVALID_BODY
        //         }
        //     }

        //     if (businessSchedule[i].flag_open != true && businessSchedule[i].flag_open != false) {
        //         console.log("7")
        //         return {
        //             status: false,
        //             error: constant.requestMessages.ERR_INVALID_BODY
        //         }
        //     }
        // }

        // for (let i = 0; i < businessCoverPhotos.length; i++) {
        //     if (!businessCoverPhotos[i].business_cover_photo_url) {
        //         console.log("8")
        //         return {
        //             status: false,
        //             error: constant.requestMessages.ERR_INVALID_BODY
        //         }
        //     }
        // }

        // for (let i = 0; i < businessProductTags.length; i++) {
        //     if (!businessProductTags[i].business_product_tag_name) {
        //         console.log("9")
        //         return {
        //             status: false,
        //             error: constant.requestMessages.ERR_INVALID_BODY
        //         }
        //     }
        // }

        // for (let i = 0; i < businessCatalogDetails.length; i++) {
        //     if (!businessCatalogDetails[i].catalog_name || !businessCatalogDetails[i].catalog_file_url || !businessCatalogDetails[i].catalog_image_url) {
        //         console.log("10")
        //         return {
        //             status: false,
        //             error: constant.requestMessages.ERR_INVALID_BODY
        //         }
        //     }
        // }

        const businessEmailAddress = businessContactDetails.business_email_address || null
        const businessContact = businessContactDetails.business_contact || null
        const businessWebsiteURL = businessContactDetails.business_website_url || null
        if (!businessContact) {
            console.log("11")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const businessAddressLineOne = businessContactDetails.business_address.address_line_one || null
        const businessAddressLineTwo = businessContactDetails.business_address.address_line_two || null
        const businessState = businessContactDetails.business_address.state || null
        const businessCity = businessContactDetails.business_address.city || null
        const businessTaluka = businessContactDetails.business_address.taluka || null
        const businessPincode = businessContactDetails.business_address.pincode || null
        if (!businessAddressLineOne || !businessState || !businessCity || !businessTaluka) {
            console.log("12")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }
        // ----------------------------------------------- Validation Ends -----------------------------------------------

        const getActiveStatusDataDb = await globalDb.getStatusDataByNameInDB("Active")
        const activeStatusId = getActiveStatusDataDb.data[0].status_id

        const businessUUID = LibFunction.generateUUID()

        const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
        const changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id

        const addBusinessDataDb = await businessDb.addBusinessDataInDB(businessUUID, changeLogId, userId, timestamp, activeStatusId, cashPayment ? true : false, cashPayment ? true : false, cashAmount)
        const businessId = addBusinessDataDb.data[0].business_id

        const addBusinessDetailDb = await businessDb.addBusinessDetailInDB(changeLogId, businessId, businessLogo, businessName, businessDescription, businessTypeId, businessCategoryId, businessSubCategoryId, false)
        if (addBusinessDetailDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const addBusinessContactDb = await businessDb.addBusinessContactDataInDB(changeLogId, businessId, businessWebsiteURL, businessEmailAddress, businessContact, false)
        if (addBusinessContactDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const addBusinessAddressDataDb = await businessDb.addBusinessAddressDataInDB(changeLogId, businessId, businessAddressLineOne, businessAddressLineTwo, businessState, businessCity, businessPincode, businessTaluka, false)
        if (addBusinessAddressDataDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        let addBusinessScheduleString = []
        let addBusinessCoverPhotoString = []
        let addBusinessProductTagString = []
        let addBusinessCatalogString = []
        for (let i = 0; i < businessSchedule.length; i++) {
            addBusinessScheduleString.push(
                `(${changeLogId}, ${businessId}, ${businessSchedule[i].week_day_id}, ${businessSchedule[i].flag_open}, ${!businessSchedule[i].open_time ? null : `'${businessSchedule[i].open_time}'`}, ${!businessSchedule[i].close_time ? null : `'${businessSchedule[i].close_time}'`}, ${false})`
            )
        }
        for (let i = 0; i < businessCoverPhotos.length; i++) {
            addBusinessCoverPhotoString.push(`(${changeLogId}, ${businessId}, '${businessCoverPhotos[i].business_cover_photo_url}', ${false})`)
        }
        for (let i = 0; i < businessProductTags.length; i++) {
            addBusinessProductTagString.push(`(${changeLogId}, ${businessId}, '${businessProductTags[i].business_product_tag_name}', ${false})`)
        }
        for (let i = 0; i < businessCatalogDetails.length; i++) {
            addBusinessCatalogString.push(
                `(
                    ${changeLogId},
                    ${businessId},
                    '${businessCatalogDetails[i].catalog_name}',
                    ${!businessCatalogDetails[i].catalog_description ? null : `${businessCatalogDetails[i].catalog_description}`},
                    '${businessCatalogDetails[i].catalog_file_url}',
                    '${businessCatalogDetails[i].catalog_image_url}',
                    ${!businessCatalogDetails[i].catalog_price ? null : `${businessCatalogDetails[i].catalog_price}`},
                    ${false}
                )`
            )
        }

        const addBusinessScheduleDb = await businessDb.addBusinessScheduleDataInDB(addBusinessScheduleString.join(","))
        if (addBusinessScheduleDb.data.length != addBusinessScheduleString.length) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        if (addBusinessCoverPhotoString.length > 0) {
            const addBusinessCoverPhotoDb = await businessDb.addBusinessCoverPhotoDataInDB(addBusinessCoverPhotoString.join(","))
            if (addBusinessCoverPhotoDb.data.length != addBusinessCoverPhotoString.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (addBusinessProductTagString.length > 0) {
            const addBusinessProductTagDb = await businessDb.addBusinessProductTagDataInDB(addBusinessProductTagString.join(","))
            if (addBusinessProductTagDb.data.length != addBusinessProductTagString.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (addBusinessCatalogString.length > 0) {
            const addBusinessCatalogDb = await businessDb.addBusinessCatalogDataInDB(addBusinessCatalogString.join(","))
            if (addBusinessCatalogDb.data.length != addBusinessCatalogString.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        req["query"]["business_uuid"] = businessUUID
        return await getBusinessDetailModule(req)
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getBusinessDetailModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = userData.user_id

        const businessUUID = req.query.business_uuid || null
        if (!businessUUID) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        const getBusinessDataDb = await businessDb.getBusinessDataByUUIdInDB(businessUUID)
        if (getBusinessDataDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        const businessId = getBusinessDataDb.data[0].business_id
        const businessCreatedAtTimestamp = getBusinessDataDb.data[0].created_at_timestamp
        const businessCreatedByUserId = getBusinessDataDb.data[0].created_by_user_id
        const businessCreatedByUsername = getBusinessDataDb.data[0].created_by_username
        const businessStatusId = getBusinessDataDb.data[0].business_status_id
        const businessStatusName = getBusinessDataDb.data[0].business_status_name
        const businessName = getBusinessDataDb.data[0].business_name
        const businessDescription = getBusinessDataDb.data[0].business_description
        const businessLogoURL = getBusinessDataDb.data[0].business_logo_url
        const businessTypeId = getBusinessDataDb.data[0].business_type_id
        const businessTypeName = getBusinessDataDb.data[0].business_type_name
        const businessCategoryId = getBusinessDataDb.data[0].category_id
        const businessCategoryName = getBusinessDataDb.data[0].category_name
        const businessSubCategoryId = getBusinessDataDb.data[0].sub_category_id

        const getBusinessScheduleDataDb = await businessDb.getBusinessScheduleDataInDB(businessId)
        const getBusinessCoverPhotoDataDb = await businessDb.getBusinessCoverPhotoDataInDB(businessId)
        const getBusinessProductTagDataDb = await businessDb.getBusinessProductTagDataInDB(businessId)
        const getBusinessCatalogDataDb = await businessDb.getBusinessCatalogDataInDB(businessId)
        const getBusinessContactDataDb = await businessDb.getBusinessContactDataInDB(businessId)
        const getBusinessAddressDataDb = await businessDb.getBusinessAddressDataInDB(businessId)

        let result = []
        let dataObj = {
            business_id: parseInt(businessId),
            business_uuid: businessUUID,
            created_at_timestamp: businessCreatedAtTimestamp,
            created_by_user_id: parseInt(businessCreatedByUserId),
            created_by_username: businessCreatedByUsername,
            business_status_id: parseInt(businessStatusId),
            business_status_name: businessStatusName,
            business_name: businessName,
            business_description: businessDescription,
            business_logo_url: businessLogoURL,
            business_type_id: parseInt(businessTypeId),
            business_type_name: businessTypeName,
            category_id: parseInt(businessCategoryId),
            category_name: businessCategoryName,
            sub_category_id: parseInt(businessSubCategoryId),
            business_schedule: getBusinessScheduleDataDb.data
                .map((element) => {
                    delete element.added_by_change_log_id
                    delete element.business_id
                    delete element.history_id
                    delete element.flag_deleted

                    return {
                        ...element
                    }
                })
                .sort((a, b) => a.week_day_id - b.week_day_id),
            business_cover_photos: getBusinessCoverPhotoDataDb.data.map((element) => {
                delete element.added_by_change_log_id
                delete element.business_id
                delete element.history_id
                delete element.flag_deleted

                return {
                    ...element
                }
            }),
            business_product_tags: getBusinessProductTagDataDb.data.map((element) => {
                delete element.added_by_change_log_id
                delete element.business_id
                delete element.history_id
                delete element.flag_deleted

                return {
                    ...element
                }
            }),
            business_catalog_details: getBusinessCatalogDataDb.data.map((element) => {
                delete element.added_by_change_log_id
                delete element.business_id
                delete element.history_id
                delete element.flag_deleted

                return {
                    ...element
                }
            }),
            business_contact_details: {
                business_contact_id: parseInt(getBusinessContactDataDb.data[0].business_contact_id),
                business_email_address: getBusinessContactDataDb.data[0].business_email_address,
                business_contact: getBusinessContactDataDb.data[0].business_contact,
                business_website_url: getBusinessContactDataDb.data[0].business_website_url,
                business_address: {
                    business_address_id: parseInt(getBusinessAddressDataDb.data[0].business_address_id),
                    address_line_one: getBusinessAddressDataDb.data[0].address_line_one,
                    address_line_two: getBusinessAddressDataDb.data[0].address_line_two,
                    state: getBusinessAddressDataDb.data[0].state,
                    city: getBusinessAddressDataDb.data[0].city,
                    taluka: getBusinessAddressDataDb.data[0].taluka,
                    pincode: getBusinessAddressDataDb.data[0].pincode
                }
            }
        }

        result.push(dataObj)
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

const updateBusinessDetailModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = userData.user_id
        const timestamp = await LibFunction.formateDateLib()

        const obj = {
            userId: userId,
            ipAddress: req.ip
        }
        console.log("--->>>", req.body)
        const businessName = req.body.business_name || null
        const businessUUID = req.body.business_uuid || null
        const businessDescription = req.body.business_description || null
        const businessLogo = req.body.business_logo_url || null
        const businessTypeId = parseInt(req.body.business_type_id) || null
        const businessCategoryId = parseInt(req.body.business_category_id) || null
        const businessSubCategoryId = parseInt(req.body.business_sub_category_id) || null
        const businessSchedule = !req.body.business_schedule || req.body.business_schedule.length == 0 ? [] : req.body.business_schedule
        const businessCoverPhotos = !req.body.business_cover_photos || req.body.business_cover_photos.length == 0 ? [] : req.body.business_cover_photos
        const businessProductTags = !req.body.business_product_tags || req.body.business_product_tags.length == 0 ? [] : req.body.business_product_tags
        const businessCatalogDetails = !req.body.business_catalog_details || req.body.business_catalog_details.length == 0 ? [] : req.body.business_catalog_details
        const businessContactDetails = req.body.business_contact_details

        // ----------------------------------------------- Validation Start -----------------------------------------------

        if (!businessUUID || !businessTypeId || !businessName || !businessCategoryId || !businessSubCategoryId) {
            console.log("1")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        if (businessSchedule.length == 0) {
            console.log("2")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const getBusinessDataDb = await businessDb.getBusinessDataByUUIdInDB(businessUUID)
        if (getBusinessDataDb.data.length == 0) {
            console.log("3")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        // const checkBusinessNameValidationDb = await businessDb.getBusinessDataByNameInDB(businessName)
        // if (checkBusinessNameValidationDb.data.length > 0 && checkBusinessNameValidationDb.data[0].business_id != getBusinessDataDb.data[0].business_id) {
        //     return {
        //         status: false,
        //         error: constant.requestMessages.ERR_BUSINESS_ALREADY_REGISTERED
        //     }
        // }

        const getBusinessTypeDataDb = await businessDb.getBusinessTypeDataInDB(businessTypeId)
        if (getBusinessTypeDataDb.data.length == 0) {
            console.log("4")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const getSubCategoryDataDb = await categoryDb.getSubCategoryDataInDB(businessCategoryId)
        if (getSubCategoryDataDb.data.length == 0) {
            console.log("5")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const getWeekDaysDataDb = await businessDb.getWeekDayDataInDB()
        for (let i = 0; i < businessSchedule.length; i++) {
            if (!businessSchedule[i].flag_open) {
                businessSchedule[i].open_time = '10:00';
                businessSchedule[i].close_time = '19:00'
            }

            if (getWeekDaysDataDb.data.filter((element) => element.week_day_id == businessSchedule[i].week_day_id).length != 1) {
                console.log("6")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }

            if (businessSchedule[i].flag_open != true && businessSchedule[i].flag_open != false) {
                console.log("7")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }
        }

        for (let i = 0; i < businessCoverPhotos.length; i++) {
            if (!businessCoverPhotos[i].business_cover_photo_url) {
                console.log("8")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }
        }

        for (let i = 0; i < businessProductTags.length; i++) {
            if (!businessProductTags[i].business_product_tag_name) {
                console.log("9")
                return {
                    status: false,
                    error: constant.requestMessages.ERR_INVALID_BODY
                }
            }
        }

        // for (let i = 0; i < businessCatalogDetails.length; i++) {
        //     if (!businessCatalogDetails[i].catalog_name || !businessCatalogDetails[i].catalog_file_url || !businessCatalogDetails[i].catalog_image_url) {
        //         console.log("10")
        //         return {
        //             status: false,
        //             error: constant.requestMessages.ERR_INVALID_BODY
        //         }
        //     }
        // }

        const businessEmailAddress = businessContactDetails.business_email_address || null
        const businessContact = businessContactDetails.business_contact || null
        const businessWebsiteURL = businessContactDetails.business_website_url || null
        if (!businessContact) {
            console.log("11")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const businessAddressLineOne = businessContactDetails.business_address.address_line_one || null
        const businessAddressLineTwo = businessContactDetails.business_address.address_line_two || null
        const businessState = businessContactDetails.business_address.state || null
        const businessCity = businessContactDetails.business_address.city || null
        const businessTaluka = businessContactDetails.business_address.taluka || null
        const businessPincode = businessContactDetails.business_address.pincode || null
        if (!businessAddressLineOne || !businessState || !businessCity || !businessTaluka) {
            console.log("12")
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }
        // ----------------------------------------------- Validation Ends -----------------------------------------------

        let changeLogId
        const businessId = getBusinessDataDb.data[0].business_id

        const getBusinessScheduleDataDb = await businessDb.getBusinessScheduleDataInDB(businessId)
        const getBusinessCoverPhotoDataDb = await businessDb.getBusinessCoverPhotoDataInDB(businessId)
        const getBusinessProductTagDataDb = await businessDb.getBusinessProductTagDataInDB(businessId)
        const getBusinessCatalogDataDb = await businessDb.getBusinessCatalogDataInDB(businessId)
        const getBusinessContactDataDb = await businessDb.getBusinessContactDataInDB(businessId)
        const getBusinessAddressDataDb = await businessDb.getBusinessAddressDataInDB(businessId)

        if (
            businessLogo != getBusinessDataDb.data[0].business_logo_url ||
            businessDescription != getBusinessDataDb.data[0].business_description ||
            businessName != getBusinessDataDb.data[0].business_name ||
            businessTypeId != getBusinessDataDb.data[0].business_type_id ||
            businessCategoryId != getBusinessDataDb.data[0].business_category_id
        ) {
            if (!changeLogId) {
                const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
                changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
            }

            const businessDataId = getBusinessDataDb.data[0].business_data_id
            const addBusinessDetailLogsDb = await businessDb.addBusinessDetailLogInDB(businessDataId)
            if (addBusinessDetailLogsDb.data.length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }

            const updateBusinessDetailDb = await businessDb.updateBusinessDetailInDB(businessDataId, changeLogId, businessLogo, businessName, businessTypeId, businessCategoryId, businessSubCategoryId, businessDescription)
            if (updateBusinessDetailDb.data.length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (getBusinessScheduleDataDb.data.length > 0) {
            for (let i = 0; i < getBusinessScheduleDataDb.data.length; i++) {
                let filterWeekData = businessSchedule.filter((element) => element.week_day_id == getBusinessScheduleDataDb.data[i].week_day_id)
                if (getBusinessScheduleDataDb.data[i].flag_open != filterWeekData[0].flag_open || getBusinessScheduleDataDb.data[i].open_time != filterWeekData[0].open_time || getBusinessScheduleDataDb.data[i].close_time != filterWeekData[0].close_time) {
                    if (!changeLogId) {
                        const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
                        changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
                    }

                    const addBusinessScheduleLogDb = await businessDb.addBusinessScheduleLogInDB(getBusinessScheduleDataDb.data[i].business_schedule_id)
                    if (addBusinessScheduleLogDb.data.length == 0) {
                        return {
                            status: false,
                            error: constant.requestMessages.ERR_GENERAL
                        }
                    }

                    const updateBusinessScheduleDb = await businessDb.updateBusinessScheduleInDB(getBusinessScheduleDataDb.data[i].business_schedule_id, changeLogId, filterWeekData[0].flag_open, filterWeekData[0].open_time, filterWeekData[0].close_time)
                    if (updateBusinessScheduleDb.data.length == 0) {
                        return {
                            status: false,
                            error: constant.requestMessages.ERR_GENERAL
                        }
                    }
                }
            }
        } else {
            // This is the case that could never be occur
            if (!changeLogId) {
                const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
                changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
            }

            let addBusinessScheduleString = []
            for (let i = 0; i < businessSchedule.length; i++) {
                addBusinessScheduleString.push(`(${changeLogId}, ${businessId}, ${businessSchedule[i].week_day_id}, ${businessSchedule[i].flag_open}, '${businessSchedule[i].open_time}', '${businessSchedule[i].close_time}', ${false})`)
            }

            const addBusinessScheduleDb = await businessDb.addBusinessScheduleDataInDB(addBusinessScheduleString.join(","))
            if (addBusinessScheduleDb.data.length != addBusinessScheduleString.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (getBusinessCoverPhotoDataDb.data.length > 0) {
            if (!changeLogId) {
                const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
                changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
            }

            const removeCoverPhotoDb = await businessDb.removeBusinessCoverPhotoInDB(businessId, changeLogId)
            if (removeCoverPhotoDb.data.length != getBusinessCoverPhotoDataDb.data.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (getBusinessProductTagDataDb.data.length > 0) {
            if (!changeLogId) {
                const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
                changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
            }

            const removeProductTagNameDb = await businessDb.removeBusinessProductTagInDB(businessId, changeLogId)
            if (removeProductTagNameDb.data.length != getBusinessProductTagDataDb.data.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (getBusinessCatalogDataDb.data.length > 0) {
            if (!changeLogId) {
                const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
                changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
            }

            const removeCatalogDataDb = await businessDb.removeBusinessCatalogInDB(businessId, changeLogId)
            if (removeCatalogDataDb.data.length != getBusinessCatalogDataDb.data.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        let addBusinessCoverPhotoString = []
        let addBusinessProductTagString = []
        let addBusinessCatalogString = []
        for (let i = 0; i < businessCoverPhotos.length; i++) {
            addBusinessCoverPhotoString.push(`(${changeLogId}, ${businessId}, '${businessCoverPhotos[i].business_cover_photo_url}', ${false})`)
        }
        for (let i = 0; i < businessProductTags.length; i++) {
            addBusinessProductTagString.push(`(${changeLogId}, ${businessId}, '${businessProductTags[i].business_product_tag_name}', ${false})`)
        }
        for (let i = 0; i < businessCatalogDetails.length; i++) {
            addBusinessCatalogString.push(
                `(
                    ${changeLogId},
                    ${businessId},
                    '${businessCatalogDetails[i].catalog_name}',
                    ${!businessCatalogDetails[i].catalog_description ? null : `${businessCatalogDetails[i].catalog_description}`},
                    '${businessCatalogDetails[i].catalog_file_url}',
                    '${businessCatalogDetails[i].catalog_image_url}',
                    ${!businessCatalogDetails[i].catalog_price ? null : `${businessCatalogDetails[i].catalog_price}`},
                    ${false}
                )`
            )
        }

        if (addBusinessCoverPhotoString.length > 0) {
            if (!changeLogId) {
                const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
                changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
            }

            const addBusinessCoverPhotoDb = await businessDb.addBusinessCoverPhotoDataInDB(addBusinessCoverPhotoString.join(","))
            if (addBusinessCoverPhotoDb.data.length != addBusinessCoverPhotoString.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (addBusinessProductTagString.length > 0) {
            if (!changeLogId) {
                const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
                changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
            }

            const addBusinessProductTagDb = await businessDb.addBusinessProductTagDataInDB(addBusinessProductTagString.join(","))
            if (addBusinessProductTagDb.data.length != addBusinessProductTagString.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (addBusinessCatalogString.length > 0) {
            if (!changeLogId) {
                const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
                changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id
            }

            const addBusinessCatalogDb = await businessDb.addBusinessCatalogDataInDB(addBusinessCatalogString.join(","))
            if (addBusinessCatalogDb.data.length != addBusinessCatalogString.length) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (getBusinessContactDataDb.data[0].business_website_url != businessWebsiteURL || getBusinessContactDataDb.data[0].business_email_address != businessEmailAddress || getBusinessContactDataDb.data[0].business_contact != businessContact) {
            const addBusinessContactLogDb = await businessDb.addBusinessContactLogInDB(getBusinessContactDataDb.data[0].business_contact_id)
            if (addBusinessContactLogDb.data.length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }

            const updateBusinessContactDb = await businessDb.updateBusinessContactInDB(getBusinessContactDataDb.data[0].business_contact_id, changeLogId, businessWebsiteURL, businessEmailAddress, businessContact)
            if (updateBusinessContactDb.data.length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (
            getBusinessAddressDataDb.data[0].address_line_one != businessAddressLineOne ||
            getBusinessAddressDataDb.data[0].address_line_two != businessAddressLineTwo ||
            getBusinessAddressDataDb.data[0].state != businessState ||
            getBusinessAddressDataDb.data[0].city != businessCity ||
            getBusinessAddressDataDb.data[0].taluka != businessTaluka ||
            getBusinessAddressDataDb.data[0].pincode != businessPincode
        ) {
            const addBusinessAddressLogDb = await businessDb.addBusinessAddressLogInDB(getBusinessAddressDataDb.data[0].business_address_id)
            if (addBusinessAddressLogDb.data.length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }

            const updateBusinessAddressDataDb = await businessDb.updateBusinessAddressInDB(getBusinessAddressDataDb.data[0].business_address_id, changeLogId, businessAddressLineOne, businessAddressLineTwo, businessState, businessCity, businessTaluka, businessPincode)
            if (updateBusinessAddressDataDb.data.length == 0) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }
        }

        if (!changeLogId) {
            return {
                status: false,
                error: constant.requestMessages.NO_CHANGE_FOUND
            }
        }

        req["query"]["business_uuid"] = businessUUID
        return await getBusinessDetailModule(req)
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const activeBusinessModule = async (req) => {
    try {
        const { business_id, flag_deleted } = req.body;
        if (!business_id) throw new Error("Business ID is required !");

        const result = await businessDb.updateBusinessDataInDB(business_id, flag_deleted);
        if (result.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return {
            status: true,
            message: "Business updated successfully."
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getInactiveBusinessModule = async (req) => {
    try {
        const businessData = await businessDb.getInactiveBusinessDB();
        if (businessData.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return {
            status: true,
            message: "Business fetched successfully.",
            data: businessData?.data
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const bulkUploadModule = async (req, res) => {
    try {
        if (!req.file) {
            return { success: false, message: "Please, upload file !" };
        }

        const filePath = req.file.path;

        const parseCSV = async (filePath) => {
            return new Promise((resolve, reject) => {
                const businessData = [];
                fs.createReadStream(filePath)
                    .pipe(csvParser())
                    .on("data", (data) => {
                        if (Object.values(data).some(value => value.trim() !== "")) {
                            businessData.push(data);
                        }
                    })
                    .on("end", () => resolve(businessData))
                    .on("error", (err) => reject(err));
            });
        };

        const businessData = await parseCSV(filePath);

        if (businessData.length === 0) {
            return { success: false, message: "No data found in your file !" };
        }

        for (business of businessData) {
            console.log(business)
            if (!business.business_name || business.business_name.trim() === "" || !business.business_type_id || !business.business_category_id || !business.business_sub_category_id) {
                console.log("Skipping business with missing data --->>> ", business);
                continue;
            }

            if (business.user_contact) {
                let changeLogId = null;
                let userId;

                const currentTimestamp = await LibFunction.formateDateLib()
                const getUserDataDb = await authDb.getUserDataByContactInDB(`+91${business.user_contact}`)
                if (getUserDataDb.data.length == 0) {
                    // User not registered yet so we will create
                    const userUUID = LibFunction.generateUUID()

                    const addUserDataDb = await authDb.addUserDataInDB(userUUID, 1111, currentTimestamp, null, `+91${business.user_contact}`, null, null, null, null, null, false)
                    userId = addUserDataDb.data[0].user_id;

                    if (!changeLogId) {
                        const obj = {
                            ipAddress: req.ip,
                            userId
                        }
                        const addChangeLogDetailsDb = await LibFunction.addChangeLogDetailsLib(obj)
                        changeLogId = addChangeLogDetailsDb?.data[0].change_log_id
                    }

                    await userDb.updateUserDataInDB(userId, changeLogId, null, null, null, null, null, null, null, null)
                }

                if (userId) {
                    const businessName = business.business_name || null;
                    const businessDescription = business.business_description || null;
                    const businessTypeId = business.business_type_id || null;
                    const businessCategoryId = business.business_category_id || null;
                    const businessSubCategoryId = business.business_sub_category_id || null;
                    const businessWebsiteURL = business.website_url || null;
                    const businessEmailAddress = business.business_email_address || null;
                    const businessContact = business.business_contact || null;

                    const getBusinessTypeDataDb = await businessDb.getBusinessTypeDataInDB(businessTypeId)
                    if (getBusinessTypeDataDb.data.length == 0) {
                        console.log("Skipping business because of wrong business_type_id --->>> ", business);
                        continue;
                    }

                    const getSubCategoryDataDb = await categoryDb.getSubCategoryDataInDB(businessCategoryId)
                    if (getSubCategoryDataDb.data.length == 0) {
                        console.log("Skipping business because of wrong business_category_id or business_sub_category_id --->>> ", business);
                        continue;
                    }

                    if (!businessContact) {
                        console.log("Skipping business because of missing business_contact --->>> ", business);
                        continue;
                    }

                    const businessAddressLineOne = business.address_line_one || null;
                    const businessAddressLineTwo = business.address_line_two || null;
                    const businessState = business.state || null;
                    const businessCity = business.city || null;
                    const businessTaluka = business.taluka || null;
                    const businessPincode = business.pincode || null;

                    if (!businessAddressLineOne || !businessState || !businessCity || !businessTaluka) {
                        console.log("Skipping business because of missing business address data --->>> ", business);
                        continue;
                    }

                    const getActiveStatusDataDb = await globalDb.getStatusDataByNameInDB("Active");
                    const activeStatusId = getActiveStatusDataDb.data[0].status_id;

                    const businessUUID = LibFunction.generateUUID();

                    const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib({ ipAddress: req.ip, userId });
                    changeLogId = addChangeLogDetailsLibDB.data[0].change_log_id;

                    const addBusinessDataDb = await businessDb.addBusinessDataInDB(businessUUID, changeLogId, userId, currentTimestamp, activeStatusId, false, false, null);
                    const businessId = addBusinessDataDb.data[0].business_id;

                    const addBusinessDetailDb = await businessDb.addBusinessDetailInDB(changeLogId, businessId, null, businessName, businessDescription, businessTypeId, businessCategoryId, businessSubCategoryId, false)
                    if (addBusinessDetailDb.data.length == 0) {
                        console.log("Skipping business because of something went wrong in save business_data --->>> ", business);
                        continue;
                    }

                    const addBusinessContactDb = await businessDb.addBusinessContactDataInDB(changeLogId, businessId, businessWebsiteURL, businessEmailAddress, businessContact, false)
                    if (addBusinessContactDb.data.length == 0) {
                        console.log("Skipping business because of something went wrong in save business_contact --->>> ", business);
                        continue;
                    }

                    const addBusinessAddressDataDb = await businessDb.addBusinessAddressDataInDB(changeLogId, businessId, businessAddressLineOne, businessAddressLineTwo, businessState, businessCity, businessPincode, businessTaluka, false)
                    if (addBusinessAddressDataDb.data.length == 0) {
                        console.log("Skipping business because of something went wrong in save business_address --->>> ", business);
                        continue;
                    }

                    if (business.government_business) {
                        const isGovernment = business.government_business.toLowerCase() === "yes";
                        const open_time = isGovernment ? '10:10' : '10:00';
                        const close_time = isGovernment ? '18:10' : '19:00';

                        const business_schedule = [
                            {
                                week_day_id: 1,
                                flag_open: isGovernment ? false : true,
                                open_time,
                                close_time
                            },
                            {
                                week_day_id: 2,
                                flag_open: true,
                                open_time,
                                close_time
                            },
                            {
                                week_day_id: 3,
                                flag_open: true,
                                open_time,
                                close_time
                            },
                            {
                                week_day_id: 4,
                                flag_open: true,
                                open_time,
                                close_time
                            },
                            {
                                week_day_id: 5,
                                flag_open: true,
                                open_time,
                                close_time
                            },
                            {
                                week_day_id: 6,
                                flag_open: true,
                                open_time,
                                close_time
                            },
                            {
                                week_day_id: 7,
                                flag_open: isGovernment ? false : true,
                                open_time,
                                close_time
                            }
                        ]

                        let addBusinessScheduleString = [];
                        for (let i = 0; i < business_schedule.length; i++) {
                            addBusinessScheduleString.push(
                                `(${changeLogId}, ${businessId}, ${business_schedule[i].week_day_id}, ${business_schedule[i].flag_open}, ${!business_schedule[i].open_time ? null : `'${business_schedule[i].open_time}'`}, ${!business_schedule[i].close_time ? null : `'${business_schedule[i].close_time}'`}, ${false})`
                            )
                        }

                        const addBusinessScheduleDb = await businessDb.addBusinessScheduleDataInDB(addBusinessScheduleString.join(","))
                        if (addBusinessScheduleDb.data.length != addBusinessScheduleString.length) {
                            console.log("Skipping business because of something went wrong in save business_schedule data --->>> ", business);
                            continue;
                        }
                    }
                }
            }
        }

        return {
            success: true
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

// Function to convert time from IST to GMT
const convertISTtoGMT = (istTime) => {
    const [hours, minutes, seconds = 0] = istTime.split(':').map(Number);
    // IST is UTC+5:30, so subtract 5h30m to get GMT
    let gmtHours = hours - 5;
    let gmtMinutes = minutes - 30;
    
    // Handle underflow (e.g., 00:30 IST → 19:00 GMT previous day)
    if (gmtMinutes < 0) {
        gmtHours--;
        gmtMinutes += 60;
    }
    if (gmtHours < 0) {
        gmtHours += 24;
    }
    
    return `${String(gmtHours).padStart(2, '0')}:${String(gmtMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

module.exports = {
    getBusinessTypeModule: getBusinessTypeModule,
    getWeekDataModule: getWeekDataModule,
    getBusinessListModule: getBusinessListModule,
    registerBusinessModule: registerBusinessModule,
    getBusinessDetailModule: getBusinessDetailModule,
    updateBusinessDetailModule: updateBusinessDetailModule,
    activeBusinessModule: activeBusinessModule,
    getInactiveBusinessModule: getInactiveBusinessModule,
    bulkUploadModule: bulkUploadModule
}
