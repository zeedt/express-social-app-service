const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const uploadImageToS3 = async (fileData, fileName) => {
    const params = {
        Bucket: 'social-app-bucket1', // pass your bucket name
        Key: `social-app-images/${fileName}`, // file will be saved as social-app-bucket1/social-app-images
        Body: fileData
    };
    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
    });
};

module.exports = {uploadImageToS3}