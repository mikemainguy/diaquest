const axios = require('axios');
const {updateJira} = require("./firebase");
const getJiraIssues = async function (jiraconfig) {
    const auth = Buffer.from(jiraconfig.auth)
        .toString('base64');
    const config = {headers:
            {'Authorization': 'Basic ' + auth}
    }
    const data = await axios.get(
        jiraconfig.searchurl + '?jql=project%20%3D%20IM&fields=id,key,summary,description,issuetype,status,priority',
        config
    )
    for (const issue of data.data.issues) {
        extractData({webhookEvent: 'issue_synced', issue: issue});
    }
}
const extractData = async (world, data) => {

    const operation = data.webhookEvent.split('_');
    operation[0]  = operation[0].replace('jira:', '');
    try {
        const output = {
            timestamp: data.timestamp ? data.timestamp: new Date().valueOf(),
            event: data.webhookEvent ? data.webhookEvent: 'sync',
        }
        if (data.user) {
            output.user= data.user.displayName;
        }

        if (operation[0] == 'issue') {
            if (data.issue) {
                const desc = data.issue.fields.description;
                if (desc) {
                    if (desc.text) {
                        output.issueDescription = desc.text;
                    } else {
                        output.issueDescription = desc;
                    }

                }
                    output.issueId = data.issue.id;
                output.id = data.issue.id;

                output.issueKey = data.issue.key;
                output.issueType = data.issue.fields.issuetype.name;
                output.issueStatus = data.issue.fields.status.name;
                output.issuePriority = data.issue.fields.priority.name;
                output.issueSummary = data.issue.fields.summary;
            }
        }
        if (operation[0] == 'comment') {
            if (data.comment) {
                output.id = data.comment.id;
                output.comment = data.comment.body;
                output.issueId = data.issue.id;
            }
        }
        await updateJira(world, operation[0] +'s', output);
        console.log(output);
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    extractData, getJiraIssues
}
