const env = require('./server/env');
const {expressLogger, logger} = require('./server/logging');
const config = require('./newrelic').config;

const sgMail = require('@sendgrid/mail')

const {generateManifest} = require('./server/webmanifest');
const {createWorld} = require('./server/createworld');
const {getProfile, signalwireToken} = require('./server/user');
const {pageHandler} = require('./server/pagehandler');
const {mailer} = require('./server/mailer');
const {voiceHandler} = require('./server/voice');


sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//Test Commit
const version = env.VERSION;
const axios = require('axios');
if (env.NR_LICENCE_KEY) {
    require('newrelic');
}

const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}))
app.use(expressLogger);

const {engine} = require('express-handlebars');
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', './server/views');

const port = env.PORT;

const firebase = require('./server/firebase');

const {auth, requiresAuth} = require('express-openid-connect');
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
app.get('/manifest.webmanifest', generateManifest );

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

app.get('/pages/:page', pageHandler);

app.get('/local', (req, res) => {
    res.render('world', {vrLocal: true, version: version});
});

app.get('/login', (req, res) => res.oidc.login({returnTo: '/'}));
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

app.post('/worlds/create', requiresAuth(), createWorld);
app.get('/invite/:world', requiresAuth(), (req, res) => { });
app.post('/worlds/:world/invite', requiresAuth(), mailer);
app.get('/api/voice/token', requiresAuth(), voiceHandler);
app.get('/api/user/signalwireToken', requiresAuth(), signalwireToken);
app.get('/api/user/profile', requiresAuth(), getProfile);

logger.log({level: "info", message: "server start on port: " + port});

app.listen(port, () => {

});

if (env.NODE_ENV != "development") {
    console.log(process.env.NODE_ENV);
    axios.post('https://api.newrelic.com/v2/applications/739699753/deployments.json', {
        "deployment": {
            "revision": env.VERSION.toString()
        }
    }, { headers: {'Api-Key': env.NR_USER_KEY}}).then(function(response) {
        console.log('deployment logged');
    }).catch(function(error){
        console.log('deployment could not be logged');
        console.log(error);
    });
}
