const path = require("path")
const fs = require("fs")
const dotenv = require("dotenv").config()
const LibFunction = require("../../../helpers/libfunction")
const LibStorage = require("../../../helpers/libstorage")
const constant = require("../../../helpers/constant")
const storageDb = require("./storage.db")

function errorMessage(params) {
    return {
        status: false,
        error: params != undefined ? params : constant.requestMessages.ERR_GENERAL
    }
}

const uploadFileModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = userData.user_id
        const city_name = req?.body?.name
        if (!userId) {
            return errorMessage()
        }

        let fileArr = req.files
        console.log(fileArr)
        if (fileArr.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const obj = {
            userId: userId,
            ipAddress: req.ip
        }

        const addChangeLogDetailsLib = await LibFunction.addChangeLogDetailsLib(obj)
        let changeLogId = addChangeLogDetailsLib.data[0].change_log_id

        let result = []
        for (let i = 0; i < fileArr.length; i++) {
            let file = fileArr[i]
            let fileType = path.extname(file.originalname)
            let fileSize = file.size
            let filePath = path.join(__dirname, `../../../${file.path}`)
            let originalFileName = file.originalname
            let newFileName = file.filename
            let flagPublic = true

            const fileStream = fs.createReadStream(filePath)
            let fileUpload = await LibStorage.s3FileUpload(fileStream, originalFileName, newFileName, fileSize, fileType, flagPublic, false, userId, changeLogId, city_name)

            const deleteFile = await LibStorage.FileDelete(filePath)
            if (deleteFile.status == false) {
                return errorMessage(constant.requestMessages.ERR_WHILE_UPLODING_FILE)
            }

            if (fileUpload.status == false) {
                return errorMessage(constant.requestMessages.ERR_WHILE_UPLODING_FILE)
            }

            const data = {
                "s3_storage_id": fileUpload.data.s3_storage_id,
                "user_assignment_id": fileUpload.data.user_id,
                "s3_storage_original_file_name": fileUpload.data.s3_storage_original_file_name,
                "s3_storage_file_key": fileUpload.data.s3_storage_file_key,
                "file_url": fileUpload.data.s3_storage_file_self_link,
                "s3_storage_etag": fileUpload.data.s3_storage_etag,
                "s3_storage_server_side_encryption": fileUpload.data.s3_storage_server_side_encryption,
                "s3_storage_flag_public": fileUpload.data.s3_storage_flag_public,
                "flag_deleted": fileUpload.data.flag_deleted,
                "timestamp": fileUpload.data.timestamp
            }
            result.push(data)
        }

        return {
            status: true,
            data: result
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getFileModule = async (req) => {
    try {
        let fileID = req.query.file_id
        let flagInfo = req.query.flag_info

        if (fileID == "" || fileID == undefined || flagInfo == "" || flagInfo == undefined) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_BODY
            }
        }

        const s3Storage = await storageDb.getS3StorageFile(fileID)
        if (s3Storage.status == false || s3Storage.data.length == 0) {
            return errorMessage(constant.requestMessages.ERR_BAD_REQUEST)
        }
        // console.log(s3Storage.data)

        if (flagInfo == "true" || flagInfo == true) {
            const data = {
                "s3_storage_id": s3Storage.data[0].s3_storage_id,
                "user_assignment_id": s3Storage.data[0].user_assignment_id,
                "s3_storage_original_file_name": s3Storage.data[0].s3_storage_original_file_name,
                "s3_storage_file_key": s3Storage.data[0].s3_storage_file_key,
                "self_link": s3Storage.data[0].s3_storage_file_self_link,
                "s3_storage_object": s3Storage.data[0].s3_storage_object,
                "s3_storage_etag": s3Storage.data[0].s3_storage_etag,
                "s3_storage_server_side_encryption": s3Storage.data[0].s3_storage_server_side_encryption,
                "s3_storage_flag_public": s3Storage.data[0].s3_storage_flag_public,
                "s3_storage_file_size": s3Storage.data[0].s3_storage_s3_storage_file_size,
                "s3_storage_file_type": s3Storage.data[0].s3_storage_file_type,
                "flag_deleted": s3Storage.data[0].flag_deleted,
                "timestamp": s3Storage.data[0].timestamp
            }
            return {
                "status": true,
                "data": [data]
            }
        } else if (flagInfo == "false") {
            const preSignedUrl = await LibStorage.getPreSignedUrl(s3Storage.data[0].s3_storage_file_key)
            if (!preSignedUrl.status) {
                return { status: false, error: preSignedUrl.error }
            }
            console.log(preSignedUrl)
            return {
                "status": true,
                "data": preSignedUrl.data?.pre_signed_url
            }
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const deleteFileModule = async (req) => {
    try {
        let fileId = req.query.file_id
        let userAssignmentId = req.user_data?.user_assignment_id
        if (fileId == undefined || fileId == null || fileId == "") {
            return errorMessage(constant.requestMessages.ERR_INVALID_BODY)
        }

        const s3Storage = await storageDb.getS3StorageFile(fileId)

        if (s3Storage.status == false || s3Storage.data.length == 0) {
            return errorMessage(constant.requestMessages.ERR_BAD_REQUEST)
        }

        if (s3Storage.data[0].user_assignment_id != userAssignmentId) {
            return errorMessage(constant.requestMessages.ERR_ACCESS_NOT_GRANTED)
        }
        let changeLogId
        if (s3Storage.data[0].flag_saved == true) {
            const obj = {
                userAssignmentId: userAssignmentId,
                ipAddress: req.ip
            }

            const addChangeLogDetailsLib = await LibFunction.addChangeLogDetailsLib(obj)
            changeLogId = addChangeLogDetailsLib.data[0].change_log_id
        } else {
            changeLogId = undefined
        }
        let deleteFile = await LibStorage.deleteS3File(fileId, userAssignmentId, s3Storage.data[0], changeLogId)

        if (deleteFile.status == false) {
            return errorMessage(constant.requestMessages.ERR_DELETE_FILE_FROM_GOOGLE)
        }

        return {
            status: true,
            data: "File deleted successfully"
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const refreshSignedUrlModule = async (req) => {
    try {
        let pre_signed_url = req.pre_signed_url
        let file_id = req.file_id
        let userAssignmentId = req.user_data?.user_assignment_id
        if (pre_signed_url == undefined || pre_signed_url == null || pre_signed_url == "" || file_id == undefined || file_id == null || file_id == "") {
            return errorMessage(constant.requestMessages.ERR_INVALID_BODY)
        }

        const s3Storage = await storageDb.getS3StorageFile(file_id)

        if (s3Storage.status == false || s3Storage.data.length == 0) {
            return errorMessage(constant.requestMessages.ERR_BAD_REQUEST)
        }

        if (s3Storage.data[0].user_assignment_id != userAssignmentId) {
            return errorMessage(constant.requestMessages.ERR_ACCESS_NOT_GRANTED)
        }

        let newSignedUrl = await LibStorage.getPreSignedUrl(s3Storage.data[0].s3_storage_file_key)
        if (!newSignedUrl.status) {
            return { status: false, error: newSignedUrl.error }
        }
        console.log(newSignedUrl)
        return {
            status: true,
            message: "Signed url refreshed",
            data: newSignedUrl.data?.pre_signed_url
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
    uploadFileModule: uploadFileModule,
    getFileModule: getFileModule,
    deleteFileModule: deleteFileModule,
    refreshSignedUrlModule: refreshSignedUrlModule
}
