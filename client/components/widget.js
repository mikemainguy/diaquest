import {debug} from './debug';


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
    },
    mouseLeave: function(evt) {
        evt.target.removeAttribute('animation');
        evt.target.setAttribute('material','color', this.color);
    },
    clickHandler: function (evt) {
        document.querySelector('#sizer').setAttribute('visible', false);
        const buttons = document.querySelector('a-scene').systems['buttons'];
        buttons.first = null;
        const event = new Event('rigChanged');
        document.dispatchEvent(event);
        debug(evt.target.id);
        switch (evt.target.id) {
            case 'add-connector':
                buttons.mode = ['connecting'];
                buttons.mode.push('select-first');
                break;
            case 'add-cylinder':
                buttons.template = '#cylinder-template'
                buttons.mode = ['adding'];
                break;
            case 'resize':
                buttons.mode = ['resizing'];
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
                break;
            case 'edit-color':
                buttons.mode= ['edit-color'];
                showColorPicker();
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
            case 'copy':
                buttons.mode = ['copying'];
                break;
            case 'edit':
                buttons.mode = ['editing'];
                break;
            case 'joinConference':
                document.dispatchEvent(
                    new CustomEvent('connectSignalwire',
                        {detail: 'OK'}));
                break;
            case 'leaveConference':
                document.dispatchEvent(
                    new CustomEvent('disconnectSignalwire',
                        {detail: 'OK'}));
                break;
            case 'mute':
                document.dispatchEvent(
                    new CustomEvent('mute',
                        {detail: 'OK'}));
                break;
            case 'unmute':
                document.dispatchEvent(
                    new CustomEvent('unmute',
                        {detail: 'OK'}));
                break;
            default:

        }
        debug(buttons.mode);

    }


});

function hideMenu() {
    document.dispatchEvent( new CustomEvent('hideMenu', {detail: {id: '#bmenu'}}));
}
function showColorPicker() {
    document.dispatchEvent( new CustomEvent('showMenu', {detail: {id: '#color-picker', objects: '[color-swatch], .saveable'}}));
}