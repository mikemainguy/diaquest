import {signInWithCustomToken} from "firebase/auth";
import {getDb, getFbAuth, getProfile, afterSceneLoads} from './base';
import {getMediaPath, getAnimationPath, getEntityPath, getSessionPath} from "./paths";
import {shareUpdate, createEntity} from "./shareupdate";
import {writeUser} from "./firebaseuser";
import {createOrUpdateDom} from './firebasestuff';
import {
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    onValue,
    ref
} from "firebase/database";
const database = getDb();


async function setupApp(profile) {
    try {
        if (profile) {
            await signInWithCustomToken(getFbAuth(), profile.firebase_token);
        } else {
            //window.location.href = "/";
        }
        return profile;
    } catch (error) {
        console.log(error);
    }
    return null;
}

async function registerMedias(medias) {
    onValue(medias, (snapshot) => {
        const val = snapshot.val();
        const data = [];
        for (const media in val) {
            const mediaEntry =
                {
                    href: 'https://media.immersiveidea.com/' + media,
                    name: val[media].name,
                    mimetype: val[media].mimetype,
                    width: val[media].width,
                    height: val[media].height
                };
            data.push(mediaEntry);
        };
        document.querySelector('[mediamanager]').dispatchEvent(
            new CustomEvent('mediaUpdated',
                {detail: data}));
    });
}
const updateListener = (snapshot) => {
    afterSceneLoads(createOrUpdateDom, snapshot.val());
};
const removeListener = (snapshot) => {
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
        afterSceneLoads(writeUser, {database, createEntity, profile});

        const directoryRef = ref(database, 'directory/');
        onValue(directoryRef, (snapshot) => {
            document.dispatchEvent(
                new CustomEvent('directoryUpdate',
                    {
                        detail: {
                            htmlId: 'listing',
                            entries: snapshot.val()
                        }
                    }));
        });

        const privateDirectoryRef = ref(database, `dir/user_worlds/${profile.user.sub}/`);
        onValue(privateDirectoryRef, (snapshot) => {
            document.dispatchEvent(
                new CustomEvent('directoryUpdate',
                    {
                        detail: {
                            htmlId: 'privateListing',
                            entries: snapshot.val()
                        }
                    }));
        });
        const loc = window.location.pathname;
        if (loc.startsWith('/worlds')) {
            afterSceneLoads(registerMedias, ref(database, getMediaPath()));
            addListeners(ref(database, getEntityPath(null)));
            addListeners(ref(database, getSessionPath()));
            addListeners(ref(database, getAnimationPath()))
        }
    }
    if (typeof newrelic !== 'undefined') {
        newrelic.addPageAction('firebase db setup complete');
    }
}
function addListeners(entity) {
    onChildAdded(entity, updateListener);
    onChildRemoved(entity, removeListener);
    onChildChanged(entity, updateListener);
}
document.addEventListener('userloaded', initializeFirebase);
document.addEventListener('shareUpdate', shareUpdate);