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
        this.swimlanes = document.querySelectorAll('[jirastatus]');
        const stateMap = new Map();
        const posMap = new Map();
        this.swimlanes.forEach((el) => {
            for (const state of el.components['jirastatus'].data.states) {
                stateMap.set(state, el);
                posMap.set(state, 5);
                const geometry = el.querySelector('a-box').getObject3D('mesh').geometry;
                geometry.computeBoundingBox();
            }
        });
        for (const ticket of entries) {
            const statusId = ticket.components['jira'].data.issueStatusId;
            if (stateMap.has(statusId)) {
                const parent = stateMap.get(statusId);
                if (ticket.parentEl.object3D != parent.object3D) {
                    let pos = posMap.get(statusId);
                    let size = .1;
                    if (!ticket.components['jira'].grabbed) {
                        parent.object3D.add(ticket.object3D);
                    }
                    if (ticket.components['jira'].data.issueStoryPoints) {
                        size = ticket.components['jira'].data.issueStoryPoints * size;
                        pos = pos - (size / 2);
                        const box = ticket.querySelector('a-box');
                        box.setAttribute('depth', size);
                        const text = ticket.querySelector('.key');
                        if (!ticket.components['jira'].grabbed) {
                            text.setAttribute('position', `0 0 ${(size / 2) + .001}`);
                        }

                    }
                    if (!ticket.components['jira'].grabbed) {
                        ticket.setAttribute('position', `0 .2 ${pos}`);
                    }
                    posMap.set(statusId, pos - (size + .1));
                } else {
                    console.log('parent already correct');
                }
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
            this.el.setAttribute('position', `${this.system.count} 1 -5`);
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
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction('release', {id: this.grabbed.id});
            }

            this.el.sceneEl.object3D.attach(this.grabbed.object3D);
            const newPos = round(this.grabbed.object3D.position, .1);
            this.grabbed.object3D.position.set(newPos.x, newPos.y, newPos.z);

            const ang = AFRAME.utils.coordinates.parse(this.grabbed.getAttribute('rotation'));
            this.grabbed.setAttribute('rotation', AFRAME.utils.coordinates.stringify(round(ang, 45)));
            this.grabbed = null;
            if (this.dropTarget) {
                console.log(this.dropTarget.getAttribute('id'));
                this.data.issueStatusId = this.dropTarget.getAttribute('id');

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
        const tickets = this.system.tickets;
        const priority = this.system.priority;
        if (!priority.has(this.data.issuePriority)) {
            priority.set(this.data.issuePriority, priority.size);
        }
        if (tickets.has(id)) {

        } else {
            tickets.set(id, this.el);
        }

        if (this.data.issueDescription) {
            const test = this.htmlToElement(this.data.issueDescription);
            console.log(test);
            domtoimage.toPng(test, {width: 1024, height: 1024}).then((url) => {
                const img = new Image();
                img.src = url;
                const id = 'img' + Date.now().valueOf();
                img.setAttribute('id', id);
                const assets = document.querySelector('a-assets');
                assets.append(img);

                this.image = id;

                if (this.data.issueDescription) {
                    console.log(this.data.issueDescription);
                    if (this.image) {
                        window.setTimeout(() => {
                            const description = this.el.querySelector('.description');
                            console.log(this.image);
                            description.setAttribute('src', '#' + this.image);
                        }, 1000);

                        //const material = description.getObject3D('mesh').material;
                        //if (material && material.map) {
                        //    material.map.needsUpdate = true;
                        //}
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
        } else {
            console.log(this.el);
        }
        const description = this.el.querySelector('.description');

        const key = this.el.querySelector('.key');
        if (key) {
            key.setAttribute('text', `value: ${this.data.issueKey}`);
        } else {
            console.log(this.el);
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
                } else {
                    swimlane.querySelector('a-box').setAttribute('color', '#fff');
                }
                this.el.components['jira'].dropTarget = dropTarget;
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