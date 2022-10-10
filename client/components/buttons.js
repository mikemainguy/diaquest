import {debug} from './debug';
import {createUUID, getMenuPosition, showMenu} from './util';

AFRAME.registerSystem('buttons', {
    init: function () {
        this.mode = [];
        this.first = null;
        this.second = null;
        this.template = null;
        this.color = '#399';
        this.boundTriggerDown = this.triggerdown.bind(this);
        document.addEventListener("bbuttondown", this.bbuttondown.bind(this));
        document.addEventListener("bbuttonup", this.bbuttonup.bind(this));
        document.addEventListener('triggerdown', this.boundTriggerDown);
    },
    bbuttondown: function (evt) {
        showMenu();
    },
    bbuttonup: function(evt) {

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
    }
});


