import * as SignalWire from '@signalwire/js';
import {default as axios} from "axios";
import { debug } from './debug';

AFRAME.registerSystem('signalwire', {
    init: function () {
        document.addEventListener('connectSignalwire', (evt) => {
            if (this.roomSession && this.roomSession.active) {
                debug('already in session');
            } else {
                setupRoom().then((results)=> {
                    debug('connected to conference');
                    newrelic.addPageAction('room session started');
                    this.roomSession = results;
                });
            }

        });
        document.addEventListener('disconnectSignalwire', (evt) => {
            if (this.roomSession) {
                if (this.roomSession.active) {
                    this.roomSession.leave().then((data) => {
                        debug('left session');
                        newrelic.addPageAction('left session');
                        this.roomSession.dispose();
                    });

                }
            }
        });
        document.addEventListener('mute', this.mute.bind(this));
        document.addEventListener('unmute', this.unmute.bind(this));

    },
    disconnect: function(evt) {

    },
    mute: function(evt) {

        if (this.roomSession) {
            newrelic.addPageAction('mute');
            this.roomSession.audioMute().then(() => {
                debug('muted');
            });

        } else {
            debug('no room session');
        }
    },
    unmute: function(evt) {

        if (this.roomSession) {
            newrelic.addPageAction('unmute');
            this.roomSession.audioUnmute().then(() => {
                debug('unmuted');
            });

        } else {
            debug('no room session');
        }

    }
});

async function setupRoom() {
    const room = window.location.pathname;
    if (room.startsWith('/worlds/')) {
        const data = await axios.get('/api/user/signalwireToken?room=' + room.split('/')[2]);
        if (data.status == 200) {
            newrelic.addPageAction('session started', {path: room});
            const roomSession = new SignalWire.Video.RoomSession({
                token: data.data.signalwire_token,
                video: false,
                audio: true,
                rootElement: document.getElementById('room'),

            });

            try {
                await roomSession.join({audio: true, video: false});
                return roomSession;
            } catch (error) {
                newrelic.addPageAction('session start failed', {path: room, error: error});
                console.error("Error", error);
            }
        } else {
            console.error('No Room Found');
        }

    }
    return null;
}