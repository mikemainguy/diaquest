const {auth0, requiresAuth} = require('./server/auth0');
const env = require('./server/env');
const {expressLogger} = require('./server/logging');
const fileUpload = require("express-fileupload");
require('./server/newrelic');

const deploymentlogger = require('./server/deploymentlogger');
const { setup } = require('./server/pagehandler');


const version = env.VERSION;

const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true}))
app.use(fileUpload());
app.use(expressLogger);
const jsonParser = require('body-parser').json()
app.use(jsonParser);
const api = require('./server/api');
const sgMail = require("@sendgrid/mail");

auth0(app);
setup(app);

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
api(app);
const port = env.PORT;
app.listen(port, () => {});
deploymentlogger(port);