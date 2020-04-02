const AWS = require('aws-sdk');
AWS.config.httpOptions.timeout = 0;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const uploadImageToS3 = async (fileData, fileName) => {
    console.log(" uploading to s3 at " + new Date());

    const params = {
        Bucket: 'social-app-bucket1', // pass your bucket name
        Key: `social-app-images/${fileName}`, // file will be saved as social-app-bucket1/social-app-images
        Body: fileData
    };
    try {
        await s3.upload(params).promise();
        console.log("Done uploading");
    } catch (err) {
        console.dir(err);
        console.log("Error occurred when uploading to s3 at " + new Date());
        throw err;
    }
};

module.exports = {uploadImageToS3}