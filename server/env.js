require('dotenv').config();
const env =
  {
    PORT: process.env.PORT || 3000,
    AUTH0_SECRET: process.env.AUTH0_SECRET || "SECRET"
  }
module.exports = env;

