const firebase = require("../../firebase");
module.exports = async (req, res) => {
    if (req.method != 'GET') {
        res.sendStatus(405);
        return;
    }
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
    if (newRelic) {
        obj.newrelic_token = newRelic.newrelic_token;
        obj.newrelic_account = newRelic.newrelic_account;
    }
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'private, no-store');
    res.send(JSON.stringify(obj));
}