const fs = require("fs");

require('dotenv').config();
const version = fs.readFileSync('./VERSION');
const env =
    {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 3000,
        AUTH0_SECRET: process.env.AUTH0_SECRET || "SECRET",
        AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || "http://localhost:3000",
        AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL || '',
        AUTH0_ADMIN_CLIENT: process.env.AUTH0_ADMIN_CLIENT || '',
        AUTH0_ADMIN_SECRET: process.env.AUTH0_ADMIN_SECRET || '',
        FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') || '',
        NR_ACCOUNT_ID: process.env.NR_ACCOUNT_ID || false,
        NR_LICENCE_KEY: process.env.NR_LICENCE_KEY || false,
        NR_USER_KEY: process.env.NR_USER_KEY || false,
        SIGNALWIRE_TOKEN: process.env.SIGNALWIRE_TOKEN || false,
        SIGNALWIRE_USER: process.env.SIGNALWIRE_USER || false,
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || false,
        VOICE_TOKEN: process.env.VOICE_TOKEN || false,
        VERSION: version || 'unknown',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || '',
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '',
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '',
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
        RING_TOKEN: process.env.RING_TOKEN || ''


    }
module.exports = env;

