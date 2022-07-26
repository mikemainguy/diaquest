require('dotenv').config();
const env =
  {
    PORT: process.env.PORT || 3000,
    AUTH0_SECRET: process.env.AUTH0_SECRET || "SECRET",
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || "http://localhost:3000",
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') || ''
  }
module.exports = env;

