import {debug} from './debug';
import {createUUID, getMenuPosition} from "./util";

AFRAME.registerComponent('stuff', {
    schema: {
        text: {type: 'string'},
        color: {type: 'string'},
        scale: {type: 'vec3', default: '1 1 1'}
    },
    init: function () {
        this.el.addEventListener("click", this.clickHandler.bind(this));
        this.el.addEventListener("mouseenter", this.mouseEnter.bind(this));
        this.el.addEventListener("mouseleave", this.mouseLeave.bind(this));

    },
    tick: function(time, timeDelta) {

    },
    mouseEnter: function (evt) {
        const obj = evt.target;
        obj.setAttribute('animation',  "property: material.color; from: #cc2; to: #ff2; dir: alternate; dur: 500; loop: true")
        //obj.setAttribute('material', 'wireframe: true');

    },
    mouseLeave: function (evt) {
        const obj = evt.target;
        obj.setAttribute('material', 'color', this.data.color);
        obj.removeAttribute('animation');


        //obj.setAttribute('material', 'wireframe: false');
    },
    clickHandler: function (evt) {
        const buttons = document.querySelector('a-scene').systems['buttons'];

        const obj = evt.target.closest('[template]');
        debug(obj.id);
        const id = obj.id;
        switch (buttons.mode.slice(-1)[0]) {
            case 'removing':
                document.dispatchEvent( new CustomEvent('shareUpdate', {detail: {id: obj.id, remove: true}}));
                break;
            case 'edit-color':
                const newColor = document.querySelector('a-scene').systems['color-picker'].color;
                this.data.color = newColor;
                evt.target.setAttribute('material', 'color', this.data.color);
                document.dispatchEvent( new CustomEvent('shareUpdate', {detail: {id: obj.id, color: newColor}}));
                break;
            case 'resizing':
                buttons.first = obj.id;
                buttons.mode.push('change-size');

                break;
            case 'editing':
                buttons.first = obj.id;
                buttons.mode.push('typing');
                const keyboard = document.querySelector('#keyboard');
                keyboard.setAttribute('position', getMenuPosition());
                keyboard.setAttribute('super-keyboard', 'show', true);
                keyboard.setAttribute('super-keyboard', 'value', this.data.text);
                const hands = document.querySelectorAll('[raycaster]');
                for (const hand of hands) {
                    hand.setAttribute('raycaster', 'objects', '.keyboardRaycastable');
                }

                keyboard.emit('show');
                break;
            case 'moving':
                buttons.first = obj.id;
                const event = new Event('rigChanged');
                document.dispatchEvent(event);
                break;
            case 'select-first':
                buttons.first = obj.id;
                buttons.mode.push('select-second');
                break;
            case 'select-second':
                switch (buttons.mode[0]) {
                    case 'connecting':
                        const data = {
                            id: createUUID(),
                            first: buttons.first,
                            second: obj.id,
                            text: '',
                            color: buttons.color,
                            template: '#connector-template'
                        }
                        document.dispatchEvent(
                            new CustomEvent('shareUpdate',
                                {detail: data}));

                        buttons.mode.pop();
                        break;
                    case 'aligning':

                        break;
                }
        }
    },
    update: function () {
        const textDisplay = this.el.querySelector('a-plane');
        if (textDisplay) {
            if (this.data.text) {
                textDisplay.setAttribute('visible', true);
                textDisplay.setAttribute('text', 'value', this.data.text);
            } else {
                textDisplay.setAttribute('visible', false);
            }

        }
        const saveable = this.el.querySelector('.saveable');
        if (saveable) {
            saveable.setAttribute('scale', this.data.scale);
            saveable.setAttribute('material', 'color', this.data.color);
        }
    }
});
