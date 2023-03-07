import {debug} from './debug';
AFRAME.registerSystem('widget', {
    init: function () {
        this.mode = [];
    }
});

AFRAME.registerComponent('widget', {
    schema: {
        method: {type: 'string'},
        label: {type: 'string', default: ''},
        template: {type: 'string', default: ''}
    },
    init: function () {
        this.color = '#11a';
        this.el.setAttribute('material', 'color', this.color);
        this.el.setAttribute('sound__0', 'src: url(/assets/sounds/KeyInLow.mp3); volume: 0.3; on: mouseenter; poolSize: 5');
        this.el.setAttribute('sound__1', 'src: url(/assets/sounds/ButtonClick.mp3); volume: 0.8; on: mousedown; poolSize: 5');
        const label = document.createElement('a-text');
        label.setAttribute('position', '0 .35 .05');
        label.setAttribute('value', this.data.label);
        label.setAttribute('align', 'center');
        label.setAttribute('wrap-count', '10');
        label.setAttribute('width', '1');
        this.el.appendChild(label);
    },
    events: {
        mouseenter: function(evt) {
            const target = evt.target;
            if (!target.getAttribute('animation')) {
                target.setAttribute('animation',
                    'from: #ff2; to: #cc2; property: material.color; loop: true; dir: alternate; dur: 500');
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
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction(evt.target.id);
            }
            buttonState.mode = [this.data.method];
            buttonState.template = this.data.template;
            switch (this.data.method) {
                case 'add-light':
                    buttonState.template = '#light-template'
                    buttonState.mode = ['adding'];
                    break;
                case 'add-animationmanager':
                    buttonState.template = '#animationmanager-template'
                    buttonState.mode = ['adding'];
                    break;
                case 'exit':
                    this.el.sceneEl.exitVR();
                    break;
                case 'close':
                    break;
                case 'edit-image':
                    this.el.emit('showMenu', {id: '#image-picker', objects: '[image-swatch], .saveable'});
                    break;
                case 'edit-color':
                    this.el.emit('showMenu', {id: '#color-picker', objects: '[color-swatch], .saveable'});
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
                default:
                    this.el.emit(this.data.method, {detail: 'OK'});

            }
            this.el.emit('buttonstate', buttonState, true);
        }
    },
});