const env = require("./env");
const {logger} = require("./logging");
const axios = require("axios");

module.exports = (port) => {
    if (env.NODE_ENV != "development") {
        logger.info("Logging deployment");
        axios.post('https://api.newrelic.com/v2/applications/739699753/deployments.json', {
            "deployment": {
                "revision": env.VERSION.toString()
            }
        }, { headers: {'Api-Key': env.NR_USER_KEY}}).then(function(response) {
            logger.info('deployment logged');
        }).catch(function(error){
            logger.warn('deployment could not be logged');
            logger.warn(error);
        });
    } else {
        logger.info("Deployment not logged");
    }
    logger.info(`Server start on port: ${port}`);
    logger.info(`Mode: ${process.env.NODE_ENV}`);

}