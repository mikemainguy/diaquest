export function createOrUpdateDom (entity) {
    const me = document.querySelector('.rig')

    if (!entity || !entity.template || !entity.id ||
        (me && me.getAttribute('id') === entity.id)) {
        return;
    }
    /*if (entity && entity.template && (entity.template.indexOf('animation') > -1)){
        return;
    }*/
    const scene = document.querySelector("a-scene");
    let exists = document.getElementById(entity.id);
    if (exists && entity.updater && (me.getAttribute('id') === entity.updater)) {
        return;
    }
    const ele = exists ? exists : document.createElement('a-entity');

    ele.setAttribute('template', 'src: ' + entity.template);
    ele.setAttribute('id', entity.id);
    const comp = ele.querySelector('[share-position]');
    if (entity.rotation || entity.position) {
        if (comp && comp.components && comp.components['share-position'] &&
            comp.components['share-position'].oldPosition) {
            comp.components['share-position'].pause();
            comp.components['share-position'].oldPosition = null;

        }
    }
    if (entity.rotation) {
        if (exists && ele.object3D && ele.getAttribute('stuff')) {
            const parent = ele.getAttribute('stuff').parent;
            if (parent && document.querySelector('#' + parent)) {
                ele.sceneEl.object3D.attach(ele.object3D);
                if (entity.template == '#user-template') {
                    const head = ele.querySelector('.head');
                    head.object3D.setRotationFromEuler(new THREE.Euler(
                        THREE.MathUtils.degToRad(entity.rotation.x),
                        THREE.MathUtils.degToRad(entity.rotation.y),
                        THREE.MathUtils.degToRad(entity.rotation.z)));
                } else {
                    ele.object3D.setRotationFromEuler(new THREE.Euler(
                        THREE.MathUtils.degToRad(entity.rotation.x),
                        THREE.MathUtils.degToRad(entity.rotation.y),
                        THREE.MathUtils.degToRad(entity.rotation.z)));
                }

                document.querySelector('#' + parent).object3D.attach(ele.object3D);
            } else {
                if (entity.template == '#user-template') {
                    const head = ele.querySelector('.head');
                    head.object3D.setRotationFromEuler(new THREE.Euler(
                        THREE.MathUtils.degToRad(entity.rotation.x),
                        THREE.MathUtils.degToRad(entity.rotation.y),
                        THREE.MathUtils.degToRad(entity.rotation.z)));
                } else {
                    ele.object3D.setRotationFromEuler(new THREE.Euler(
                        THREE.MathUtils.degToRad(entity.rotation.x),
                        THREE.MathUtils.degToRad(entity.rotation.y),
                        THREE.MathUtils.degToRad(entity.rotation.z)));
                }
            }

        } else {

            ele.setAttribute('rotation', entity.rotation);
        }

    }

    if (entity.position) {
        if (exists && ele.object3D && ele.object3D.position) {
            const loc = new THREE.Vector3(entity.position.x, entity.position.y, entity.position.z);
            ele.object3D.parent.worldToLocal(loc);
            ele.object3D.position.set(loc.x, loc.y, loc.z);
        } else {
            ele.setAttribute('position', entity.position);
        }

    }
    const scale = entity.scale ? entity.scale : '0.2 0.2 0.2';
    const image = entity.image ? entity.image : '';
    const color = entity.color ? entity.color : '#669';
    const text = entity.text ? entity.text : '';
    const parent = entity.parent ? entity.parent : '';
    switch (entity.template) {
        case '#user-template':
        case '#box-template':
        case '#plane-template':
        case '#pane-template':
        case '#cylinder-template':
        case '#light-template':
        case '#sphere-template':
            ele.setAttribute('stuff', 'text: ' + text
                + '; color: ' + color
                + '; scale: ' + scale
                + '; image: ' + image
                + '; parent: ' + parent);
            break;
        case '#connector-template':
            ele.setAttribute('stuff', 'text: ' + text + '; color: ' + color);
            ele.setAttribute('connector', 'startEl: #' + entity.first + "; endEl: #" + entity.second);
            break;
    }
    if (!exists) {
        scene.append(ele);
    }
    if (entity.rotation || entity.position) {
        if (comp && comp.components && comp.components['share-position'] &&
            comp.components['share-position'].oldPosition) {
            comp.components['share-position'].play();

        }
    }
}