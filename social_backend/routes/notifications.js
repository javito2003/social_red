const express = require("express")
const router = express.Router()

//model
const Notification = require("../models/notification")

//middleware
const {checkAuth} = require("../middlewares/authentication")


router.get("/notifications", checkAuth, async(req,res) => {
    try {
        const userId = req.userData._id

        const findNotif = await Notification.find({recibeUserId: userId})
        if (findNotif) {
            return res.json({
                status: "success",
                data: findNotif
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
})

//read notif
router.put('/notification-read', checkAuth, async(req,res) => {
    try {
        const recibeUserId = req.userData._id
        const notifId = req.query.notifId
        console.log(recibeUserId);
        console.log(notifId);
        let res1 = await Notification.findOneAndUpdate({_id: notifId, recibeUserId: recibeUserId}, {$set: {readed: true}})
        console.log(res1);
        if (res1) {
            const toSend = {
                status: "Success"
            }

            return res.json(toSend)
        }


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
})


module.exports = router