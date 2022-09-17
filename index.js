const env = require('./server/env');
const {expressLogger, logger} = require('./server/logging');
const express = require('express');
const  { engine } = require('express-handlebars');
const {auth} = require('express-openid-connect');
const app = express();
const port = env.PORT;
const firebase = require('./server/firebase');



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


/**********************************************************
 * Routes above here are insecure, only put static insecure stuff above here
 * Route below here are secured with token from auth0
 */
const auth0Config = {
    authRequired: true,
    auth0Logout: true,
    secret: env.AUTH0_SECRET,
    baseURL: env.AUTH0_BASE_URL,
    clientID: '7el4MeFi7147tNZlL9EbYI8hEBuzMTaB',
    issuerBaseURL: 'https://aardvarkguru.us.auth0.com'
};
app.use(auth(auth0Config));
app.use(expressLogger);

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', './server/views');

app.get('/worlds/:worldId', (req, res) => {
    res.render('world');
})
app.get('/', (req, res) => {
    res.render('world');
})
app.get('/api/user/profile',
    (req, res, next) => {
        const firebasePromise = firebase.getAuth().createCustomToken(req.oidc.user.sub);
        Promise.all([firebasePromise]).then(data => {
            const obj = {}
            obj.user = req.oidc.user;
            obj.firebase_token = data[0];
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify(obj));
        });
    });
logger.log({level: "info", message: "server start on port: " + port});
app.listen(port, () => {

});
