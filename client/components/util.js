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

export function show(id, distance) {
    const obj = document.querySelector(id);
    obj.setAttribute('visible', true);
    const hands = document.querySelectorAll('[raycaster]');
    for (const hand in hands) {
        hand.setAttribute('raycaster', 'objects', 'id > a-plane');
    }

}

export function hide(id) {
    const obj = document.querySelector(id);
    obj.setAttribute('visible', false);
    const hands = document.querySelectorAll('[raycaster]');
    for (const hand in hands) {
        hand.setAttribute('raycaster', 'objects', '.saveable');
    }

}

export function createUUID() {
    return 'id' + ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}
