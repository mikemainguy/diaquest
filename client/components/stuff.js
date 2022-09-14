import {debug} from './debug';
import {createUUID, getHUDPosition} from "./util";

AFRAME.registerComponent('stuff', {
    schema: {
        text: {type: 'string'},
        color: {type: 'string'}
    },
    init: function () {
        this.el.addEventListener("click", this.clickHandler.bind(this));
        this.el.addEventListener("mouseenter", this.mouseEnter.bind(this));
        this.el.addEventListener("mouseleave", this.mouseLeave.bind(this));

    },
    mouseEnter: function (evt) {
        const obj = evt.target;
        obj.setAttribute('animation',  "property: material.color; from: #cc2; to: #ff2; dur: 200; loop: true")
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
                document.dispatchEvent( new CustomEvent('shareUpdate', {detail: {id: obj.id, color: newColor}}));
                break;
            case 'editing':
                buttons.first = obj.id;
                buttons.mode.push('typing');
                const keyboard = document.querySelector('#keyboard');
                keyboard.setAttribute('position', getHUDPosition());
                keyboard.setAttribute('super-keyboard', 'show', true);
                keyboard.setAttribute('super-keyboard', 'value', this.data.text);
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
                        if (!obj.id && buttons.second) {
                            const data = {
                                id: buttons.second,
                                position: document.querySelector(buttons.second).getAttribute('position')
                            };
                            document.dispatchEvent(
                                new CustomEvent('shareUpdate',
                                    {detail: data}));
                            buttons.second = null;
                            buttons.mode.pop();
                        } else {
                            if (obj.id) {
                                buttons.second = obj.id;
                            }
                        }
                        break;
                }
        }
    },
    update: function () {
        if (this.el.querySelector('a-plane')) {
            if (this.data.text) {
                this.el.querySelector('a-plane').setAttribute('visible', true);
                this.el.querySelector('a-plane').setAttribute('text', 'value: ' + this.data.text);
            } else {
                this.el.querySelector('a-plane').setAttribute('visible', false);
            }

        }
        if (this.el.querySelector('.saveable')) {
            this.el.querySelector('.saveable').setAttribute('base-color', this.data.color);
            this.el.querySelector('.saveable').setAttribute('material', 'color', this.data.color);
        }
    }
});
