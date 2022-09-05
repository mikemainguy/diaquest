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
        document.addEventListener('triggerdown', this.triggerdown.bind(this));
    },
    bbuttondown: function (evt) {
        show('#hud');
    },
    triggerdown: function (evt) {
        switch (this.mode.slice(-1)[0]) {
            case 'adding':
                this.first = null;
                this.mode.push('typing');
                document.querySelector('#keyboard').setAttribute('position', getHUDPosition());
                document.querySelector('#keyboard').setAttribute('super-keyboard', 'show', true);
                document.querySelector('#keyboard').emit('show');
                break;
        }
        debug(this.mode);
    }
});

AFRAME.registerComponent('buttons', {
    init: function () {

    },


    /*clickHandler: function (evt) {
        switch (this.system.mode.length > 0 ? this.system.mode.slice(-1)[0] : null) {
            case 'selecting-color-object':
                if (selectedObject) {
                    ele.setAttribute('material', 'color', this.system.color);
                    ele.setAttribute('base-color', this.system.color);
                    const data = {id: selectedObject.id, color: this.system.color};
                    import('../firebase/firebase.js').then((module) => {
                        module.updateEntity(data);
                    });
                }
                break;
            case 'editing-color':
                if (ele && ele.classList.contains('colorswatch')) {
                    this.system.color = ele.getAttribute('newcolor');
                    this.system.mode.push('selecting-color-object');
                }
                hideColorPicker();
                break;
            case 'moving':
                if (selectedObject) {
                    this.system.first = selectedObject.id;
                    debug('moving: ' + selectedObject.id);
                } else {
                    debug('movement cleared: ');
                    this.system.first = null;
                }
        }
        if (this.system.mode.length > 0) {
            debug(JSON.stringify(this.system.mode));
        }


    }, */
    tick: function () {

    }
});

