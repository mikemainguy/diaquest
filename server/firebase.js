const env = require('./env')

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = {
  "type": "service_account",
  "project_id": "metastore-37b60",
  "private_key_id": "a657ff95a5486043706b92dbfb9189b3d80a8d34",
  "private_key": env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-opmyl@metastore-37b60.iam.gserviceaccount.com",
  "client_id": "115560938552692183326",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-opmyl%40metastore-37b60.iam.gserviceaccount.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://metastore-37b60-default-rtdb.firebaseio.com"
});

module.exports = {getAuth: getAuth};
