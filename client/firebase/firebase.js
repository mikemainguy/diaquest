const axios = require('axios').default;

import {getAuth, signInWithCustomToken} from "firebase/auth";
import {initializeApp} from 'firebase/app';
import {sha512} from 'crypto-hash';


import {
    getDatabase,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    onValue,
    ref,
    remove,
    set,
    update
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

    const pathId = id == null ? '' : '/' + id;

    if (loc.length < 3) {
        return 'worlds/public/entities' + pathId;
    }
    switch (loc[1]) {
        case 'public':
            return 'worlds/public/entities' + pathId;
        case 'worlds':
            if (loc.length === 3) {
                const myLoc = decodeURIComponent(window.location).split('/').pop()
                return 'worlds/' + myLoc + '/entities' + pathId;
            } else {
                return 'worlds/public/entities' + pathId;
            }
        default:
            return 'worlds/public/entities' + pathId;
    }
}

async function getProfile() {
    try {
        const profile = await axios.get('/api/user/profile');
        return profile.data;
    } catch (err) {
        console.log(err);
        return null;
    }

}

async function setupApp(profile) {
    try {
        if (profile) {
            await signInWithCustomToken(auth, profile.firebase_token);
        } else {
            //window.location.href = "/";
        }
        return profile;
    } catch (error) {
        console.log(error);
    }
    return null;
}

async function getWorldList() {

}

async function initializeFirebase() {
    if (!VRLOCAL) {
        if (typeof newrelic !== 'undefined') {
            newrelic.addPageAction('initializing firebase');
        }
        const profile = await getProfile();
        if (profile == null) {
            return;
        }
        await setupApp(profile);

        const scene = document.querySelector('a-scene');
        if (scene && scene.hasLoaded) {
            writeUser(profile);
        } else {
            document.addEventListener('aframeReady', (evt) => {
                writeUser(profile)
            });
        }

        if (typeof newrelic !== 'undefined') {
            newrelic.addPageAction('firebase db setup');
        }
        const directoryRef = ref(database, 'directory/');
        onValue(directoryRef, (snapshot) => {
            document.dispatchEvent(
                new CustomEvent('directoryUpdate',
                    {detail: snapshot.val()}));

        });

        const loc = window.location.pathname;
        if (loc.startsWith('/worlds')) {
            const path = getDbPath(null);

            const entities = ref(database, path);

            onChildAdded(entities, (snapshot) => {
                const scene = document.querySelector('a-scene');
                if (scene && scene.hasLoaded) {
                    createOrUpdateDom(snapshot.val());
                } else {
                    document.addEventListener('aframeReady', (evt) => {
                        createOrUpdateDom(snapshot.val());
                    });
                }

            });

            onChildRemoved(entities, (snapshot) => {
                const scene = document.querySelector('a-scene');
                const ele = document.getElementById(snapshot.val().id);

                if (ele) {
                    if (!ele.classList.contains('rig')) {
                        ele.remove();
                    } else {
                        document.dispatchEvent(
                            new CustomEvent('disconnectSignalwire',
                                {detail: 'OK'}));

                    }

                }
            });
            onChildChanged(entities, (snapshot) => {
                if (scene && scene.hasLoaded) {
                    createOrUpdateDom(snapshot.val());
                } else {
                    document.addEventListener('aframeReady', (evt) => {
                        createOrUpdateDom(snapshot.val());
                    });
                }
            });
        }
    }
}
initializeFirebase();

export function writeUser(profile) {
    if (profile && profile.user && profile.user.sid
        && profile.user.sub && profile.user.email) {
        sha512(profile.user.sid).then((result) => {
            profile.user.last_seen = new Date().toUTCString();
            const id = 'session' + result;
            update(ref(database, 'users/' + profile.user.sub), profile);


            const rig = document.querySelector('.rig');
            if (rig) {
                rig.setAttribute('id', id);
                createEntity({
                    id: id,
                    last_seen: new Date().toUTCString(),
                    position: rig.object3D.position,
                    rotation: rig.getAttribute('rotation'),
                    text: profile.user.email,
                    template: "#user-template"
                });
            } else {
                console.error('rig not found');
            }
        });
    } else {
        console.error('user info appears to be not logged in');
    }

    const directory = ref(database, "/users/" + profile.user.sub + "/directory/worlds");

    onValue(directory, (snap) => {
        const el = document.getElementById('directory');
    });
}


document.addEventListener('shareUpdate', function (evt) {
    if (!evt || !evt.detail || !evt.detail.id || evt.detail.id == null) {
        console.error("Missing Id to update, skipping update");
        return;
    }
    if (VRLOCAL) {
        const el = document.getElementById(evt.detail.id);
        evt.detail.updater = document.querySelector('.rig').getAttribute('id');
        createOrUpdateDom(evt.detail);
    } else {
        if (evt.detail.remove === true) {
            if (evt.detail && evt.detail.id) {
                const id = evt.detail.id;
                const children = document.querySelectorAll('[stuff]');
                const scene = document.querySelector('a-scene');
                for (const c of children) {
                    if (c.components['stuff'].data.parent == id) {
                        c.setAttribute('stuff', 'parent', '');
                    }
                }
                removeEntity(evt.detail.id);
                return;
            } else {
                console.error("cannot remove " + JSON.stringify(evt.detail));
            }

        }
        const el = document.getElementById(evt.detail.id);
        evt.detail.updater = document.querySelector('.rig').getAttribute('id');

        if (el) {
            updateEntity(evt.detail);
        } else {
            createEntity(evt.detail);
        }

    }


});

function updateEntity(data) {
    try {
        const path = getDbPath(data.id);
        update(ref(database, path), data);
    } catch (err) {
        console.log(err);
    }


}

function createEntity(data) {
    try {
        const path = getDbPath(data.id);
        set(ref(database, path), data);
    } catch (err) {
        console.log(err);
    }
}

function removeEntity(id) {
    try {
        if (id) {
            const path = getDbPath(id);
            remove(ref(database, path));
        } else {
            console.error("no id passed to remove");
        }

    } catch (err) {
        console.log(err);
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
    const parent = entity.parent ? entity.parent : '';
    switch (entity.template) {
        case '#user-template':
        case '#box-template':
        case '#pane-template':
        case '#cylinder-template':
        case '#light-template':
        case '#sphere-template':
            ele.setAttribute('stuff', 'text: ' + text + '; color: ' + color + '; scale: ' + scale + '; parent: ' + parent);
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
