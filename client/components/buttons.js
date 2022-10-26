import {debug} from './debug';
import {createUUID, getMenuPosition} from './util';


AFRAME.registerSystem('buttons', {

    init: function () {
        this.mode = [];
        this.first = null;
        this.second = null;
        this.template = null;
        this.bmenuShowing = false;
        this.ymenuShowing = false;
        this.color = '#399';
        document.addEventListener("hideMenu", this.hideMenu.bind(this));
        document.addEventListener("showMenu", this.showMenu.bind(this));
        document.addEventListener("ybuttondown", this.ybuttondown.bind(this));
        document.addEventListener("bbuttondown", this.bbuttondown.bind(this));
        document.addEventListener('triggerdown', this.triggerdown.bind(this));
    },
    bbuttondown: function (evt) {
        const bMenuShowing = document.querySelector('#bmenu').getAttribute('visible');
        if (bMenuShowing) {
            this.hideMenu({detail: {id: '#bmenu'}});
        } else {
            this.showMenu({detail: {id: '#bmenu', objects: '#bmenu a-plane[mixin=menuPlane], .saveable'}});
        }
    },
    ybuttondown: function (evt) {
        const yMenuShowing = document.querySelector('#ymenu').getAttribute('visible');
        if (ymenuShowing) {
            this.hideMenu({detail: {id: '#ymenu'}});
        } else {
            this.showMenu({detail: {id: '#ymenu', objects: '#ymenu a-plane[mixin=menuPlane], .saveable'}});
        }
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
        this.changeMenu(evt.detail.id, true, evt.detail.objects);
    },
    hideMenu: function(evt) {
        this.changeMenu(evt.detail.id, false, '.saveable')
    },
    changeMenu: function(id, visible, objects) {
        const el = document.querySelector(id);
        el.setAttribute('visible', visible);
        for (const hand of this.getRaycasters()) {
            hand.setAttribute('raycaster', 'objects', objects);
        }
    },
    getRaycasters: function() {
        return document.querySelectorAll('[raycaster]');
    }

});

