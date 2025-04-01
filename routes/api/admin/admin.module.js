const bcrypt = require("bcrypt")
const adminDB = require("./admin.db")
const constant = require("../../../helpers/constant")
const LibFunction = require("../../../helpers/libfunction")

const registerAdminModule = async (req, res) => {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        return {
            status: false,
            error: constant.requestMessages.ERR_INVALID_BODY
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;

        let adminData = []
        Object.entries(req.body).map(x => adminData.push({ "field": x[0], "value": x[1] }))
        const registerAdmin = await adminDB.registerAdmin(adminData);

        if (registerAdmin.status == false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return {
            status: true,
            data: registerAdmin.data[0]
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error.message
        }
    }
};

const loginModule = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return {
            status: false,
            error: constant.requestMessages.ERR_INVALID_BODY
        }
    }

    try {
        const adminData = await adminDB.getAdminData(email);
        if (adminData.data.length == 0) {
            return {
                status: false,
                error: "Admin not found with this email !"
            }
        }

        const admin = adminData.data[0];

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return {
                status: false,
                error: "Invalid email or password !"
            }
        }

        const token = await LibFunction.getRandomString(64);
        const condition = `email = '${email}'`;
        const updatedData = [{ "field": "access_token", "value": token }, { "field": "login_at", "value": 'NOW()' }]
        const updateAdmin = await adminDB.updateAdminData(updatedData, condition);

        if (updateAdmin.status === false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return {
            status: true,
            data: updateAdmin.data[0]
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error.message
        }
    }
}

const logoutModule = async (req, res) => {
    try {
        const user_data = req.user_data;

        const condition = `email = '${user_data.email}'`;
        const updatedData = [{ "field": "access_token", "value": null }, { "field": "login_at", "value": null }]
        const updateAdmin = await adminDB.updateAdminData(updatedData, condition);

        if (updateAdmin.status === false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return {
            status: true,
            data: "Logout Successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error.message
        }
    }
}

module.exports = {
    registerAdminModule: registerAdminModule,
    loginModule: loginModule,
    logoutModule: logoutModule
}