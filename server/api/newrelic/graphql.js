const axios = require("axios");
module.exports.handler = async (req, res) => {
    console.log(req.body);
    const input = {"query":" {  actor {    user  { name } } }"};
    const data = await axios.post('https://api.newrelic.com/graphql',
        req.body,
        {headers: { "Api-Key": "NRAK-W6FQ9H1JM9QE8UHIOIYATZPRMEG"}, "Content-Type": "application/json"}
        );
    console.log(JSON.stringify(data.data));
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(data.data));
}
module.exports.UNAUTH = true;