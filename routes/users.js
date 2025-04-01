var express = require('express');
var router = express.Router();
const AWS = require("aws-sdk")
const fs = require('fs')
const axios = require('axios'); // legacy way
const crud = require('./crud')

router.get('/update-icon',function(req, res, next) {
    res.render('index')
})
/* GET users listing. */
router.get('/',async function(req, res, next) {
 
    return await axios.get('http://api.zoiloapp.com/api/portal/category?token=2M$1f{FQ8,Pp?gab)?SCy!Dd7!0r-Q$Jxi.ZBnh15mnhiF,V.[Zd7cK(9wLBC8*h')
    .then(function (response) {
      // handle success
      // console.log(response)
      return res.send(response.data)
    })

});

router.get('/buccket-list',function(req,res,next){
  // Import the AWS SDK

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
      return res.send(data)
        // console.log("Objects in folder:")
        data.Contents.forEach(function (object) {
            console.log(object.Key)
        })
    }
})
})

router.get('/remaning-buccket-list',function(req,res,next){
    // Import the AWS SDK
  
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
  const folderPath = "remaining-icon/"
  
  // Create parameters for the listObjectsV2 method
  const params = {
      Bucket: bucketName,
      Prefix: folderPath
  }

  s3.listObjectsV2(params, function (err, data) {
    if (err) {
        console.log("Error", err)
    } else {
      return res.send(data)
        // console.log("Objects in folder:")
        data.Contents.forEach(function (object) {
            console.log(object.Key)
        })
    }
})
})


router.get('/remaning-category-icon',async function(req,res,next){
     return res.send(await crud.executeQuery(`select ac.*,bc.category_name as bccategory_name from category AS ac 
        JOIN category AS bc
    ON ac.parent_category_id = bc.category_id
    where ac.category_icon is null and ac.parent_category_id is not null `))
})

module.exports = router;
