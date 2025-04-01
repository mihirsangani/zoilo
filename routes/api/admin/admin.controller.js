const adminModule = require("./admin.module")

const registerAdminController = async (req, res) => {
    const result = await adminModule.registerAdminModule(req)
    return res.send(result)
}

const loginController = async (req, res) => {
    const result = await adminModule.loginModule(req)
    return res.send(result)
}

const logoutController = async (req, res) => {
    const result = await adminModule.logoutModule(req)
    return res.send(result)
}

module.exports = {
    registerAdminController: registerAdminController,
    loginController: loginController,
    logoutController: logoutController
}
