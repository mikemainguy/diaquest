const {
    S3Client,
    ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const env = require("../env");

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
});

module.exports = async (req, res) => {
    if (req.method != 'GET') {
        res.sendStatus(405);
        return;
    }
    console.log(
        await S3.send(
            new ListObjectsCommand({Bucket: 'immersiveidea'})
        )
    );
    res.sendStatus(200);
}