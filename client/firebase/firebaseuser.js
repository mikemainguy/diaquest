import {sha512} from "crypto-hash";
import {ref, update} from "firebase/database";

export function writeUser (input) {
    const profile = input.profile;
    const database = input.database;
    const createEntity = input.createEntity;
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
}
