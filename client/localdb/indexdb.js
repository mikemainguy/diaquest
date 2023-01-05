const DB_NAME = 'localobjects';
const DB_VERSION = 1;
const DB_STORE_NAME = 'vrobjects';

let db;
let request = indexedDB.open(DB_NAME, DB_VERSION);
request.onsuccess = function(event) {
    console.log("IndexedDB opened successfully");
    db = this.result;
};
request.onupgradeneeded = function(event) {
    let dbResult = event.target.result;

    // check if our database already exists and contains our object store
    if (dbResult.objectStoreNames.contains(DB_STORE_NAME)) {
        // if so, delete it so we can re-create it with our new structure
        dbResult.deleteObjectStore(DB_STORE_NAME);
    }

    // create a new object store
    let store = dbResult.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id' , autoIncrement: false}
    );

    // create indices for each of our key property names
    //store.createIndex('authorName', 'authorName', { unique: false });
    //store.createIndex('fileName', 'fileName', { unique: true });
    //store.createIndex('markdownContent', 'markdownContent', { unique: false });
};
document.addEventListener('shareUpdate', function (evt) {
    if (!evt.detail && !evt.detail.id) {
        console.error("Missing Id to update " + JSON.stringify(evt.detail));
        return;
    }
    if (VRLOCAL) {
        const el = document.getElementById(evt.detail.id);
        evt.detail.updater = document.querySelector('.rig').getAttribute('id');
        createOrUpdateDom(evt.detail);
    } else {
        if (evt.detail.remove === true) {
            if (evt.detail && evt.detail.id) {
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
        //const path = getDbPath(data.id);
        //update(ref(database, path), data);
    } catch (err) {
        console.log(err);
    }


}

function createEntity(data) {
    try {
        //const path = getDbPath(data.id);
        //set(ref(database, path), data);
    } catch(err){
        console.log(err);
    }
}