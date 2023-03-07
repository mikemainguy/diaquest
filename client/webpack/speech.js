import {debug} from "../components/debug";

const RecordRTC = require("recordrtc");
AFRAME.registerSystem('transcription', {
    init: function () {
        this.socketOpen = this.socketOpen.bind(this);
        this.socket;
        this.recorder;
        this.target = null;
        this.data = null
        this.transcribestart = this.transcribestart.bind(this);
        document.addEventListener('transcribestart', this.transcribestart);
        this.transcribestop = this.transcribestop.bind(this);
        document.addEventListener('transcribestop', this.transcribestop);
        this
            .setupConnection()
            .then(() => {
                debug('Connection setup')
            });
    },
    transcribestart: function (evt) {
        this.target = evt.detail;
        this.data = [];
        this
            .startRecording()
            .then(() => {
                debug('Recording started')
            });
    },
    transcribestop: function () {
        this.target = null;
        this.data = null;
        this.stopRecording();
    },
    setupConnection: async function () {
        const response = await fetch('/api/voice/token');
        const data = await response.json();
        this.token = data.token;
        if (!this.socket) {
            this.socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${this.token}`);
            this.socket.onmessage = (message) => {
                const res = JSON.parse(message.data);
                if (this.data) {
                    this.data.push(res);
                    this.target.emit('transcriptiondata', {data: res});
                }
            }
            this.socket.onopen = this.socketOpen;
        } else {
            switch (this.socket.readyState) {
                case 0:
                    console.log('socket opening');
                    break;
                case 1:
                    console.log('socket already open');
                    break;
                case 2:
                    console.log('dang, socket is closing');
                    this.socket = null;
                    break;
                case 3:
                    console.log('Socket is closed');
                    this.socket = null;
                    break
                default:
                    console.log(`socket state is unknown: ${this.socket.readyState}`);
            }

        }
    },
    socketOpen: async function () {
        if (!this.recorder) {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            this.recorder = new RecordRTC(stream, {
                type: 'audio', mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
                recorderType: RecordRTC.StereoAudioRecorder, timeSlice: 300, // set 250 ms intervals of data that sends to AAI
                desiredSampRate: 16000, numberOfAudioChannels: 1, // real-time requires only one channel
                bufferSize: 4096, audioBitsPerSecond: 128000, ondataavailable: (blob) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64data = reader.result;
                        // audio data must be sent as a base64 encoded string
                        if (this.socket && (this.socket.readyState === 1)) {
                            this.socket.send(JSON.stringify({audio_data: base64data.split('base64,')[1]}));
                        } else {
                            console.log('no socket available');
                        }
                    };
                    reader.readAsDataURL(blob);
                },
            });
        }
    },
    startRecording: async function () {
        if (this.socket && this.socket.readyState > 1) {
            debug('Socket closed or closing, disposing');
            this.socket = null;
        }
        if (!this.socket) {
            debug('Setting up socket');
            await this.setupConnection();
        }
        if (this.recorder) {
            const state = this.recorder.getState();
            switch (state) {
                case 'paused':
                    debug('Resuming Recording');
                    this.recorder.resumeRecording();
                    break;
                case 'inactive':
                    debug('Starting Recording');
                    this.recorder.startRecording();
                    break
                default:
                    debug(state);
            }
        }
        document.dispatchEvent(new CustomEvent('playUp', {detail: this.el}));
    },
    stopRecording: async function () {
        try {
            if (this.recorder.getState() === 'recording') {
                debug('Pausing Recorder');
                this.recorder.pauseRecording();
                if (this.socket && this.socket.readyState < 2) {
                    debug('Terminating socket session');
                    await this.socket.send('{"terminate_session": true}');
                    this.socket = null;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
});

AFRAME.registerComponent('transcription', {
    events: {
        mousedown: function () {
            debug('mouse down');
            document.dispatchEvent(new CustomEvent('transcribestart', {detail: this.el}));
        }, mouseup: function () {
            document.dispatchEvent(new CustomEvent('transcribestop', null));
        }
    }
});