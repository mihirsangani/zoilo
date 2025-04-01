const cron = require('node-cron');
const globalDb = require('../routes/api/global/global.db');

const updatePaymentValidity = async () => {
    try {
        console.log("Cronjob started ... ", new Date().toLocaleString());

        const updateData = await globalDb.paymentExpiredDb();
        const updateUserData = await globalDb.userPlanExpiredDb();
        if (updateData.status === false || updateUserData.status === false) {
            throw new Error("Nothing to update")
        }

        console.log("Cronjob done successfully.")
    } catch (error) {
        console.error(error.message);
    }
};

cron.schedule('0 0 * * *', () => {
    console.log('Running daily payment validity check...');
    updatePaymentValidity();
});