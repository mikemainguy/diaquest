import * as SignalWire from '@signalwire/js';
import {default as axios} from "axios";


AFRAME.registerSystem('signalwire', {
    init: function () {
        this.roomSession = null;
        document.addEventListener('changeDevice', (evt) => {
            if (this.roomSession) {
                switch (evt.detail.kind) {
                    case 'audioinput':
                        this.roomSession.updateMicrophone({deviceId: evt.detail.id});
                        break;
                    case 'audiooutput':
                        this.roomSession.updateSpeaker({deviceId: evt.detail.id});
                        break;
                    case 'videoinput':
                        this.roomSession.updateCamera({deviceId: evt.detail.id});
                        break;
                    default:
                        console.log('unknown event:  ' + JSON.serialize(evt.detail));
                }
            }
        });
        document.addEventListener('startScreenShare', async (evt) => {
            if (this.roomSession && this.roomSession.active) {
                this.screenshare = await this.roomSession.startScreenShare(
                    {
                        layout: "screen-share",
                        autoJoin: true,
                        positions: {self: "reserved-1"}
                    });
            }
        });

        document.addEventListener('connectSignalwire', (evt) => {
            if (this.roomSession && this.roomSession.active) {
                this.debug('already in session');
            } else {
                setupRoom().then((results) => {
                    this.debug('connected to conference');
                    if (typeof newrelic !== 'undefined') {
                        newrelic.addPageAction('room session started');
                    }
                    this.roomSession = results;

                    const el = document.querySelector('#room video');
                    if (el) {
                        el.setAttribute('id', 'videostream');
                        const conf = document.querySelector('#conference');
                        conf.setAttribute('material', 'src', '#videostream');
                        conf.setAttribute('visible', 'true');
                        console.log('conference mapped');
                    }

                    const els = document.querySelectorAll('.insession');
                    els.forEach((el) => {
                        el.setAttribute('visible', 'true');
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
        document.addEventListener('disconnectSignalwire', (evt) => {
            if (this.roomSession) {
                if (this.roomSession.active) {
                    this.roomSession.leave().then((data) => {
                        this.debug('left session');
                        if (typeof newrelic !== 'undefined') {
                            newrelic.addPageAction('left session');
                        }
                        this.roomSession.destroy();
                        this.roomSession = null;
                        const els = document.querySelectorAll('.insession');
                        els.forEach((el) => {
                            el.setAttribute('visible', 'false');
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        });
        document.addEventListener('mute', this.mute.bind(this));
        document.addEventListener('unmute', this.unmute.bind(this));

    },
    disconnect: function (evt) {

    },
    mute: function (evt) {

        if (this.roomSession) {
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction('mute');
            }

            this.roomSession.audioMute().then(() => {
                this.debug('muted');
            });


        } else {
            this.debug('no room session');
        }
    },
    unmute: function (evt) {

        if (this.roomSession) {
            if (newrelic !== 'undefined') {
                newrelic.addPageAction('unmute');
            }

            this.roomSession.audioUnmute().then(() => {
                this.debug('unmuted');
            });


        } else {
            this.debug('no room session');
        }

    },
    debug: function (message) {
        console.log(message);
    }
});

function createDeviceList(id, items) {
    const el = document.createElement('ul');
    el.setAttribute('id', id);
    for (const item of items) {
        const it = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', '#');
        a.setAttribute('data-id', item.id);
        a.setAttribute('data-kind', item.kind);

        a.innerText = item.label;
        it.appendChild(a);
        el.appendChild(it);

    }
    document.getElementById('mediaselect').appendChild(el);
}

async function setupRoom() {
    const room = window.location.pathname;


    if (room.startsWith('/worlds/')) {
        const data = await axios.get('/api/user/signalwireToken?room=' + room.split('/')[2]);
        if (data.status == 200) {
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction('session started', {path: room});
            }

            const roomSession = new SignalWire.Video.RoomSession({
                token: data.data.signalwire_token,
                rootElement: document.getElementById('room'),
            });
            let videoPresent = true;
            try {
                const video = await navigator.mediaDevices.getUserMedia({video: true});
                const devices = await SignalWire.WebRTC.enumerateDevices();
                const audioinputdevices = [];
                const audiooutputdevices = [];
                const videodevices = [];
                for (const device of devices) {
                    if (device.kind) {
                        switch (device.kind) {
                            case 'audioinput':
                                audioinputdevices.push({kind: 'audioinput', id: device.deviceId, label: device.label});
                                break;
                            case 'videoinput' :
                                videodevices.push({kind: 'videoinput', id: device.deviceId, label: device.label});
                                break;
                            case 'audiooutput' :
                                audiooutputdevices.push({
                                    kind: 'audiooutput',
                                    id: device.deviceId,
                                    label: device.label
                                });
                                break;
                            default:
                                console.log(JSON.stringify(device) + ' Unknown device kind');
                        }
                    }
                }
                createDeviceList('audioinput', audioinputdevices);
                createDeviceList('audiooutput', audiooutputdevices);
                createDeviceList('videoinput', videodevices);
                console.log(JSON.stringify(devices));
                if (!video) {
                    videoPresent = false;
                }
            } catch (error) {
                videoPresent = false;
            }
            try {

                await roomSession.join({
                    audio: true,
                    video: true,
                    sendVideo: videoPresent,
                    receiveVideo: true,
                    sendAudio: true,
                    receiveAudio: true
                });
                if (videoPresent) {
                    await roomSession.videoUnmute();
                }


                return roomSession;
            } catch (error) {
                console.log("Cannot join");
                newrelic.addPageAction('session start failed', {path: room, error: error});
                console.error("Error", error);
            }
        } else {
            console.error('No Room Found');
        }

    }
    return null;
}
