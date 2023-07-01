const aws = require('aws-sdk');
require("dotenv").config()
const { AWS_ACCESS_KEY_SECRET, AWS_ACCESS_KEY } = process.env


aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_ACCESS_KEY_SECRET,
    region: "ap-south-1"
})

const uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        let uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  //HERE
            Key: "abc/" + file.originalname, //HERE 
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded successfully")
            return resolve(data.Location)
        }) 
    })
}

module.exports = uploadFile