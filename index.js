const env = require('./server/env');
const { expressLogger, logger } = require('./server/logging');
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const app = express();
const port = process.env.PORT | 3000;
const firebase = require('./server/firebase');
/*
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw24r35mkTBRsUH/SwJUD
yBQ3QNE3u0kDpGP+ZZs2BguOZQ6eZe7/IENM5AtkVtggkpcaQTOu4nSrUrc/o+yc
PGssJAtN8k2KNtMtMGRzckcAbH2p0sSkFzgOJIuiEnzysMU3TNGIEKn8vOBXoW6R
cTJsSC3Tfvc54Xv7RTUGIUAYcg+MAq01yY+qJRFtuTNowmSn6Xd6DcFRnHTLXtDW
EytHLW9GheVId5u+vw0cI5cZw/saobH34cFbdazLlTiaxSVrt1Oz4/tyPOaIQrnl
sTfjJkwp+mwr3rFbeejMoDdYOiMEX/P8q77kLsyiY+Az4GmpQw4p615yZgFgeeKV
PQIDAQAB
-----END PUBLIC KEY-----

 */
const auth0Config = {
  authRequired: true,
  auth0Logout: true,
  secret: env.AUTH0_SECRET,
  baseURL: env.AUTH0_BASE_URL,
  clientID: '7el4MeFi7147tNZlL9EbYI8hEBuzMTaB',
  issuerBaseURL: 'https://aardvarkguru.us.auth0.com'
};

app.use(auth(auth0Config));
app.use(expressLogger);
app.use(express.static('client'));
app.use('/twilio', express.static('node_modules/twilio-video/dist/'));
app.use('/voice', requiresAuth(false));

//cp node_modules/@twilio/voice-sdk/dist/twilio.min.js public
app.get('/api/user/profile',
  (req, res, next)=> {
    const videoGrant = new VideoGrant({
      room: 'diaQuest'
    });
    const user = 'user_' + Math.floor(Math.random() * 100);
    console.log(user);
    const twilioToken = new AccessToken(
      env.TWILIIO_ACCOUNT_SID,
      env.TWILIO_API_KEY,
      env.TWILIO_SECRET,
      {identity: user}
    )
    twilioToken.addGrant(videoGrant);

    const firebasePromise = firebase.getAuth().createCustomToken(req.oidc.user.sub);
  Promise.all([firebasePromise]).then(data => {
    const obj = {}
    obj.user = req.oidc.user;
    obj.firebase_token = data[0];
    obj.twilio_token = twilioToken.toJwt();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(obj));
  });


});

logger.log({level: "info", message: "server start on port: "+ env.PORT});


const server = app.listen(env.PORT, () => {

});
