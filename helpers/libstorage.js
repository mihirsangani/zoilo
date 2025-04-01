const fs = require("fs")
const dotenv = require("dotenv").config()
const AWSClient = require("@aws-sdk/client-s3")
const AWSRequestPresigner = require("@aws-sdk/s3-request-presigner")
const crud = require("../routes/crud")
const LibFunction = require("./libfunction")
const constant = require("./constant")

//Delete file From Local Storage
const FileDelete = async (filePath) => {
    try {
        fs.unlinkSync(filePath)
        return { "status": true }
    } catch (e) {
        return { "status": false, error: e }
    }
}

// Upload File To Google Cloud Private Bucket
const s3FileUpload = async (fileStream, originalFileName, newFileName, fileSize, fileType, flagPublic, flagSaved, userId, changeLogId, city_name = "") => {
    try {
        const timestamp = await LibFunction.formateDateLib()
        let regionName = process.env.S3_BUCKET_REGION
        let bucketName = process.env.S3_BUCKET_NAME
        let s3BucketFolderName = process.env.S3_BUCKET_FOLDER_NAME

        const s3 = new AWSClient.S3Client({
            region: regionName,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY || ""
            }
        })

        const uploadParams = {
            Bucket: bucketName,
            Key: s3BucketFolderName + `/${newFileName}`, // The new file name for S3
            Body: fileStream
        }

        // console.log(`------------------------------${Object.keys(uploadParams)}/${Object.values(uploadParams)}---------------------------------`)
        const uploadCommand = new AWSClient.PutObjectCommand(uploadParams)
        const upload_file = await s3.send(uploadCommand)

        // console.log(`==============================${Object.values(upload_file)}===============================`)
        var fileObject = JSON.stringify(upload_file.$metadata).replace(/"/g, "")
        let etag = upload_file.ETag
        let serverSideEncryption = upload_file.ServerSideEncryption
        let fileURL = `https://${bucketName}.s3.${regionName}.amazonaws.com/${s3BucketFolderName}/${newFileName}`
        let s3FileKey = `${s3BucketFolderName}/${newFileName}`

        if (city_name) {
            await crud.executeQuery(`INSERT INTO city_images (city_name, city_image_url) VALUES ('${city_name}', '${fileURL}') RETURNING *`)
            // await crud.executeQuery(`UPDATE city_images SET city_image_url = '${fileURL}' WHERE city_name = '${city_name}'`)
        }

        var createGoogleStorage = await crud.executeQuery(`
            INSERT INTO s3_storage(
                user_id,
                added_by_change_log_id,
                s3_storage_original_file_name,
                s3_storage_file_self_link,
                s3_storage_object,
                s3_storage_etag,
                s3_storage_server_side_encryption,
                s3_storage_flag_public,
                s3_storage_file_size,
                s3_storage_file_type,
                s3_storage_file_key,
                timestamp,
                flag_saved,
                flag_deleted
            ) VALUES (
                ${userId},
                ${changeLogId},
                '${originalFileName}',
                '${fileURL}',
                '${JSON.stringify(fileObject)}',
                '${etag.replace(/\"/g, "")}',
                '${serverSideEncryption}',
                ${flagPublic},
                '${fileSize}',
                '${fileType}',
                '${s3FileKey}',
                '${timestamp}',
                ${flagSaved},
                false
            ) RETURNING *`)
        if (createGoogleStorage.status == false || createGoogleStorage.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return {
            status: true,
            data: createGoogleStorage.data[0]
        }
    } catch (e) {
        console.log(e)
        return {
            status: false,
            error: e.message
        }
    }
}

const deleteS3File = async (fileId, userAssignmentId, s3Storage, changeLogId) => {
    try {
        var timestamp = await LibFunction.formateDateLib(new Date())
        if (s3Storage.flag_saved == false) {
            var deletePublicFile = await crud.executeQuery(`DELETE FROM s3_storage WHERE s3_storage_id IN ('${fileId}')`)
            if (deletePublicFile.status == false) {
                return { status: false }
            }
            var deleteFileFromStorage = await deleteFileFromS3Storage(s3Storage.s3_storage_file_key)
            if (deleteFileFromStorage.status == false) {
                return { status: false }
            }
            return { status: true }
        } else {
            var generateHistory = await LibFunction.generateHistoryId("s3_storage", "s3_storage_id", fileId)
            if (generateHistory.status != true) {
                return { status: false }
            }
            var updateFile = await crud.executeQuery(`
            UPDATE s3_storage
            SET flag_deleted = 'true', timestamp = '${timestamp}', added_by_change_log_id = '${changeLogId}'
            WHERE s3_storage_id = '${fileId}'
        `)
            if (updateFile.status == false) {
                return { status: false }
            }
            return { status: true }
        }
    } catch (err) {
        return {
            status: false,
            error: err.message
        }
    }
}

const getPreSignedUrl = async (file_key) => {
    try {
        let regionName = process.env.S3_BUCKET_REGION
        let bucketName = process.env.S3_BUCKET_NAME

        const s3 = new AWSClient.S3Client({
            region: regionName,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY || ""
            }
        })

        const params = new AWSClient.GetObjectCommand({
            Bucket: bucketName,
            Key: file_key
        })

        const signedUrl = await AWSRequestPresigner.getSignedUrl(s3, params, { expiresIn: 60 * 10 * 1 }) // URL expires in seconds

        return {
            status: true,
            data: {
                pre_signed_url: signedUrl
            }
        }
    } catch (error) {
        console.error("Error generating pre-signed URL:", error)
        return { status: false, error: error.message }
    }
}

const deleteFileFromS3Storage = async (fileName) => {
    try {
        const bucketName = process.env.S3_BUCKET_NAME

        const s3 = new AWSClient.S3Client({
            region: "us-west-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY || ""
            }
        })

        const deleteParams = {
            Bucket: bucketName,
            Key: fileName
        }
        const deleteCommand = new AWSClient.DeleteObjectCommand(deleteParams)
        const deleteResponse = await s3.send(deleteCommand)
        // console.log(deleteResponse)

        return { status: true }
    } catch (e) {
        console.log(e)
        return { status: false, error: e.message }
    }
}

module.exports = {
    FileDelete: FileDelete,
    s3FileUpload: s3FileUpload,
    deleteS3File: deleteS3File,
    getPreSignedUrl: getPreSignedUrl,
    deleteFileFromS3Storage: deleteFileFromS3Storage
}
