import {debug} from './debug';
import {htmlToElement} from './util';

AFRAME.registerSystem('animationmanager', {
    init: function () {
        this.state = null;
        this.index = null;
        this.from = null;
        this.to = null;
        this.selected = null;
        this.duration = 1000;
        this.delay = 0;

        this.click = this.click.bind(this);
        document.addEventListener('click', this.click);
    },
    createSelector: function (id, color) {
        const c = color ? color : '#00f';
        const selector =
            htmlToElement(`
            <a-entity selected-animation="true" animation="from: 0 0 0; to: 0 0 359; dur: 2000; autoplay: true; loop: true; property: rotation; easing: linear">
                <a-entity animation="from: 0 0 0; to: 359 0 0; dur: 500; autoplay: true; loop: true; property: rotation; easing: linear">
                    <a-sphere radius=".05" animation="from: 1 1 1; to: .25 .25 .25; autoplay: true; dur: 750; loop: true; property: scale;" position="0 .1 0" color="${color}"></a-sphere>
                </a-entity>
            </a-entity>
            `);
        if (id.components['stuff'] && id.components['stuff'].data.scale) {
            //selector.setAttribute('scale', id.components['stuff'].data.scale);
            debug('scale set to ' + id.components['stuff'].data.scale);
        }
        id.appendChild(selector);
    },
    updateAnimation: function (field, id, color) {
        const ele = document.getElementById(id);
        if (ele) {
            if (this[field]) {
                const old = document.getElementById(this[field]);
                old.querySelector('[selected-animation]').remove();
            }
            this[field] = id;
            this.createSelector(ele, color);

        }
    },
    click: function (evt) {
        if (this.state) {
            if (evt.detail.intersectedEl &&
                evt.detail.intersectedEl.closest('[template]')) {
                const id = evt.detail.intersectedEl.closest('[template]').id
                switch (this.state) {
                    case 'animation-select':
                        this.updateAnimation('selected', id, '#ff0');
                        break;
                    case 'animation-from':
                        this.updateAnimation('from', id, '#f00');
                        break;
                    case 'animation-to':
                        this.updateAnimation('to', id, '#00f');
                        break;
                }
                let ready = true;
                for (const f of ['selected', 'from', 'to']) {
                    if (this[f] == null) {
                        ready = false;
                    }
                }
                if (ready) {
                    document.dispatchEvent(new CustomEvent('animationUpdate',{detail: 'OK'}));
                }

            }
        } else {

        }
    }
});
AFRAME.registerComponent('animationmanager', {
    init: function () {
        this.animationUpdate = this.animationUpdate.bind(this);
        document.addEventListener('animationUpdate', this.animationUpdate);
    },
    animationUpdate: function (evt) {
        const list = this.el.querySelectorAll('[widget]');
        for(const w of list) {
            console.log(w.components['widget'].data.method);
        }
        debug(evt.detail);
    },
    events: {
        'animation-add': function (evt) {
            this.system.state = 'animation-add';
            const item = {
                item: this.system.selected,
                from: this.system.from,
                to: this.system.to,
                duration: this.system.duration,
                delay: this.system.delay
            }
            if (this.system.index) {
                this.animations[this.system.index] = item;
            } else {
                this.animations.push(item);
            }
            this.system.select = null;
            this.system.from = null;
            this.system.to = null;
            this.updateAnimationList();

        },
        'animation-play': function (evt) {
            for (const c of this.animations) {
                document.querySelector('#' + c.item).emit('animation-play');
            }
            this.system.state = null;

        },
        'animation-select': function (evt) {
            this.system.state = 'animation-select';
        },
        'animation-from': function (evt) {
            this.system.state = 'animation-from';
        },
        'animation-to': function (evt) {
            this.system.state = 'animation-to';
        },
        'animation-duration': function (evt) {
            this.system.state = 'animation-duration';
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