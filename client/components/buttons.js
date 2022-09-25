import {debug} from './debug';
import {changeRaycaster, getMenuPosition, showMenu} from './util';

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
                this.mode.push('typing');
                document.querySelector('#keyboard').setAttribute('position', getMenuPosition());
                document.querySelector('#keyboard').setAttribute('super-keyboard', 'show', true);
                document.querySelector('#keyboard').emit('show');
                changeRaycaster('.keyboardRaycastable');
                break;
            case 'moving':
                this.first = null;
                this.mode.pop();
                const event = new Event('rigChanged');
                document.dispatchEvent(event);
                break;
            case 'scaling':
                this.first = null;
                this.mode.pop();
                break;
        }
        debug(this.mode);

    }
});


