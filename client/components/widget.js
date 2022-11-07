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
        document.getElementById('sizer').setAttribute('visible', false);
        //const buttons = document.querySelector('a-scene').systems['buttons'];
        const buttonState = {}
        buttonState.first = null;
        const event = new Event('rigChanged');
        document.dispatchEvent(event);
        debug(evt.target.id);
        newrelic.addPageAction(evt.target.id);
        switch (evt.target.id) {
            case 'add-connector':
                buttonState.mode = ['connecting', 'select-first'];
                break;
            case 'add-cylinder':
                buttonState.template = '#cylinder-template'
                buttonState.mode = ['adding'];
                break;
            case 'resize':
                buttonState.mode = ['resizing'];
                break;
            case 'add-sphere':
                buttonState.template = '#sphere-template'
                buttonState.mode = ['adding'];
                break;
            case 'add-box':
                buttonState.template = '#box-template'
                buttonState.mode = ['adding'];
                break;
            case 'close':
                break;
            case 'edit-color':
                buttonState.mode= ['edit-color'];
                this.el.emit('showMenu', {id: '#color-picker', objects: '[color-swatch], .saveable'});
                break;
            case 'add-plane':
                buttonState.mode = ['adding'];
                break;
            case 'remove':
                buttonState.mode = ['removing'];
                break;
            case 'move':
                buttonState.mode = ['moving'];
                break;
            case 'copy':
                buttonState.mode = ['copying'];
                break;
            case 'edit':
                buttonState.mode = ['editing'];
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
        this.el.emit('buttonstate', buttonState, true);
    }
});