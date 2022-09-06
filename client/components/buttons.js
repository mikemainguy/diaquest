import {debug} from './debug';
import {getHUDPosition, show} from './util';

AFRAME.registerSystem('buttons', {
    init: function () {
        this.mode = [];
        this.first = null;
        this.second = null;
        this.template = null;
        this.color = '#399';
        document.addEventListener("bbuttondown", this.bbuttondown.bind(this));
        document.addEventListener("bbuttonup", this.bbuttonup.bind(this));
        document.addEventListener('triggerdown', this.triggerdown.bind(this));
    },
    bbuttondown: function (evt) {
        show('#hud');
    },
    bbuttonup: function(evt) {

    },
    triggerdown: function (evt) {
        switch (this.mode.slice(-1)[0]) {
            case 'adding':
                this.first = null;
                this.mode.push('typing');
                document.querySelector('#keyboard').setAttribute('position', getHUDPosition());
                document.querySelector('#keyboard').setAttribute('super-keyboard', 'show', true);
                document.querySelector('#keyboard').emit('show');
                debug(this.mode);
                break;
        }

    }
});


