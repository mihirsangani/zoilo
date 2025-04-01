const crud = require("../../crud")

const updateUserDataInDB = async (userId, changeLogId, username, emailAddress, gender, birthDate, profileIcon, address, city, taluka) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "username", value: username },
        { field: "email_address", value: emailAddress },
        { field: "gender", value: gender },
        { field: "birth_date", value: birthDate },
        { field: "profile_icon", value: profileIcon },
        { field: "address", value: address },
        { field: "city", value: city },
        { field: "taluka", value: taluka }
    ]
    let condition = `user_id = ${userId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("user_data", fieldArr, condition))
    return response
}

const addUserDataLogInDB = async (userId) => {
    let sql = `INSERT INTO user_data(user_uuid, added_by_change_log_id, created_at, username, email_address, contact, gender, birth_date, profile_icon, address, history_id, flag_deleted)
    (
        SELECT user_uuid, added_by_change_log_id, created_at, username, email_address, contact, gender, birth_date, profile_icon, address, user_id, flag_deleted
        FROM user_data
        WHERE user_id = ${userId}
    ) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const removeUserDataInDB = async (userId, changeLogId) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "flag_deleted", value: true }
    ]
    let condition = `user_id = ${userId}`
    let response = await crud.executeQuery(crud.makeUpdateQueryString("user_data", fieldArr, condition))
    return response
}

const updateUserDataDynamic = async (data, id) => {
    const condition = `user_id = ${id}`
    const sql =  crud.makeUpdateQueryString('user_data', data, condition)
    const result = await crud.executeQuery(sql)
    return result
}

const getUserDataById = async (id) => {
    const sql = `SELECT * FROM user_data WHERE user_id=${id}`;
    const result = await crud.executeQuery(sql)
    return result
}

const getUserDataByIdWithPlanActive = async (id) => {
    const sql = `SELECT * FROM user_data WHERE user_id=${id} AND plan_active = true`;
    const result = await crud.executeQuery(sql)
    return result
}

module.exports = {
    updateUserDataInDB: updateUserDataInDB,
    addUserDataLogInDB: addUserDataLogInDB,
    removeUserDataInDB: removeUserDataInDB,
    updateUserDataDynamic: updateUserDataDynamic,
    getUserDataById: getUserDataById,
    getUserDataByIdWithPlanActive: getUserDataByIdWithPlanActive
}
