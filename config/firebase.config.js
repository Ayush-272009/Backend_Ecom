const fbAdmin = require("firebase-admin");
const serviceCredentials = require("/etc/secrets/backend-domination-1dc8b-firebase-adminsdk-xaruh-1dc3eb911b.json");

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceCredentials),
  storageBucket: "backend-domination-1dc8b.appspot.com",
});

module.exports = fbAdmin;
