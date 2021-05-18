const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    userId: {type: String, required: true},
    recibeUserId: {type: String, required: true},
    description: {type: String, required: true},
    time: {type: Number, required: true},
    readed: {type: Boolean, default: false}
})

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification