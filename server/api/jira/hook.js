const {extractData} = require('../../jira');
const {getJiraConfig} = require('../../firebase');

module.exports.handler = async (req, res) => {
    const path = req.path.split('/');

    if (path.length < 6 || req.method != 'POST') {
        res.sendStatus(405);
        return;
    } else {
        const token = await getJiraConfig(path[5]);
        console.log(req.body);
        if (token && token.webhookkey == path[4]) {
            try {
                await extractData(path[5], req.body);
                res.send(200);
            } catch (err) {
                res.send(500);
            }
        } else {
            res.sendStatus(401);
        }
    }
}


module.exports.UNAUTH = true;
