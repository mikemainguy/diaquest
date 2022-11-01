const firebase = require('./server/firebase');
const fb = require("firebase-admin/database");

async function run() {
    let db = await fb.getDatabase();
    const ref = await db.ref('/worlds/')
    const cur_date = new Date(new Date() - (60000*5));
    const nodeList = [];
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
                                nodeList.push(node);
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
    for (node of nodeList) {
        console.log('removing ' + node);
        await db.ref(node).remove();
    }

    await ref.off();
    db.goOffline();

}
run().then(() => {
    console.log('Done');
    process.exit();
});




