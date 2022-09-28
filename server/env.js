require('dotenv').config();
const env =
    {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 3000,
        AUTH0_SECRET: process.env.AUTH0_SECRET || "SECRET",
        AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || "http://localhost:3000",
        FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') || '',
        NR_ACCOUNT_ID: process.env.NR_ACCOUNT_ID || false,
        NR_LICENCE_KEY: process.env.NR_LICENCE_KEY || false,
    }
module.exports = env;

