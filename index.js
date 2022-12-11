const env = require('./server/env');
const {expressLogger, logger} = require('./server/logging');
const config = require('./newrelic').config;
const fs = require('fs');
const version = fs.readFileSync('./VERSION');
const axios = require('axios');
if (env.NR_LICENCE_KEY) {
    require('newrelic');
}

const express = require('express');
const {engine} = require('express-handlebars');
const {auth} = require('express-openid-connect');
const app = express();
const port = env.PORT;

const firebase = require('./server/firebase');


app.use(expressLogger);

const maxAge = 60 * 60 * 4;
if (env.NODE_ENV != 'development') {
    /**
     * Let these routes be cached by CDN
     */
    app.use('/dist', function (req, res, next) {
        res.set('Cache-control', 'public, max-age=' + maxAge);
        next();
    });
    app.use('/assets', function (req, res, next) {
        res.set('Cache-control', 'public, max-age=' + maxAge);
        next();
    });
    app.use('/', function (req, res, next) {
        res.set('Cache-control', 'public, max-age=' + maxAge);
        next();
    });

}
/**
 * Serve these routes without authentication required
 */
app.use('/dist', express.static('client/dist'));
app.use('/assets', express.static('client/assets'));
app.use('/favicon.ico', express.static('client/favicon.ico'));
app.use('/manifest.webmanifest', express.static('client/manifest.webmanifest'));


/**********************************************************
 * Routes above here are insecure, only put static insecure stuff above here
 * Route below here are secured with token from auth0
 */
const auth0Config = {
    authRequired: true,
    auth0Logout: true,
    secret: env.AUTH0_SECRET,
    baseURL: env.AUTH0_BASE_URL,
    clientID: env.AUTH0_CLIENT_ID,
    issuerBaseURL: env.AUTH0_ISSUER_BASE_URL
};
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', './server/views');

app.get('/', async (req, res) => {
    res.render('landing', {
        html: true, version: version
    });
});

app.get('/local', (req, res) => {
    res.render('world', {vrLocal: true, version: version});
});

app.use(auth(auth0Config));
app.get('/login', (req, res) => res.oidc.login({returnTo: '/worlds/public'}));
app.get('/home', async (req, res) => {
   const userInfo = req.oidc.user;
   res.redirect('/worlds/' + userInfo.sub);
});
app.get('/worlds/:worldId', (req, res) => {
    res.render('world', {vrConnected: true, version: version});
});
app.get('/api/voice/token', async (req, res) => {
    try {
        const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
            { expires_in: 3600 }, // can set a TTL timer in seconds.
            { headers: { authorization: env.VOICE_TOKEN } });
        const {data} = response;
        res.json(data)
    } catch (error) {
        res.json(`Error: ${error}`);
    }

});

app.get('/api/user/signalwireToken', (req, res, next) => {
    if (req.query && req.query.room) {
        const signalwirePromise = axios.post('https://diaquest.signalwire.com/api/video/room_tokens',
            {
                room_name: req.query.room,
                user_name: req.oidc.user.name,
                permissions: [
                    "room.self.audio_mute",
                    "room.self.audio_unmute"
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
});

app.get('/api/user/profile',
    (req, res, next) => {
        const claims = {"user": true};
        if (req.oidc.idTokenClaims['immersiveRoles']) {
            claims.roles = req.oidc.idTokenClaims['immersiveRoles'];
            if (claims.roles.length > 0) {
                claims.roles = claims.roles.reduce((a, v) => ({...a, [v]: true}), {})
            } else {
                claims.roles = {"user": true};
            }
        }

        const firebasePromise = firebase
            .getAuth()
            .createCustomToken(req.oidc.user.sub, claims.roles);
        const obj = {};
        obj.user = req.oidc.user;

        firebasePromise.then(data => {
            obj.firebase_token = data;
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify(obj));
        })
            .catch((err) => res.status(500).send(err));

    });

logger.log({level: "info", message: "server start on port: " + port});
app.listen(port, () => {

});
