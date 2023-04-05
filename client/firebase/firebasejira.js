import {afterSceneLoads, getDb} from "./base";
import {buildPath} from "./paths";
import {onChildChanged, onValue, ref} from "firebase/database";

const database = getDb();
afterSceneLoads(jiraListener, ref(database, buildPath('jira')));


async function jiraListener(jira) {
    const issueRef = ref(database, buildPath('jira/issues'));
    onChildChanged(issueRef, (snapshot) => {
       updateDom(snapshot.val());
    });
    onValue(jira , (snapshot) => {
        snapshot.child('issues').forEach((j) => {
            updateDom(j.val());
        });
        snapshot.child('boards').forEach((j) => {
            updateBoard(j.val());
        });

    }, {onlyOnce: true});
}
function updateBoard(board) {
    for (const column of board.columns) {
        let statusEl = document.querySelector('#jirastatus' + column.id );
        if (!statusEl) {
            statusEl = document.createElement('a-entity');
            statusEl.setAttribute('id', 'jirastatus' + column.id);
            statusEl.setAttribute('jiraStatus', 'status: '+
                column.column + '; states: '+
                column.statuses.join(','));
            statusEl.setAttribute('template', 'src: #jirastatusTemplate');
            statusEl.setAttribute('position', '0 2 0');

            document.querySelector('a-scene').append(statusEl);
        }
    }


    console.log(board);
}
function updateDom(jira) {
    let ticket = document.querySelector('#jira' + jira.id);
    if (!ticket) {
        ticket = document.createElement('a-entity');
        ticket.setAttribute('template', 'src: #jiratemplate');
        ticket.setAttribute('id', 'jira'+jira.id);
        document.querySelector('a-scene').append(ticket);
    }
    const data = {
        rank: jira.rank,
        issueId: jira.id,
        issueType: jira.issueType,
        issueStatus: jira.issueStatus,
        issueStatusId: jira.issueStatusId,
        issueKey: jira.issueKey,
        issuePriority: jira.issuePriority,
        issueSummary: jira.issueSummary,
        issueDescription: jira.issueDescription,

    }
    if (jira.issueStoryPoints) {
        data.issueStoryPoints = jira.issueStoryPoints;
    }
    ticket.setAttribute('jira', data);
}