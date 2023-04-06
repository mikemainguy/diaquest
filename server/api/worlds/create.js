const firebase = require("../../firebase");
const axios = require("axios");
const env = require("../../env");
const {logger} = require('../../logging');
module.exports.handler = async (req, res) => {
    if (req.method != "POST") {
        res.sendStatus(405);
        return;
    }

    try {
        const publicFlag = !!req.body.public;

        const fbresponse = await firebase.createWorld(req.body.name, req.oidc.user.sub, publicFlag);

        logger.debug(JSON.stringify(fbresponse.data));
        if (fbresponse.status=="OK") {
            //Note we just create the room, we only care that we get a 200, we don't need anything else in the response
            const signalwire = await axios.post('https://diaquest.signalwire.com/api/video/rooms',
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
        } else {
            res.json({"status": fbresponse.status});
        }

    } catch (err) {
        logger.error({"createWorld": err.code});
        res.json({"status": "Error: "+ JSON.stringify('Error')});
    }
}