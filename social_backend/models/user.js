const mongoose = require("mongoose")
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
    name: {type: String, required: [true, "Name is required"]},
    email: {type: String, required: [true, "Email is required"], unique: true},
    password: {type: String, required: [true, "Password is required"]},
    active: {type: Boolean, default: false},
    postsId: [{type: Schema.Types.ObjectId, ref: "Post"}],
    saved: [{type:Schema.Types.ObjectId, ref: "Post"}],
})


userSchema.plugin(uniqueValidator, {message: "Error, {PATH} already exists"})
userSchema.methods.toJSON = function(){
    var obj = this.toObject()
    delete obj.password
    return obj
}

const User = mongoose.model('User', userSchema)

module.exports = User