const {
    S3Client,
    PutObjectCommand
} = require("@aws-sdk/client-s3");
const {Readable } = require("stream");
const crypto = require('crypto');
const {storeMedia} = require('../../firebase');
const sizeOf = require('buffer-image-size');

const env = require("../../env");
const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
});

module.exports = async(req, res) => {
    if (req.method != 'POST') {
        res.sendStatus(405);
        return;
    }
    const key = crypto
        .createHash('sha256')
        .update(req.files.file.name)
        .digest('hex');
    const entry = {
        key: key,
        name: req.files.file.name
    }
    const response = await S3.send(
            new PutObjectCommand({Bucket: 'immersiveidea',
                Key: key,
                ContentLength: req.files.file.size,
                ContentType: req.files.file.mimetype,
                Body: Readable.from(req.files.file.data)})
        );
    let dimensions = {width: 100, height: 100};
    try {
        dimensions = sizeOf(req.files.file.data);
    } catch (err) {
        console.log(err);
    }
    await storeMedia(req.body.path.replace('/worlds', ''), key, req.files.file.name, req.files.file.mimetype, dimensions.width, dimensions.height);
    console.log(response);
    console.log(entry);
    res.status(200).send({status: 'OK'});
}
