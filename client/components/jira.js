import {round} from "./util";
import domtoimage from "dom-to-image";

AFRAME.registerSystem('jira', {
    init: function () {
        this.tickets = new Map();
        this.priority = new Map();
        this.organize = this.organize.bind(this);
        this.el.addEventListener('organize', this.organize);
        this.tick = AFRAME.utils.throttleTick(this.tick, 1000, this);
    },

    tick: function (t, dt) {
        this.el.emit('organize', {}, false);
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
        this.swimlanes = document.querySelectorAll('[jirastatus]');
        const stateMap = new Map();
        const posMap = new Map();
        this.swimlanes.forEach((el) => {
            for (const state of el.components['jirastatus'].data.states) {
                stateMap.set(state, el);
                posMap.set(state, .2);
                const geometry = el.querySelector('a-box').getObject3D('mesh').geometry;
                geometry.computeBoundingBox();
            }
        });
        for (const ticket of entries) {
            const statusId = ticket.components['jira'].data.issueStatusId;
            if (stateMap.has(statusId)) {
                const parent = stateMap.get(statusId);
                if (ticket.object3D.parent != parent.object3D) {
                    if (!ticket.components['jira'].grabbed) {
                        parent.object3D.add(ticket.object3D);
                    }
                }
                let pos = posMap.get(statusId);
                let size = .1;

                if (ticket.components['jira'].data.issueStoryPoints) {
                    size = ticket.components['jira'].data.issueStoryPoints * size;
                }
                const box = ticket.querySelector('a-box');
                box.setAttribute('height', size);
                pos = pos + (size / 2);

                if (!ticket.components['jira'].grabbed) {
                    const text = ticket.querySelector('.key');
                    text.setAttribute('position', `0 0 .051`);
                    const summary = ticket.querySelector('.summary');
                    summary.setAttribute('position', `0 ${(size / 2) + .05} 0`);
                    ticket.setAttribute('position', `0 ${pos} 4.8`);
                }
                pos = pos + (size / 2) + .2;
                posMap.set(statusId, pos);
            } else {
                console.log(statusId + ' missing');
            }
        }

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
    events: {
        color: function (evt) {

        }
    },
    init: function () {

    },
    update: function () {
        if (!this.data.position) {
            this.el.setAttribute('position', `${this.system.count} 1 -2`);
            this.system.count++;
        }
        window.setTimeout(() => {
            const textEl = this.el.querySelector('.text');
            textEl.setAttribute('text', 'value', this.data.status);
            textEl.setAttribute('width', '.5');

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
        comment: {type: 'string'},
        issueStoryPoints: {type: 'string'}
    },
    events: {
        grabbed: function (evt) {
            this.grabbed = this.el.closest('[template]');
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction('grab', {id: this.grabbed.id});
            }
            evt.detail.hand.object3D.attach(this.grabbed.object3D);
        },
        released: function () {
            console.log('Dropped on ' + this.dropTarget);
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction('release', {id: this.grabbed.id});
            }

            this.el.sceneEl.object3D.attach(this.grabbed.object3D);
            const newPos = round(this.grabbed.object3D.position, .1);
            this.grabbed.object3D.position.set(newPos.x, newPos.y, newPos.z);
            this.grabbed.setAttribute('rotation', '0 0 0');
            this.grabbed = null;
            if (this.dropTarget) {
                this.el.setAttribute('jira', 'issueStatusId', this.dropTarget.getAttribute('id'));
            }
        },
        mouseenter: function (evt) {
            const box = this.el.querySelector('a-box');
            box.setAttribute('color', '#dd0');
            const description = this.el.querySelector('.description');
            if (description) {
                description.setAttribute('visible', true);
            }
        },
        mouseleave: function (evt) {
            const box = this.el.querySelector('a-box');
            box.setAttribute('color', '#333');
            const description = this.el.querySelector('.description');
            if (description) {
                description.setAttribute('visible', false);
            }
        },

    },
    update: function () {
        const id = this.el.id;
        this.system.tickets.set(id, this.el);
        const priority = this.system.priority;
        if (!priority.has(this.data.issuePriority)) {
            priority.set(this.data.issuePriority, priority.size);
        }

        if (this.data.issueDescription) {
            const test = this.htmlToElement(this.data.issueDescription);
            domtoimage.toPng(test, {width: 768, height: 768}).then((url) => {
                const img = new Image();
                img.src = url;
                const id = 'img' + Date.now().valueOf();
                img.setAttribute('id', id);
                const assets = document.querySelector('a-assets');
                assets.append(img);
                this.image = id;
                if (this.data.issueDescription) {
                    if (this.image) {
                        window.setTimeout(() => {
                            const description = this.el.querySelector('.description');
                            description.setAttribute('src', '#' + this.image);
                        }, 1000);
                    }
                }
            })
                .catch(function (error) {

                });
        }
    },
    tick: function () {
        const summary = this.el.querySelector('.summary');
        if (summary) {
            summary.setAttribute('text', `value: ${this.data.issueSummary}`);
        }
        const key = this.el.querySelector('.key');
        if (key) {
            key.setAttribute('text', `value: ${this.data.issueKey}`);
        }
        if (this.grabbed && this.system.swimlanes) {
            const worldPos = this.el.object3D.getWorldPosition(this.el.object3D.position.clone());
            this.system.swimlanes.forEach((swimlane) => {
                const laneBox = swimlane.querySelector('a-box');
                const parentObj = laneBox.object3D.parent;
                const newBox = laneBox.getObject3D('mesh').geometry.boundingBox.clone();
                const worldBox = new THREE.Box3(parentObj.localToWorld(newBox.min),
                    parentObj.localToWorld(newBox.max));

                worldBox.expandByVector(new THREE.Vector3(0, 100, 0));
                let dropTarget = null;
                if (worldBox.containsPoint(worldPos)) {
                    swimlane.querySelector('a-box').setAttribute('color', '#22f');
                    dropTarget = swimlane;
                    this.dropTarget = dropTarget;
                } else {
                    swimlane.querySelector('a-box').setAttribute('color', '#fff');
                }

            });

        }
    },
    htmlToElement: function htmlToElement(html) {
        const template = document.createElement('div');
        template.style.backgroundColor = "#fff";
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template;
    }
});