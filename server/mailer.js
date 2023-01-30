const sgMail = require("@sendgrid/mail");
const mailer = (req, res) => {
    if (!req.body.email) {
        return;
    }
    const msg = {
        to: req.body.email, // Change to your recipient
        from: 'invite@immersiveidea.com', // Change to your verified sender
        subject: 'Invitation to collaborate on Immersive Idea',
        text: '',
        html: '<a href="https://www.immersiveidea.com/invite/' + params['world'] + '">Join Now</a>',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
    res.json({"status": "OK"});
}
module.exports = {mailer: mailer};