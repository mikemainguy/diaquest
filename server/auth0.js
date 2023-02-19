const env = require("./env");
const {auth, requiresAuth} = require("express-openid-connect");
const auth0 = (app) => {
    const auth0Config = {
        authorizationParams: {
            allowedConnections: ["email", "facebook", 'google-oauth2']
        },
        authRequired: false,
        auth0Logout: true,
        secret: env.AUTH0_SECRET,
        baseURL: env.AUTH0_BASE_URL,
        clientID: env.AUTH0_CLIENT_ID,
        issuerBaseURL: env.AUTH0_ISSUER_BASE_URL
    };
    app.use(auth(auth0Config));
}
module.exports = {auth0: auth0, requiresAuth: requiresAuth};