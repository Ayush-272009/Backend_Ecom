const FirebaseStorage = require("multer-firebase-storage");
const multer = require("multer");
const fbAdmin = require("./firebase.config");
const serviceCredentials = require("/etc/secrets/backend-domination-1dc8b-firebase-adminsdk-xaruh-1dc3eb911b.json");

const storage = FirebaseStorage({
  bucketName: "backend-domination-1dc8b.appspot.com",
  credentials: fbAdmin.credential.cert(serviceCredentials),
  unique: true,
  public: true,
});

const upload = multer({
  storage: storage,
});

//const upload = multer({ storage });
//  it is same as above works exactly in same way

module.exports = upload;
