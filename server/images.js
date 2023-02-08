const {
    S3Client,
    ListBucketsCommand,
    ListObjectsCommand,
    GetObjectCommand,
    PutObjectCommand
} = require("@aws-sdk/client-s3");
const env = require("./env");
//const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
});

const listImages = async () => {
    console.log(
        await S3.send(
            new ListObjectsCommand({Bucket: 'immersiveidea'})
        )
    );
}
const createImage = async() => {
    console.log(
        await S3.send(
            new PutObjectCommand({Bucket: 'immersiveidea',
            Key: 'test.json',
            Body: '{test: "data"}'})
        )
    );
}
module.exports = {
    listImages: listImages,
    createImage: createImage};
