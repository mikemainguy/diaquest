const firebase = require("./firebase");

const getProfile =     (req, res, next) => {
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

}

module.exports = {getProfile: getProfile}