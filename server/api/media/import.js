const {
    S3Client,
    PutObjectCommand
} = require("@aws-sdk/client-s3");
const {Readable} = require("stream");
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

function buildShape(node, x, y, z) {
    return {
        'text': node.name,
        'id': 'id' + generateUUID(),
        'template': node.template,
        'scale': '.1 .1 .1',
        'color': node.color,
        'position': {'x': x, 'y': y, 'z': z}
    }
}

const axios = require("axios");
module.exports.handler = async(req, res) => {
    if (req.method != 'POST') {
        res.sendStatus(405);
        return;
    }
    const world = req.data.world;
    const url = req.data.url;
    const response = await getData(world, url);
    console.log(response);
    res.status(200).send('OK');

}
async function getData(world, imageUrl) {
    try {

        const response = await axios.get(imageUrl, {responseType: 'arraybuffer'});
        const key = crypto
            .createHash('sha256')
            .update(imageUrl)
            .digest('hex');
        const length = response.headers['content-length'];
        const contentType = response.headers['content-type'];
        const entry = {
            key: key,
            name: imageUrl
        }
        const dimensions = sizeOf(response.data);

        const s3response = await S3.send(
            new PutObjectCommand({
                Bucket: 'immersiveidea',
                Key: key,
                ContentLength: length,
                ContentType: contentType,
                Body: response.data
            })
        );

        await storeMedia('ctr', key, imageUrl, contentType, dimensions.width, dimensions.height);
        console.log(s3response);
        return s3response;


    } catch (error) {
        console.log(error);
        return null;
    }
}