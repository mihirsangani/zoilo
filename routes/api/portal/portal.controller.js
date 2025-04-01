const portalModule = require("./portal.module")

const getCategoryController = async (req, res) => {
    const result = await portalModule.getCategoryModule()
    return res.send(result)
}

const updateCategoryController = async (req, res) => {
    const result = await portalModule.updateCategoryModule(req)
    return res.send(result)
}

module.exports = {
    getCategoryController: getCategoryController,
    updateCategoryController: updateCategoryController
}
