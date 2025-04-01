const crud = require("../../crud")

const addUserDataInDB = async (userUUID, changeLogId, createdAt, username, contact, emailAddress, gender, birthDate, profileIcon, address, flag) => {
    let fieldArr = [
        { field: "user_uuid", value: userUUID },
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "created_at", value: createdAt },
        { field: "username", value: username },
        { field: "contact", value: contact },
        { field: "email_address", value: emailAddress },
        { field: "gender", value: gender },
        { field: "birth_date", value: birthDate },
        { field: "profile_icon", value: profileIcon },
        { field: "address", value: address },
        { field: "flag_deleted", value: flag }
    ]
    let response = await crud.executeQuery(crud.makeInsertQueryString("user_data", fieldArr, [], true))
    return response
}

const addUserPasswordTokenInDB = async (changeLogId, userId, code, timestamp, expireTimestamp, flag) => {
    let fieldArr = [
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "user_id", value: userId },
        { field: "code", value: code },
        { field: "created_at", value: timestamp },
        { field: "expires_at", value: expireTimestamp },
        { field: "flag_deleted", value: flag }
    ]
    let response = await crud.executeQuery(crud.makeInsertQueryString("user_password_token", fieldArr, [], true))
    return response
}

const addUserAccessTokenInDB = async (userId, changeLogId, accessToken, createdAtTimestamp, expiresAtTimestamp, flag) => {
    let fieldArr = [
        { field: "user_id", value: userId },
        { field: "added_by_change_log_id", value: changeLogId },
        { field: "access_token_value", value: accessToken },
        { field: "created_at", value: createdAtTimestamp },
        { field: "expires_at", value: expiresAtTimestamp },
        { field: "flag_deleted", value: flag }
    ]
    let response = await crud.executeQuery(crud.makeInsertQueryString("user_access_token", fieldArr, [], true))
    return response
}

const removeUserPasswordTokenInDB = async (userPasswordTokenId) => {
    let sql = `UPDATE user_password_token SET flag_deleted = true WHERE user_password_token_id IN (${userPasswordTokenId}) RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const removeUserPasswordTokenByIdInDB = async (userId) => {
    let sql = `UPDATE user_password_token SET flag_deleted = true WHERE user_id = ${userId} RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const removeAccessTokenDataInDB = async (accessToken) => {
    let sql = `UPDATE user_access_token
    SET flag_deleted = true
    WHERE access_token_value = '${accessToken}'
    AND flag_deleted = false
    RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const removeAccessTokenDataByIdInDB = async (userId) => {
    let sql = `UPDATE user_access_token
    SET flag_deleted = true
    WHERE user_id = ${userId}
    AND flag_deleted = false
    RETURNING *`
    let response = await crud.executeQuery(sql)
    return response
}

const getUserDataByContactInDB = async (contact) => {
    let sql = `SELECT user_data.*, change_log.change_log_timestamp, change_log.ip_address
    FROM user_data
    JOIN change_log ON user_data.added_by_change_log_id = change_log.change_log_id
    WHERE history_id IS NULL
    AND flag_deleted = false`

    if (!!contact) {
        sql += ` AND REPLACE(REPLACE(REPLACE(contact, ' ', ''), '-', ''), '+', '') = '${contact.replace(/ /g, "").replace(/-/g, "").replace(/\+/g, "")}'`
    }

    let response = await crud.executeQuery(sql)
    return response
}

const getUserPasswordTokenInDB = async (userId, code, timestamp) => {
    let sql = `SELECT *
    FROM user_password_token
    WHERE user_id = ${userId}
    AND code = '${code}'
    AND created_at <= '${timestamp}'
    AND expires_at >= '${timestamp}'
    AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getUserPasswordTokenByUserIdInDB = async (userId) => {
    let sql = `SELECT *
    FROM user_password_token
    WHERE user_id = ${userId}
    AND flag_deleted = false`
    let response = await crud.executeQuery(sql)
    return response
}

const getAccessTokenDataInDB = async (accessToken, timestamp) => {
    let sql = `SELECT * 
    FROM user_access_token
    WHERE access_token_value = '${accessToken}'
    AND expires_at >= '${timestamp}'
    AND flag_deleted = false`
}

module.exports = {
    addUserDataInDB: addUserDataInDB,
    addUserPasswordTokenInDB: addUserPasswordTokenInDB,
    addUserAccessTokenInDB: addUserAccessTokenInDB,
    removeUserPasswordTokenInDB: removeUserPasswordTokenInDB,
    removeUserPasswordTokenByIdInDB: removeUserPasswordTokenByIdInDB,
    removeAccessTokenDataInDB: removeAccessTokenDataInDB,
    removeAccessTokenDataByIdInDB: removeAccessTokenDataByIdInDB,
    getUserDataByContactInDB: getUserDataByContactInDB,
    getUserPasswordTokenInDB: getUserPasswordTokenInDB,
    getUserPasswordTokenByUserIdInDB: getUserPasswordTokenByUserIdInDB,
    getAccessTokenDataInDB: getAccessTokenDataInDB
}
