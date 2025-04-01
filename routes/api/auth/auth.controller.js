const authModule = require("./auth.module")

const sendAuthenticationCodeController = async (req, res) => {
    const result = await authModule.sendAuthenticationCodeModule(req)
    return res.send(result)
}

const loginController = async (req, res) => {
    const result = await authModule.loginModule(req)
    if (result.status) {
        res.setHeader("Set-Cookie", `zoilo-ssid=${result.data[0].access_token}; Domain=${process.env.COOKIE_DOMAIN}; Secure; Path=/;HttpOnly;SameSite=None; Expires=${new Date(result.data[0].access_token_expires_at).toUTCString()};`)
    }
    return res.send(result)
}

const logoutController = async (req, res) => {
    const result = await authModule.logoutModule(req)
    if (result.status) {
        res.setHeader("Set-Cookie", `zoilo-ssid=; Domain=${process.env.COOKIE_DOMAIN}; Secure; Path=/;HttpOnly;SameSite=None; Expires=${new Date("2000-01-01").toUTCString()};`)
    }
    return res.send(result)
}

module.exports = {
    sendAuthenticationCodeController: sendAuthenticationCodeController,
    loginController: loginController,
    logoutController: logoutController
}
