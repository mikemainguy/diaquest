const env = require('./server/env');
const { expressLogger, logger } = require('./server/logging');
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');

const app = express();
const port = process.env.PORT | 3000;
const firebase = require('./server/firebase');

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
app.get('/api/user/profile', (req, res, next)=> {
  firebase.getAuth().createCustomToken(req.oidc.user.sub).then((token) => {
      const obj = {}
      obj.user = req.oidc.user;
      obj.firebase_token = token;
      res.setHeader('content-type', 'application/json');
      res.send(JSON.stringify(obj));
    });
});

logger.log({level: "info", message: "server start on port: "+ env.PORT});


const server = app.listen(env.PORT, () => {

});
