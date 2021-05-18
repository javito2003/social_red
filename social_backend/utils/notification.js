const Notification = require("../models/notification")

async function notificationCreate(userId, recibeUserId, description){
    try {
        const toCreate = {
            userId: userId,
            recibeUserId: recibeUserId,
            description: description,
            time: Date.now()
        }

        const createNotif = await Notification.create(toCreate)
        if (createNotif) {
            return true
        }
    } catch (error) {
        return false
    }
}

module.exports = {notificationCreate}