import profile from "/api/user/profile" assert {type: 'json'};
async function require(path) {
  let _module = window.module;
  window.module = {};
  await import(path);
  let exports = module.exports;
  window.module = _module; // restore global
  return exports;
}
import "/twilio/twilio-video.min.js";




export async function connect() {
  const localTracks = await  Twilio.Video.createLocalTracks({audio:true, video: false});

  const room = await Twilio.Video.connect(profile.twilio_token, {name: 'diaQuest', tracks: localTracks});
  room.on('participantConnect', participant => {
    console.log(`${participant} joined`);
  })
}
