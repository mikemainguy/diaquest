import {debug} from './debug';


AFRAME.registerSystem('widget', {
    init: function () {
        this.mode = [];

    }
});

AFRAME.registerComponent('widget', {
    schema: {
        method: {type: 'string'},
        label: {type: 'string', default: ''}
    },
    init: function () {
        this.color = '#11a';
        this.el.setAttribute('material', 'color', this.color);
        const label = document.createElement('a-text');
        label.setAttribute('position', '0 .4 .041');
        label.setAttribute('value', this.data.label);
        label.setAttribute('wrapCount', 5);
        label.setAttribute('width', 2);
        this.el.appendChild(label);
    },
    events: {
        mouseenter: function(evt) {
            const target = evt.target;
            if (!target.getAttribute('animation')) {
                target.setAttribute('animation', 'from: #ff2; to: #cc2; property: material.color; loop: true; dir: alternate; dur: 500');
            }
        },
        mouseleave: function(evt) {
            evt.target.removeAttribute('animation');
            evt.target.setAttribute('material','color', this.color);
        },
        click: function (evt) {
            document.getElementById('sizer').setAttribute('visible', false);
            const buttonState = {}
            buttonState.first = null;
            debug(this.data.method);
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction(evt.target.id);
            }
            switch (this.data.method) {
                case 'align':
                    buttonState.mode = ['aligning'];
                    break;
                case 'add-connector':
                    buttonState.mode = ['connecting', 'select-first'];
                    break;
                case 'add-cylinder':
                    buttonState.template = '#cylinder-template'
                    buttonState.mode = ['adding'];
                    break;
                case 'exit':
                    this.el.sceneEl.exitVR();
                    break;
                case 'grouping':
                    buttonState.mode = ['grouping'];
                    break;
                case 'resize':
                    buttonState.mode = ['resizing'];
                    break;
                case 'add-sphere':
                    buttonState.template = '#sphere-template'
                    buttonState.mode = ['adding'];
                    break;
                case 'add-plane':
                    buttonState.template = '#plane-template'
                    buttonState.mode = ['adding'];
                    break;
                case 'add-box':
                    buttonState.template = '#box-template'
                    buttonState.mode = ['adding'];
                    break;
                case 'add-light':
                    buttonState.template = '#light-template'
                    buttonState.mode = ['adding'];
                    break;
                case 'close':
                    break;
                case 'edit-image':
                    buttonState.mode= ['edit-image'];
                    this.el.emit('showMenu', {id: '#image-picker', objects: '[image-swatch], .saveable'});
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
    },



});