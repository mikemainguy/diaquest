import {createUUID} from "./util";
import {debug} from "./debug";

AFRAME.registerSystem('key-listen', {
    init: function () {
        this.text = '';
        this.id = null;
        document.addEventListener('superkeyboardinput', this.superkeyboardinput.bind(this));
    },
    superkeyboardinput: function (event) {
        const data = { text: event.detail.value, id: event.detail.elId};
        document.getElementById(data.id).setAttribute('stuff', 'text', data.text);
        document.dispatchEvent( new CustomEvent('shareUpdate', {detail: data}));
        document.getElementById('keyboard').setAttribute('3d-keyboard', 'value', '');
        const hands = document.querySelectorAll('[raycaster]');
        for (const hand of hands) {
            hand.setAttribute('raycaster', 'objects', '.saveable');
        }
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

