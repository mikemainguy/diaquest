import {debug} from './debug';
import {show} from './util';

AFRAME.registerSystem('buttons', {
    init: function () {
        this.mode = [];
        this.first = null;
        this.second = null;
        this.template = null;
        this.color = '#399';
    }
});

AFRAME.registerComponent('buttons', {
    init: function () {
        this.el.addEventListener("bbuttondown", this.bbuttondown.bind(this));
        //this.el.addEventListener('triggerdown', this.triggerdown.bind(this));
    },
    bbuttondown: function (evt) {
        show('#hud');
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

function disableAlignment() {
    const hand = document.querySelector('#right-hand');
    hand.removeAttribute('aligner');
}

function enableAlignment() {
    const hand = document.querySelector('#right-hand');
    hand.setAttribute('aligner', '');
}

