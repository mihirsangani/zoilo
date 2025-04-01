const crud = require("../../crud")

const getS3StorageFile = async (fileId) => {
    var sql = `SELECT * FROM s3_storage WHERE flag_deleted = false AND history_id IS NULL AND s3_storage_id IN (${fileId})`
    var result = await crud.executeQuery(sql)
    return result
}

module.exports = {
    getS3StorageFile: getS3StorageFile
}
