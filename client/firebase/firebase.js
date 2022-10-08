
const axios = require('axios').default;

import {getAuth, signInWithCustomToken} from "firebase/auth";
import {initializeApp} from 'firebase/app';
import {sha512} from 'crypto-hash';

import {
    getDatabase,
    remove,
    ref,
    set,
    update,
    onChildRemoved,
    onChildAdded,
    onChildChanged
} from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyAEkQdc91Hnjek1v-KlXiYLf5fHN_pKB_E",
    authDomain: "metastore-37b60.firebaseapp.com",
    databaseURL: "https://metastore-37b60-default-rtdb.firebaseio.com",
    projectId: "metastore-37b60",
    storageBucket: "metastore-37b60.appspot.com",
    messagingSenderId: "312692319255",
    appId: "1:312692319255:web:6aa206a92440a771a42852",
    measurementId: "G-26SWC62X80"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

function getDbPath(id) {
    const loc = window.location.pathname.split('/');

    const pathId = id == null? '': '/'+id;
    if (loc.length < 3) {
        return 'public/entities' + pathId;
    }
    switch (loc[1]) {
        case 'public':
            return 'public/entities'+pathId;
        case 'worlds':
            if (loc.length ===3) {
                return 'worlds/' + loc[2] + '/entities' + pathId;
            } else {
                return 'public/entities' + pathId;
            }
        default:
            return 'public/entities' + pathId;
    }
}


async function setupApp() {
    try {
        const profile = await axios.get('/api/user/profile');
        await signInWithCustomToken(auth, profile.data.firebase_token);
        return profile.data;
    } catch (error) {
        console.log(error);
    }
    return null;
}
if (!VRLOCAL) {
    setupApp().then((profile) => {
        writeUser(profile);
    });

}

export function writeUser(profile) {
    sha512(profile.user.sid).then((result) => {
        profile.user.last_seen = new Date().toUTCString();
        const id = 'session' + result
        set(ref(database, 'users/' + profile.user.sub), profile);
        const rig = document.querySelector('.rig');
        rig.setAttribute('id', id);
        createEntity({
            id: id,
            last_seen: new Date().toUTCString(),
            position: rig.object3D.position,
            rotation: rig.getAttribute('rotation'),
            text: profile.user.email,
            template: "#user-template"
        });
    });
}

document.addEventListener('shareUpdate', function (evt) {
    if (VRLOCAL) {
        const el = document.querySelector('#' + evt.detail.id);
        evt.detail.updater = document.querySelector('.rig').getAttribute('id');
        createOrUpdateDom(evt.detail);
    } else {
        if (evt.detail.remove === true) {
            removeEntity(evt.detail.id);
            return;
        }
        const el = document.querySelector('#' + evt.detail.id);
        evt.detail.updater = document.querySelector('.rig').getAttribute('id');
        if (el) {
            updateEntity(evt.detail);
        } else {
            createEntity(evt.detail);
        }

    }


});

function updateEntity(data) {
    update(ref(database, getDbPath(data.id)), data);
}

function createEntity(data) {
    set(ref(database, getDbPath(data.id)), data);
}

function removeEntity(id) {
    remove(ref(database, getDbPath(id)));
}

if (!VRLOCAL) {
    const entities = ref(database, getDbPath(null));
    onChildAdded(entities, (snapshot) => {
        createOrUpdateDom(snapshot.val());
    });

    onChildRemoved(entities, (snapshot) => {
        const ele = document.querySelector('#' + snapshot.val().id);
        if (ele) {
            ele.remove();
        }
    });
    onChildChanged(entities, (snapshot) => {
        createOrUpdateDom(snapshot.val());
    });

}

function createOrUpdateDom(entity) {
    const me = document.querySelector('.rig')

    if (!entity || !entity.template || !entity.id ||
        (me && me.getAttribute('id') === entity.id)) {
        return;
    }
    const scene = document.querySelector("a-scene");
    let exists = document.querySelector('#' + entity.id);
    if (exists && entity.updater && (me.getAttribute('id') === entity.updater)) {
        return;
    }
    const ele = exists ? exists : document.createElement('a-entity');

    ele.setAttribute('template', 'src: ' + entity.template);
    ele.setAttribute('id', entity.id);
    const comp =ele.querySelector('[share-position]');

    if (entity.rotation || entity.position) {
        if ( comp && comp.components && comp.components['share-position'] &&
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

    const color = entity.color ? entity.color : '#669';
    const text = entity.text ? entity.text : '';
    switch (entity.template) {
        case '#user-template':
        case '#box-template':
        case '#pane-template':
        case '#cylinder-template':
        case '#sphere-template':
            window.setTimeout(function () {
                ele.setAttribute('stuff', 'text: ' + text + '; color: ' + color);
            }, 200);

            break;
        case '#connector-template':
            window.setTimeout(function () {
                ele.setAttribute('stuff', 'text: ' + text + '; color: ' + color);
                ele.setAttribute('connector', 'startEl: #' + entity.first + "; endEl: #" + entity.second);
            }, 200)
            break;
    }

    if (!exists) {
        scene.appendChild(ele);
    }
    if (entity.rotation || entity.position) {
        if ( comp && comp.components && comp.components['share-position'] &&
            comp.components['share-position'].oldPosition) {
            comp.components['share-position'].play();

        }
    }
}
