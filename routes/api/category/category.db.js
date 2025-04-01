const crud = require("../../crud")

const getCategoryDataInDB = async (categoryId) => {
    let sql = `SELECT * FROM category WHERE parent_category_id IS NULL AND history_id IS NULL AND flag_deleted = false`
    if (categoryId) {
        sql += ` AND category_id IN (${categoryId}) Order by category_name asc`
    }
    let response = await crud.executeQuery(sql)
    return response
}

const getSubCategoryDataInDB = async (subCategoryId) => {
    let sql = `SELECT * FROM category WHERE history_id IS NULL AND flag_deleted = false`
    if (subCategoryId) {
        sql += ` AND category_id = ${subCategoryId} Order by category_name asc`
    }
    let response = await crud.executeQuery(sql)
    return response
}

const getCategoryDataByPCIdInDB = async (parentCategoryId) => {
    let sql = `SELECT * FROM category WHERE parent_category_id IN (${parentCategoryId}) AND history_id IS NULL AND flag_deleted = false Order by category_name asc`
    let response = await crud.executeQuery(sql)
    return response
}

const getTemplateCategoryDataInDB = async () => {
    let sql = `SELECT * FROM template_category WHERE flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getFeaturedCategoryDataInDB = async () => {
    let sql = `SELECT * FROM featured_category WHERE flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getMarketCategory = async (category_id) => {
    let sql = `SELECT * FROM market_category`;

    if (category_id) {
        sql += ` WHERE parent_category_id = ${category_id}`
    } else {
        sql += `  WHERE parent_category_id IS NULL`
    }
    const response = await crud.executeQuery(sql)
    return response
}

const getMarketCategoryDataDB = async (categoryId) => {
    let sql = `SELECT * FROM market_category WHERE parent_category_id IS NULL`
    if (categoryId) {
        sql += ` AND category_id IN (${categoryId}) ORDER BY category_name asc`
    }
    let response = await crud.executeQuery(sql)
    return response
}

const getMarketSubCategoryDataDB = async (categoryId) => {
    let sql = `SELECT * FROM market_category WHERE category_id IN (${categoryId})`
    let response = await crud.executeQuery(sql)
    return response
}

module.exports = {
    getCategoryDataInDB: getCategoryDataInDB,
    getSubCategoryDataInDB: getSubCategoryDataInDB,
    getCategoryDataByPCIdInDB: getCategoryDataByPCIdInDB,
    getTemplateCategoryDataInDB: getTemplateCategoryDataInDB,
    getFeaturedCategoryDataInDB: getFeaturedCategoryDataInDB,
    getMarketCategory: getMarketCategory,
    getMarketCategoryDataDB: getMarketCategoryDataDB,
    getMarketSubCategoryDataDB: getMarketSubCategoryDataDB
}
