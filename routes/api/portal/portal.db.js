const crud = require("../../crud")

const getCategoryDataInDB = async () => {
    let sql = `SELECT * FROM category WHERE history_id IS NULL AND flag_deleted = false`
    return await crud.executeQuery(sql)
}

const updateCategoryIconInDB = async (categoryId, categoryIconURL) => {
    let sql = `UPDATE category
    SET category_icon = ${!categoryIconURL ? null : `'${categoryIconURL}'`}
    WHERE category_id = ${categoryId}
    RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

module.exports = {
    getCategoryDataInDB: getCategoryDataInDB,
    updateCategoryIconInDB: updateCategoryIconInDB
}
