const env = require("../env");
const RingApi = require('ring-client-api').RingApi;
/*const ringApi = new RingApi({
    refreshToken: env.RING_TOKEN,
    cameraStatusPollingSeconds: 30,
    debug: true
});
ringApi.getCameras().then((cameras) =>{
    cameras.forEach((camera) => {
        console.log(camera.id);
        camera.onNewNotification.subscribe(({event, subType}) => {
            console.log('Motion detected');
            console.log(event);
            console.log(subType)
        });
    });
});
*/
module.exports.handler = async (req, res) => {
    if (req.method == 'OPTIONS') {
        await res.set('access-control-allow-methods', 'GET, OPTIONS')
            .set('access-control-allow-origin', '*')
            .set('access-control-allow-headers', 'content-type,authorization')
            .send();
        return;
    }
    if (req.method != 'GET') {
        await res.sendStatus(405);
        return;
    }

  //  const cams = await ringApi.getCameras();

    if (req.query.id) {
        /*
        const photoItem = cams.filter(camera => camera.id == req.query.id);
        if (photoItem.length > 0) {
            try {
                const photo = await photoItem[0].getSnapshot();
                res.contentType('image/jpg');
                res.send(photo);
            } catch(err) {
                console.log(err);
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(404);
        }
    } else {
        res.status(200).send(cams.map((value) => {
            return {id: value.id, data: value.data}
        }));

         */
    }


}

module.exports.UNAUTH = true;