const crud = require("../../crud")

const addProductDataInDB = async (userId, changeLogId, marketTypeId, productStatusId, productCategoryId, productSubCategoryId, productName, productDescription, productPriceTypeId, productPrice, productAddress, productTypeId, userCity) => {
    let fieldArr = [
        { field: "user_id", value: userId },
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "market_type_id", value: marketTypeId },
        { field: "product_status_id", value: productStatusId },
        { field: "product_category_id", value: productCategoryId },
        { field: "product_sub_category_id", value: productSubCategoryId },
        { field: "product_name", value: productName },
        { field: "product_description", value: productDescription },
        { field: "product_price_type_id", value: productPriceTypeId },
        { field: "product_price", value: productPrice },
        { field: "product_address", value: productAddress },
        { field: "product_type_id", value: productTypeId },
        { field: "flag_deleted", value: false },
        { field: "city", value: userCity }
    ]
    let response = await crud.executeQuery(crud.makeInsertQueryString("product_data", fieldArr, [], true))
    return response
}

const addProductImageDataInDB = async (values) => {
    let sql = `INSERT INTO product_image_data(added_by_change_log_id, product_data_id, product_image_url, flag_deleted)
    VALUES ${values} RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addProductProfileDetailsInDB = async (changeLogId, productDataId, profileUsername, profileContactNum, whatsappNum, whatsappPreferenceFlag, callPreferenceFlag, profileUserEmail, profileUserAddress) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "product_data_id", value: productDataId },
        { field: "username", value: profileUsername },
        { field: "contact_number", value: profileContactNum },
        { field: "whatsapp_number", value: whatsappNum },
        { field: "contact_preference_whatsapp_flag", value: whatsappPreferenceFlag },
        { field: "contact_preference_call_flag", value: callPreferenceFlag },
        { field: "user_email", value: profileUserEmail },
        { field: "user_address", value: profileUserAddress },
        { field: "flag_deleted", value: false }
    ]
    let response = await crud.executeQuery(crud.makeInsertQueryString("product_profile_detail", fieldArr, [], true))
    return response
}

const addProductDataLogsInDB = async (productDataId) => {
    let sql = `INSERT INTO product_data(user_id, added_by_change_log_id, market_type_id, product_status_id, product_category_id, product_sub_category_id, product_name, product_description, product_price_type_id, product_price, product_address, product_type_id, history_id, flag_deleted)
    (
        SELECT user_id, added_by_change_log_id, market_type_id, product_status_id, product_category_id, product_sub_category_id, product_name, product_description, product_price_type_id, product_price, product_address, product_type_id, product_data_id, flag_deleted
        FROM product_data
        WHERE product_data_id IN (${productDataId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const addProductProfileDetailsLogsInDB = async (productProfileDetailId) => {
    let sql = `INSERT INTO product_profile_detail(added_by_change_log_id, product_data_id, username, contact_number, whatsapp_number, contact_preference_whatsapp_flag, contact_preference_call_flag, user_email, user_address, history_id, flag_deleted)
    (
        SELECT added_by_change_log_id, product_data_id, username, contact_number, whatsapp_number, contact_preference_whatsapp_flag, contact_preference_call_flag, user_email, user_address, product_profile_detail_id, flag_deleted
        FROM product_profile_detail
        WHERE product_profile_detail_id IN (${productProfileDetailId})
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const updateProductDataInDB = async (productDataId, changeLogId, productCategoryId, productSubCategoryId, productName, productDescription, productPriceTypeId, productPrice, productAddress, productTypeId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "product_category_id", value: productCategoryId },
        { field: "product_sub_category_id", value: productSubCategoryId },
        { field: "product_name", value: productName },
        { field: "product_description", value: productDescription },
        { field: "product_price_type_id", value: productPriceTypeId },
        { field: "product_price", value: productPrice },
        { field: "product_address", value: productAddress },
        { field: "product_type_id", value: productTypeId }
    ]
    let condition = `product_data_id = ${productDataId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("product_data", fieldArr, condition))
    return response
}

const updateProductProfileDetailsInDB = async (productProfileDetailId, changeLogId, profileUsername, profileContactNum, whatsappNum, whatsappPreferenceFlag, callPreferenceFlag, profileUserEmail, profileUserAddress) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "username", value: profileUsername },
        { field: "contact_number", value: profileContactNum },
        { field: "whatsapp_number", value: whatsappNum },
        { field: "contact_preference_whatsapp_flag", value: whatsappPreferenceFlag },
        { field: "contact_preference_call_flag", value: callPreferenceFlag },
        { field: "user_email", value: profileUserEmail },
        { field: "user_address", value: profileUserAddress }
    ]
    let condition = `product_profile_detail_id = ${productProfileDetailId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("product_profile_detail", fieldArr, condition))
    return response
}

const removeProductDataInDB = async (productDataId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `product_data_id = ${productDataId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("product_data", fieldArr, condition))
    return response
}

const removeProductImageDataInDB = async (productDataId) => {
    let fieldArr = [{ field: "flag_deleted", value: true }]
    let condition = `product_data_id = ${productDataId} AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("product_image_data", fieldArr, condition))
    return response
}

const removeProductProfileDetailInDB = async (productProfileDetailId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `product_profile_detail_id = ${productProfileDetailId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("product_profile_detail", fieldArr, condition))
    return response
}

const getProductDataInDB = async (productDataId) => {
    let sql = `SELECT *
    FROM product_data
    WHERE product_data_id = ${productDataId}
    AND history_id IS NULL
    AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getFilteredProductDataInDB = async (marketTypeId, productDataId, categoryId, productPriceTypeId, productTypeId, userCity, myProductFlag = false) => {
    let sql = `SELECT product_data.*, user_data.username AS created_by_username, user_data.profile_icon, market_type.market_type_name,
    status.status_name AS product_status_name, market_category.category_name AS product_category_name, product_type.product_type_name,
    sub_category.category_name AS product_sub_category_name, product_price_type.product_price_type_name,
    product_profile_detail.product_profile_detail_id, product_profile_detail.username AS profile_detail_username,
    product_profile_detail.contact_number, product_profile_detail.whatsapp_number,
    product_profile_detail.contact_preference_whatsapp_flag, product_profile_detail.contact_preference_call_flag,
    product_profile_detail.user_email AS profile_detail_user_email, product_profile_detail.user_address AS profile_detail_user_address
    FROM product_data
    JOIN user_data ON product_data.user_id = user_data.user_id AND user_data.history_id IS NULL AND user_data.flag_deleted = false
    JOIN market_type ON product_data.market_type_id = market_type.market_type_id
    JOIN status ON product_data.product_status_id = status.status_id
    JOIN product_price_type ON product_data.product_price_type_id = product_price_type.product_price_type_id
    JOIN product_type ON product_data.product_type_id = product_type.product_type_id
    LEFT JOIN market_category
        ON product_data.product_category_id = market_category.category_id
        AND market_category.parent_category_id IS NULL
        AND market_category.flag_deleted = false
    LEFT JOIN market_category AS sub_category
        ON product_data.product_sub_category_id = sub_category.category_id
        AND sub_category.parent_category_id = product_data.product_category_id
        AND sub_category.flag_deleted = false 
    JOIN product_profile_detail
        ON product_data.product_data_id = product_profile_detail.product_data_id
        AND product_profile_detail.history_id IS NULL
        AND product_profile_detail.flag_deleted = false
    WHERE product_data.market_type_id = ${marketTypeId} ${!myProductFlag ? `AND product_data.city = '${userCity}'` : ''}
    AND product_data.history_id IS NULL
    AND product_data.flag_deleted = false`

    if (productDataId != null) {
        sql += ` AND product_data.product_data_id = ${productDataId}`
    } else if (categoryId != null || productPriceTypeId != null || productTypeId != null) {
        if (categoryId != null) {
            sql += ` AND product_data.product_category_id = ${categoryId}`
        }

        if (productPriceTypeId != null) {
            sql += ` AND product_data.product_price_type_id = ${productPriceTypeId}`
        }

        if (productTypeId != null) {
            sql += ` AND product_data.product_type_id = ${productTypeId}`
        }
    }

    sql += ` ORDER BY product_data.timestamp desc`

    let response = await crud.executeQuery(sql)
    return response
}

const getProductImageDataInDB = async (productDataId) => {
    let sql = `SELECT * FROM product_image_data WHERE product_data_id IN (${productDataId}) AND history_id IS NULL AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getProductProfileDetailInDB = async (productProfileDetailId) => {
    let sql = `SELECT *
    FROM product_profile_detail
    WHERE product_profile_detail_id IN (${productProfileDetailId})
    AND history_id IS NULL
    AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const createJobOpeningDb = async (jobOpeningObj) => {
    const sql = crud.makeInsertQueryString('job_opening', jobOpeningObj, null, true)
    const result = await crud.executeQuery(sql)
    return result
}

const updateJobOpeningDb = async (jobOpeningObj, jobOpeningObjWhere) => {
    const sql = crud.makeUpdateQueryString('job_opening', jobOpeningObj, jobOpeningObjWhere)
    const result = await crud.executeQuery(sql)
    return result
}

const getJobOpeningDb = async (flag_single, businessId, userCity, education, keyword) => {
    let sql;
    let whereClause;
    if (userCity) {
        const cityList = userCity.split(" ");

        whereClause = cityList
            .map(city => `city LIKE '%${city}%'`)
            .join(" OR ");
    }
    
    whereClause = `(${whereClause})`;

    if (flag_single) {
        sql = `select * from job_opening where ${keyword ? `job_position ILIKE '%${keyword}%' AND` : ''} ${education ? `education_qualification = '${education}'AND ` : ''} business_id = ${businessId} AND history_id is null AND flag_deleted = false ORDER BY timestamp desc`
    } else {
        sql = `select * from job_opening where ${keyword ? `job_position ILIKE '%${keyword}%' AND` : ''} ${education ? `education_qualification = '${education}'AND ` : ''} history_id is null AND flag_deleted = false AND ${whereClause ? (whereClause) : ""} ORDER BY timestamp desc`
    }

    const result = await crud.executeQuery(sql)
    return result
}

const getJobOpeningByIdDb = async (id) => {
    const sql = `select * from job_opening where job_opening_id=${id} AND history_id is null AND flag_deleted = false`
    const result = await crud.executeQuery(sql)
    return result
}

const getBusinessDetailDb = async (businessId) => {
    const sql = `select * from business_data where business_id IN ('${businessId}') and history_id is null and flag_deleted = false`
    const result = await crud.executeQuery(sql)
    return result
}

const getResumeDetailDb = async (flag_single, user_id, education, role, userCity) => {
    let sql;
    let whereClause;
    if (userCity) {
        const cityList = userCity.split(" ");

        whereClause = cityList
            .map(city => `cities LIKE '%${city}%'`)
            .join(" OR ");
    }

    whereClause = `(${whereClause})`;

    if (flag_single) {
        sql = `SELECT *
            FROM resume_detail rd
            JOIN change_log cl ON rd.change_log_id = cl.change_log_id
            JOIN user_data ud ON cl.user_id = ud.user_id
            WHERE ud.user_id = ${user_id} AND rd.flag_deleted = false ${education ? `AND rd.resumer_education = '${education}'` : ''} ${role ? `AND rd.resumer_role = '${role}'` : ''} ORDER BY timestamp desc`
    } else {
        sql = `select * from resume_detail where history_id is null AND flag_deleted = false AND ${whereClause ? (whereClause) : ""} ${education ? `AND resumer_education = '${education}'` : ''} ${role ? `AND resumer_role = '${role}'` : ''} ORDER BY timestamp desc`
    }

    const result = await crud.executeQuery(sql)
    return result
}

const getResumeByIdDb = async (id) => {
    const sql = `select * from resume_detail where resume_detail_id=${id} AND history_id is null AND flag_deleted = false`
    const result = await crud.executeQuery(sql)
    return result
}

const createResumeDb = async (resumeOpeningObj) => {
    const sql = crud.makeInsertQueryString('resume_detail', resumeOpeningObj, null, true)
    const result = await crud.executeQuery(sql)
    return result
}

const updateResumeOpeningDb = async (jobOpeningObj, jobOpeningObjWhere) => {
    const sql = crud.makeUpdateQueryString('resume_detail', jobOpeningObj, jobOpeningObjWhere)
    const result = await crud.executeQuery(sql)
    return result
}

const deleteRowDb = async (tableName, fieldName, id) => {
    const sql = `UPDATE ${tableName} SET flag_deleted = true WHERE ${fieldName} = ${id} Returning *`;
    const result = await crud.executeQuery(sql);
    return result;
}

const countJobOpening = async (id, purchaseDate, validityDate) => {
    let sql;
    if (validityDate) {
        sql = `
            SELECT cl.user_id, 
                COUNT(jo.job_opening_id) AS total_job_openings_current_year
            FROM change_log cl
            JOIN job_opening jo 
            ON cl.change_log_id = jo.change_log_id
            WHERE cl.user_id = ${id}
            AND 
                jo.timestamp >= TO_TIMESTAMP(${purchaseDate} / 1000) + 
                    (FLOOR(EXTRACT(EPOCH FROM (CURRENT_DATE - TO_TIMESTAMP(${purchaseDate} / 1000))) / (365 * 24 * 60 * 60)) * INTERVAL '1 year')
            AND 
                jo.timestamp < '${validityDate}'::date
            GROUP BY cl.user_id;`
    } else {
        sql = `
            SELECT cl.user_id, 
                COUNT(jo.job_opening_id) AS total_job_openings_current_year
            FROM change_log cl
            JOIN job_opening jo 
            ON cl.change_log_id = jo.change_log_id
            WHERE cl.user_id = ${id}
            AND 
                jo.timestamp >= TO_TIMESTAMP(${purchaseDate} / 1000) + 
                    (FLOOR(EXTRACT(EPOCH FROM (CURRENT_DATE - TO_TIMESTAMP(${purchaseDate} / 1000))) / (365 * 24 * 60 * 60)) * INTERVAL '1 year')
            AND 
                jo.timestamp < TO_TIMESTAMP(${purchaseDate} / 1000) + 
                    ((FLOOR(EXTRACT(EPOCH FROM (CURRENT_DATE - TO_TIMESTAMP(${purchaseDate} / 1000))) / (365 * 24 * 60 * 60)) + 1) * INTERVAL '1 year')
            GROUP BY cl.user_id;`
    }

    const result = await crud.executeQuery(sql);
    return result;
}

const countMarketPost = async (id) => {
    const sql = `SELECT 
                    pd.user_id, 
                        COUNT(CASE WHEN pd.market_type_id = 1 THEN pd.product_data_id END) AS total_sell_post,
                        COUNT(CASE WHEN pd.market_type_id = 2 THEN pd.product_data_id END) AS total_demand_post
                    FROM product_data pd 
                    WHERE pd.user_id = ${id} 
                    AND pd.timestamp >= DATE_TRUNC('month', CURRENT_DATE)
                    AND pd.timestamp < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
                    GROUP BY pd.user_id;`

    const result = await crud.executeQuery(sql);
    return result;
}

module.exports = {
    addProductDataInDB: addProductDataInDB,
    addProductImageDataInDB: addProductImageDataInDB,
    addProductProfileDetailsInDB: addProductProfileDetailsInDB,
    addProductDataLogsInDB: addProductDataLogsInDB,
    addProductProfileDetailsLogsInDB: addProductProfileDetailsLogsInDB,
    updateProductDataInDB: updateProductDataInDB,
    updateProductProfileDetailsInDB: updateProductProfileDetailsInDB,
    removeProductDataInDB: removeProductDataInDB,
    removeProductImageDataInDB: removeProductImageDataInDB,
    removeProductProfileDetailInDB: removeProductProfileDetailInDB,
    getProductDataInDB: getProductDataInDB,
    getFilteredProductDataInDB: getFilteredProductDataInDB,
    getProductImageDataInDB: getProductImageDataInDB,
    getProductProfileDetailInDB: getProductProfileDetailInDB,
    createJobOpeningDb: createJobOpeningDb,
    updateJobOpeningDb: updateJobOpeningDb,
    getJobOpeningDb: getJobOpeningDb,
    getJobOpeningByIdDb: getJobOpeningByIdDb,
    getBusinessDetailDb: getBusinessDetailDb,
    getResumeDetailDb: getResumeDetailDb,
    getResumeByIdDb: getResumeByIdDb,
    createResumeDb: createResumeDb,
    updateResumeOpeningDb: updateResumeOpeningDb,
    deleteRowDb: deleteRowDb,
    countJobOpening: countJobOpening,
    countMarketPost: countMarketPost
}
