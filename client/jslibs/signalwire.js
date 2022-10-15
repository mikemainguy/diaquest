import * as SignalWire from '@signalwire/js';
import {default as axios} from "axios";

document.addEventListener('connectSignalwire', (evt) => {
    setupRoom().then((results)=> {
        console.log('done');
    });
});

async function setupRoom() {
    const room = window.location.pathname;
    if (room.startsWith('/worlds/')) {
        const data = await axios.get('/api/user/signalwireToken?room=' + room.split('/')[2]);
        if (data.status == 200) {
            const roomSession = new SignalWire.Video.RoomSession({
                token: data.data.signalwire_token,
                video: false,
                audio: true,
                rootElement: document.getElementById('room'),

            });

            try {
                await roomSession.join({audio: true, video: false});
            } catch (error) {
                console.error("Error", error);
            }
        } else {
            console.error('No Room Found');
        }

    }
}

