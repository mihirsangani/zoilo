const axios = require("axios");
const moment = require("moment-timezone")
const { Country, State, City } = require("country-state-city")
const globalDb = require("./global.db")
const constant = require("../../../helpers/constant")
const usersDb = require('../user/user.db')
const businessDb = require('../business/business.db')
const helper = require('../../../helpers/constant')
const libfunction = require("../../../helpers/libfunction");
const categoryDb = require("../category/category.db");
const marketDb = require("../market/market.db");

const BASE_URL = process.env.BASE_URL;
const APP_ID = process.env.APP_ID;
const SECRET_KEY = process.env.SECRET_KEY;

const getPrivacyPolicyModule = async (req) => {
    try {
        const getPrivacyPolicyDataDb = await globalDb.getPrivacyPolicyDataInDB()
        let result = []
        for (let i = 0; i < getPrivacyPolicyDataDb.data.length; i++) {
            result.push({
                privacy_policy_id: getPrivacyPolicyDataDb.data[i].privacy_policy_id,
                privacy_policy_url: getPrivacyPolicyDataDb.data[i].privacy_policy_url
            })
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

const getTermsNConditionModule = async (req) => {
    try {
        const getTermsNConditionDataDb = await globalDb.getTermsNConditionDataInDB()
        let result = []
        for (let i = 0; i < getTermsNConditionDataDb.data.length; i++) {
            result.push({
                terms_and_condition_id: getTermsNConditionDataDb.data[i].terms_and_condition_id,
                terms_and_condition_url: getTermsNConditionDataDb.data[i].terms_and_condition_url
            })
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

const getBannerModule = async () => {
    try {
        const getBannerDataDb = await globalDb.getBannerDataInDB()
        let result = []
        for (let i = 0; i < getBannerDataDb.data.length; i++) {
            result.push({
                banner_id: getBannerDataDb.data[i].banner_id,
                banner_name: getBannerDataDb.data[i].banner_name,
                banner_image: getBannerDataDb.data[i].banner_image,
                banner_url: getBannerDataDb.data[i].banner_url
            })
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

const getStatesModule = async () => {
    try {
        const states = State.getAllStates().sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLowerCase()))
        return {
            status: true,
            data: states
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getCitiesModule = async (req) => {
    try {
        let contryCode = req.query.country_code
        let stateCode = req.query.state_code

        if (!contryCode || !stateCode) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        let cities = City.getCitiesOfState(contryCode, stateCode)
        return {
            status: true,
            data: cities
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getMarketTypeModule = async () => {
    try {
        const getMarketTypeDataDb = await globalDb.getMarketTypeDataInDB()
        let result = []
        for (let i = 0; i < getMarketTypeDataDb.data.length; i++) {
            result.push({
                market_type_id: getMarketTypeDataDb.data[i].market_type_id,
                market_type_name: getMarketTypeDataDb.data[i].market_type_name
            })
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

const getProductTypeModule = async () => {
    try {
        const getProductTypeDataDb = await globalDb.getProductTypeDataInDB()
        let result = []
        for (let i = 0; i < getProductTypeDataDb.data.length; i++) {
            result.push({
                product_type_id: getProductTypeDataDb.data[i].product_type_id,
                product_type_name: getProductTypeDataDb.data[i].product_type_name
            })
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

const getProductPriceTypeModule = async () => {
    try {
        const getProductPriceTypeDataDb = await globalDb.getProductPriceTypeDataInDB()
        let result = []
        for (let i = 0; i < getProductPriceTypeDataDb.data.length; i++) {
            result.push({
                product_price_type_id: getProductPriceTypeDataDb.data[i].product_price_type_id,
                product_price_type_name: getProductPriceTypeDataDb.data[i].product_price_type_name
            })
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

const getCitiesListModule = async () => {
    try {
        const list = ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota-Udaipur", "Dahod", "Dang", "Diu", "Dwarka", "Gandhinagar", "Gir-Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mahesana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Valsad", "Vadodara"]
        return {
            status: true,
            data: list
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getTalukaListModule = async (req, res) => {
    try {
        const cityName = req.query.city;
        if (!cityName) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        const talukaList = helper.citiesTalukaList.find(item => item.city === cityName);

        return {
            status: true,
            data: talukaList?.taluka
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getCityImgModule = async (req, res) => {
    try {
        const city_name = req.params.city_name;
        if (!city_name) {
            return {
                status: false,
                error: constant.requestMessages.ERR_BAD_REQUEST
            }
        }
        const result = await globalDb.getCityImgDataInDB(city_name);
        if (result.data.length) {
            return {
                status: true,
                data: result.data
            }
        }
        return {
            status: false,
            data: null
        }
    } catch (err) {
        return {
            status: false,
            error: err.message
        }
    }
}

const getPlansModule = async (req, res) => {
    try {
        const result = await globalDb.getPlanDetailsDB();

        return {
            status: true,
            data: result?.data
        }
    } catch (err) {
        return {
            status: false,
            error: err.message
        }
    }
}

const searchModule = async (req, res) => {
    try {
        const { keyword } = req.query;
        const userId = req.user_id;
        const userCity = req.user_data?.city;
        const userTaluka = req.user_data?.taluka;
        const result = [];

        let jobOpeningData = await globalDb.searchJobOpening(keyword, userCity);

        if (jobOpeningData.data.length) {
            const businessId = jobOpeningData.data.map(x => x.business_id)
            const businessDetail = await marketDb.getBusinessDetailDb(businessId.join("','"))

            if (businessDetail.status == false) {
                return {
                    status: false,
                    error: constant.requestMessages.ERR_GENERAL
                }
            }

            jobOpeningData = jobOpeningData.data.map(x => {
                x["business"] = businessDetail.data.filter(y => x.business_id == y.business_id)[0]
                return x
            })
        }

        const resumeData = await globalDb.searchResume(keyword, userCity);
        const feedData = await globalDb.searchFeed(keyword, userCity, userId);
        const categoryData = await globalDb.searchCategory(keyword);
        const marketData = await globalDb.searchProduct(keyword, userCity);
        if (marketData.data.length > 0) {
            const productDataIdArr = marketData.data.map((ele) => ele.product_data_id)
            const getProductImageDataDb = await marketDb.getProductImageDataInDB(productDataIdArr.join(","))

            for (let i = 0; i < marketData.data.length; i++) {
                let filterImageDataDB = getProductImageDataDb.data.filter((element) => element.product_data_id == marketData.data[i].product_data_id)
                let priceData =
                    marketData.data[i].market_type_name.toLowerCase() == "sell"
                        ? {
                            total_price: marketData.data[i].product_price
                        }
                        : {
                            price_start: JSON.parse(marketData.data[i].product_price)[0],
                            price_end: JSON.parse(marketData.data[i].product_price)[1]
                        }
                result.push({
                    "product_data_id": marketData.data[i].product_data_id,
                    "created_by_user_id": marketData.data[i].user_id,
                    "created_by_username": marketData.data[i].created_by_username,
                    "created_by_user_profile_icon": marketData.data[i].profile_icon,
                    "market_type_id": marketData.data[i].market_type_id,
                    "market_type_name": marketData.data[i].market_type_name,
                    "product_status_id": marketData.data[i].product_status_id,
                    "product_status_name": marketData.data[i].product_status_name,
                    "product_category_id": marketData.data[i].product_category_id,
                    "product_category_name": marketData.data[i].product_category_name,
                    "product_sub_category_id": marketData.data[i].product_sub_category_id,
                    "product_sub_category_name": marketData.data[i].product_sub_category_name,
                    "product_name": marketData.data[i].product_name,
                    "product_description": marketData.data[i].product_description,
                    "product_price_type_id": marketData.data[i].product_price_type_id,
                    "product_price_type_name": marketData.data[i].product_price_type_name,
                    "product_price_data": priceData,
                    "product_address": marketData.data[i].product_address,
                    "product_type_id": marketData.data[i].product_type_id,
                    "product_type_name": marketData.data[i].product_type_name,
                    "product_image_data": filterImageDataDB,
                    "product_profile_details": {
                        "product_profile_detail_id": marketData.data[i].product_profile_detail_id,
                        "username": marketData.data[i].profile_detail_username,
                        "contact_number": marketData.data[i].contact_number,
                        "whatsapp_number": marketData.data[i].whatsapp_number,
                        "contact_preference_whatsapp_flag": marketData.data[i].contact_preference_whatsapp_flag,
                        "contact_preference_call_flag": marketData.data[i].contact_preference_call_flag,
                        "user_email": marketData.data[i].profile_detail_user_email,
                        "user_address": marketData.data[i].profile_detail_user_address
                    }
                })
            }
        }

        const categories = [];
        if (categoryData?.data.length) {
            await Promise.all(
                categoryData.data.map(async (category) => {
                    if (category.parent_category_id) {
                        const parentCategoryData = await categoryDb.getCategoryDataInDB(category.parent_category_id);
                        if (parentCategoryData?.data.length) {
                            const obj = {
                                ...parentCategoryData.data[0],
                                sub_categories: [category],
                            };
                            categories.push(obj);
                        }
                    } else {
                        const subCategoriesData = await categoryDb.getCategoryDataByPCIdInDB(category.category_id);
                        if (subCategoriesData?.data.length) {
                            const obj = {
                                ...category,
                                sub_categories: subCategoriesData.data,
                            };
                            categories.push(obj);
                        }
                    }
                })
            );
        }

        const updatedCategories = categories
            .map(category => {
                const filteredSubCategories = category.sub_categories.filter(sub => sub.category_name !== "Other");

                if (filteredSubCategories.length === 0) {
                    return null;
                }

                return {
                    ...category,
                    sub_categories: filteredSubCategories
                };
            })
            .filter(category => category !== null);

        const businessFind = await globalDb.searchBusiness(keyword, userTaluka);
        if (!businessFind.data?.length) {
            return {
                status: true,
                data: {
                    business_data: [],
                    job_openings: jobOpeningData.length ? jobOpeningData : [],
                    resume_details: resumeData?.data.length ? resumeData?.data : [],
                    feed: feedData?.data.length ? feedData?.data : [],
                    market: result?.length ? result : [],
                    categories: updatedCategories?.length ? updatedCategories : []
                }
            }
        }
        const currWeekDay = new Date().getDay() + 1

        const businessIdArr = [...new Set(businessFind.data.map((element) => element.business_id).filter(id => id))];
        const businessIdArrStr = businessIdArr.length >= 2 ? businessIdArr.join(",") : businessIdArr[0] || "";

        const [
            businessSchedules,
            businessProductTags,
            businessCatalogs,
            businessContacts,
            businessAddresses
        ] = await Promise.all([
            businessDb.getBusinessScheduleDataInDB(businessIdArrStr),
            businessDb.getBusinessProductTagDataInDB(businessIdArrStr),
            businessDb.getBusinessCatalogDataInDB(businessIdArrStr),
            businessDb.getBusinessContactDataInDB(businessIdArrStr),
            businessDb.getBusinessAddressDataInDB(businessIdArrStr, userCity)
        ]);

        const businessData = businessFind.data.map((business) => {
            const businessId = business.business_id;

            const schedule = businessSchedules.data.find(
                (s) => s.business_id == businessId && s.week_day_id == currWeekDay
            );
            const businessOpenFlag = schedule?.flag_open || false;
            const businessOpenTime = schedule ? convertISTtoGMT(schedule.open_time) : null;
            const businessCloseTime = schedule ? convertISTtoGMT(schedule.close_time) : null;
            const businessOpenStatus = businessOpenFlag
                ? libfunction.isBusinessOpen(businessOpenTime, businessCloseTime)
                : false;
            const businessScheduleHours = businessOpenStatus
                ? `Open until ${schedule.close_time}`
                : "Closed";
            const productTags = businessProductTags.data
                .filter((tag) => tag.business_id == businessId)
                .map(({ business_product_tag_id, business_product_tag_name }) => ({
                    business_product_tag_id,
                    business_product_tag_name
                }));

            const contact = businessContacts.data.find((c) => c.business_id == businessId);
            const address = businessAddresses.data.find((a) => a.business_id == businessId);
            const formattedAddress = address
                ? `${address.address_line_one} - ${address.city}`
                : null;

            return {
                business_id: `${businessId}`,
                business_uuid: business.business_uuid,
                business_name: business.business_name,
                business_logo_url: business.business_logo_url,
                business_description: business.business_description,
                category_id: business.category_id,
                category_name: business.category_name,
                gujarati_category_name: business.gujarati_category_name,
                business_status_id: business.business_status_id,
                business_status_name: business.business_status_name,
                business_type_id: business.business_type_id,
                business_type_name: business.business_type_name,
                business_schedule_hours: businessScheduleHours,
                business_product_tags: productTags,
                business_catalog_details: businessCatalogs.data
                    .filter((cat) => cat.business_id == businessId)
                    .map((cat) => {
                        const { added_by_change_log_id, business_id, history_id, flag_deleted, ...cleanedCat } = cat;
                        return cleanedCat;
                    }),
                business_contact_details: contact
                    ? {
                        business_contact_id: contact.business_contact_id,
                        business_email_address: contact.business_email_address,
                        business_contact: contact.business_contact,
                        business_website_url: contact.business_website_url,
                        business_address: formattedAddress
                    }
                    : {}
            };
        });

        const uniqueBusiness = Array.from(
            businessData?.reduce((acc, business) => {
                if (!acc.has(business.business_id)) {
                    acc.set(business.business_id, business);
                }
                return acc;
            }, new Map()).values()
        );

        return {
            status: true,
            data: {
                business_data: uniqueBusiness.length ? uniqueBusiness : [],
                job_openings: jobOpeningData.length ? jobOpeningData : [],
                resume_details: resumeData?.data.length ? resumeData?.data : [],
                feed: feedData?.data.length ? feedData?.data : [],
                market: result?.length ? result : [],
                categories: updatedCategories?.length ? updatedCategories : []
            }
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error.message
        }
    }
}

const searchCategoryModule = async (req, res) => {
    try {
        const { keyword } = req.query;

        const categoryData = await globalDb.searchCategory(keyword);

        const categories = [];
        if (categoryData?.data.length) {
            await Promise.all(
                categoryData.data.map(async (category) => {
                    if (category.parent_category_id) {
                        const parentCategoryData = await categoryDb.getCategoryDataInDB(category.parent_category_id);
                        if (parentCategoryData?.data.length) {
                            const obj = {
                                ...parentCategoryData.data[0],
                                sub_categories: [category],
                            };
                            categories.push(obj);
                        }
                    } else {
                        const subCategoriesData = await categoryDb.getCategoryDataByPCIdInDB(category.category_id);
                        if (subCategoriesData?.data.length) {
                            const obj = {
                                ...category,
                                sub_categories: subCategoriesData.data,
                            };
                            categories.push(obj);
                        }
                    }
                })
            );
        }

        return {
            status: true,
            data: {
                categories: categories?.length ? categories : []
            }
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error.message
        }
    }
}

const createOrderModule = async (req, res) => {
    const { orderAmount } = req.body;

    const customerName = req.body.customerName || req.user_data.username;
    const customerEmail = req.body.customerEmail || req.user_data.email_address;
    const customerPhone = req.body.customerPhone || req.user_data.contact;
    const user_id = req.body.user_id || req.user_data.user_id;

    const orderId = `lokonomy_${user_id}_${Date.now()}`

    const data = {
        order_id: orderId,
        order_amount: orderAmount,
        customer_details: {
            customer_id: `${user_id}`,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
        },
        order_note: "Payment for order",
        order_currency: "INR"
    };

    try {
        const response = await axios.post(`${BASE_URL}/orders`, data, {
            headers: {
                "Content-Type": "application/json",
                "x-client-id": APP_ID,
                "x-client-secret": SECRET_KEY,
                "x-api-version": "2023-08-01"
            },
        });
        return {
            status: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        return {
            status: false,
            error: "Failed to create order"
        };
    }
}

const savePaymentModule = async (req, res) => {
    try {
        console.log(req.body, " <<<---")
        const { user_id, payment_amount, validity, order_id, order_status } = req.body;
        const currentDate = new Date();

        if (!user_id || !payment_amount || !validity) {
            return { status: false, error: "Missing required fields" };
        }

        if (validity === "Lifetime") {
            req.body.validity = 0;
        } else {
            const months = parseInt(validity, 10);
            const futureDate = new Date(currentDate);
            futureDate.setMonth(futureDate.getMonth() + months)
            const futureUnixTimestamp = futureDate.getTime();
            req.body.validity = `${futureUnixTimestamp}`;
        }

        if (!order_id) {
            req.body.order_id = `lokonomy_${user_id}_${Date.now()}`;
        }

        req.body.is_active = true;

        let paymentData = []
        Object.entries(req.body).map(x => paymentData.push({ "field": x[0], "value": x[1] }))
        const createPayment = await globalDb.createPaymentDb(paymentData)

        if (createPayment.status == false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        const formattedDate = currentDate.getTime();

        let userData = [{ "field": "plan_amount", "value": payment_amount }, { "field": "plan_validity", "value": req.body.validity }, { "field": "plan_active", "value": order_status.toLowerCase() == "success" ? true : false }, { "field": "payment_date", "value": formattedDate }]
        const updateUser = await usersDb.updateUserDataDynamic(userData, user_id)

        if (updateUser.status == false) {
            return {
                status: false,
                error: constant.requestMessages.ERR_GENERAL
            }
        }

        return {
            status: true,
            data: createPayment?.data
        };
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error.message
        };
    }
}

const orderStatusModule = async (req, res) => {
    try {
        const order_id = req.query.order_id || null;
        if (!order_id) {
            return {
                status: false,
                message: "Please, provide order_id !"
            }
        }

        const response = await axios.get(`${BASE_URL}/orders/${order_id}/payments`, {
            headers: {
                "Content-Type": "application/json",
                "x-client-id": APP_ID,
                "x-client-secret": SECRET_KEY,
                "x-api-version": "2022-09-01"
            },
        });

        return {
            status: true,
            data: response?.data
        };
    } catch (err) {
        console.error(err.response?.data || err.message);
        return {
            status: false,
            error: err
        };
    }
}

// Function to convert time from IST to GMT
const convertISTtoGMT = (istTime) => {
    const [hours, minutes, seconds = 0] = istTime.split(':').map(Number);
    // IST is UTC+5:30, so subtract 5h30m to get GMT
    let gmtHours = hours - 5;
    let gmtMinutes = minutes - 30;
    
    // Handle underflow (e.g., 00:30 IST → 19:00 GMT previous day)
    if (gmtMinutes < 0) {
        gmtHours--;
        gmtMinutes += 60;
    }
    if (gmtHours < 0) {
        gmtHours += 24;
    }
    
    return `${String(gmtHours).padStart(2, '0')}:${String(gmtMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

module.exports = {
    getPrivacyPolicyModule: getPrivacyPolicyModule,
    getTermsNConditionModule: getTermsNConditionModule,
    getBannerModule: getBannerModule,
    getStatesModule: getStatesModule,
    getCitiesModule: getCitiesModule,
    getMarketTypeModule: getMarketTypeModule,
    getProductTypeModule: getProductTypeModule,
    getProductPriceTypeModule: getProductPriceTypeModule,
    getCitiesListModule: getCitiesListModule,
    getTalukaListModule: getTalukaListModule,
    getCityImgModule: getCityImgModule,
    getPlansModule: getPlansModule,
    searchModule: searchModule,
    searchCategoryModule: searchCategoryModule,
    createOrderModule: createOrderModule,
    savePaymentModule: savePaymentModule,
    orderStatusModule: orderStatusModule
}
