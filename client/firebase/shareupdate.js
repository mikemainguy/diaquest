import {createOrUpdateDom} from "./firebasestuff";
import {onDisconnect, ref, remove, set, update} from "firebase/database";
import {getDb} from "./base";
import {getEntityPath, getSessionPath} from "./paths";
const database = getDb();
export function shareUpdate(evt) {
    if (!evt || !evt.detail || !evt.detail.id || evt.detail.id == null) {
        console.error("Missing Id to update, skipping update");
        return;
    }
    if (VRLOCAL) {
        evt.detail.updater = document.querySelector('.rig').getAttribute('id');
        createOrUpdateDom(evt.detail);
    } else {
        if (evt.detail.remove === true) {
            if (evt.detail && evt.detail.id) {
                const id = evt.detail.id;
                const children = document.querySelectorAll('[stuff]');
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
}
export function updateEntity(data) {
    try {
        const path = getEntityPath(data.id);
        if (document.getElementById(data.id).classList.contains('rig')) {
            const userRef = ref(database, getSessionPath(data.id));
            update(userRef, data);
        } else {
            update(ref(database, path), data);
        }

    } catch (err) {
        console.log(err);
    }
}
export function removeEntity(id) {
    try {
        if (id) {
            const path = getEntityPath(id);
            remove(ref(database, path));
        } else {
            console.error("no id passed to remove");
        }
    } catch (err) {
        console.log(err);
    }
}
export function createEntity(data) {
    try {
        const path = getEntityPath(data.id);
        if (data.template == '#user-template') {
            const userRef = ref(database, getSessionPath(data.id));
            onDisconnect(userRef).remove();
            set(userRef, data);
        } else {
            set(ref(database, path), data);
        }
    } catch (err) {
        console.log(err);
    }
}