export function getMenuPosition(distance) {
    let pos = new THREE.Vector3();
    const c = document.querySelector('#camera').object3D;
    c.getWorldPosition(pos);
    let dir = new THREE.Vector3();
    c.getWorldDirection(dir);
    dir.multiplyScalar(distance ? distance : -1);
    dir.y -= .6;
    dir.x -= .4;
    pos.add(dir);
    return pos;
}

export function showMenu() {
    const obj = document.querySelector('#menu');
    obj.setAttribute('visible', true);
    const hands = document.querySelectorAll('[raycaster]');
    for (const hand of hands) {
        hand.setAttribute('raycaster', 'objects', '#menu a-plane[mixin=menuPlane]');
    }
}
export function changeRaycaster(newObjects) {
    const hands = document.querySelectorAll('[raycaster]');
    for (const hand of hands) {
        hand.setAttribute('raycaster', 'objects', newObjects);
    }
}
export function showColorPicker() {
    const obj = document.querySelector('#color-picker');
    obj.setAttribute('visible', true);
    changeRaycaster('#menu a-plane[color-swatch]');
}

export function hide(id) {
    const obj = document.querySelector(id);
    obj.setAttribute('visible', false);
    changeRaycaster('.saveable');
}

export function createUUID() {
    return 'id' + ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

export function getSystem(systemName) {
    return document.querySelector('a-scene').systems[systemName];
}
export function getCurrentMode() {
    return getSystem('buttons').mode.slice(-1)[0];
}
export function initSound() {
    const a = document.querySelector('#ambient');
    if (a) {
        const ambient = a.components.sound;
        if (ambient.loaded && ambient.listener.context.state != 'running') {
            ambient.playSound();
        }
    }
}
