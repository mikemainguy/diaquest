AFRAME.registerSystem('jira', {
    init: function() {
        this.tickets = new Map();
        this.status = new Map();
        this.status.set('Backlog', 0);
        this.status.set('Selected For Development', 1);
        this.status.set('In Progress', 2);
        this.status.set('Done', 3);
        this.priority = new Map();
    },
    organize: function() {
        let i = 0;
        const entries = [...this.tickets.values()];
        entries.sort((a,b)=> {
            return b.components['jira'].data.rank.localeCompare(a.components['jira'].data.rank);
        });
        for (const ticket of entries)  {
            const status = ticket.components['jira'].data.issueStatus;
            const statusPos = this.status.get(status);
            ticket.setAttribute('position', `${statusPos*.5} ${i*.2} 0`);
            i++;
        };
    }
});
AFRAME.registerComponent('jiraStatus', {
    init: function() {

    }
});
AFRAME.registerComponent('jira', {
    schema: {
        rank: {type: 'string'},
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
        const id = this.el.id;
        const tickets = this.system.tickets;
        const status = this.system.status;
        const priority = this.system.priority;
        if (!status.has(this.data.issueStatus)) {
            status.set(this.data.issueStatus, status.size);
        }
        if (!priority.has(this.data.issuePriority)) {
            priority.set(this.data.issuePriority, priority.size);
        }
        if (tickets.has(id)) {

        } else {
            tickets.set(id, this.el);
        }
        window.setTimeout(()=> {
            const summary = this.el.querySelector('.summary');
            summary.setAttribute('text', 'value', this.data.issueSummary);
            const key = this.el.querySelector('.key');
            key.setAttribute('text', 'value', this.data.issueKey);
        }, 100);

        this.system.organize();
    },

});