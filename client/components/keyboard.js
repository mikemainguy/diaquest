import {getHUDPosition, createUUID} from "./util";
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
            data.position = getHUDPosition();
            data.template = buttons.template;
            data.color = buttons.color;
            import('../firebase/firebase.js').then((module) => {
                module.writeEntity(data);
            });
        } else {
            data.id= buttons.first;
            import('../firebase/firebase.js').then((module) => {
                module.updateEntity(data);
            });
        }
        document.querySelector('#keyboard').setAttribute('super-keyboard', 'value', '');

    }
});




