AFRAME.registerComponent('jira', {
    schema: {
        issueId: {type: 'string'},
        issueType: {type: 'string'},
        issueStatus: {type: 'string'},
        issueKey: {type: 'string'},
        issuePriority: {type: 'string'},
        issueSummary: {type: 'string'},
        issueDescription: {type: 'string'},
        commentId: {type: 'string'},
        comment: {type: 'string'}
    },
    update: function() {

    }
});