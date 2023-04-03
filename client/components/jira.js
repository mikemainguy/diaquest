AFRAME.registerSystem('jira', {
    init: function () {
        this.tickets = new Map();
        this.priority = new Map();
        this.organize = this.organize.bind(this);
        this.el.addEventListener('organize', this.organize);
        this.tick = AFRAME.utils.throttleTick(this.tick, 1000, this);
    },
    tick: function(t, dt)  {
      this.organize();
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
        performance.mark('organize-started');
        let i = 1;
        const entries = [...this.tickets.values()];
        entries.sort((a, b) => {
            return b.components['jira'].data.rank.localeCompare(a.components['jira'].data.rank);
        });
        const swimlanes = document.querySelectorAll('[jirastatus]');
        const stateMap = new Map();
        const posMap = new Map();
        swimlanes.forEach((el) => {
            for (const state of el.components['jirastatus'].data.states) {
                stateMap.set(state, el);
                posMap.set(state, 5);
            }
        });
        for (const ticket of entries) {
            const statusId = ticket.components['jira'].data.issueStatusId;
            if (stateMap.has(statusId)) {
                const parent = stateMap.get(statusId);
                if (ticket.parentEl.object3D != parent.object3D) {
                    const pos = posMap.get(statusId);
                    parent.object3D.add(ticket.object3D);
                    ticket.setAttribute('position', `0 .2 ${pos}`);
                    posMap.set(statusId, pos-.2);
                } else {
                    console.log('parent already correct');
                }
            } else {
                console.log(statusId + ' missing');
            }
        };
        performance.mark('organize-ended');
        const organizeMeasure =
            performance.measure('organize-started',
            'organize-ended');

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
    },
    tick: function() {
        const summary = this.el.querySelector('.summary');
        if (summary) {
            summary.setAttribute('text', `value: ${this.data.issueSummary}`);
        } else {
                console.log(this.el);
        }
        const key = this.el.querySelector('.key');
        if (key) {
            key.setAttribute('text', `value: ${this.data.issueKey}`);
        } else {
            console.log(this.el);
        }
        if (this.system) {
            //this.el.sceneEl.emit('organize', {detail: 'OK'});
            //this.el.sceneEl.emit('organize', {detail: 'OK'});
            //console.log('here');
            //this.system.organize();
        } else {
            //console.log('no system');
        }

        //

    }
});