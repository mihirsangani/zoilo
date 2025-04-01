const globalModule = require("./global.module")

const getPrivacyPolicyController = async (req, res) => {
    const result = await globalModule.getPrivacyPolicyModule(req)
    return res.send(result)
}

const getTermsNConditionController = async (req, res) => {
    const result = await globalModule.getTermsNConditionModule(req)
    return res.send(result)
}

const getBannerController = async (req, res) => {
    const result = await globalModule.getBannerModule()
    return res.send(result)
}

const getStatesController = async (req, res) => {
    const result = await globalModule.getStatesModule()
    return res.send(result)
}

const getCitiesController = async (req, res) => {
    const result = await globalModule.getCitiesModule(req)
    return res.send(result)
}

const getMarketTypeController = async (req, res) => {
    const result = await globalModule.getMarketTypeModule()
    return res.send(result)
}

const getProductTypeController = async (req, res) => {
    const result = await globalModule.getProductTypeModule()
    return res.send(result)
}

const getProductPriceTypeController = async (req, res) => {
    const result = await globalModule.getProductPriceTypeModule()
    return res.send(result)
}

const getCitiesListController = async (req, res) => {
    const result = await globalModule.getCitiesListModule()
    return res.send(result)
}

const getTalukaListController = async (req, res) => {
    const result = await globalModule.getTalukaListModule(req, res)
    return res.send(result)
}

const getCityImgController = async (req, res) => {
    const result = await globalModule.getCityImgModule(req, res)
    return res.send(result)
}

const getPlansController = async (req, res) => {
    const result = await globalModule.getPlansModule(req, res)
    return res.send(result)
}

const searchController = async (req, res) => {
    const result = await globalModule.searchModule(req, res)
    return res.send(result)
}

const searchCategoryController = async (req, res) => {
    const result = await globalModule.searchCategoryModule(req, res)
    return res.send(result)
}

const createOrderController = async (req, res) => {
    const result = await globalModule.createOrderModule(req, res)
    return res.send(result)
}

const savePaymentController = async (req, res) => {
    const result = await globalModule.savePaymentModule(req, res)
    return res.send(result)
}

const orderStatusController = async (req, res) => {
    const result = await globalModule.orderStatusModule(req, res)
    return res.send(result)
}

module.exports = {
    getPrivacyPolicyController: getPrivacyPolicyController,
    getTermsNConditionController: getTermsNConditionController,
    getBannerController: getBannerController,
    getStatesController: getStatesController,
    getCitiesController: getCitiesController,
    getMarketTypeController: getMarketTypeController,
    getProductTypeController: getProductTypeController,
    getProductPriceTypeController: getProductPriceTypeController,
    getCitiesListController: getCitiesListController,
    getTalukaListController: getTalukaListController,
    getCityImgController: getCityImgController,
    getPlansController: getPlansController,
    searchController: searchController,
    searchCategoryController: searchCategoryController,
    createOrderController: createOrderController,
    savePaymentController: savePaymentController,
    orderStatusController: orderStatusController
}
