const crud = require("../../crud")

const registerAdmin = async (adminObj) => {
    const sql = crud.makeInsertQueryString("admin_data", adminObj, [], true)
    const result = await crud.executeQuery(sql)
    return result;
}

const getAdminData = async (email) => {
    const sql = `SELECT * FROM admin_data WHERE email = '${email}' AND flag_deleted = false`
    const result = await crud.executeQuery(sql)
    return result;
}

const updateAdminData = async (adminObj, adminCondition) => {
    const sql = crud.makeUpdateQueryString('admin_data', adminObj, adminCondition)
    const result = await crud.executeQuery(sql)
    return result;
}

module.exports = {
    registerAdmin: registerAdmin,
    getAdminData: getAdminData,
    updateAdminData: updateAdminData
}