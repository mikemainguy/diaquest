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

export function exportGLB() {

    const exporter = new THREE.GLTFExporter();
    const nodes = Array.from(document.querySelectorAll('[stuff]').values());
    const nodeMap = nodes.map(x => x.object3D);
// Parse the input and generate the glTF output
    exporter.parse(
        nodeMap,
        // called when the gltf has been generated
        function (gltf) {
            console.log(gltf);
            //let myJson = gltf
            let element = document.createElement('a');
            element.setAttribute('href',
                URL.createObjectURL(new Blob([gltf],
                    {type: 'model/gltf-binary'})));
            element.setAttribute('download', 'model.glb');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        function (err) {
            console.log('error ' + err);
        },

        {
            "binary": true,
            forcePowerOfTwoTextures: true,
            onlyVisible: true,
            embedImages: true,
            forceIndices: true
        }
    );

}

export function changeRaycaster(newObjects) {
    const hands = document.querySelectorAll('[raycaster]');
    for (const hand of hands) {
        hand.setAttribute('raycaster', 'objects', newObjects);
    }
}
export function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
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
    const sys = getSystem('buttons');
    if (sys && sys.mode) {
        return getSystem('buttons').mode.slice(-1)[0];
    } else {
        return null;
    }


}

export function initSound() {
    const a = document.getElementById('ambient');
    if (a) {
        const ambient = a.components.sound;
        if (ambient.loaded && ambient.pool.children.length > 0) {
            for (const audio of ambient.pool.children) {
                if (!audio.isPlaying) {
                    ambient.playSound();
                }
            }
        }
    }
}
