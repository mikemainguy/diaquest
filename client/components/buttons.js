import {debug} from './debug';
import {getHUDPosition, show} from './util';

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
        show('#hud');
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
                document.querySelector('#keyboard').setAttribute('position', getHUDPosition());
                document.querySelector('#keyboard').setAttribute('super-keyboard', 'show', true);
                document.querySelector('#keyboard').emit('show');
                debug(this.mode);
                break;
            case 'moving':
                this.first = null;
                this.mode.pop();
                debug(this.mode);
                const event = new Event('rigChanged');
                document.dispatchEvent(event);
        }

    }
});


