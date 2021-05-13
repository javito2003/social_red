const express = require("express");
const router = express.Router();

//MODELS IMPORT
const User = require("../models/user");
const Post = require("../models/post");

//MIDDLEWARES IMPORT
const { checkAuth } = require("../middlewares/authentication");

//post request - create post
router.post("/post", checkAuth, async (req, res) => {
  try {
    var imageRoute = "";
    imageRoute = "src/assets/";

    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else if (
      req.files.file.mimetype != "image/png" &&
      req.files.file.mimetype != "image/jpeg"
    ) {
      res.send({
        status: false,
        message: "Solo png o jpg",
      });
      return;
    } else if (parseInt(req.files.file.size) > 2000000) {
      res.send({
        status: false,
        message: "El archivo debe ser menor a 2 Mb",
      });
      return;
    } else {
      var uploadFile = req.files.file;
      var extencion = getExtension(uploadFile.name);
      var filename = makeid(10) + extencion;
      uploadFile.mv(imageRoute + "post-images/" + filename);

      const description = req.body.description
      const photo = "post-images/" + filename
      const userId = req.userData._id

      const toCreate = {
          photo: photo,
          description: description,
          userId: userId
      }

      const createPost = await Post.create(toCreate)

      if (createPost) {
          const setPostInUser = await User.findOneAndUpdate({_id: userId}, {$push: {postId: createPost._id}})
          if (setPostInUser) {
              return res.json({
                  status: "success",
                  message: "Post created"
              })
          }
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error,
    });
  }
});

/* FUNCTIONS */
function getExtension(filename) {
  var i = filename.lastIndexOf(".");
  return i < 0 ? "" : filename.substr(i);
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
