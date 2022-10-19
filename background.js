const firebase = require('./server/firebase');
const fb = require("firebase-admin/database");

async function run() {
    const db = await fb.getDatabase();
    const ref = await db.ref('/worlds/')
    await ref.once('value', (snapshot) => {
        console.log(snapshot.key);
        console.log(snapshot.val());
    });
    await ref.off();


}
run().then(() => console.log('here'));



