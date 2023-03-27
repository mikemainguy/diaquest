import {afterSceneLoads, getDb} from "./base";
import {buildPath} from "./paths";
import {onChildChanged, onValue, ref} from "firebase/database";


const database = getDb();
afterSceneLoads(jiraListener, ref(database, buildPath('jira/issues')));
async function jiraListener(jira) {
    onChildChanged(jira, (snapshot) => {
       updateDom(snapshot.val());
    });
    onValue(jira , (snapshot) => {
        snapshot.forEach((j) => {
            updateDom(j.val());
        })
    }, {onlyOnce: true});
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
        issueKey: jira.issueKey,
        issuePriority: jira.issuePriority,
        issueSummary: jira.issueSummary,
        issueDescription: jira.issueDescription
    }
    ticket.setAttribute('jira', data);
}

