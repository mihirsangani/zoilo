const dotenv = require("dotenv").config()
const crud = require("./crud")
const LibFunction = require("../helpers/libfunction")
const constant = require("../helpers/constant")

const multer = require("multer");
const path = require("path");
const fs = require('fs');

const checkAccessToken = async (req, res, next) => {
    const currentTimestamp = await LibFunction.formateDateLib(new Date())

    let authTokenHeader = req.headers["Authorization"] || req.headers["authorization"]
    if (authTokenHeader) authTokenHeader = authTokenHeader.replace("Bearer ", "")
    let accessToken = authTokenHeader || req.cookies["zoilo-ssid"]

    if (!accessToken) {
        console.log("1")
        return res.status(401).send({
            status: false,
            error: constant.inValidAuthentication
        })
    }

    const sql = `SELECT * 
    FROM user_access_token
    WHERE access_token_value = '${accessToken}'
    AND expires_at >= '${currentTimestamp}'
    AND flag_deleted = false`
    const getUserIdByTokenDB = await crud.executeQuery(sql)
    if (getUserIdByTokenDB.data.length == 0) {
        console.log("2")
        return res.status(401).send({
            status: false,
            error: constant.inValidAuthentication
        })
    }

    const userId = getUserIdByTokenDB.data[0].user_id
    const loginTimestamp = getUserIdByTokenDB.data[0].user_access_token_create_at

    const getUserDataDb = await LibFunction.getUserDataByIdInDB(userId)
    if (!getUserDataDb.status) {
        console.log("3")
        return res.status(401).send({
            status: false,
            error: constant.inValidAuthentication
        })
    }

    req["user_id"] = userId
    req["user_data"] = getUserDataDb.data
    req["user_data"]["access_token"] = accessToken
    req["user_data"]["login_timestamp"] = loginTimestamp

    console.log(req.user_data)
    next()
}

const blockSystemUser = async (req, res, next) => {
    try {
        if (req.user_data.constant == "+91 555-666-7777") {
            return res.status(401).send({
                status: false,
                error: constant.inValidAuthentication
            })
        }
        next()
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const checkPortalAccess = (req, res, next) => {
    try {
        let accessToken = req.query["token"]
        console.log(accessToken)
        if (accessToken != "2M$1f{FQ8,Pp?gab)?SCy!Dd7!0r-Q$Jxi.ZBnh15mnhiF,V.[Zd7cK(9wLBC8*h") {
            return res.status(401).send({ status: false, error: "Access not granted" })
        }
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).send({ status: false, error: err.message })
    }
}

const checkAccessTokenAdmin = async (req, res, next) => {
    let authTokenHeader = req.headers["Authorization"] || req.headers["authorization"]
    if (authTokenHeader) authTokenHeader = authTokenHeader.replace("Bearer ", "")

    if (!authTokenHeader) {
        console.log("1")
        return res.status(401).send({
            status: false,
            error: constant.inValidAuthentication
        })
    }

    const sql = `SELECT * 
    FROM admin_data
    WHERE access_token = '${authTokenHeader}'
    AND flag_deleted = false`
    const getUserByTokenDB = await crud.executeQuery(sql);

    if (getUserByTokenDB.data.length == 0) {
        console.log("2")
        return res.status(401).send({
            status: false,
            error: constant.inValidAuthentication
        })
    }

    const adminId = getUserByTokenDB.data[0].id

    req["user_id"] = adminId
    req["user_data"] = getUserByTokenDB.data[0]
    req["user_data"]["access_token"] = authTokenHeader

    console.log(req.user_data)
    next()
}

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "text/csv") {
        cb(null, true);
    } else {
        cb(new Error("Only CSV files are allowed!"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = {
    checkAccessToken: checkAccessToken,
    blockSystemUser: blockSystemUser,
    checkPortalAccess: checkPortalAccess,
    checkAccessTokenAdmin: checkAccessTokenAdmin,
    upload: upload
}
