import {debug} from './debug';
import {createUUID, getMenuPosition, round} from './util';

AFRAME.registerSystem('buttons', {
    init: function () {
        this.first = null;
        this.mode = [];
        this.color = '#399';
        this.template = null;
        this.buttonstate = this.buttonstate.bind(this);
        this.hideMenu = hideMenu.bind(this);
        this.showMenu = showMenu.bind(this);

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
    },
    events: {
        bbuttondown: function (evt) {
            const bMenuShowing = document.getElementById('bmenu').getAttribute('visible');
            if (bMenuShowing) {
                hideMenu({detail: {id: '#bmenu'}});
            } else {
                showMenu({detail: {id: '#bmenu', objects: '#bmenu a-plane[mixin=menuPlane], .saveable'}});
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
            switch (this.system.mode.slice(-1)[0]) {
                case 'copying':

                    data.id = createUUID();
                    data.position = round(getMenuPosition(), .1);
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
                    //const newPos = round(this.grabbed.object3D.position, .1);

                    data.position = round(getMenuPosition(), .1);
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
    changeMenu(evt.detail.id, false, '.saveable')
}

function changeMenu(id, visible, objects) {
    const el = document.querySelector(id);
    el.setAttribute('visible', visible);
    for (const hand of getRaycasters()) {
        hand.setAttribute('raycaster', 'objects', objects);
    }
}

function getRaycasters() {
    return document.querySelectorAll('[raycaster]');
}

