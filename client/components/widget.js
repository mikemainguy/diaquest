import {debug} from './debug';
import {show} from './util';

AFRAME.registerSystem('widget', {
    init: function () {
        this.mode = [];

    }
});

AFRAME.registerComponent('widget', {
    init: function () {
        this.el.addEventListener("click", this.clickHandler.bind(this));this.el.addEventListener("mouseenter", this.mouseEnter.bind(this));
        this.el.addEventListener("mouseleave", this.mouseLeave.bind(this));
    },
    mouseEnter: function(evt) {
        evt.target.setAttribute('base-color', evt.target.getAttribute('material').color);
        evt.target.setAttribute('material', 'color', '#ff0');
    },
    mouseLeave: function(evt) {
        evt.target.setAttribute('material','color', evt.target.getAttribute('base-color'));
    },
    clickHandler: function (evt) {
        const buttons = document.querySelector('a-scene').systems['buttons'];
        switch (evt.target.id) {
            case 'add-connector':
                buttons.mode = ['connecting'];
                buttons.mode.push('select-first');
                break;
            case 'add-sphere':
                buttons.template = '#sphere-template'
                buttons.mode = ['adding'];
                break;
            case 'add-box':
                buttons.template = '#box-template'
                buttons.mode = ['adding'];
                break;
            case 'add-plane':
                buttons.template = '#plane-template'
                buttons.mode = ['adding'];
                break;
            case 'remove':
                buttons.mode = ['removing'];
                break;
            case 'move':
                buttons.mode = ['moving'];
                break;
            case 'edit':
                buttons.mode = ['editing'];
                break;
            case 'edit-color':
                buttons.mode = ['editing-color'];
                this.showColorPicker();
                break;
            case 'align':
                buttons.mode = ['aligning'];
                buttons.mode.push('select-first');
                break;
            default:

        }
        debug(buttons.mode);
    },

    showColorPicker: function () {
        function showColorPicker() {
            show('#color-picker');
        }

    }


});


