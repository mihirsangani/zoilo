const { v4 } = require("uuid")
const crud = require("../routes/crud")
const constant = require("../helpers/constant")
const globalDb = require('../routes/api/global/global.db')
const userDb = require("../routes/api/user/user.db")
const marketDb = require("../routes/api/market/market.db")
const feedDb = require("../routes/api/feed/feed.db")

const formateDateLib = async (date) => {
    var d = date ? new Date(date) : new Date(),
        month = 1 + d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1,
        day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours(),
        minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
        second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()

    var str = [year, month, day].join("-")
    var formatedDate = `${str} ${hour}:${minute}:${second}`
    return formatedDate
}

const getCurrentTimeStamp = async (date) => {
    // let currentTimestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    let currentTimestamp = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return currentTimestamp
}

const getExpireTimeStamp = async (flag) => {
    if (flag) {
        var expireTimestamp = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 30)
    } else {
        var expireTimestamp = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }

    return expireTimestamp
}

const getExpireOTP = async () => {
    var expireTimestamp = new Date(new Date().getTime() + 3 * 60 * 1000)
    return expireTimestamp
}

const getRandomString = async (len) => {
    if (!len) {
        return ""
    }

    var result = ""
    var characters = "ABCDEFGHIJKfLMNOPQrerfhRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    result += new Date().getTime()
    return result
}

const addChangeLogDetailsLib = async (obj) => {
    const getTime = obj.create_timestamp ? await formateDateLib(obj.create_timestamp) : await formateDateLib()
    var fieldArr = [
        { field: "user_id", value: obj.userId },
        { field: "change_log_timestamp", value: getTime },
        { field: "ip_address", value: obj.ipAddress }
    ]

    // if (obj.companyId) fieldArr.push({ field: "company_id", value: obj.companyId })
    const changeLogDetails = await crud.executeQuery(crud.makeInsertQueryString("change_log", fieldArr, ["change_log_id"], false))

    if (!changeLogDetails.status) {
        return {
            status: false,
            error: constant.requestMessages.ERR_GENERAL
        }
    }
    return changeLogDetails
}

const generateUUID = () => {
    return v4()
}

const generateOTP = async (length) => {
    if (!length) length = 8
    let otp = ""
    for (let i = 0; i < length; i++) {
        const randomValue = Math.round(Math.random() * 9)
        otp += randomValue
    }
    return otp
}

const generateRamdomPassword = async (length) => {
    if (length == undefined || length < 8) {
        return ""
    }

    var result = ""
    var char = "ABCsyz012%DEFGHI&Jtuvw@xKLMNOPc^defQRSTU!34abghi*jklm56#VWXYZnopqr$789"
    for (i = 0; i < length; i++) {
        result += char.charAt(Math.floor(Math.random() * char.length))
    }
    return result
}

const isBusinessOpen = (gmtOpenTime, gmtCloseTime) => {
    // Parse GMT times (HH:MM:SS)
    const parseTime = (timeStr) => {
        const [h, m, s = 0] = timeStr.split(':').map(Number);
        return h * 3600 + m * 60 + s;
    };

    const now = new Date();
    // Get current UTC time in seconds
    const currentUTCSec = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
    const openSec = parseTime(gmtOpenTime);
    const closeSec = parseTime(gmtCloseTime);

    // Handle overnight in GMT (e.g., "18:00 GMT" → "02:00 GMT")
    if (closeSec < openSec) {
        return currentUTCSec >= openSec || currentUTCSec <= closeSec;
    }
    // Normal case (e.g., "09:00 GMT" → "20:00 GMT")
    else {
        return currentUTCSec >= openSec && currentUTCSec <= closeSec;
    }
};

const getUserDataByIdInDB = async (userId) => {
    try {
        const sql = `SELECT * FROM user_data WHERE user_id = ${userId} AND history_id IS NULL AND flag_deleted = false`
        const response = await crud.executeQuery(sql)
        if (!response.status || response.data.length == 0) {
            return {
                status: false,
                error: constant.inValidAuthentication
            }
        }

        const getBusinessDataDb = await crud.executeQuery(`SELECT * FROM business WHERE created_by_user_id = ${userId} AND history_id IS NULL AND (flag_deleted = false OR (flag_deleted = true AND cash_payment = true))`)
        const businessRegisteredFlag = getBusinessDataDb.data.length > 0
        const businessId = !businessRegisteredFlag ? null : getBusinessDataDb.data[0].business_id
        const businessUUID = !businessRegisteredFlag ? null : getBusinessDataDb.data[0].business_uuid
        const businessAddressData = await crud.executeQuery(`SELECT * FROM business_address WHERE business_id = ${businessId} AND flag_deleted = false`)
        const businessCity = businessAddressData.data.length > 0 ? businessAddressData.data[0].city : null

        const userUUID = response.data[0].user_uuid
        const createdAtTimestamp = await formateDateLib(new Date(response.data[0].created_at))
        const username = response.data[0].username
        const contact = response.data[0].contact
        const emailAddress = response.data[0].email_address || null
        const address = response.data[0].address || null
        const city = response.data[0].city || null
        const taluka = response.data[0].taluka || null
        const gender = response.data[0].gender
        const birthDate = !response.data[0].birth_date ? null : await formateDateLib(response.data[0].birth_date)
        const profileIcon = response.data[0].profile_icon || null
        const plan_active = response.data[0].plan_active || false

        const userData = {
            user_id: parseInt(userId),
            user_uuid: userUUID,
            created_at_timestamp: createdAtTimestamp,
            username: username,
            contact: contact,
            email_address: emailAddress,
            gender: gender,
            birth_date: birthDate,
            profile_icon: profileIcon,
            address: address,
            user_business_data: {
                business_registered_flag: businessRegisteredFlag,
                business_id: businessId,
                business_uuid: businessUUID,
                business_city: businessCity
            },
            city: city,
            taluka: taluka,
            plan_active: plan_active
        }

        // console.log(userData)

        return {
            status: true,
            data: userData
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getPlanDetails = async (amount) => {
    try {
        const planData = await globalDb.getPlanByAmountDb(amount);

        if (planData.data.length == 0) {
            return {
                status: false,
                error: "Plan not found !"
            }
        }

        return {
            status: true,
            data: planData.data
        }
    } catch (error) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getUsersSubscriptionData = async (userId, type) => {
    try {
        console.log("Type --->", type)
        // Fetch user payment data
        const { data: userPaymentData } = await userDb.getUserDataByIdWithPlanActive(userId);
        const userPlan = userPaymentData?.[0];
        console.log("User Plan --->", userPlan?.plan_active, userPlan?.plan_amount, userPlan?.plan_validity)

        if (!userPlan?.plan_active) {
            return { status: false, error: constant.requestMessages.ERR_NO_PLAN };
        }

        // Check plan validity
        if (userPlan?.plan_validity && userPlan?.plan_validity !== '0' && Date.now() >= parseInt(userPlan.plan_validity)) {
            return { status: false, error: constant.requestMessages.ERR_PLAN_EXPIRED };
        }

        // Fetch plan details
        const { data: planDetails } = await getPlanDetails(userPlan.plan_amount);
        console.log("Plan Details --->", planDetails)
        const {
            validity: planValidity,
            dojobopening: doJobOpening,
            jobopeningperyear: jobOpeningPerYear,
            dofeed: doFeed,
            feedpermonth: feedPerMonth,
            dosellpost: doSellPost,
            sellpostpermonth: sellPostPerMonth,
            dodemandpost: doDemandPost,
            demandpostpermonth: demandPostPerMonth,
        } = planDetails?.[0] || {};

        // Check permission for the requested type
        const typePermissions = {
            job: doJobOpening,
            feed: doFeed,
            sell: doSellPost,
            demand: doDemandPost,
        };
        
        if (!typePermissions[type]) {
            return { status: false, error: constant.requestMessages.ERR_NO_POST };
        }

        // Compute validity date for non-lifetime plans
        let planValidityDate;
        if (planValidity !== 'Lifetime') {
            const validityDate = new Date(parseInt(userPlan.plan_validity));
            planValidityDate = validityDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        }
        console.log("Plan Validity --->", planValidityDate)

        // Helper to check limits
        const checkLimitExceeded = async (dbCall, limitKey, limitValue) => {
            const { data } = await dbCall(userId, userPlan.payment_date, planValidityDate);
            console.log("Post Count --->", data)
            if (data?.[0]?.[limitKey] >= limitValue) {
                return true;
            }
            return false;
        };

        // Check specific limits based on type
        if (type === "job") {
            console.log("---> 1")
            const isExceeded = await checkLimitExceeded(
                marketDb.countJobOpening,
                "total_job_openings_current_year",
                jobOpeningPerYear
            );
            if (isExceeded) {
                return { status: false, error: constant.requestMessages.ERR_LIMIT_EXEED };
            }
        } else if (type === "feed") {
            console.log("---> 2")
            const isExceeded = await checkLimitExceeded(
                feedDb.countFeeds,
                "total_feeds_last_month",
                feedPerMonth
            );
            if (isExceeded) {
                return { status: false, error: constant.requestMessages.ERR_LIMIT_EXEED };
            }
        } else if (type === "sell" || type === "demand") {
            console.log("---> 3")
            const { data: marketPostData } = await marketDb.countMarketPost(userId);
            const {
                total_sell_post: totalSellPost,
                total_demand_post: totalDemandPost,
            } = marketPostData?.[0] || {};

            if (
                (type === "sell" && totalSellPost >= sellPostPerMonth) ||
                (type === "demand" && totalDemandPost >= demandPostPerMonth)
            ) {
                return { status: false, error: constant.requestMessages.ERR_LIMIT_EXEED };
            }
        }

        // Success response
        return { status: true };
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error.message
        }
    }
}

module.exports = {
    formateDateLib: formateDateLib,
    getCurrentTimeStamp: getCurrentTimeStamp,
    getExpireTimeStamp: getExpireTimeStamp,
    getExpireOTP: getExpireOTP,
    getRandomString: getRandomString,
    addChangeLogDetailsLib: addChangeLogDetailsLib,
    generateUUID: generateUUID,
    generateOTP: generateOTP,
    generateRamdomPassword: generateRamdomPassword,
    isBusinessOpen: isBusinessOpen,
    getUserDataByIdInDB: getUserDataByIdInDB,
    getPlanDetails: getPlanDetails,
    getUsersSubscriptionData: getUsersSubscriptionData
}
