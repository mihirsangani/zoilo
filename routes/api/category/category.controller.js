const categoryModule = require("./category.module")

const getCategoryListController = async (req, res) => {
    const result = await categoryModule.getCategoryListModule(req)
    return res.send(result)
}

const getSubCategoryListController = async (req, res) => {
    const result = await categoryModule.getSubCategoryListModule(req)
    return res.send(result)
}

const getMarketCategoryController = async (req, res) => {
    const result = await categoryModule.getMarketCategoryListModule(req)
    return res.send(result)
}

const getMarketSubCategoryController = async (req, res) => {
    const result = await categoryModule.getMarketSubCategoryListModule(req)
    return res.send(result)
}

module.exports = {
    getCategoryListController: getCategoryListController,
    getSubCategoryListController: getSubCategoryListController,
    getMarketCategoryController: getMarketCategoryController,
    getMarketSubCategoryController: getMarketSubCategoryController
}
