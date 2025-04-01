module.exports.notFound = {
    status: false,
    code: 404,
    error: "Path Not Found."
}

module.exports.inValidAuthentication = {
    code: -999,
    message: "ERROR! Invalid authentication found."
}

module.exports.requestMessages = {
    ERR_GENERAL: {
        code: 9000,
        message: "Something went wrong with the server."
    },
    ERR_INVALID_BODY: {
        code: 9001,
        message: "Invalid body!"
    },
    ERR_INVALID_QUERY_PARAMETER: {
        code: 9002,
        message: "ERROR! Invalid query parameter."
    },
    ERR_BAD_REQUEST: {
        code: 9003,
        message: "ERROR! bad request found."
    },
    ERR_USER_NOT_FOUND: {
        code: 9004,
        message: "User not found."
    },
    MESSAGE_SENT_SUCCESSFULLY: {
        code: 9005,
        message: "Message sent successfully."
    },
    ERR_INVALID_VERIFICATION_CODE: {
        code: 9006,
        message: "Invalid authentication code! Please try again."
    },
    NO_CHANGE_FOUND: {
        code: 9007,
        message: "Nothing to update."
    },
    TWILIO_ERROR: {
        code: 9008,
        message: "{{error_message}}"
    },
    USER_LOGOUT_SUCCESSFULLY: {
        code: 9009,
        message: "Logged out successfully."
    },
    USER_ACCOUNT_DELETED_SUCCESSFULLY: {
        code: 9010,
        message: "Account deleted successfully."
    },
    ERR_WHILE_UPLODING_FILE: {
        code: 9011,
        message: "Error occured while uploading file."
    },
    ERR_BUSINESS_ALREADY_REGISTERED: {
        code: 9012,
        message: "Business already exists. Please try with another business name."
    },
    ERR_ACCESS_NOT_GRANTED: {
        code: 9013,
        message: "Sorry! you do not have access to perform this action."
    },
    PRODUCT_DELETED: {
        code: 9014,
        message: "Product deleted successfully."
    },
    ERR_NO_PLAN: {
        code: 9000,
        message: "You have no active plan currently !"
    },
    ERR_PLAN_EXPIRED: {
        code: 9000,
        message: "Your plan has beed expired !"
    },
    ERR_LIMIT_EXEED: {
        code: 9000,
        message: "You are exeed the post limit of your current plan !"
    },
    ERR_NO_POST: {
        code: 9000,
        message: "You're not able to do post with your current plan !"
    },
    ERR_NO_BUSINESS: {
        code: 9013,
        message: "Please, register you business first !"
    }
}

module.exports.citiesTalukaList = [
    {
        city: "Ahmedabad",
        taluka: ["Ahmedabad", "Daskroi", "Dholka", "Dhandhuka", "Bavla", "Sanand", "Viramgam", "Detroj-Rampura", "Dholera", "Mandal"]
    },
    {
        city: "Amreli",
        taluka: ["Amreli", "Bagasara", "Lathi", "Savarkundla", "Dhari", "Khambha", "Rajula", "Jafrabad", "Lilia", "Kunkavav-vadia", "Babra"]
    },
    {
        city: "Anand",
        taluka: ["Anand", "Anklav", "Petlad", "Sojitra", "Borsad", "Khambhat", "Umreth", "Tarapur"]
    },
    {
        city: "Aravalli",
        taluka: ["Aravalli", "Modasa", "Malpur", "Bayad", "Dhansura", "Meghraj", "Bhiloda"]
    },
    {
        city: "Banaskantha",
        taluka: ["Banaskantha", "Palanpur", "Dantiwada", "Dhanera", "Deesa", "Diyodar", "Tharad", "Vadgam", "Suigam", "Vav", "Bhabhar", "Kankrej", "Amirgadh", "Lakhani"]
    },
    {
        city: "Bharuch",
        taluka: ["Bharuch", "Amod", "Ankleshwar", "Jhagadia", "Jambusar", "Netrang", "Valia", "Hansot", "Vagra"]
    },
    {
        city: "Bhavnagar",
        taluka: ["Bhavnagar", "Talaja", "Mahuva", "Gariadhar", "Jesar", "Palitana", "Sihor", "Ghogha", "Vallabhipur", "Umrala"]
    },
    {
        city: "Botad",
        taluka: ["Botad", "Gadhada", "Barvala", "Ranpur"]
    },
    {
        city: "Chhota-Udaipur",
        taluka: ["Chhota-Udaipur", "Kawant", "Nasvadi", "Sankheda", "Jetpur Pavi", "Bodeli"]
    },
    {
        city: "Dahod",
        taluka: ["Dahod", "Limkheda", "Garbada", "Devgadh baria", "Dhanpur", "Fatepura", "Singvad", "Sanjeli", "Jhalod"]
    },
    {
        city: "Dang",
        taluka: ["Dang", "Ahwa", "Subir", "Waghai"]
    },
    {
        city: "Diu",
        taluka: ["Diu"]
    },
    {
        city: "Dwarka",
        taluka: ["Dwarka", "Kalyanpur", "Khambhalia", "Okhamandal", "Bhanvad"]
    },
    {
        city: "Gandhinagar",
        taluka: ["Gandhinagar", "Kalol", "Mansa", "Dehgam"]
    },
    {
        city: "Gir-Somnath",
        taluka: ["Gir-Somnath", "Veraval", "Kodinar", "Talala", "Sutrapada", "Una", "Gir-Gadhada"]
    },
    {
        city: "Jamnagar",
        taluka: ["Jamnagar", "Jodiya", "Dhrol", "Kalavad", "Lalpur", "Jamjodhpur"]
    },
    {
        city: "Junagadh",
        taluka: ["Junagadh", "Junagadh-Rural", "Mendarda", "Mangrol", "Malia", "Visavadar", "Manavadar", "Keshod", "Vanthali", "Bhesan"]
    },
    {
        city: "Kheda",
        taluka: ["Kheda", "Nadiad", "Kapadvanj", "Mehmedabad", "Matar", "Thasra", "Kathlal", "Galteshwar", "Vaso", "Mahudha"]
    },
    {
        city: "Kutch",
        taluka: ["Kutch", "Bhuj", "Anjar", "Bhachau", "Gandhidham", "Mandvi", "Rapar", "Abdasa", "Lakhpat", "Mundra", "Nakhatrana"]
    },
    {
        city: "Mahisagar",
        taluka: ["Mahisagar", "Lunawada", "Balasinor", "Kadana", "Santrampur", "Khanpur", "Virpur"]
    },
    {
        city: "Mahesana",
        taluka: ["Mahesana", "Becharaji", "Kadi", "Unjha", "Vadnagar", "Visnagar", "Vijapur", "Gojhariya", "Kheralu", "Jotana", "Satlasana"]
    },
    {
        city: "Morbi",
        taluka: ["Morbi", "Halvad", "Maliya", "Tankara", "Wankaner"]
    },
    {
        city: "Narmada",
        taluka: ["Narmada", "Rajpipla", "Nandod", "Dediapada", "Sagbara", "Garudeshwar", "Tilakwada"]
    },
    {
        city: "Navsari",
        taluka: ["Navsari", "Jalalpore", "Gandevi", "Vansda", "Chikhli", "Khergam"]
    },
    {
        city: "Panchmahal",
        taluka: ["Panchmahal", "Godhra", "Kalol", "Halol", "Ghoghamba", "Morva-Hadaf", "Shehera", "Jambughoda"]
    },
    {
        city: "Patan",
        taluka: ["Patan", "Sidhpur", "Radhanpur", "Chanasma", "Harij", "Sankheswar", "Santalpur", "Sarasvati", "Sami"]
    },
    {
        city: "Porbandar",
        taluka: ["Porbandar", "Ranavav", "Kutiyana"]
    },
    {
        city: "Rajkot",
        taluka: ["Rajkot", "Gondal", "Jasdan", "Jetpur", "Dhoraji", "Upleta", "Kotda-Sangani", "Jamkandorna", "Paddhari", "Vinchchiya", "Lodhika"]
    },
    {
        city: "Sabarkantha",
        taluka: ["Sabarkantha", "Himatnagar", "Idar", "Khedbrahma", "Prantij", "Talod", "Vijaynagar", "Vadali", "Poshina"]
    },
    {
        city: "Surat",
        taluka: ["Surat", "Olpad", "Bardoli", "Kamrej", "Mandvi", "Mangrol", "Palsana", "Choryasi", "Umarpada", "Mahuva"]
    },
    {
        city: "Surendranagar",
        taluka: ["Surendranagar", "Wadhwan", "Limbdi", "Dhrangadhra", "Chuda", "Chotila", "Lakhtar", "Muli", "Sayla", "Dasada"]
    },
    {
        city: "Tapi",
        taluka: ["Tapi", "Vyara", "Songadh", "Uchhal", "Valod", "Nizar", "Dolvan", "Kukarmunda"]
    },
    {
        city: "Valsad",
        taluka: ["Valsad", "Pardi", "Kaprada", "Dharampur", "Vapi", "Umbergaon"]
    },
    {
        city: "Vadodara",
        taluka: ["Vadodara", "Savli", "Karjan", "Desar", "Dabhoi", "Padra", "Sinor", "Waghodia"]
    }
];  