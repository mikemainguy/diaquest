const {getJiraIssues, getBoards} = require('../../jira');
const {getJiraConfig, storeJiraBoardConfig} = require('../../firebase');

module.exports.handler = async (req, res) => {
    if (req.method == 'GET') {

        if (req.query && req.query.world) {

            let startAt = 0;
            if (req.query.startAt) {
                startAt = req.query.startAt;
            }
            const config = await getJiraConfig(req.query.world);
            const boards = await getBoards(req.query.world, config);
            if (boards && boards.length > 0) {
                await storeJiraBoardConfig(req.query.world, boards);
                console.log(boards);
            }
            if (config.statusMap) {
                //const statuses = await getJiraIssues(req.query.world, config, startAt);
            }
            if (config.searchurl) {
                const results = await getJiraIssues(req.query.world, config, startAt);
                res.status(200).send(results);
            } else {
                res.status(500).send({error: 'No Config Found'});
            }
        } else {
            res.status(400).send({error: 'Missing Query'});
        }
    } else {
        res.status(400).send({error: 'Wrong Method'});
    }
}