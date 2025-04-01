const crud = require("../../crud")

const addBusinessDataInDB = async (businessUUID, changeLogId, createdByUserId, createdAtTimestamp, businessStatusId, flag, cashPayment, cashAmount) => {
    let fieldArr = [
        { field: "business_uuid", value: businessUUID },
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "created_by_user_id", value: createdByUserId },
        { field: "created_at_timestamp", value: createdAtTimestamp },
        { field: "business_status_id", value: businessStatusId },
        { field: "flag_deleted", value: flag },
        { field: "cash_payment", value: cashPayment },
        { field: "cash_amount", value: cashAmount }
    ]
    let response = await crud.executeQuery(crud.makeInsertQueryString("business", fieldArr, [], true))
    return response
}

const addBusinessDetailInDB = async (changeLogId, businessId, businessLogoURL, businessName, businessDescription, businessTypeId, categoryId, businessSubCategoryId, flag) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "business_id", value: businessId },
        { field: "business_logo_url", value: businessLogoURL },
        { field: "business_name", value: businessName },
        { field: "business_description", value: businessDescription },
        { field: "business_type_id", value: businessTypeId },
        { field: "category_id", value: categoryId },
        { field: "sub_category_id", value: businessSubCategoryId },
        { field: "flag_deleted", value: flag }
    ]
    let response = await crud.executeQuery(crud.makeInsertQueryString("business_data", fieldArr, [], true))
    return response
}

const addBusinessContactDataInDB = async (changeLogId, businessId, businessWebsiteURL, businessEmailAddress, businessContact, flag) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "business_id", value: businessId },
        { field: "business_website_url", value: businessWebsiteURL },
        { field: "business_email_address", value: businessEmailAddress },
        { field: "business_contact", value: businessContact },
        { field: "flag_deleted", value: flag }
    ]
    let response = await crud.executeQuery(crud.makeInsertQueryString("business_contact", fieldArr, [], true))
    return response
}

const addBusinessAddressDataInDB = async (changeLogId, businessId, addressLineOne, addressLineTwo, state, city, pincode, taluka, flag) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "business_id", value: businessId },
        { field: "address_line_one", value: addressLineOne },
        { field: "address_line_two", value: addressLineTwo },
        { field: "state", value: state },
        { field: "city", value: city },
        { field: "taluka", value: taluka },
        { field: "pincode", value: pincode },
        { field: "flag_deleted", value: flag }
    ]
    let response = await crud.executeQuery(crud.makeInsertQueryString("business_address", fieldArr, [], true))
    return response
}

const addBusinessScheduleDataInDB = async (values) => {
    let sql = `INSERT INTO business_schedule(added_by_change_log_id, business_id, week_day_id, flag_open, open_time, close_time, flag_deleted)
    VALUES ${values}
    RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessCoverPhotoDataInDB = async (values) => {
    let sql = `INSERT INTO business_cover_photo(added_by_change_log_id, business_id, business_cover_photo_url, flag_deleted)
    VALUES ${values}
    RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessProductTagDataInDB = async (values) => {
    let sql = `INSERT INTO business_product_tag(added_by_change_log_id, business_id, business_product_tag_name, flag_deleted)
    VALUES ${values}
    RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessCatalogDataInDB = async (values) => {
    let sql = `INSERT INTO business_catalog(added_by_change_log_id, business_id, catalog_name, catalog_description, catalog_file_url, catalog_image_url, catalog_price, flag_deleted)
    VALUES ${values}
    RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const updateBusinessDataInDB = async (businessId, flag, changeLogId, businessStatusId) => {
    // let fieldArr = [
    //     { field: "added_by_change_log_id", value: changeLogId },
    //     { field: "business_status_id", value: businessStatusId }
    // ]

    let fieldArr = [{ field: "flag_deleted", value: flag }]
    let condition = `business_id = ${businessId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business", fieldArr, condition))
    return response
}

const updateBusinessDetailInDB = async (businessDataId, changeLogId, businessLogoURL, businessName, businessTypeId, businessCategoryId, businessSubCategoryId, businessDescription) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "business_logo_url", value: businessLogoURL },
        { field: "business_name", value: businessName },
        { field: "business_type_id", value: businessTypeId },
        { field: "category_id", value: businessCategoryId },
        { field: "sub_category_id", value: businessSubCategoryId },
        { field: "business_description", value: businessDescription }
    ]
    let condition = `business_data_id = ${businessDataId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_data", fieldArr, condition))
    return response
}

const updateBusinessScheduleInDB = async (businessScheduleId, changeLogId, flagOpen, openTime, closeTime) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_open", value: flagOpen },
        { field: "open_time", value: openTime },
        { field: "close_time", value: closeTime }
    ]
    let condition = `business_schedule_id = ${businessScheduleId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_schedule", fieldArr, condition))
    return response
}

const updateBusinessCoverPhotoInDB = async (businessCoverPhotoId, changeLogId, businessCoverPhotoURL) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "business_cover_photo_url", value: businessCoverPhotoURL }
    ]
    let condition = `business_cover_photo_id = ${businessCoverPhotoId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_cover_photo", fieldArr, condition))
    return response
}

const updateBusinessProductTagInDB = async (businessProductTagId, changeLogId, businessProductTagName) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "business_product_tag_name", value: businessProductTagName }
    ]
    let condition = `business_product_tag_id = ${businessProductTagId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_product_tag", fieldArr, condition))
    return response
}

const updateBusinessCatalogInDB = async (businessCatalogId, changeLogId, catalogName, catalogDescription, catalogFileURL, catalogImageURL, catalogPrice) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "catalog_name", value: catalogName },
        { field: "catalog_description", value: catalogDescription },
        { field: "catalog_file_url", value: catalogFileURL },
        { field: "catalog_image_url", value: catalogImageURL },
        { field: "catalog_price", value: catalogPrice }
    ]
    let condition = `business_catalog_id = ${businessCatalogId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_catalog", fieldArr, condition))
    return response
}

const updateBusinessContactInDB = async (businessContactId, changeLogId, businessWebsiteURL, businessEmailAddress, businessContact) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "business_website_url", value: businessWebsiteURL },
        { field: "business_email_address", value: businessEmailAddress },
        { field: "business_contact", value: businessContact }
    ]
    let condition = `business_contact_id = ${businessContactId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_contact", fieldArr, condition))
    return response
}

const updateBusinessAddressInDB = async (businessAddressId, changeLogId, addressLineOne, addressLineTwo, state, city, taluka, pincode) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "address_line_one", value: addressLineOne },
        { field: "address_line_two", value: addressLineTwo },
        { field: "state", value: state },
        { field: "city", value: city },
        { field: "taluka", value: taluka },
        { field: "pincode", value: pincode }
    ]
    let condition = `business_address_id = ${businessAddressId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_address", fieldArr, condition))
    return response
}

const addBusinessLogInDB = async (businessId) => {
    let sql = `INSERT INTO business(added_by_change_log_id, business_uuid, created_by_user_id, created_at_timestamp, business_status_id, history_id, flag_deleted)
    (
        SELECT added_by_change_log_id, business_uuid, created_by_user_id, created_at_timestamp, business_status_id, business_id, flag_deleted
        FROM business
        WHERE business_id In (${businessId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessDetailLogInDB = async (businessDataId) => {
    let sql = `INSERT INTO business_data(added_by_change_log_id, business_id, business_logo_url, business_name, business_description, business_type_id, category_id, sub_category_id, history_id, flag_deleted)
    (
        SELECT added_by_change_log_id, business_id, business_logo_url, business_name, business_description, business_type_id, category_id, sub_category_id, business_data_id, flag_deleted
        FROM business_data
        WHERE business_data_id IN (${businessDataId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessScheduleLogInDB = async (businessScheduleId) => {
    let sql = `INSERT INTO business_schedule(added_by_change_log_id, business_id, week_day_id, flag_open, open_time, close_time, history_id, flag_deleted)
    (
        SELECT added_by_change_log_id, business_id, week_day_id, flag_open, open_time, close_time, business_schedule_id, flag_deleted
        FROM business_schedule
        WHERE business_schedule_id IN (${businessScheduleId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessCoverPhotoLogInDB = async (businessCoverPhotoId) => {
    let sql = `INSERT INTO business_cover_photo(added_by_change_log_id, business_id, business_cover_photo_url, history_id, flag_deleted)
    (
        SELECT added_by_change_log_id, business_id, business_cover_photo_url, business_cover_photo_id, flag_deleted
        FROM business_cover_photo
        WHERE business_cover_photo_id IN (${businessCoverPhotoId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessProductTagLogInDB = async (businessProductTagId) => {
    let sql = `INSERT INTO business_product_tag(added_by_change_log_id, business_id, business_product_tag_name, history_id, flag_deleted)
    (
        SELECT added_by_change_log_id, business_id, business_product_tag_name, business_product_tag_id, flag_deleted
        FROM business_product_tag
        WHERE business_product_tag_id IN (${businessProductTagId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessCatalogLogInDB = async (businessCatalogId) => {
    let sql = `INSERT INTO business_catalog(added_by_change_log_id, business_id, catalog_name, catalog_description, catalog_file_url, catalog_image_url, catalog_price, history_id, flag_deleted)
    (
        SELECT added_by_change_log_id, business_id, catalog_name, catalog_description, catalog_file_url, catalog_image_url, catalog_price, business_catalog_id, flag_deleted
        FROM business_catalog
        WHERE business_catalog_id IN (${businessCatalogId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessContactLogInDB = async (businessContactId) => {
    let sql = `INSERT INTO business_contact(added_by_change_log_id, business_id, business_website_url, business_email_address, business_contact, history_id, flag_deleted)
    (
        SELECT added_by_change_log_id, business_id, business_website_url, business_email_address, business_contact, business_contact_id, flag_deleted
        FROM business_contact
        WHERE business_contact_id IN (${businessContactId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addBusinessAddressLogInDB = async (businessAddressId) => {
    let sql = `INSERT INTO business_address(added_by_change_log_id, business_id, address_line_one, address_line_two, state, city, pincode, history_id, flag_deleted)
    (
        SELECT added_by_change_log_id, business_id, address_line_one, address_line_two, state, city, pincode, business_address_id, flag_deleted
        FROM business_address
        WHERE business_address_id IN (${businessAddressId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const removeBusinessDataInDB = async (businessId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `business_id IN (${businessId}) AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business", fieldArr, condition))
    return response
}

const removeBusinessDetailInDB = async (businessId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `business_id IN (${businessId}) AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_data", fieldArr, condition))
    return response
}

const removeBusinessScheduleInDB = async (businessId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `business_id IN (${businessId}) AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_schedule", fieldArr, condition))
    return response
}

const removeBusinessCoverPhotoInDB = async (businessId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `business_id IN (${businessId}) AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_cover_photo", fieldArr, condition))
    return response
}

const removeBusinessProductTagInDB = async (businessId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `business_id IN (${businessId}) AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_product_tag", fieldArr, condition))
    return response
}

const removeBusinessCatalogInDB = async (businessId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `business_id IN (${businessId}) AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_catalog", fieldArr, condition))
    return response
}

const removeBusinessContactInDB = async (businessId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `business_id IN (${businessId}) AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_contact", fieldArr, condition))
    return response
}

const removeBusinessAddressInDB = async (businessId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `business_id IN (${businessId}) AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("business_address", fieldArr, condition))
    return response
}

const getWeekDayDataInDB = async () => {
    let sql = `SELECT * FROM week_day`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessTypeDataInDB = async (businessTypeId) => {
    let sql = `SELECT * FROM business_type`
    if (!!businessTypeId) {
        sql += ` WHERE business_type_id = ${businessTypeId}`
    }
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessDataInDB = async (businessId) => {
    let sql = `SELECT business.business_uuid, business.created_by_user_id, user_data.username AS created_by_username,
    business.business_status_id, status.status_name AS business_status_name, business.created_at_timestamp, business_data.*,
    business_type.business_type_name, category.category_name
    FROM business
    JOIN business_data
        ON business.business_id = business_data.business_id
        AND business_data.history_id IS NULL
        AND business_data.flag_deleted = false
    JOIN user_data ON business.created_by_user_id = user_data.user_id
    JOIN status ON business.business_status_id = status.status_id
    JOIN business_type ON business_data.business_type_id = business_type.business_type_id
    JOIN category
        ON business_data.category_id = category.category_id
        AND category.history_id IS NULL
        AND category.flag_deleted = false
    WHERE business.business_id = ${businessId}
    AND business.history_id IS NULL
    AND business.flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessDataByNameInDB = async (businessName) => {
    let sql = `SELECT business.business_uuid, business.created_by_user_id, user_data.username AS created_by_username,
    business.business_status_id, status.status_name AS business_status_name, business.created_at_timestamp, business_data.*,
    business_type.business_type_name, category.category_name
    FROM business
    JOIN business_data
        ON business.business_id = business_data.business_id
        AND business_data.history_id IS NULL
        AND business_data.flag_deleted = false
        AND LOWER(business_data.business_name) = '${businessName.toLowerCase()}'
    JOIN user_data ON business.created_by_user_id = user_data.user_id
    JOIN status ON business.business_status_id = status.status_id
    JOIN business_type ON business_data.business_type_id = business_type.business_type_id
    JOIN category
        ON business_data.category_id = category.category_id
        AND category.history_id IS NULL
        AND category.flag_deleted = false
    WHERE business.history_id IS NULL
    AND business.flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessDataByUUIdInDB = async (businessUUID) => {
    let sql = `SELECT business.business_uuid, business.created_by_user_id, user_data.username AS created_by_username,
    business.business_status_id, status.status_name AS business_status_name, business.created_at_timestamp, business_data.*,
    business_type.business_type_name, category.category_name
    FROM business
    JOIN business_data
        ON business.business_id = business_data.business_id
        AND business_data.history_id IS NULL
        AND business_data.flag_deleted = false
    JOIN user_data ON business.created_by_user_id = user_data.user_id
    JOIN status ON business.business_status_id = status.status_id
    JOIN business_type ON business_data.business_type_id = business_type.business_type_id
    JOIN category
        ON business_data.category_id = category.category_id
        AND category.history_id IS NULL
        AND category.flag_deleted = false
    WHERE business.business_uuid = '${businessUUID}'
    AND business.history_id IS NULL`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessDataByCIdInDB = async (categoryId) => {
    let sql = `SELECT business.business_uuid, business.created_by_user_id, user_data.username AS created_by_username,
    business.business_status_id, status.status_name AS business_status_name, business.created_at_timestamp, business_data.*,
    business_type.business_type_name, category.category_name
    FROM business
    JOIN business_data
        ON business.business_id = business_data.business_id
        AND business_data.history_id IS NULL
        AND business_data.flag_deleted = false
        AND business_data.sub_category_id = ${categoryId}
    JOIN user_data ON business.created_by_user_id = user_data.user_id
    JOIN status ON business.business_status_id = status.status_id
    JOIN business_type ON business_data.business_type_id = business_type.business_type_id
    JOIN category
        ON business_data.category_id = category.category_id
        AND category.history_id IS NULL
        AND category.flag_deleted = false
    WHERE business.history_id IS NULL
    AND business.flag_deleted = false
    ORDER BY RANDOM()`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessScheduleDataInDB = async (businessId) => {
    let sql = `SELECT business_schedule.*, week_day.week_day_name
    FROM business_schedule
    JOIN week_day ON business_schedule.week_day_id = week_day.week_day_id
    WHERE ${businessId.length ? `business_id IN (${businessId}) AND` : ""}
    history_id IS NULL
    AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessCoverPhotoDataInDB = async (businessId) => {
    let sql = `SELECT * FROM business_cover_photo WHERE ${businessId.length ? `business_id IN (${businessId}) AND` : ""} history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessProductTagDataInDB = async (businessId) => {
    let sql = `SELECT * FROM business_product_tag WHERE ${businessId.length ? `business_id IN (${businessId}) AND` : ""} history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessCatalogDataInDB = async (businessId) => {
    let sql = `SELECT * FROM business_catalog WHERE ${businessId.length ? `business_id IN (${businessId}) AND` : ""} history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessContactDataInDB = async (businessId) => {
    let sql = `SELECT * FROM business_contact WHERE ${businessId.length ? `business_id IN (${businessId}) AND` : ""} history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getBusinessAddressDataInDB = async (businessId, userTaluka) => {
    let sql = `SELECT * FROM business_address WHERE ${businessId.length ? `business_id IN (${businessId}) AND` : ""} ${userTaluka ? `taluka = '${userTaluka}' AND` : ""} history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getInactiveBusinessDB = async () => {
    let sql = `SELECT business.business_uuid, business.created_by_user_id, business.cash_amount, user_data.*,
    business.business_status_id, status.status_name AS business_status_name, business.created_at_timestamp, business_data.*,
    business_type.business_type_name, category.category_name, business_contact.*
    FROM business
    JOIN business_data
        ON business.business_id = business_data.business_id
        AND business_data.history_id IS NULL
        AND business_data.flag_deleted = false
    JOIN user_data ON business.created_by_user_id = user_data.user_id
    JOIN status ON business.business_status_id = status.status_id
    JOIN business_type ON business_data.business_type_id = business_type.business_type_id
    JOIN category
        ON business_data.category_id = category.category_id
        AND category.history_id IS NULL
        AND category.flag_deleted = false
    JOIN business_contact ON business.business_id = business_contact.business_id
    WHERE business.history_id IS NULL
    AND business.flag_deleted = true
    AND cash_payment = true`
    let response = await crud.executeQuery(sql)
    return response
}

module.exports = {
    addBusinessDataInDB: addBusinessDataInDB,
    addBusinessDetailInDB: addBusinessDetailInDB,
    addBusinessContactDataInDB: addBusinessContactDataInDB,
    addBusinessAddressDataInDB: addBusinessAddressDataInDB,
    addBusinessScheduleDataInDB: addBusinessScheduleDataInDB,
    addBusinessCoverPhotoDataInDB: addBusinessCoverPhotoDataInDB,
    addBusinessProductTagDataInDB: addBusinessProductTagDataInDB,
    addBusinessCatalogDataInDB: addBusinessCatalogDataInDB,
    updateBusinessDataInDB: updateBusinessDataInDB,
    updateBusinessDetailInDB: updateBusinessDetailInDB,
    updateBusinessScheduleInDB: updateBusinessScheduleInDB,
    updateBusinessCoverPhotoInDB: updateBusinessCoverPhotoInDB,
    updateBusinessProductTagInDB: updateBusinessProductTagInDB,
    updateBusinessCatalogInDB: updateBusinessCatalogInDB,
    updateBusinessContactInDB: updateBusinessContactInDB,
    updateBusinessAddressInDB: updateBusinessAddressInDB,
    addBusinessLogInDB: addBusinessLogInDB,
    addBusinessDetailLogInDB: addBusinessDetailLogInDB,
    addBusinessScheduleLogInDB: addBusinessScheduleLogInDB,
    addBusinessCoverPhotoLogInDB: addBusinessCoverPhotoLogInDB,
    addBusinessProductTagLogInDB: addBusinessProductTagLogInDB,
    addBusinessCatalogLogInDB: addBusinessCatalogLogInDB,
    addBusinessContactLogInDB: addBusinessContactLogInDB,
    addBusinessAddressLogInDB: addBusinessAddressLogInDB,
    removeBusinessDataInDB: removeBusinessDataInDB,
    removeBusinessDetailInDB: removeBusinessDetailInDB,
    removeBusinessScheduleInDB: removeBusinessScheduleInDB,
    removeBusinessCoverPhotoInDB: removeBusinessCoverPhotoInDB,
    removeBusinessProductTagInDB: removeBusinessProductTagInDB,
    removeBusinessCatalogInDB: removeBusinessCatalogInDB,
    removeBusinessContactInDB: removeBusinessContactInDB,
    removeBusinessAddressInDB: removeBusinessAddressInDB,
    getWeekDayDataInDB: getWeekDayDataInDB,
    getBusinessTypeDataInDB: getBusinessTypeDataInDB,
    getBusinessDataInDB: getBusinessDataInDB,
    getBusinessDataByNameInDB: getBusinessDataByNameInDB,
    getBusinessDataByUUIdInDB: getBusinessDataByUUIdInDB,
    getBusinessDataByCIdInDB: getBusinessDataByCIdInDB,
    getBusinessScheduleDataInDB: getBusinessScheduleDataInDB,
    getBusinessCoverPhotoDataInDB: getBusinessCoverPhotoDataInDB,
    getBusinessProductTagDataInDB: getBusinessProductTagDataInDB,
    getBusinessCatalogDataInDB: getBusinessCatalogDataInDB,
    getBusinessContactDataInDB: getBusinessContactDataInDB,
    getBusinessAddressDataInDB: getBusinessAddressDataInDB,
    getInactiveBusinessDB: getInactiveBusinessDB
}
