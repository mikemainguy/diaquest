//const {getMiroConfig} = require("../../firebase");

module.exports.handler = async (req, res) => {
    const path = req.path.split('/');

    if (path.length < 4 || req.method != 'POST') {
        res.sendStatus(405);
    } else {
        const challenge = req.body.challenge;
        const hmac = req.get('X-Miro-Hmac-SHA256');
        if (hmac) {
            console.log(hmac);
        }
        if (challenge) {
            console.log("challenge received");
            res.status(200).send(req.body);
        } else {
            console.log(req.body);
            res.status(200).send({status: "OK"});
        }

    }
}
module.exports.UNAUTH = true;