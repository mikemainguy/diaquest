const winston = require('winston');
const env = require('./env');
const expressWinston = require("express-winston");
const expressLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP ",
  expressFormat: true
});
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ],
  level: env.LOG_LEVEL

});
module.exports = {expressLogger: expressLogger, logger: logger};
