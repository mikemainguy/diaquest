import {openDB} from 'idb';
async function startup() {
    const myDb = await openDB('immersive', 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            db.createObjectStore('entities');
        }
    });
    const keys = await myDb.getAllKeys('entities');
    for (const id of keys) {
        const data = await myDb.get('entities', id);
        createOrUpdateDom(data);
    }
}

async function createEntity(data) {
    const myDb = await openDB('immersive', 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            db.createObjectStore('entities');
        }
    });
    if (data && data.id && data.id != null) {
        await myDb.put('entities', data, data.id);
    }

}
async function removeEntity(id) {
    const myDb = await openDB('immersive', 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            db.createObjectStore('entities');
        }
    });
    await myDb.delete('entities', id);
}

document.addEventListener('shareUpdate', function (evt) {
    if (!evt.detail && !evt.detail.id) {
        console.error("Missing Id to update " + JSON.stringify(evt.detail));
        return;
    }
    if (VRLOCAL) {
        const el = document.getElementById(evt.detail.id);
        evt.detail.updater = document.querySelector('.rig').getAttribute('id');

        if (evt.detail.remove === true) {
            removeEntity(evt.detail.id);
        } else {
            if (el) {
                updateEntity(evt.detail);
            } else {
                createEntity(evt.detail);
            }

        }
        createOrUpdateDom(evt.detail);

    }
});

async function updateEntity(data) {
    const myDb = await openDB('immersive', 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            db.createObjectStore('entities');
        }
    });
    if (data && data.id && data.id != null) {
        const myObj = await myDb.get('entities', data.id);
        Object.assign(myObj, data);
        await myDb.put('entities', myObj, data.id);
    }

}
function createOrUpdateDom(entity) {
    const me = document.querySelector('.rig')

    if (!entity || !entity.template || !entity.id ||
        (me && me.getAttribute('id') === entity.id)) {
        return;
    }
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
        ele.setAttribute('rotation', entity.rotation);
    }

    if (entity.position) {
        ele.setAttribute('position', entity.position);
    }
    const scale = entity.scale ? entity.scale : '0.2 0.2 0.2';

    const color = entity.color ? entity.color : '#669';
    const text = entity.text ? entity.text : '';
    switch (entity.template) {
        case '#user-template':
        case '#box-template':
        case '#pane-template':
        case '#cylinder-template':
        case '#light-template':
        case '#sphere-template':
            ele.setAttribute('stuff', 'text: ' + text + '; color: ' + color + '; scale: ' + scale);
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
const sc = document
    .querySelector('a-scene');
if (sc.hasLoaded){
    startup().then(()=> {
        console.log('data loaded after scene');
    });
} else {
    sc.addEventListener('loaded', function() {
        startup().then(() => {
            console.log('localdb loaded before scene');
        });
    })
}

