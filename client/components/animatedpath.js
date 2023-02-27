import {debug} from './debug';
import {getCurrentMode, htmlToElement, round} from './util';
AFRAME.registerSystem('animationmanager', {
    init: function() {
        this.activeid = null;
    }
});

AFRAME.registerComponent('animationmanager', {
    init: function () {
        this.state = null;
        this.index = null;
        this.from = null;
        this.to = null;
        this.selected = null;
        this.duration = 1000;
        this.delay = 0;
        this.active = false;

        this.click = this.click.bind(this);
        document.addEventListener('click', this.click);
        this.animations = [];
        this.animationUpdate = this.animationUpdate.bind(this);
        document.addEventListener('animationUpdate', this.animationUpdate);
    },
    animationUpdate: function (evt) {
        const list = this.el.querySelectorAll('[widget]');
        for (const w of list) {
            if (w.components['widget'].data.method == 'animation-add') {
                w.setAttribute('visible', 'true');
            }
        }
    },
    createSelector: function (id, color) {
        const c = color ? color : '#00f';
        const selector =
            htmlToElement(`
            <a-entity selected-animation="true" animation="from: 0 0 0; to: 0 0 359; dur: 2000; autoplay: true; loop: true; property: rotation; easing: linear">
                <a-entity animation="from: 0 0 0; to: 359 0 0; dur: 500; autoplay: true; loop: true; property: rotation; easing: linear">
                    <a-sphere radius=".05" animation="from: 1 1 1; to: .25 .25 .25; autoplay: true; dur: 750; loop: true; property: scale;" position="0 .1 0" color="${c}"></a-sphere>
                </a-entity>
            </a-entity>
            `);
        if (id.components['stuff'] && id.components['stuff'].data.scale) {
            //selector.setAttribute('scale', id.components['stuff'].data.scale);
            debug('scale set to ' + id.components['stuff'].data.scale);
        }
        id.appendChild(selector);
    },
    updateSelection: function (field, id, color) {
        const ele = document.getElementById(id);
        if (ele) {

            if (this[field]) {
                const old = document.getElementById(this[field]);
                if (old) {
                    const select = old.querySelector('[selected-animation]');
                    if (select) {
                        select.remove();
                    }
                }

            }
            if (id) {
                if (color) {
                    this[field] = id;
                    this.createSelector(ele, color);
                } else {
                    this[field] == null;
                }

            }
        }
    },
    clearSelections: function () {
        for (const f of ['selected', 'from', 'to']) {
            this.updateSelection(f, this[f], null);
        }
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
            this.system.activeid = this.grabbed.id;

            const newPos = round(this.grabbed.object3D.position, .1);
            this.grabbed.object3D.position.set(newPos.x, newPos.y, newPos.z);

            const ang = AFRAME.utils.coordinates.parse(this.grabbed.getAttribute('rotation'));
            this.grabbed.setAttribute('rotation', AFRAME.utils.coordinates.stringify(round(ang, 45)));
            this.grabbed = null;
        },
        'animation-add': function (evt) {
            this.state = 'animation-add';
            const item = {
                item: this.selected,
                from: this.from,
                to: this.to,
                duration: this.duration,
                delay: this.delay
            }
            if (this.index) {
                this.animations[this.index] = item;
            } else {
                this.animations.push(item);
            }
            this.updateAnimationList();
            this.clearSelections();
            const el = document.getElementById(item.item);
            const fromEl = document.getElementById(item.from);

            if (el && fromEl) {
                el.setAttribute('position', fromEl.getAttribute('position'));
            }
        },
        'animation-play': function (evt) {
            for (const c of this.animations) {
                const el = document.querySelector('#' + c.item);
                if (el) {
                    el.querySelector('[share-position]').setAttribute('share-position', 'active', false);
                }
                el.emit('animation-play');
            }
            this.state = null;

        },
        'animation-select': function (evt) {
            this.state = 'animation-select';
        },
        'animation-from': function (evt) {
            this.state = 'animation-from';
        },
        'animation-to': function (evt) {
            this.state = 'animation-to';
        },
        'animation-duration': function (evt) {
            this.state = 'animation-duration';
        }

    },
    click: function (evt) {
        if (getCurrentMode() == 'remove') {
            console.log('here');
            //document.dispatchEvent(new CustomEvent('shareUpdate', {detail: {id: obj.id, remove: true}}));
        }

        if (this.state) {
            const intersectedEl = evt.detail.intersectedEl;
            if (intersectedEl &&
                intersectedEl.classList.contains('saveable')) {
                const id = intersectedEl.closest('[template]').id
                switch (this.state) {
                    case 'animation-select':
                        this.updateSelection('selected', id, '#ff0');
                        break;
                    case 'animation-from':
                        this.updateSelection('from', id, '#f00');
                        break;
                    case 'animation-to':
                        this.updateSelection('to', id, '#00f');
                        break;
                }
                let ready = true;
                for (const f of ['selected', 'from', 'to']) {
                    if (this[f] == null) {
                        ready = false;
                    }
                }
                if (ready) {
                    document.dispatchEvent(new CustomEvent('animationUpdate', {detail: 'OK'}));
                }

            }
        } else {

        }
    },
    updateList: function () {
        const listEls = this.el.querySelector('.animationlist');
        if (!listEls) {
            debug('no list found');
            return;
        }
        let i = -0.1;

        let child = listEls.lastElementChild;
        while (child) {
            listEls.removeChild(child);
            child = listEls.lastElementChild;
        }
        let index = 1;
        for (const animation of this.animations) {
            const el = document.createElement('a-plane');
            el.setAttribute('width', '1');
            el.setAttribute('height', '.1');
            el.setAttribute('position', `0 ${i} 0`);
            el.setAttribute('text',
                `value: ${index} duration ${animation.duration} delay ${animation.delay}`);
            listEls.appendChild(el);
            index++;
            i -= .1
        }
    },
    getCoordinates: function (val) {
        return AFRAME.utils.coordinates.stringify(val);
    },
    updateAnimationList: function (oldData) {
        let idx = 0;
        for (const a of this.animations) {
            const ele = document.querySelector('#' + a.item);
            const from = document.querySelector('#' + a.from).getAttribute('position');
            const to = document.querySelector('#' + a.to).getAttribute('position');
            ele
                .setAttribute(`animation__${idx}`,
                    `from: ${this.getCoordinates(from)}; 
                to: ${this.getCoordinates(to)}; 
            property: position; autoplay: false; startEvents: animation-play`);
            idx++;
        }
        this.updateList();

    },
    update: function (oldData) {

    }
});
