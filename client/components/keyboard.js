import {getMenuPosition, createUUID} from "./util";
import {debug} from "./debug";

AFRAME.registerSystem('key-listen', {
    init: function () {
        this.text = '';
        this.id = null;
        document.addEventListener('superkeyboardinput', this.superkeyboardinput.bind(this));
    },
    superkeyboardinput: function (event) {
        const buttons = document.querySelector('a-scene').systems['buttons'];
        const data = { text: event.detail.value};
        if (buttons.first == null) {
            data.id = createUUID();
            data.position = getMenuPosition();
            data.template = buttons.template;
            data.color = buttons.color;
            document.dispatchEvent(
                new CustomEvent('shareUpdate',
                    {detail: data}));
            buttons.mode.pop();
        } else {
            data.id = buttons.first;
            document.dispatchEvent( new CustomEvent('shareUpdate', {detail: data}));
            buttons.mode.pop();
        }
        document.querySelector('#keyboard').setAttribute('super-keyboard', 'value', '');
        debug(buttons.mode);

    }
});




