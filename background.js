const firebase = require('./server/firebase');
const fb = require("firebase-admin/database");

async function run() {
    let db = await fb.getDatabase();
    const ref = await db.ref('/worlds/')
    const cur_date = new Date(new Date() - (60000*5));
    await ref.once('value', (snapshot) => {
        snapshot.forEach((world) => {
            console.log(world.key);
            if (world.hasChild('entities')) {
                world.child('entities').forEach((entity) => {
                    if (entity.hasChild('last_seen') &&
                        entity.hasChild('template')) {
                        const node ='/worlds/' + world.key + '/entities/'+ entity.key;
                        console.log(entity.key);

                        const dt = new Date(new Date(entity.val().last_seen));
                        if (entity.val().template === '#user-template') {
                            if (dt < cur_date) {
                                db.ref(node).remove();
                                console.log('delete');
                                console.log(entity.val().last_seen);

                            } else {
                                console.log('keep');
                                console.log(entity.val().last_seen);
                            }

                        }

                    }
                });
            }

        })

    });
    await ref.off();
    db.goOffline();


}
run().then(() => {
    console.log('Done');
    process.exit();
});




