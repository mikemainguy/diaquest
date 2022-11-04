import {createUUID} from "./util";
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
            data.position = getPosition(-2);
            data.template = buttons.template;
            data.color = buttons.color;
            document.dispatchEvent(
                new CustomEvent('shareUpdate',
                    {detail: data}));
            buttons.mode.pop();
        } else {
            data.id = buttons.first;
            document.getElementById(data.id).setAttribute('stuff', 'text', data.text);
            document.dispatchEvent( new CustomEvent('shareUpdate', {detail: data}));
            buttons.mode.pop();
        }
        document.getElementById('keyboard').setAttribute('3d-keyboard', 'value', '');
        const hands = document.querySelectorAll('[raycaster]');
        for (const hand of hands) {
            hand.setAttribute('raycaster', 'objects', '.saveable');
        }


        debug(buttons.mode);

    }
});
function getPosition(distance)
{
    let pos = new THREE.Vector3();
    const c = document.getElementById('camera').object3D;
    c.getWorldPosition(pos);
    let dir = new THREE.Vector3();
    c.getWorldDirection(dir);
    dir.multiplyScalar(distance ? distance : -1);
    dir.y -= 1.1;

    pos.add(dir);
    return pos;
}

