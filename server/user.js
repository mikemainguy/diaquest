const firebase = require("./firebase");
const axios = require("axios");
const env = require("./env");


const getProfile = async (req, res, next) => {
    const claims = {"user": true};
    if (req.oidc.idTokenClaims['immersiveRoles']) {
        claims.roles = req.oidc.idTokenClaims['immersiveRoles'];
        if (claims.roles.length > 0) {
            claims.roles = claims.roles.reduce((a, v) => ({...a, [v]: true}), {})
        } else {
            claims.roles = {"user": true};
        }
    }

    const data = await firebase
        .getAuth()
        .createCustomToken(req.oidc.user.sub, claims.roles);
    const obj = {};
    obj.user = req.oidc.user;
    const newRelic = await firebase.getUser(req.oidc.user.sub);

    obj.firebase_token = data;
    obj.newrelic_token = newRelic.newrelic_token;
    obj.newrelic_account = newRelic.newrelic_account;
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(obj));


}

const signalwireToken = (req, res, next) => {
    if (req.query && req.query.room) {
        const signalwirePromise = axios.post('https://diaquest.signalwire.com/api/video/room_tokens',
            {
                room_name: req.query.room,
                user_name: req.oidc.user.name,
                permissions: [
                    "room.self.audio_mute",
                    "room.self.audio_unmute",
                    "room.self.video_mute",
                    "room.self.video_unmute",

                ],
                join_video_muted: true,
                auto_create_room: false

            }, {
                auth: {
                    username: env.SIGNALWIRE_USER,
                    password: env.SIGNALWIRE_TOKEN
                }
            });


        signalwirePromise.then((data) => {
            const obj = {};
            obj.signalwire_token = data.data.token;
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify(obj));
        }).catch((err) => {
            res.status(500).send(err);
        });
    } else {
        res.status(404).send("No Room Found");
    }
}

const storeNewRelic = async (req, res, next) => {
    await firebase.saveNewRelic(req.oidc.user.sub, req.body.token, req.body.account);
    res.send({'status': 'OK'});

}
module.exports = {getProfile: getProfile, signalwireToken: signalwireToken, storeNewRelic: storeNewRelic}