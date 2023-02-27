import {debug} from './debug';
import {changeRaycaster, createUUID, exportGLB} from './util';

AFRAME.registerSystem('buttons', {
    init: function () {
        this.first = null;
        this.mode = [];
        this.color = '#399';
        this.image = null;
        this.template = null;
        this.buttonstate = this.buttonstate.bind(this);
        this.hideMenu = hideMenu.bind(this);
        this.showMenu = showMenu.bind(this);
        this.pointers = [];
        this.el.addEventListener('buttonstate', this.buttonstate);
        this.el.addEventListener('hideMenu', this.hideMenu);
        this.el.addEventListener('showMenu', this.showMenu);
        document.addEventListener('export', exportGLB);
    },
    buttonstate: function (evt) {
        if (this.template == '#connector-template'
            && this.mode[0] == 'add'
           && this.first
           && evt.detail.first) {
            const data = {
                id: createUUID(),
                template: this.template,
                color: this.color,
                first: this.first,
                second: evt.detail.first
            }

            document.dispatchEvent(
                new CustomEvent('shareUpdate',
                    {detail: data}));
            this.system.first = null;
        }
        if (evt.detail.template) {
            this.template = evt.detail.template;
        }
        this.mode = evt.detail.mode;
        this.image = evt.detail.image;
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
        this.image = '';
        this.pointer = this.buildPointer();
        this.system.pointers.push(this.pointer);
    },
    buildPointer: function() {
        const pointer = document.createElement('a-sphere');
        pointer.setAttribute('material', 'color: #fff; opacity: 0.8; emissive: #fff');
        pointer.setAttribute('radius', '0.004');
        pointer.setAttribute('visible', 'false');
        this.el.appendChild(pointer);
        return pointer;
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
            this.pointer.object3D.position.copy(this.raycaster.lineData.end);
        }
    },
    events: {
        thumbstickdown: function (evt) {
            const rays = getRaycasters();
            for (const caster of rays) {
                caster.setAttribute('raycaster', 'far',
                    caster.getAttribute('raycaster').far == 20 ? .1 : 20);
            }
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

        },
        abuttonup: function (evt) {

        },
        bbuttontouchstart: function (evt) {

        },
        bbuttontouchend: function (evt) {

        },
        triggertouchstart: function (evt) {
            this.pointer.setAttribute('visible', 'true');
        },
        triggertouchend: function (evt) {
            this.pointer.setAttribute('visible', 'false');
        },
        bbuttondown: function (evt) {
            const bmenu = document.getElementById('bmenu');
            if (bmenu) {
                const bMenuShowing = document.getElementById('bmenu').getAttribute('visible');
                if (bMenuShowing) {
                    hideMenu({detail: {id: '#bmenu'}});
                } else {
                    showMenu({detail: {id: '#bmenu', objects: '[widget], .saveable'}});
                }
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
            if (!this.system.mode) {
                this.system.mode = [];
                return;
            }
            if (evt.target.states.includes('cursor-hovering')) {
                return;
            }
            const data = {};
            const v = this.pointer.object3D.position.clone();
            this.el.object3D.localToWorld(v);
            data.position = v;

            switch (this.system.mode.slice(-1)[0]) {
                case 'copy':
                    if (!this.system.first) {
                        return;
                    }
                    data.id = createUUID();
                    const ele = document.getElementById(this.system.first);
                    data.template = ele.getAttribute('template').src;
                    const stuffData = ele.components['stuff'].data;
                    data.text = stuffData.text;
                    data.image = stuffData.image;
                    data.color = stuffData.color;
                    data.scale = stuffData.scale;
                    document.dispatchEvent(
                        new CustomEvent('shareUpdate',
                            {detail: data}));
                    break;
                case 'add':
                    data.id = createUUID();
                    data.template = this.system.template;
                    data.color = this.system.color;

                    document.dispatchEvent(
                        new CustomEvent('shareUpdate',
                            {detail: data}));
                    this.system.first = null;
                    this.system.second = null;
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
    let objs = '.saveable, [widget]'
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

