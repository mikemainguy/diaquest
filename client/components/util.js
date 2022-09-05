export function getHUDPosition(distance) {
    let pos = new THREE.Vector3();
    const c = document.querySelector('#camera').object3D;
    c.getWorldPosition(pos);
    let dir = new THREE.Vector3();
    c.getWorldDirection(dir);
    dir.multiplyScalar(distance ? distance : -1);
    pos.add(dir);
    return pos;
}

export function show(id) {
    const obj = document.querySelector(id);
    obj.setAttribute('position', getHUDPosition(-1));
    obj.setAttribute('visible', true);
}