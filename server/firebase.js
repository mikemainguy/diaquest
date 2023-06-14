const env = require('./env');
const {logger} = require('./logging');
const admin = require("firebase-admin");
const {getAuth} = require("firebase-admin/auth");
const serviceAccount = {
    "type": "service_account",
    "project_id": "immersive-idea",
    "private_key_id": "f12539504e640144ca931679e4e12581c164a40f",
    "private_key": env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-iuh9c@immersive-idea.iam.gserviceaccount.com",
    "client_id": "106441066426901632156",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-iuh9c%40immersive-idea.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://immersive-idea-default-rtdb.firebaseio.com/"
});
const saveNewRelic = async (user, token, account) => {
    const db = admin.database();
    const ref = db.ref('/users/' + user)
    await ref.update({"newrelic_token": token, "newrelic_account": account});
}
const getUser = async (user) => {
    const db = admin.database();
    const ref = db.ref('/users/' + user);
    const data = await ref.once('value');
    return data.val();
}
const createWorld = async function (world, owner, publicFlag) {
    try {
        const db = admin.database();
        const ref = db.ref('/worlds/' + world);
        const val = await ref.once('value');
        if (!val.exists()) {
            await ref.set({"owner": owner, "public": publicFlag});
            const dirref = db.ref('/directory/' + world);
            await dirref.set({"owner": owner, "public": publicFlag, "name": world});
        } else {
            logger.warn(world + " Already Exists");
            return ({"status": world + " Already Exists"});
        }

    } catch (e) {
        return ({"status": JSON.stringify(e)});
    }

    return ({"status": "OK"});
}
const updateJira = async function (world, type, data) {
    const db = admin.database();
    const dirref = db.ref(`/worlds/${world}/jira/${type}/${data.id}`);
    dirref
        .update(data)
        .then((evt) => {
            console.log(evt);
        });
}
const getJiraConfig = async function (world) {
    const db = admin.database();
    const dirref = db.ref(`/worlds/${world}/jira/config`);
    const ref = await dirref.once('value');
    if (ref.exists) {
        if (ref.val().webhookkey) {
            return ref.val();
        } else {
            return null;
        }
    } else {
        return null;
    }
}
const getNewRelicConfig = async function (world) {
    const db = admin.database();
    const dirref = db.ref(`/worlds/${world}/newRelic/config`);
    const ref = await dirref.once('value');
    if (ref.exists) {
        const val = ref.val();
        if (val.newrelic_account && val.newrelic_key) {
            return val;
        } else {
            return null;
        }
    } else {
        return null;
    }
}
const getWorld = async function(worldId) {
    const db = admin.database();
    const dirref = db.ref('/worlds/' + worldId);
    const data = await dirref.once('value');
    return data.val();
}
const listWorlds = async function (user) {
    const db = admin.database();
    const dirref = db.ref('/worlds');
    return await dirref.once('value');
}

const createCollaborator = async function (user, world) {

    const db = admin.database();
    await db.ref('/worlds/' + world)
        .once('value', (snapshot, context) => {
                if (snapshot.exists()) {
                    const ref = db.ref('/worlds/' + world + '/collaborators/' + user);
                    ref.set(true);
                }
            }
        );
}
const storeMedia = async function (world, key, name, mimetype, width, height, preview) {
    const db = admin.database();
    await db.ref(`/worlds/${world}`)
        .once('value', (snapshot, context) => {
            if (snapshot.exists()) {
                if (preview == "true") {
                    const ref = db.ref(`/worlds/${world}/preview/${key}`);
                    ref.set({name: key+'.png', mimetype: mimetype, width: width, height: height});
                } else {
                    const ref = db.ref(`/worlds/${world}/media/${key}`);
                    ref.set({name: name, mimetype: mimetype, width: width, height: height});
                }

            }
        });
}

const verifyInvite = async function (email, world) {
    const db = admin.database();
    const ref = db.ref('/invites/' + email + '/' + world);
    await ref.set({"world": world});
}
const storeJiraBoardConfig = async function (world, boards) {
    const db = admin.database();
    const boardRef = db.ref(`/worlds/${world}/jira/boards`);
    for (const board of boards) {
        const fbBoard = await boardRef.child(board.id).get();
        if (fbBoard.exists()) {
            await boardRef.child(board.id).child('columns').set(board.columns);
            await boardRef.child(board.id).child('name').set(board.name);
            await boardRef.child(board.id).child('rankingField').set(board.rankingField);
        } else {
            await boardRef.child(board.id).set(board);
        }

    }

}


module.exports = {
    getNewRelicConfig: getNewRelicConfig,
    getAuth: getAuth,
    createWorld: createWorld,
    createCollaborator: createCollaborator,
    listWorlds: listWorlds,
    saveNewRelic: saveNewRelic,
    getUser: getUser,
    storeMedia: storeMedia,
    updateJira: updateJira,
    getJiraConfig: getJiraConfig,
    storeJiraBoardConfig: storeJiraBoardConfig,
    getWorld: getWorld
};
