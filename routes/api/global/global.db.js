const crud = require("../../crud")

const getPrivacyPolicyDataInDB = async () => {
    let sql = `SELECT * FROM privacy_policy`
    let response = await crud.executeQuery(sql)
    return response
}

const getTermsNConditionDataInDB = async () => {
    let sql = `SELECT * FROM terms_and_condition`
    let response = await crud.executeQuery(sql)
    return response
}

const getBannerDataInDB = async () => {
    let sql = `SELECT * FROM banner`
    let response = await crud.executeQuery(sql)
    return response
}

const getStatusDataByNameInDB = async (statusName) => {
    let sql = `SELECT * FROM status`
    if (statusName) {
        sql += ` WHERE status_name = '${statusName}'`
    }
    let response = await crud.executeQuery(sql)
    return response
}

const getMarketTypeDataInDB = async () => {
    let sql = `SELECT * FROM market_type`
    let response = await crud.executeQuery(sql)
    return response
}

const getProductTypeDataInDB = async () => {
    let sql = `SELECT * FROM product_type`
    let response = await crud.executeQuery(sql)
    return response
}

const getProductPriceTypeDataInDB = async () => {
    let sql = `SELECT * FROM product_price_type`
    let response = await crud.executeQuery(sql)
    return response
}

const getCityImgDataInDB = async (city_name) => {
    let sql = `SELECT * FROM city_images WHERE city_name = '${city_name}'`
    let response = await crud.executeQuery(sql)
    return response
}

const getPlanDetailsDB = async () => {
    let sql = `SELECT * FROM plan_details`
    let response = await crud.executeQuery(sql)
    return response;
}

const searchBusiness = async (keyword, userTaluka) => {
    let sql = `SELECT 
        business.business_id, 
        business.business_uuid, 
        business.created_by_user_id, 
        user_data.username AS created_by_username,
        business.business_status_id, 
        status.status_name AS business_status_name, 
        business.created_at_timestamp, 
        business_data.*,
        business_type.business_type_name, 
        category.category_name, 
        category.gujarati_category_name, 
        COALESCE(
            STRING_AGG(DISTINCT business_product_tag.business_product_tag_name, ', '), ''
        ) AS business_product_tag_name
    FROM business
    JOIN business_data
        ON business.business_id = business_data.business_id
        AND business_data.flag_deleted = false AND business_data.history_id IS NULL
    INNER JOIN business_address ba
        ON business_data.business_id = ba.business_id
        AND ba.taluka = '${userTaluka}'
    LEFT JOIN business_product_tag
        ON business_data.business_id = business_product_tag.business_id
    JOIN user_data 
        ON business.created_by_user_id = user_data.user_id
    JOIN status 
        ON business.business_status_id = status.status_id
    JOIN business_type 
        ON business_data.business_type_id = business_type.business_type_id
    JOIN category
        ON business_data.category_id = category.category_id
        AND category.history_id IS NULL
        AND category.flag_deleted = false
    WHERE business.history_id IS NULL
    AND business.flag_deleted = false
    AND (
        business_data.business_name ILIKE '%${keyword}%'
        OR business_data.business_description ILIKE '%${keyword}%'
        OR COALESCE(business_product_tag.business_product_tag_name, '') ILIKE '%${keyword}%'
    )
    GROUP BY 
        business.business_id, business.business_uuid, business.created_by_user_id, 
        user_data.username, business.business_status_id, status.status_name, 
        business.created_at_timestamp, business_data.business_data_id, 
        business_data.business_id, business_data.business_name, business_data.business_description, business_type.business_type_name, 
        business_data.business_type_id, business_data.category_id, business_data.sub_category_id, business_data.business_logo_url,
        category.category_name, category.gujarati_category_name
    ORDER BY 
        (CASE 
            WHEN LOWER(business_data.business_name) LIKE LOWER('${keyword}%') THEN 1
            ELSE 2
        END),
        POSITION(LOWER('${keyword}') IN LOWER(business_data.business_name)), 
        POSITION(LOWER('${keyword}') IN LOWER(business_data.business_description)),
        business_data.business_name;`

    let response = await crud.executeQuery(sql)
    return response;
}

const searchJobOpening = async (keyword, userCity) => {
    const sql = `SELECT * FROM job_opening WHERE (job_position ILIKE '%${keyword}%' OR job_location ILIKE '%${keyword}%' OR education_qualification ILIKE '%${keyword}%' OR required_skill ILIKE '%${keyword}%' OR profile_name ILIKE '%${keyword}%') AND city ILIKE '%${userCity}%'
    ORDER BY 
        POSITION(LOWER('${keyword}') IN LOWER(job_position)), 
        POSITION(LOWER('${keyword}') IN LOWER(job_location)), 
        POSITION(LOWER('${keyword}') IN LOWER(education_qualification)), 
        POSITION(LOWER('${keyword}') IN LOWER(required_skill)), 
        POSITION(LOWER('${keyword}') IN LOWER(profile_name)), 
        job_position;`
    let response = await crud.executeQuery(sql)
    return response;
}

const searchResume = async (keyword, userCity) => {
    const sql = `SELECT * FROM resume_detail WHERE (resume_personal_name ILIKE '%${keyword}%' OR resume_degree ILIKE '%${keyword}%' OR resumer_education ILIKE '%${keyword}%') AND cities ILIKE '%${userCity}%'
    ORDER BY 
        POSITION(LOWER('${keyword}') IN LOWER(resume_personal_name)), 
        POSITION(LOWER('${keyword}') IN LOWER(resume_degree)), 
        POSITION(LOWER('${keyword}') IN LOWER(resumer_education)), 
        resume_personal_name;`
    let response = await crud.executeQuery(sql)
    return response;
}

const searchFeed = async (keyword, userCity, userId) => {
    const sql = `select bf.*,bfi.business_feed_image_id,bfi.business_feed_image_url,business.business_logo_url,business.business_name,bfl.business_feed_like_id,bfl.user_id,bfl.flag_like from 
	business_feed as bf
    join business_feed_image as bfi
        on bf.business_feed_id = bfi.business_feed_id
    join (select b.business_id,bd.business_logo_url,bd.business_name from business as b 
            join business_data as bd
            on b.business_id = bd.business_id
            where b.history_id is null and b.flag_deleted = false
            and bd.history_id is null and bd.flag_deleted = false
            and b.business_status_id = 1) as business
    on business.business_id = bf.business_id
    left join business_feed_like as bfl
        on bfl.business_feed_id = bf.business_feed_id and bfl.user_id='${userId}' and flag_like = true
    where bf.business_feed_description ILIKE '%${keyword}%' and bf.history_id is null and bf.flag_deleted = false and bf.expire_time >= (CURRENT_DATE) and city='${userCity}'
    and bfi.history_id is null and bfi.flag_deleted = false
    ORDER BY POSITION(LOWER('${keyword}') IN LOWER(bf.business_feed_description)), bf.created_time desc`
    let response = await crud.executeQuery(sql)
    return response;
}

const searchProduct = async (keyword, userCity) => {
    const sql = `SELECT product_data.*, user_data.username AS created_by_username, user_data.profile_icon, market_type.market_type_name,
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
        WHERE (product_data.product_name ILIKE '%${keyword}%' OR product_data.product_description ILIKE '%${keyword}%') AND product_data.city = '${userCity}'
        AND product_data.history_id IS NULL
        AND product_data.flag_deleted = false
        ORDER BY 
            POSITION(LOWER('${keyword}') IN LOWER(product_data.product_name)), 
            POSITION(LOWER('${keyword}') IN LOWER(product_data.product_description)), 
            product_data.product_name;`;
        
    let response = await crud.executeQuery(sql)
    return response;
}

const searchCategory = async (keyword) => {
    const sql = `SELECT * FROM category 
        WHERE history_id IS NULL AND flag_deleted = false AND (category_name ILIKE '%${keyword}%' OR gujarati_category_name ILIKE '%${keyword}%') 
        ORDER BY 
            POSITION(LOWER('${keyword}') IN LOWER(category_name)), 
            POSITION(LOWER('${keyword}') IN LOWER(gujarati_category_name)),
            category_name`
    let response = await crud.executeQuery(sql)
    return response;
}

const createPaymentDb = async(data) => {
    const sql =  crud.makeInsertQueryString('payments', data, null, true)
    const result = await crud.executeQuery(sql)
    return result
}

const getPaymentByIdDb = async (id) => {
    const sql = `SELECT * FROM payments WHERE user_id=${id} AND is_active=true`
    const result = await crud.executeQuery(sql)
    return result
}

const getPlanByAmountDb = async (amount) => {
    const sql = `SELECT * FROM plan_details WHERE amount=${amount}`
   const result = await crud.executeQuery(sql)
   return result
}

const paymentExpiredDb = async () => {
    const sql = `UPDATE payments SET is_active = false WHERE validity != 'Lifetime' AND CAST(validity AS BIGINT) <= EXTRACT(EPOCH FROM NOW()) * 1000 AND is_active = true`
    const result = await crud.executeQuery(sql)
    return result
}

const userPlanExpiredDb = async () => {
    const sql = `UPDATE user_data SET plan_active = false WHERE plan_validity != 0 AND CAST(plan_validity AS BIGINT) <= EXTRACT(EPOCH FROM NOW()) * 1000`
    const result = await crud.executeQuery(sql)
    return result
}

module.exports = {
    getPrivacyPolicyDataInDB: getPrivacyPolicyDataInDB,
    getTermsNConditionDataInDB: getTermsNConditionDataInDB,
    getBannerDataInDB: getBannerDataInDB,
    getStatusDataByNameInDB: getStatusDataByNameInDB,
    getMarketTypeDataInDB: getMarketTypeDataInDB,
    getProductTypeDataInDB: getProductTypeDataInDB,
    getProductPriceTypeDataInDB: getProductPriceTypeDataInDB,
    getCityImgDataInDB: getCityImgDataInDB,
    getPlanDetailsDB: getPlanDetailsDB,
    searchBusiness: searchBusiness,
    searchJobOpening: searchJobOpening,
    searchResume: searchResume,
    searchFeed: searchFeed,
    searchProduct: searchProduct,
    createPaymentDb: createPaymentDb,
    getPaymentByIdDb: getPaymentByIdDb,
    getPlanByAmountDb: getPlanByAmountDb,
    paymentExpiredDb: paymentExpiredDb,
    userPlanExpiredDb: userPlanExpiredDb,
    searchCategory: searchCategory
}
