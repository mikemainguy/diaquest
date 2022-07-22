const env = require('./server/env');

const { expressLogger, logger } = require('./server/logging');

const express = require('express');
const app = express();
const port = process.env.PORT | 3000;
app.use(expressLogger);
app.use(express.static('client'));
logger.log({level: "info", message: "server start on port: "+ env.PORT});

const server = app.listen(env.PORT, () => {

});
