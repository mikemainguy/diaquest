const axios = require('axios');
const {updateJira} = require("./firebase");
const getBoards = async function(world, jiraconfig) {
    const boardList = [];
    const config = (getAxiosConfig(jiraconfig));
    const res = await axios.get(
        jiraconfig.searchurl + `/rest/agile/1.0/board`,
        config
    )
    const boards = res.data.values;
    const boardData = {};
    if (boards && boards.length > 0) {
        console.log(boards[0]);
        const boardId = boards[0].id;
        const board = await axios.get(
            jiraconfig.searchurl + `/rest/agile/1.0/board/${boardId}/configuration`,
            config
        )
        const columns = [];
        for (const column of board.data.columnConfig.columns) {
            const statusIds = [];
            if (column.statuses.length > 0) {
                for (const status of column.statuses) {
                    statusIds.push(status.id);
                }
                columns.push({column: column.name, statuses: statusIds});
            }
        }
        boardData.id= board.data.id;
        boardData.name=board.data.name;
        boardData.rankingField= board.data.ranking.rankCustomFieldId;
        boardData.columns = columns;
        boardList.push(boardData);
    }
    return boardList;
}

function getAxiosConfig(config) {
    const auth = Buffer.from(config.auth)
        .toString('base64');
    return {
        headers: {'Authorization': 'Basic ' + auth}
    };
}
const getJiraIssues = async function (world, jiraconfig, startPos) {
    let startAt = 0;
    if (startPos) {
        startAt = startPos;
    }
    const config = getAxiosConfig(jiraconfig);

    try {
        const data = await axios.get(
            jiraconfig.searchurl + `/rest/api/3/search?jql=project%20%3D%20IM&startAt=${startAt}&fields=id,key,customfield_10019,summary,description,issuetype,status,priority`,
            config
        )


        for (const issue of data.data.issues) {
            extractData(world, {webhookEvent: 'issue_synced', issue: issue});
        }
        return ({status: 'OK', total: data.data.total, maxResults: data.data.maxResults, startAt: data.data.startAt, syncCount: data.data.issues.length});
    } catch (err) {
        console.log(err);
        return {error: err};
    }
    return ({error: 'Unknown'});


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
                if (data.issue.fields.customfield_10019) {
                    output.rank = data.issue.fields.customfield_10019;
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
    extractData, getJiraIssues, getBoards
}
