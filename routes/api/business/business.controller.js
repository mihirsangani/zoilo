const businessModule = require("./business.module")

const getBusinessTypeController = async (req, res) => {
    const result = await businessModule.getBusinessTypeModule()
    return res.send(result)
}

const getWeekDataController = async (req, res) => {
    const result = await businessModule.getWeekDataModule(req)
    return res.send(result)
}

const getBusinessListController = async (req, res) => {
    const result = await businessModule.getBusinessListModule(req)
    return res.send(result)
}

const registerBusinessController = async (req, res) => {
    const result = await businessModule.registerBusinessModule(req)
    return res.send(result)
}

const getBusinessDetailController = async (req, res) => {
    const result = await businessModule.getBusinessDetailModule(req)
    return res.send(result)
}

const updateBusinessDetailController = async (req, res) => {
    const result = await businessModule.updateBusinessDetailModule(req)
    return res.send(result)
}

const activeBusinessController = async (req, res) => {
    const result = await businessModule.activeBusinessModule(req)
    return res.send(result)
}

const getInactiveBusinessController = async (req, res) => {
    const result = await businessModule.getInactiveBusinessModule(req)
    return res.send(result)
}

const bulkUploadController = async (req, res) => {
    const result = await businessModule.bulkUploadModule(req)
    return res.send(result)
}

module.exports = {
    getBusinessTypeController: getBusinessTypeController,
    getWeekDataController: getWeekDataController,
    getBusinessListController: getBusinessListController,
    registerBusinessController: registerBusinessController,
    getBusinessDetailController: getBusinessDetailController,
    updateBusinessDetailController: updateBusinessDetailController,
    activeBusinessController: activeBusinessController,
    getInactiveBusinessController: getInactiveBusinessController,
    bulkUploadController: bulkUploadController
}
