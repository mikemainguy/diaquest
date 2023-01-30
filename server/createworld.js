const firebase = require("./firebase");
const axios = require("axios");
const env = require("./env");
const {logger} = require('./logging');
const createWorld = async (req, res) => {
    try {
        const public = req.body.public ? true : false;

        const fbresponse = await firebase.createWorld(req.body.name, req.oidc.user.sub, public);
        logger.debug('here');
        logger.debug(JSON.stringify(fbresponse.data));
        signalwire = await axios.post('https://diaquest.signalwire.com/api/video/rooms',
            {
                name: req.body.name
            }, {
                auth: {
                    username: env.SIGNALWIRE_USER,
                    password: env.SIGNALWIRE_TOKEN
                }
            });
        logger.debug({"createWorld": JSON.stringify(signalwire.data)});
        res.json({"status": "OK"});
    } catch (err) {
        logger.error({"createWorld": err.code});
        res.json({"status": "Error: "+ JSON.stringify('Error')});
    }
}
module.exports = {createWorld: createWorld}