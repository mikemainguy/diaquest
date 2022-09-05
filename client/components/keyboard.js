import {getHUDPosition} from "./util";
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
        document.querySelector('#keyboard').setAttribute('super-keyboard', value, '');
        const click = document.querySelector('#click').components.sound;
        click.stopSound();
        click.playSound();

    }
});


function createUUID() {
    return 'id' + ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}


