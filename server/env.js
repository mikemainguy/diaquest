require('dotenv').config();
const env =
  {
    PORT: process.env.PORT || 3000,
    AUTH0_SECRET: process.env.AUTH0_SECRET || "SECRET",
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || "http://localhost:3000",
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') || '',
    TWILIIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || null,
    TWILIO_TWIML_APP_SID: process.env.TWILIO_TWIML_APP_SID || null,
    TWILIO_CALLER_ID:process.env.TWILIO_CALLER_ID || null,
    TWILIO_API_KEY:process.env.TWILIO_API_KEY || null,
    TWILIO_SECRET:process.env.TWILIO_SECRET || null

  }
module.exports = env;

