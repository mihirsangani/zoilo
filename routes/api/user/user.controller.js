const userModule = require("./user.module")

const getUserDetailController = async (req, res) => {
    const result = await userModule.getUserDetailModule(req)
    return res.send(result)
}

const updateUserDetailController = async (req, res) => {
    const result = await userModule.updateUserDetailModule(req)
    return res.send(result)
}

const deleteUserAccountController = async (req, res) => {
    const result = await userModule.deleteUserAccountModule(req)
    return res.send(result)
}

module.exports = {
    getUserDetailController: getUserDetailController,
    updateUserDetailController: updateUserDetailController,
    deleteUserAccountController: deleteUserAccountController
}
