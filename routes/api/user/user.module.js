const userDb = require("./user.db")
const constant = require("../../../helpers/constant")
const LibFunction = require("../../../helpers/libfunction")
const authDb = require("../auth/auth.db")
const businessDb = require("../business/business.db")

const getUserDetailModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = req.user_id

        if (!userData || !userId) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        let getUserDataByDb = await LibFunction.getUserDataByIdInDB(userId)
        if (!getUserDataByDb.status) {
            return getUserDataByDb
        }

        getUserDataByDb.data["access_token"] = userData["access_token"]

        return {
            status: true,
            data: [getUserDataByDb.data]
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const updateUserDetailModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = userData.user_id

        const obj = {
            userId: userId,
            ipAddress: req.ip
        }

        const username = req.body.username || null
        const emailAddress = req.body.email_address || null
        const gender = req.body.gender == true || req.body.gender == "true" ? true : req.body.gender == false || req.body.gender == "false" ? false : null
        const profileIcon = req.body.profile_icon || null
        const address = req.body.address || null
        const birthDate = !req.body.birth_date ? null : await LibFunction.formateDateLib(req.body.birth_date)
        const city = req.body.city || null
        const taluka = req.body.taluka || null

        // if (!username || gender == null) {
        //     return {
        //         status: false,
        //         error: constant.requestMessages.ERR_INVALID_BODY
        //     }
        // }

        if (userData.username == username && userData.email_address == emailAddress && userData.gender == gender && userData.profile_icon == profileIcon && userData.address == address && userData.birth_date == birthDate && userData.city == city && userData.taluka == taluka) {
            return {
                status: false,
                error: constant.requestMessages.NO_CHANGE_FOUND
            }
        }

        const addChangeLogDetailsDb = await LibFunction.addChangeLogDetailsLib(obj)
        const changeLogId = addChangeLogDetailsDb.data[0].change_log_id

        const addUserDataLogsDb = await userDb.addUserDataLogInDB(userId)
        if (addUserDataLogsDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const updateUserDataDb = await userDb.updateUserDataInDB(userId, changeLogId, username, emailAddress, gender, birthDate, profileIcon, address, city, taluka)
        if (updateUserDataDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return await getUserDetailModule(req)
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const deleteUserAccountModule = async (req) => {
    try {
        const userId = req.user_id || req.user_data.user_id
        const userBusinessData = req.user_data.user_business_data

        const obj = {
            userId: userId,
            ipAddress: req.ip
        }

        const addChangeLogDetailsLibDB = await LibFunction.addChangeLogDetailsLib(obj)
        const changeLogId = await addChangeLogDetailsLibDB.data[0].change_log_id

        await authDb.removeUserPasswordTokenByIdInDB(userId)
        await authDb.removeAccessTokenDataByIdInDB(userId)

        // await businessDb.addBusinessLogInDB(userBusinessData.business_id)
        // await businessDb.removeBusinessDataInDB(userBusinessData.business_id, changeLogId)

        await userDb.addUserDataLogInDB(userId)
        await userDb.removeUserDataInDB(userId, changeLogId)

        return {
            status: true,
            data: constant.requestMessages.USER_ACCOUNT_DELETED_SUCCESSFULLY
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
    getUserDetailModule: getUserDetailModule,
    updateUserDetailModule: updateUserDetailModule,
    deleteUserAccountModule: deleteUserAccountModule
}
