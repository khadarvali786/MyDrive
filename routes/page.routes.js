const express = require("express");
const router = express.Router();
const upload = require("../config/multer.config");
const fileModel = require("../models/file.model");
const authMiddleware = require("../middlewares/auth");
const firebase = require("../config/firebase.config");
// Register route

router.get("/", authMiddleware, async (req, res) => {
  const user = req.user;
  console.log(user);
  const userFiles = await fileModel.find({
    user: req.user.userId,
  });
  res.render("homePage", {
    files: userFiles,
    user: user.username,
  });
});

//logout route when we hit api it should clear the cookies
router.get("/logout", authMiddleware, async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.get("/download/:path", authMiddleware, async (req, res) => {
  const path = req.params.path;
  console.log(path);
  const file = await fileModel.findOne({
    user: req.user.userId,
    path: path,
  });
  if (!file) {
    return res.status(404).send("UnAuthorized");
  }

  const signedUrl = await firebase
    .storage()
    .bucket()
    .file(path)
    .getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 1000,
    });

  console.log(signedUrl[0]);

  res.redirect(signedUrl[0]);
});

router.get("/delete/:path", authMiddleware, async (req, res) => {
  const path = req.params.path;
  console.log(path);
  const file = await fileModel.findOne({
    user: req.user.userId,
    path: path,
  });
  if (!file) {
    return res.status(404).send("Unauthorized");
  }
  await fileModel.findByIdAndDelete(file._id);
  //Delete in firebase
  const bucket = firebase.storage().bucket();
  await bucket.file(path).delete();
  res.redirect("/");
});

router.post(
  "/upload-file",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const user = req.user;
      const file = await fileModel
        .create({
          filename: req.file.originalname,
          path: req.file.path,
          user: req.user.userId, // Assuming user is authenticated and their ID is stored in req.user._id
        })
        .then((response) => {
            res.redirect("/")
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error creating file");
        });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error uploading file");
      return;
    }
  }
);

// Login route

module.exports = router;
