const portalDb = require("./portal.db")
const constant = require("../../../helpers/constant")

const getCategoryModule = async () => {
    try {
        const getCategoryDataDb = await portalDb.getCategoryDataInDB()
        return {
            status: true,
            data: getCategoryDataDb.data
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const updateCategoryModule = async (req) => {
    try {
        const categoryId = req.body.category_id || null
        const categoryIconURL = req.body.category_icon || null

        if (!categoryId) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const updateCategoryIconDb = await portalDb.updateCategoryIconInDB(categoryId, categoryIconURL)
        if (updateCategoryIconDb.data.length == 0) {
            return {
                status: false
            }
        }

        return {
            status: true
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

module.exports = {
    getCategoryModule: getCategoryModule,
    updateCategoryModule: updateCategoryModule
}
