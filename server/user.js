const firebase = require("./firebase");
const axios = require("axios");
const env = require("./env");
const inviteHandler = async (req, res, next) => {
    try {
        const world = req.body.world;
        const email = req.body.email;
        console.log(email);
        console.log(world);
        const tokenOptions = {
            method: 'POST',
            url: 'https://aardvarkguru.us.auth0.com/oauth/token',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            data: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: 'OHQvCn6TN2xtpXHjn6dQiU5mkAUXeUW0',
                client_secret: 'QiGfzrBqp8CEHFS3JRW2IgExAWUxsNXreAkEei5y2vVWn-HCthlaj7KdtENFShm2',
                audience: env.AUTH0_ISSUER_BASE_URL + '/api/v2/'
            })
        };

        const tokenResponse = await axios.request(tokenOptions);
        const access_token =tokenResponse.data.access_token;
        console.log(access_token);
        const options = {
            method: 'GET',
            url: env.AUTH0_ISSUER_BASE_URL + '/api/v2/users-by-email',
            params: {email: email},
            headers: {authorization: 'Bearer ' + access_token}
        };

        const user = await axios.request(options);
        console.log(user);
        if (user.data && user.data.length > 0) {
            await firebase
                .createCollaborator(user.data[0].user_id, world);
        } else {
            const createOptions = {
                method: 'POST',
                url: env.AUTH0_ISSUER_BASE_URL + '/api/v2/users',
                data: JSON.stringify({email: email, connection: "email", email_verified: false, verify_email: false }),
                headers: {authorization: 'Bearer ' + access_token, "Content-Type": "application/json"}
            };
            const newUser = await axios.request(createOptions);
            if (newUser.data) {
                await firebase
                    .createCollaborator(newUser.data.user_id, world);
            } else {
                res.sendStatus(500);
            }
        }


        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }


    /*const options = {
        method: 'GET',
        url: 'https://{yourDomain}/api/v2/users-by-email',
        params: {email: email},
        headers: {authorization: 'Bearer ' + env.AUTH0_SECRET}
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
*/
}

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
module.exports = {getProfile: getProfile,
    signalwireToken: signalwireToken,
    storeNewRelic: storeNewRelic,
inviteHandler: inviteHandler}