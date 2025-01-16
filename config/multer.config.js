const multer = require("multer");
const firebaseStorage = require("multer-firebase-storage");
const firebase = require("../config/firebase.config");
const serviceAccount = require("../chatting-3f70f-firebase-adminsdk-tj270-e05fdbbc36.json");

const storage = firebaseStorage({
  credentials: firebase.credential.cert(serviceAccount),
  bucketName: "chatting-3f70f.appspot.com",
  unique: true
});


const upload = multer({
  storage: storage,
});


module.exports = upload;
