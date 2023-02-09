const env = require("./env");
const {logger} = require('./logging');

if (env.NR_LICENCE_KEY) {
    const config = require('../newrelic').config;
    require('newrelic');
    logger.info('New Relic Configured');
}