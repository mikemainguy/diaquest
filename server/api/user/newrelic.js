const firebase = require("../../firebase");
module.exports = async (req, res) => {
    await firebase.saveNewRelic(req.oidc.user.sub, req.body.token, req.body.account);
    res.send({'status': 'OK'});
}
