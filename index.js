const env = require('./server/env');

const { expressLogger, logger } = require('./server/logging');

const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');

const app = express();
const port = process.env.PORT | 3000;

const auth0Config = {
  authRequired: true,
  auth0Logout: true,
  secret: env.AUTH0_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: '7el4MeFi7147tNZlL9EbYI8hEBuzMTaB',
  issuerBaseURL: 'https://aardvarkguru.us.auth0.com'
};
app.use(auth(auth0Config));

app.use(expressLogger);
app.use(express.static('client'));
app.get('/api/user/profile', (req, res, next)=> {
  res.send(JSON.stringify(req.oidc.user));
})

logger.log({level: "info", message: "server start on port: "+ env.PORT});


const server = app.listen(env.PORT, () => {

});
