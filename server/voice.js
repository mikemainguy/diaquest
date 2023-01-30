const axios = require("axios");
const env = require("./env");
const voiceHandler =  async (req, res) => {
    try {
        const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
            {expires_in: 3600}, // can set a TTL timer in seconds.
            {headers: {authorization: env.VOICE_TOKEN}});
        const {data} = response;
        res.json(data)
    } catch (error) {
        res.json(`Error: ${error}`);
    }

}
module.exports = {voiceHandler: voiceHandler};