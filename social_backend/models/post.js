const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    description: { type: String },
    photo: { type: String, required: [true, "Image is required"] },
    userId: { type: String, required: [true, "User is required"] },
    comments: [
      {
        text: { type: String, required: [true, "Text required"] },
        userId: { type: String, required: [true] },
      },
    ],
    likes: {type: Number, default: 0}
  },
);

const Post = mongoose.model('Post', postSchema)

module.exports = Post
