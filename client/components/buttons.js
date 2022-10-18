import {debug} from './debug';
import {createUUID, getMenuPosition} from './util';


AFRAME.registerSystem('buttons', {

    init: function () {
        this.mode = [];
        this.first = null;
        this.second = null;
        this.template = null;
        this.menuShowing = false;
        this.color = '#399';
        this.boundTriggerDown = this.triggerdown.bind(this);
        document.addEventListener("hideMenu", this.hideMenu.bind(this));
        document.addEventListener("showMenu", this.showMenu.bind(this));
        document.addEventListener("ybuttondown", this.ybuttondown.bind(this));
        document.addEventListener("bbuttondown", this.bbuttondown.bind(this));
        document.addEventListener("bbuttonup", this.bbuttonup.bind(this));
        document.addEventListener('triggerdown', this.boundTriggerDown);
    },
    bbuttondown: function (evt) {

        if (this.menuShowing) {
            this.hideMenu({detail: {id: '#menu'}});
        } else {
            this.showMenu({detail: {id: '#menu'}});
        }
    },
    bbuttonup: function (evt) {

    },
    ybuttondown: function (evt) {
        document.dispatchEvent(
            new CustomEvent('connectSignalwire',
                {detail: 'OK'}));
    },
    triggerdown: function (evt) {
        if (evt.target.states.includes('cursor-hovering')) {
            return;
        }
        switch (this.mode.slice(-1)[0]) {
            case 'adding':
                this.first = null;
                const data = {};
                data.id = createUUID();
                data.position = getMenuPosition();
                data.template = this.template;
                data.color = this.color;
                document.dispatchEvent(
                    new CustomEvent('shareUpdate',
                        {detail: data}));
                break;
        }
        debug(this.mode);
    },
    showMenu: function (evt) {
        const obj = document.querySelector(evt.detail.id);
        let objs = '#menu a-plane[mixin=menuPlane], .saveable'
        if (evt.detail.objects) {
            objs = evt.detail.objects;
        }
        obj.setAttribute('visible', true);
        const hands = document.querySelectorAll('[raycaster]');
        for (const hand of hands) {
            hand.setAttribute('raycaster', 'objects', objs);
        }
        this.menuShowing = true;
    },


    hideMenu: function hideMenu(evt) {
        const obj = document.querySelector(evt.detail.id);
        obj.setAttribute('visible', false);
        const hands = document.querySelectorAll('[raycaster]');
        for (const hand of hands) {
            hand.setAttribute('raycaster', 'objects', '.saveable');
        }
        this.menuShowing = false;
    }

})
;

