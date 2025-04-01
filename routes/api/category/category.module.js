const categoryDb = require("./category.db")
const constant = require("../../../helpers/constant")

const getCategoryListModule = async (req) => {
    try {
        // const userData = req.user_data
        // const userId = userData.user_id
        // const ipAddress = req.ip

        // const obj = {
        //     userId: userId,
        //     ipAddress: ipAddress
        // }

        const getCategoryDataDb = await categoryDb.getCategoryDataInDB()
        // const getTemplateCategoryDataDb = await categoryDb.getTemplateCategoryDataInDB()
        const getFeaturedCategoryDataDb = await categoryDb.getFeaturedCategoryDataInDB()

        let featuredCategoryList = []
        let templateCategoryList = []
        let categoryList = []
        for (let i = 0; i < getCategoryDataDb.data.length; i++) {
            let categoryId = getCategoryDataDb.data[i].category_id
            if (featuredCategoryList.filter((item) => item.category_id == categoryId).length == 0 && categoryList.filter((item) => item.category_id == categoryId).length == 0) {
                if (getFeaturedCategoryDataDb.data.filter((element) => element.category_id == categoryId).length > 0) {
                    featuredCategoryList.push({
                        category_id: categoryId,
                        category_name: getCategoryDataDb.data[i].category_name,
                        gujarati_category_name: getCategoryDataDb.data[i]?.gujarati_category_name,
                        category_icon: getCategoryDataDb.data[i].category_icon,
                        category_description: getCategoryDataDb.data[i].category_description,
                        category_cover_photo_url: getCategoryDataDb.data[i].category_cover_photo_url,
                        parent_category_id: getCategoryDataDb.data[i].parent_category_id
                    })
                }

                categoryList.push({
                    category_id: categoryId,
                    category_name: getCategoryDataDb.data[i].category_name,
                    gujarati_category_name: getCategoryDataDb.data[i]?.gujarati_category_name,
                    category_icon: getCategoryDataDb.data[i].category_icon,
                    category_description: getCategoryDataDb.data[i].category_description,
                    category_cover_photo_url: getCategoryDataDb.data[i].category_cover_photo_url,
                    parent_category_id: getCategoryDataDb.data[i].parent_category_id
                })
            }
        }

        function getRandomCategories(categories, count = 6) {
            const shuffled = [...categories];

            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            return shuffled.slice(0, count);
        }

        templateCategoryList = getRandomCategories(categoryList, 6);

        if (templateCategoryList.length > 0) {
            const getSubCategoryDataDb = await categoryDb.getCategoryDataByPCIdInDB(templateCategoryList.map((item) => item.category_id).join(","))
            for (let i = 0; i < templateCategoryList.length; i++) {
                let filterSubCategoryData = getSubCategoryDataDb.data.filter((item) => item.parent_category_id == templateCategoryList[i].category_id)
                templateCategoryList[i]["sub_category_data"] = filterSubCategoryData.map((element) => {
                    return {
                        category_id: element.category_id,
                        gujarati_category_name: element?.gujarati_category_name,
                        category_name: element.category_name,
                        category_icon: element.category_icon,
                        category_description: element.category_description,
                        category_cover_photo_url: element.category_cover_photo_url
                    }
                })
                templateCategoryList[i]["sub_category_data"].sort((a, b) => {
                    return a.category_name === "Other" ? 1 : b.category_name === "Other" ? -1 : 0;
                });
            }
        }

        const requiredCategories = ["Daily Needs", "Services"];
        const firstTwoCategories = categoryList.filter(item => requiredCategories.includes(item.category_name));
        let remainingCategories = categoryList.filter(item => !requiredCategories.includes(item.category_name));

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
            return array;
        };

        remainingCategories = shuffleArray(remainingCategories);
        featuredCategoryList = [...firstTwoCategories, ...remainingCategories];

        const categoryOrder = [
            "Daily Needs", "Doctors", "Personal Care", "Healthcare", "Services",
            "Fashion", "Home Care", "Electronics", "Finance", "Food", "Education",
            "Hobby Classes", "Business Classes", "Tours & Travels", "Real Estate",
            "Adviser & Agents", "Business Consultant", "Marriage & Function", "Auto Care",
            "Car", "Bike", "Cycle", "Agriculture", "Printing & Media", "Industry/Manufacturer",
            "Hotels & Stays", "Private Entities", "Government Entities", "Other"
        ];

        const sortedCategories = categoryList.sort((a, b) => {
            let indexA = categoryOrder.indexOf(a.category_name);
            let indexB = categoryOrder.indexOf(b.category_name);

            // If a category is not found, place it at the end
            if (indexA === -1) indexA = categoryOrder.length;
            if (indexB === -1) indexB = categoryOrder.length;

            return indexA - indexB;
        });

        return {
            status: true,
            data: [
                {
                    featured_category_list: featuredCategoryList,
                    template_category_list: templateCategoryList,
                    category_list: sortedCategories
                }
            ]
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getSubCategoryListModule = async (req) => {
    try {
        const userData = req.user_data
        const userId = userData.user_id
        const ipAddress = req.ip

        const obj = {
            userId: userId,
            ipAddress: ipAddress
        }

        const categoryId = req.query.category_id || null
        if (!categoryId) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        const getCategoryDataDb = await categoryDb.getCategoryDataInDB(categoryId)
        if (getCategoryDataDb.data.length == 0) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        if (getCategoryDataDb.data[0].parent_category_id != null) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        let result = []
        const getSubCategoryDataDb = await categoryDb.getCategoryDataByPCIdInDB(categoryId)

        let subCategoryData = getSubCategoryDataDb.data.map((item, index) => {
            delete item.added_by_change_log_id;
            delete item.parent_category_id;
            delete item.history_id;
            delete item.flag_deleted;

            item["category_seq_num"] = index + 1;
            return { ...item };
        });

        subCategoryData.sort((a, b) => {
            return a.category_name === "Other" ? 1 : b.category_name === "Other" ? -1 : 0;
        });

        result.push({
            "category_id": categoryId,
            "category_name": getCategoryDataDb.data[0].category_name,
            "gujarati_category_name": getCategoryDataDb.data[0]?.gujarati_category_name,
            "category_description": getCategoryDataDb.data[0].category_description,
            "categroy_icon": getCategoryDataDb.data[0].categroy_icon,
            "category_cover_photo_url": getCategoryDataDb.data[0].category_cover_photo_url,
            "sub_category_data": subCategoryData
        })

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

const getMarketCategoryListModule = async (req) => {
    try {
        const getMarketCategoryData = await categoryDb.getMarketCategory();

        return {
            status: true,
            data: getMarketCategoryData?.data.length ? getMarketCategoryData.data : []
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const getMarketSubCategoryListModule = async (req) => {
    try {
        const categoryId = req.query.category_id || null
        if (!categoryId) {
            return {
                status: false,
                error: constant.requestMessages.ERR_INVALID_QUERY_PARAMETER
            }
        }

        const getMarketSubCategoryData = await categoryDb.getMarketCategory(categoryId);
        return {
            status: true,
            data: getMarketSubCategoryData?.data.length ? getMarketSubCategoryData.data : []
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
    getCategoryListModule: getCategoryListModule,
    getSubCategoryListModule: getSubCategoryListModule,
    getMarketCategoryListModule: getMarketCategoryListModule,
    getMarketSubCategoryListModule: getMarketSubCategoryListModule
}
