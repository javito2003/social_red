const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadphoto");

//MODELS IMPORT
const User = require("../models/user");
const Post = require("../models/post");

//MIDDLEWARES IMPORT
const { checkAuth } = require("../middlewares/authentication");

//post request - create post
router.post("/post", checkAuth,upload.single('file'), async (req, res) => {
  try {

      const description = req.body.description
      const photo = req.file.location
      const userId = req.userData._id

      const toCreate = {
          photo: photo,
          description: description,
          userId: userId
      }

      const createPost = await Post.create(toCreate)

      if (createPost) {
          const setPostInUser = await User.findOneAndUpdate({_id: userId}, {$push: {postsId: createPost._id}}, {runValidators: true, new: true})
          console.log(setPostInUser);
          if (setPostInUser) {
              return res.json({
                  status: "success",
                  message: "Post created"
              })
          }
      }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error,
    });
  }
});


router.get("/posts", async(req,res) => {
  try {
    const findPosts = await Post.find().populate('userId')
    if (findPosts) {
      return res.status(200).json({
        status: "success",
        data: findPosts
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: "success",
      message: error
    })
  }
})


router.get('/post', async(req,res) => {
  try {
    const findPost = await Post.findOne({_id: req.query.postId}).populate('userId')
    if (findPost) {
      return res.json({
        status: "success",
        data: findPost
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: "success",
      message: error
    })
  }
})





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


/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file) => new Promise((resolve,reject) => {
  console.log(file);
  const { name, buffer } = file
  console.log(name);
  const blob = bucket.file(name)
  console.log(blob);
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', (err) => {
    console.log(err);
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})


module.exports = router;
