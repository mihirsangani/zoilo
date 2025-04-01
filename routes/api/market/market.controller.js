const marketModule = require("./market.module")

const getProductController = async (req, res) => {
    const result = await marketModule.getProductModule(req)
    return res.send(result)
}

const createProductController = async (req, res) => {
    const result = await marketModule.createProductModule(req)
    return res.send(result)
}

const updateProductController = async (req, res) => {
    const result = await marketModule.updateProductModule(req)
    return res.send(result)
}

const deleteProductController = async (req, res) => {
    const result = await marketModule.deleteProductModule(req)
    return res.send(result)
}

const jobOpeningController = async (req, res) => {
    const result = await marketModule.jobOpeningModule(req)
    return res.send(result)
}

const updateJobOpeningController = async(req,res) => {
    const result = await marketModule.updateJobOpeningModule(req)
    return res.send(result)
}

const deleteJobOpeningController = async (req, res) => {
    const result = await marketModule.deleteJobOpeningModule(req)
    return res.send(result)
}

const getJobOpeningController = async(req,res) => {
    const result = await marketModule.getJobOpeningModule(req)
    return res.send(result)
}

const getJobOpeningByIdController = async(req,res) => {
    const result = await marketModule.getJobOpeninByIdgModule(req)
    return res.send(result)
}

const getResumeController = async(req,res) => {
    const result = await marketModule.getResumeModule(req)
    return res.send(result)
}

const getResumeByIdController = async(req,res) => {
    const result = await marketModule.getResumeByIdModule(req)
    return res.send(result)
}

const createResumeController = async(req,res) => {
    const result = await marketModule.createResumeModule(req)
    return res.send(result)
}

const updateResumeController = async(req,res) => {
    const result = await marketModule.updateResumeModule(req)
    return res.send(result)
}

const deleteResumeController = async (req, res) => {
    const result = await marketModule.deleteResumeModule(req)
    return res.send(result)
}

module.exports = {
    getProductController: getProductController,
    createProductController: createProductController,
    updateProductController: updateProductController,
    deleteProductController: deleteProductController,
    jobOpeningController:jobOpeningController,
    updateJobOpeningController:updateJobOpeningController,
    deleteJobOpeningController: deleteJobOpeningController,
    getJobOpeningController:getJobOpeningController,
    getJobOpeningByIdController: getJobOpeningByIdController,
    getResumeController:getResumeController,
    getResumeByIdController: getResumeByIdController,
    createResumeController:createResumeController,
    updateResumeController:updateResumeController,
    deleteResumeController: deleteResumeController
}
