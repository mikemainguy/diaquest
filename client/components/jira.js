AFRAME.registerSystem('jira', {
    init: function () {
        this.tickets = new Map();
        this.priority = new Map();
    },
    /**
     * This function sorts the tickets based on their rank and appends them to their corresponding swimlane.
     * It does this by looping through each swimlane and for each swimlane,
     * looping through the states, and setting the state to a map.
     * After that, the function sorts the tickets into the correct swimlane by looping through the tickets,
     * getting the statusId of each ticket, then appending the ticket to the correct swimlane using the stateMap.
     * Finally, the position of each ticket is set, incrementing by 0.2 each time.
     */
    organize: function () {
        let i = 1;
        const entries = [...this.tickets.values()];
        entries.sort((a, b) => {
            return b.components['jira'].data.rank.localeCompare(a.components['jira'].data.rank);
        });
        const swimlanes = document.querySelectorAll('[jirastatus]');
        const stateMap = new Map();
        swimlanes.forEach((el) => {
            for (const state of el.components['jirastatus'].data.states) {
                stateMap.set(state, el);
            }
        });
        for (const ticket of entries) {
            const statusId = ticket.components['jira'].data.issueStatusId;
            stateMap.get(statusId).append(ticket);
            ticket.setAttribute('position', `0 ${i * .2} 0`);
            i++;
        }
        ;
    }
});
AFRAME.registerSystem('jirastatus', {
    init: function () {
        this.count = 0;
    }
});
AFRAME.registerComponent('jirastatus', {
    schema: {
        status: {type: 'string'},
        states: {type: 'array'},
        position: {type: 'string'}

    },
    init: function () {
        console.log(this.data);
    },
    update: function () {
        if (!this.data.position) {
            this.el.setAttribute('position', `${this.system.count} 1 -5`);
            this.system.count++;
        }
        window.setTimeout(() => {
            const textEl = this.el.querySelector('.text');
            textEl.setAttribute('text', 'value', this.data.status);
        }, 1000);
    }
});
AFRAME.registerComponent('jira', {
    schema: {
        rank: {type: 'string'},
        issueId: {type: 'string'},
        issueType: {type: 'string'},
        issueStatus: {type: 'string'},
        issueStatusId: {type: 'string'},
        issueKey: {type: 'string'},
        issuePriority: {type: 'string'},
        issueSummary: {type: 'string'},
        issueDescription: {type: 'string'},
        commentId: {type: 'string'},
        comment: {type: 'string'}
    },
    update: function () {
        const id = this.el.id;
        const tickets = this.system.tickets;
        const priority = this.system.priority;
        if (!priority.has(this.data.issuePriority)) {
            priority.set(this.data.issuePriority, priority.size);
        }
        if (tickets.has(id)) {

        } else {
            tickets.set(id, this.el);
        }

        window.setTimeout((p) => {
            const summary = p.el.querySelector('.summary');
            summary.setAttribute('text', `value: ${p.data.issueSummary}`);
            const key = p.el.querySelector('.key');
            key.setAttribute('text', `value: ${p.data.issueKey}`);
            p.system.organize();
        }, 1000, this);


    },

});