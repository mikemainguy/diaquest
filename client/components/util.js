export function getMenuPosition(distance) {
    let pos = new THREE.Vector3();
    const c = document.getElementById('camera').object3D;
    c.getWorldPosition(pos);
    let dir = new THREE.Vector3();
    c.getWorldDirection(dir);
    dir.multiplyScalar(distance ? distance : -1);
    dir.y -= .6;
    dir.x -= .4;
    pos.add(dir);
    return pos;
}

export function changeRaycaster(newObjects) {
    const hands = document.querySelectorAll('[raycaster]');
    for (const hand of hands) {
        hand.setAttribute('raycaster', 'objects', newObjects);
    }
}

export function round(vec, amount) {
    const v = new THREE.Vector3(vec.x, vec.y, vec.z);
    v.divideScalar(amount)
        v.round()
            v.multiplyScalar(amount);
    return v;
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
    const a = document.getElementById('ambient');
    if (a) {
        const ambient = a.components.sound;
        if (ambient.loaded && ambient.listener.context.state != 'running') {
            ambient.playSound();
        }
    }
}
