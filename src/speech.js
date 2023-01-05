import { debug }  from "../client/components/debug";
const RecordRTC = require("recordrtc");
AFRAME.registerSystem('transcription', {
    init: function() {
        this.socket;
        this.recorder;
        this.isRecording = false;
        this.target = null;
        this.data = null
        this.transcribestart = this.transcribestart.bind(this);
        this.transcribestop = this.transcribestop.bind(this);
    },
    transcribestart: function(el) {
        this.target = el;
        this.data=[];
        this.startRecording();
    },
    transcribestop: function(el) {
        this.target = null;
        this.data = null;
        this.stopRecording();
    },
    startRecording: async function() {
        if (!this.isRecording) {
            const response = await fetch('/api/voice/token');
            const data = await response.json();
            const {token} = data;
            this.socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);
            this.socket.onmessage = (message) => {
                const res = JSON.parse(message.data);
                if (this.data) {
                    this.data.push(res);
                    this.target.emit('transcriptiondata', {data: res});
                }
            }
            this.socket.onopen = () => {
                debug('Socket Opened');
                navigator.mediaDevices.getUserMedia({audio: true})
                    .then((stream) => {
                        this.recorder = new RecordRTC(stream, {
                            type: 'audio',
                            mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
                            recorderType: RecordRTC.StereoAudioRecorder,
                            timeSlice: 250, // set 250 ms intervals of data that sends to AAI
                            desiredSampRate: 16000,
                            numberOfAudioChannels: 1, // real-time requires only one channel
                            bufferSize: 4096,
                            audioBitsPerSecond: 128000,
                            ondataavailable: (blob) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const base64data = reader.result;

                                    // audio data must be sent as a base64 encoded string
                                    if (this.socket && (this.socket.readyState == 1)) {
                                        this.socket.send(JSON.stringify({audio_data: base64data.split('base64,')[1]}));
                                    }
                                };
                                reader.readAsDataURL(blob);
                            },
                        });

                        this.recorder.startRecording();
                        this.isRecording=true;
                        debug('Recording Started');
                    })
                    .catch((err) => console.error(err));
            }
        }
    },
    stopRecording: async function() {

        if (this.isRecording) {
            debug('Recording happening');
            if (this.socket) {
                this.socket.send(JSON.stringify({terminate_session: true}));
                this.socket.close();
                this.socket = null;
                debug('Socket Closed');
            }
            if (this.recorder) {
                this.recorder.pauseRecording();
                this.recorder = null;
                debug('Recording Stopped');
            }
            this.isRecording = false;
        }
    }
});

AFRAME.registerComponent('transcription', {
    events: {
        mousedown: function(evt) {
            debug('mouse down');
            this.system.transcribestart(this.el);
        },
        mouseup: function(evt) {
            this.system.transcribestop(this.el);
        }
    }
});