import {debug} from './debug';
import {createUUID, round, changeRaycaster} from './util';

AFRAME.registerSystem('buttons', {
    init: function () {
        this.first = null;
        this.mode = [];
        this.color = '#399';
        this.template = null;
        this.buttonstate = this.buttonstate.bind(this);
        this.hideMenu = hideMenu.bind(this);
        this.showMenu = showMenu.bind(this);
        this.pointers = [];
        this.el.addEventListener('buttonstate', this.buttonstate);
        this.el.addEventListener('hideMenu', this.hideMenu);
        this.el.addEventListener('showMenu', this.showMenu);
    },
    buttonstate: function (evt) {
        this.template = evt.detail.template ? evt.detail.template : null;
        this.mode = evt.detail.mode;
        this.id = evt.detail.id ? evt.detail.id : null;
        this.first = evt.detail.first ? evt.detail.first : null;
        this.color = evt.detail.color ? evt.detail.color : this.color;
    }
});

AFRAME.registerComponent('buttons', {
    init: function () {
        this.mode = [];
        this.second = null;
        this.template = null;
        this.color = '#399';
        this.snapmodes = ['copying', 'adding'];
        const pointer = document.createElement('a-sphere');
        this.gridpointer = false;
        pointer.setAttribute('material', 'color: #fff; opacity: 0.6; emissive: #fff');
        pointer.setAttribute('radius', '0.008');
        this.el.appendChild(pointer);
        this.pointer = pointer;
        this.system.pointers.push(pointer);

    },
    update: function () {

    },
    tock: function () {
        if (!this.raycaster) {
            const ray = this.el.components['raycaster'];
            if (ray) {
                this.raycaster = ray;
                this.pointer.setAttribute('position', this.raycaster.lineData.end);
            }
        } else {
            if (this.gridpointer) {
                const v = this.raycaster.lineData.end.clone();
                this.el.object3D.localToWorld(v);
                const rounded = round(v, .1);
                this.el.object3D.worldToLocal(rounded)
                this.pointer.object3D.position.set(rounded.x, rounded.y, rounded.z);
            } else {
                this.pointer.object3D.position.set(
                    this.raycaster.lineData.end.x,
                    this.raycaster.lineData.end.y,
                    this.raycaster.lineData.end.z);
            }

        }

    },
    events: {
        thumbstickdown: function(evt) {
            document.dispatchEvent(
                new CustomEvent('inspect',
                    {detail: 'data'}));
        },
        xbuttondown: function (evt) {
            const debug = document.querySelector('#debug');
            if (debug.getAttribute('visible')) {
                debug.setAttribute('visible', false);
            } else {
                debug.setAttribute('visible', true);
            }

        },
        abuttondown: function (evt) {
            const rays = getRaycasters();
            for (const caster of rays) {
                const flashlight = document.createElement('a-entity');
                caster.setAttribute('raycaster', 'far', 8);
            }
            for (const pointer of this.system.pointers) {
                pointer.setAttribute('radius', .1);
            }
        },
        abuttonup: function (evt) {
            for (const pointer of this.system.pointers) {
                pointer.setAttribute('radius', .008);
            }
            const rays = getRaycasters();
            for (const caster of rays) {
                caster.setAttribute('raycaster', 'far', .1);
            }

        },
        bbuttondown: function (evt) {
            const bMenuShowing = document.getElementById('bmenu').getAttribute('visible');
            if (bMenuShowing) {
                hideMenu({detail: {id: '#bmenu'}});
            } else {
                showMenu({detail: {id: '#bmenu', objects: '#bmenu [widget], .saveable'}});
            }
        },
        ybuttondown: function (evt) {
            const yMenuShowing = document.getElementById('ymenu').getAttribute('visible');
            if (yMenuShowing) {
                hideMenu({detail: {id: '#ymenu'}});
            } else {
                showMenu({detail: {id: '#ymenu', objects: '#ymenu a-plane[mixin=menuPlane], .saveable'}});
            }
        },
        triggerdown: function (evt) {
            if (evt.target.states.includes('cursor-hovering')) {
                return;
            }
            const data = {};
            const v = this.pointer.object3D.position.clone();
            this.el.object3D.localToWorld(v);
            data.position = v;

            switch (this.system.mode.slice(-1)[0]) {
                case 'copying':
                    data.id = createUUID();
                    const ele = document.getElementById(this.system.first);
                    data.template = ele.getAttribute('template').src;
                    const stuffData = ele.components['stuff'].data;
                    data.text = stuffData.text;
                    data.color = stuffData.color;
                    data.scale = stuffData.scale;
                    document.dispatchEvent(
                        new CustomEvent('shareUpdate',
                            {detail: data}));
                    break;
                case 'adding':
                    this.system.first = null;
                    data.id = createUUID();
                    data.template = this.system.template;
                    data.color = this.system.color;
                    document.dispatchEvent(
                        new CustomEvent('shareUpdate',
                            {detail: data}));
                    break;
            }
            debug(this.system.mode);
        },
    },
});

function showMenu(evt) {
    changeMenu(evt.detail.id, true, evt.detail.objects);
}




function hideMenu(evt) {
    let objs = '.saveable'
    if (!evt.id || evt.id != '#bmenu') {
        const bmenu = document.getElementById('bmenu')

        if (bmenu && bmenu.object3D.visible) {
            objs += ', #bmenu [widget]'
        }
    }
    changeMenu(evt.detail.id, false, objs);
}

function changeMenu(id, visible, objects) {
    const el = document.querySelector(id);
    if (el) {
        el.setAttribute('visible', visible);
    }
    changeRaycaster(objects);
}

function getRaycasters() {
    return document.querySelectorAll('[raycaster]');
}

