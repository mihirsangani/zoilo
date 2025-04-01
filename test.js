// Import the AWS SDK
const AWS = require("aws-sdk")

// Configure the AWS SDK with your access credentials
AWS.config.update({
    accessKeyId: "AKIA5FTY6MPTVYFWSCBU",
    secretAccessKey: "nQkW+K9erG21UbuwZ51LxS4gxVAIMNIsxD7yiJ1d",
    region: "ap-south-1" // e.g. 'us-east-1'
})

// Create an S3 service object
const s3 = new AWS.S3()

// Define the bucket name and folder path
const bucketName = "zoilo-public-bucket"
const folderPath = "category-icon/"

// Create parameters for the listObjectsV2 method
const params = {
    Bucket: bucketName,
    Prefix: folderPath
}

// Call S3 to list the objects in the specified bucket and folder
s3.listObjectsV2(params, function (err, data) {
    if (err) {
        console.log("Error", err)
    } else {
        console.log("Objects in folder:")
        data.Contents.forEach(function (object) {
            console.log(object.Key)
        })
    }
})
