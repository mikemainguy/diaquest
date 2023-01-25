const env = require('./server/env');
const {expressLogger, logger} = require('./server/logging');
const config = require('./newrelic').config;
const fs = require('fs');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//Test Commit
const version = fs.readFileSync('./VERSION');
const axios = require('axios');
if (env.NR_LICENCE_KEY) {
    require('newrelic');
}

const express = require('express');

const {engine} = require('express-handlebars');
const {auth, requiresAuth} = require('express-openid-connect');
const app = express();
const port = env.PORT;

const firebase = require('./server/firebase');

app.use(express.urlencoded({extended: true}))
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
app.use('/sw.js', express.static('client/serviceworker/sw.js'));
app.use('/favicon.ico', express.static('client/favicon.ico'));
app.get('/manifest.webmanifest', (req, res) => {
    res.send(
        `
        {
  "name": "Immersive Idea",
  "display": "standalone",
  "start_url": "/",
  "scope": "${env.AUTH0_BASE_URL}",
  "short_name": "Immersive Idea",
  "theme_color": "#000000",
  "background_color": "#000000",
  "description": "A diagramming tool to help collaborate and edit 3d diagrams in an immersive environment.",
  "icons": [
    {
      "src": "/assets/android-icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": [
    "utilities",
    "business",
    "education",
    "productivity"
  ],
  "screenshots": [
    {
      "src": "/assets/com.oculus.browser-20230121-110512.jpg",
      "sizes": "1024x1024",
      "type": "image/jpeg",
      "label": "Example 1"
    },
    {
      "src": "/assets/com.oculus.browser-20230121-110746.jpg",
      "sizes": "1024x1024",
      "type": "image/jpeg",
      "label": "Example 2"
    },
    {
      "src": "/assets/com.oculus.browser-20230121-111323.jpg",
      "sizes": "1024x1024",
      "type": "image/jpeg",
      "label": "Complex Architecture Diagram"
    }
  ]
}
        `
    );
});
//app.use('/manifest.webmanifest', express.static('client/manifest.webmanifest'));


/**********************************************************
 * Routes above here are insecure, only put static insecure stuff above here
 * Route below here are secured with token from auth0
 */
const auth0Config = {
    authRequired: false,
    auth0Logout: true,
    secret: env.AUTH0_SECRET,
    baseURL: env.AUTH0_BASE_URL,
    clientID: env.AUTH0_CLIENT_ID,
    issuerBaseURL: env.AUTH0_ISSUER_BASE_URL
};
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', './server/views');

app.use(auth(auth0Config));
app.get('/', async (req, res) => {
    let user = false;
    let admin = false;

    if (req.oidc && req.oidc.isAuthenticated()) {
        user = req.oidc.user.email;
        const roles = req.oidc.user.immersiveRoles;
        if (roles && roles.includes('admin')) {
            admin = true;
        }
    }
    res.render('landing', {
        html: true, version: version, nonVr: true, user: user, admin: admin
    });
});

app.get('/pages/:page', async (req, res) => {
    let user = false;
    let admin = false;

    if (req.oidc && req.oidc.isAuthenticated()) {
        user = req.oidc.user.email;
        const roles = req.oidc.user.immersiveRoles;
        if (roles && roles.includes('admin')) {
            admin = true;
        }
    }

    res.render('pages/' + req.params['page'], {
        html: true, version: version, page: req.params['page'], nonVr: true,
        user: user, admin: admin
    });
});

app.get('/local', (req, res) => {
    res.render('world', {vrLocal: true, version: version});
});

app.get('/login', (req, res) => res.oidc.login({returnTo: '/worlds/public'}));
app.get('/home', requiresAuth(), async (req, res) => {
    const userInfo = req.oidc.user;
    res.redirect('/worlds/' + userInfo.sub);
});
app.get('/worlds/:worldId', requiresAuth(), (req, res) => {
    res.render('world', {vrConnected: true, version: version});
});
app.get('/worlds', async(req, res) => {
    const fbresponse = await firebase.listWorlds();
    res.json(fbresponse);
});

app.post('/worlds/create', requiresAuth(), async (req, res) => {
    const public = req.body.public ? true : false;
    const fbresponse = await firebase.createWorld(req.body.name, req.oidc.user.sub, public);
    console.log(JSON.stringify(fbresponse.data));
    signalwire = await axios.post('https://diaquest.signalwire.com/api/video/rooms',
        {
            name: req.body.name
        }, {
            auth: {
                username: env.SIGNALWIRE_USER,
                password: env.SIGNALWIRE_TOKEN
            }
        });
    console.log(JSON.stringify(signalwire.data));
    res.json({"status": "OK"});
});
app.get('/invite/:world', requiresAuth(), (req, res) => {

});

app.post('/worlds/:world/invite', requiresAuth(), (req, res) => {
    if (!req.body.email) {
        return;
    }
    const msg = {
        to: req.body.email, // Change to your recipient
        from: 'invite@immersiveidea.com', // Change to your verified sender
        subject: 'Invitation to collaborate on Immersive Idea',
        text: '',
        html: '<a href="https://www.immersiveidea.com/invite/' + params['world'] + '">Join Now</a>',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
    res.json({"status": "OK"});
});

app.get('/api/voice/token', requiresAuth(), async (req, res) => {
    try {
        const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
            {expires_in: 3600}, // can set a TTL timer in seconds.
            {headers: {authorization: env.VOICE_TOKEN}});
        const {data} = response;
        res.json(data)
    } catch (error) {
        res.json(`Error: ${error}`);
    }

});

app.get('/api/user/signalwireToken', requiresAuth(), (req, res, next) => {
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
});

app.get('/api/user/profile', requiresAuth(),
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
