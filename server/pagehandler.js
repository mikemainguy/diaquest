const express = require("express");
const {engine} = require("express-handlebars");

const env = require('./env');
const {generateManifest} = require("./webmanifest");
const {logger} = require('./logging');

const maxAge = 60 * 60 * 4;

const pageHandler = async (req, res) => {
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
        html: true, version: env.VERSION, page: req.params['page'], nonVr: true,
        user: user, admin: admin
    });
}

const cacheControl = (req, res, next) => {
    res.set('Cache-control', 'public, max-age=' + maxAge);
    next();
};
const setup = (app) => {
    app.engine('.hbs', engine({extname: '.hbs'}));
    app.set('view engine', 'hbs');
    app.set('views', './server/views');

    ['/dist', '/assets', '/favicon.ico'].forEach((path) => {
        app.use(path, express.static('client' + path));
    });

    app.use('/sw.js', express.static('client/serviceworker/sw.js'));
    app.get('/manifest.webmanifest', generateManifest );

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
            html: true, version: env.VERSION, nonVr: true, user: user, admin: admin
        });
    });
    app.get('/pages/:page', pageHandler);
    logger.info('Pagehandler configured');

}
module.exports = {setup: setup};