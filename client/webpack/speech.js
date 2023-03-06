import {debug} from "../components/debug";

const RecordRTC = require("recordrtc");
AFRAME.registerSystem('transcription', {
    init: function () {
        this.socketOpen = this.socketOpen.bind(this);
        this.socket;
        this.recorder;
        this.isRecording = false;
        this.target = null;
        this.data = null
        this.transcribestart = this.transcribestart.bind(this);
        document.addEventListener('transcribestart', this.transcribestart);
        this.transcribestop = this.transcribestop.bind(this);
        document.addEventListener('transcribestop', this.transcribestop);
        this.setupConnection();

    },
    transcribestart: function (evt) {
        this.target = evt.detail;
        this.data = [];
        this.startRecording();

    },
    transcribestop: function (evt) {
        this.target = null;
        this.data = null;
        this.stopRecording();
    },
    setupConnection: async function ()  {
        if (!this.token) {
            const response = await fetch('/api/voice/token');
            const data = await response.json();
            this.token = data.token;
        }
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
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        if (this.recorder) {
            this.recorder.resumeRecording();
        } else {
            this.recorder = new RecordRTC(stream, {
                type: 'audio', mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
                recorderType: RecordRTC.StereoAudioRecorder, timeSlice: 300, // set 250 ms intervals of data that sends to AAI
                desiredSampRate: 16000, numberOfAudioChannels: 1, // real-time requires only one channel
                bufferSize: 4096, audioBitsPerSecond: 128000, ondataavailable: (blob) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64data = reader.result;
                        // audio data must be sent as a base64 encoded string
                        if (this.socket && (this.socket.readyState == 1)) {
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
        if (!this.isRecording) {
            if (!this.socket) {
                console.log('disconnected');
            }
            this.recorder.startRecording();
            this.isRecording = true;
        } else {
            console.log('already recording');
        }
    }, stopRecording: async function () {
        if (this.isRecording) {
            debug('Recording happening');
            try {
                if (this.recorder) {
                    this.recorder.pauseRecording();
                    this.socket.send('{"terminate_session": true}');
                    debug('Recording Stopped');
                }
            } catch (err) {
                console.log(err);
            }
            this.isRecording = false;
        }
    }
});

AFRAME.registerComponent('transcription', {
    events: {
        mousedown: function (evt) {
            debug('mouse down');
            document.dispatchEvent(new CustomEvent('transcribestart', {detail: this.el}));

        }, mouseup: function (evt) {
            document.dispatchEvent(new CustomEvent('transcribestop', null));
        }
    }
});