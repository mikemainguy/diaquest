const axios = require("axios");
const env = require("../../env");
module.exports.handler = (req, res) => {
    if (req.query && req.query.room) {
        const signalwirePromise = axios.post('https://diaquest.signalwire.com/api/video/room_tokens',
            {
                room_name: req.query.room,
                user_name: req.oidc.user.name,
                permissions: [
                    "room.self.audio_mute",
                    "room.self.audio_unmute",
                    "room.self.video_mute",
                    "room.self.video_unmute",
                    "room.self.video_mute",
                    "room.self.video_unmute",
                    "room.self.screenshare"

                ],
                join_video_muted: true,
                auto_create_room: false

            }, {
                auth: {
                    username: env.SIGNALWIRE_USER,
                    password: env.SIGNALWIRE_TOKEN
                }
            });


        signalwirePromise.then((data) => {
            const obj = {};
            obj.signalwire_token = data.data.token;
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify(obj));
        }).catch((err) => {
            res.status(500).send(err);
        });
    } else {
        res.status(404).send("No Room Found");
    }
}