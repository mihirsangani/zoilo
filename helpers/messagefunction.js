const dotenv = require("dotenv").config()
const axios = require("axios")
const constant = require("./constant")
const crud = require("../routes/crud")
const LibFunction = require("./libfunction")
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioSender = process.env.TWILIO_SENDER_NUMBER

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY
const SENDER_ID = process.env.SENDER_ID
const TEMPLATE_ID = process.env.TEMPLATE_ID
const route = 4

const sendMessageFunction = async (to, code, message, changeLogObj) => {
    try {
        // const client = require("twilio")(accountSid, authToken)
        // const response = await client.messages
        //     .create({
        //         body: message || "Welcome to Lokonomy App! Your verification code is 684259. Please do not share this code with anyone.",
        //         from: twilioSender,
        //         to: to || "+918141815811"
        //     })
        //     .then((message) => {
        //         console.log(message.sid)
        //         return message
        //     })

        // console.log(response)

        // const accountSID = response.accountSid
        // const messageBody = response.body
        // const dateCreated = await LibFunction.formateDateLib(response.dateCreated)
        // const messageSentFrom = response.from
        // const messageSentTo = response.to
        // const messageSID = response.sid
        // const messageStatus = response.status
        // const messageURI = response.uri
        // const errorCode = response.errorCode
        // const errorMessage = response.errorMessage
        // const metaData = JSON.stringify(response)

        // let changeLogId = changeLogObj.change_log_id
        // if (!changeLogId) {
        //     const addChangeLogDetailsDb = await LibFunction.addChangeLogDetailsLib(changeLogObj.cl_obj)
        //     changeLogId = addChangeLogDetailsDb.data[0].change_log_id
        // }
        // const addTwilioMessageLogsDb = await crud.executeQuery(`
        //     INSERT INTO twilio_message_log(
        //         added_by_change_log_id,
        //         account_sid,
        //         message_sid,
        //         message_body,
        //         message_created_at,
        //         message_sent_from,
        //         message_sent_to,
        //         message_status,
        //         message_uri,
        //         error_code,
        //         error_message,
        //         message_metadata
        //     )
        //     VALUES (${changeLogId}, '${accountSID}', '${messageSID}', '${messageBody}', '${dateCreated}', '${messageSentFrom}', '${messageSentTo}', '${messageStatus}', '${messageURI}', '${errorCode}', '${errorMessage}', '${metaData}')
        //     RETURNING *
        // `)
        // if (!addTwilioMessageLogsDb.status || addTwilioMessageLogsDb.data.length == 0) {
        //     return {
        //         status: false,
        //         error: constant.requestMessages.ERR_GENERAL
        //     }
        // }

        // if (errorCode) {
        //     return {
        //         status: false,
        //         error: JSON.parse(JSON.stringify(constant.requestMessages.TWILIO_ERROR).replace(/{{error_message}}/g, errorMessage))
        //     }
        // }

        to = to.replace("+", "");

        const data = {
            "template_id": TEMPLATE_ID,
            "short_url": "0",
            "realTimeResponse": "1",
            "recipients": [
                {
                    "mobiles": `${to}`,
                    "var1": "Login/Signup",
                    "var2": code
                }
            ]
        }
        console.log(data)

        const response = await axios.post('https://control.msg91.com/api/v5/flow', data, {
            headers: {
                'authkey': MSG91_AUTH_KEY,
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return {
            status: true,
            data: [response.data]
        }
    } catch (err) {
        console.log(err)
        let message = err.message
        if (err.code == 21614 || err.code == 21211) {
            message = "The phone number you entered is invalid. Please try again with a different number."
        }
        return {
            status: false,
            error: message
        }
    }
}

module.exports = {
    sendMessageFunction: sendMessageFunction
}
