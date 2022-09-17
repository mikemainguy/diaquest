import {debug} from './debug';
import {show, hide} from './util';

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
            target.setAttribute('animation', 'from: #ff2; to: #cc2; property: material.color; loop: true; direction: alternate; dur: 200');
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
            case 'close':
                hide('#menu');
                break;
            case 'edit-color':
                buttons.mode= ['edit-color'];
                show('#color-picker', -0.6);
                break;
            case 'add-plane':
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
            case 'align':
                buttons.mode = ['aligning'];
                buttons.mode.push('select-first');
                break;
            default:

        }
        debug(buttons.mode);
    }


});


