const firebase = require("../../firebase");
const axios = require("axios");
const env = require("../../env");
const {logger} = require("../../logging");
const {sendMail} = require("../../sendgrid");

module.exports.handler = async (req, res) => {
    if (req.method != 'POST') {
        res.sendStatus(405);
        return;
    }
    try {
        const world = req.body.world;
        const email = req.body.email;
        const tokenOptions = {
            method: 'POST',
            url: env.AUTH0_ISSUER_BASE_URL + '/oauth/token',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            data: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: env.AUTH0_ADMIN_CLIENT,
                client_secret: env.AUTH0_ADMIN_SECRET,
                audience: env.AUTH0_ISSUER_BASE_URL + '/api/v2/'
            })
        };

        const tokenResponse = await axios.request(tokenOptions);
        const access_token =tokenResponse.data.access_token;

        const options = {
            method: 'GET',
            url: env.AUTH0_ISSUER_BASE_URL + '/api/v2/users-by-email',
            params: {email: email},
            headers: {authorization: 'Bearer ' + access_token}
        };

        const user = await axios.request(options);

        if (user.data && user.data.length > 0) {
            await firebase
                .createCollaborator(user.data[0].user_id, world);
        } else {
            const createOptions = {
                method: 'POST',
                url: env.AUTH0_ISSUER_BASE_URL + '/api/v2/users',
                data: JSON.stringify({email: email,
                    connection: "email",
                    email_verified: true,
                    verify_email: false }),
                headers: {authorization: 'Bearer ' + access_token, "Content-Type": "application/json"}
            };
            const newUser = await axios.request(createOptions);
            if (newUser.data) {

                await firebase
                    .createCollaborator(newUser.data.user_id, world);
            } else {
                res.sendStatus(500);
                return;
            }
        }
        await sendMail( email, world  );
        res.sendStatus(200);
    } catch (err) {
        logger.error(err);
        res.sendStatus(500);
    }
}