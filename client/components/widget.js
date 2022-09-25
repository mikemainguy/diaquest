import {debug} from './debug';
import {showColorPicker, hide} from './util';

AFRAME.registerSystem('widget', {
    init: function () {
        this.mode = [];

    }
});

AFRAME.registerComponent('widget', {
    init: function () {
        this.color = '#11a';
        this.el.setAttribute('material', 'color', this.color);
        this.el.addEventListener("click", this.clickHandler.bind(this));
        this.el.addEventListener("mouseenter", this.mouseEnter.bind(this));
        this.el.addEventListener("mouseleave", this.mouseLeave.bind(this));
    },
    mouseEnter: function(evt) {
        const target = evt.target;
        if (!target.getAttribute('animation')) {
            target.setAttribute('animation', 'from: #ff2; to: #cc2; property: material.color; loop: true; dir: alternate; dur: 500');
        }
        //evt.target.setAttribute('base-color', evt.target.getAttribute('material').color);
        //evt.target.setAttribute('material', 'color', '#ff0');
    },
    mouseLeave: function(evt) {
        evt.target.removeAttribute('animation');
        evt.target.setAttribute('material','color', this.color);
    },
    clickHandler: function (evt) {
        const buttons = document.querySelector('a-scene').systems['buttons'];
        buttons.first = null;
        const event = new Event('rigChanged');
        document.dispatchEvent(event);
        debug(evt.target.id);
        switch (evt.target.id) {
            case 'add-connector':
                buttons.mode = ['connecting'];
                buttons.mode.push('select-first');
                hide('#menu');
                break;
            case 'add-cylinder':
                buttons.template = '#cylinder-template'
                buttons.mode = ['adding'];
                hide('#menu');
                break;
            case 'resize':
                buttons.mode = ['resizing'];
                hide('#menu');
                break;
            case 'add-sphere':
                buttons.template = '#sphere-template'
                buttons.mode = ['adding'];
                hide('#menu');
                break;
            case 'add-box':
                buttons.template = '#box-template'
                buttons.mode = ['adding'];
                hide('#menu');
                break;
            case 'close':
                hide('#menu');
                break;
            case 'edit-color':
                buttons.mode= ['edit-color'];
                showColorPicker();
                break;
            case 'add-plane':
                buttons.mode = ['adding'];
                hide('#menu');
                break;
            case 'remove':
                buttons.mode = ['removing'];
                hide('#menu');
                break;
            case 'move':
                buttons.mode = ['moving'];
                hide('#menu');
                break;
            case 'edit':
                buttons.mode = ['editing'];
                hide('#menu');
                break;
            case 'point':
                debug('point');
                buttons.mode.push('pointing');
                break;
            default:

        }
        debug(buttons.mode);

    }


});

