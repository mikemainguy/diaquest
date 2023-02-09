const env = require("./env");
const sgMail = require("@sendgrid/mail");
const {logger} = require('./logging');
if (env.SENDGRID_API_KEY) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    logger.info('Sendgrid Configured');
} else {
    logger.warn('Sendgrid API Key missing');
}

const sendMail = async(email, world) => {
    try {
        const msg = {
            to: email, // Change to your recipient
            from: 'invite@immersiveidea.com', // Change to your verified sender
            subject: 'Invitation to collaborate on Immersive Idea',
            text: '',
            html: `<a href="https://www.immersiveidea.com/world/${world}">${world}</a>`,
        }
        const result = await sgMail.send(msg);
        return result;
    } catch (err) {
        logger.error(err);
    }


}
module.exports = {sendMail};