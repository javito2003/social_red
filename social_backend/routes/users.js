const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//model import
const User = require('../models/user')
const {checkAuth} = require("../middlewares/authentication")


//POST request - create user
router.post('/register', async(req,res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        const toCreate = {
            name: name,
            email:email,
            password: bcrypt.hashSync(password, 10),
        }

        const createUser = await User.create(toCreate)

        if(createUser){
            return res.status(200).json({
                status: "success",
                message: "Success to create the user"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: error
        })
    }
})



//POST request - login
router.post("/login", async(req,res) =>{
    try {
        const email = req.body.email
        const password = req.body.password


        const findUser = await User.findOne({email: email})

        if (!findUser) {
            return res.status(500).json({
                status: "error",
                message: "Email or password invalid"
            })
        }

        if (!bcrypt.compareSync(password, findUser.password)) {
            return res.status(500).json({
                status: "error",
                message: "Email or password invalid"
            })
        }

        const token = jwt.sign({userData: findUser}, "SECUREPASSWORDHERE", {
            expiresIn: 60 * 60 * 24 * 7
        })

        const toSend = {
            status: "success",
            token: token,
            userData: findUser
        }

        return res.json(toSend)

    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: error
        })
    }
})

//GET request - get user
router.get("/user", async(req,res) => {
    try {
        const userId = req.query.userId
        const findUser = await User.findOne({_id: userId}).populate("postsId")
        if(findUser){
            return res.json({
                status: "success",
                data: findUser
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
})

//follow user
router.put('/follow', checkAuth, async(req,res) => {
    try {
        const userId = req.userData._id
        const followUserID = req.query.followUserID

        const follow = await User.findOneAndUpdate({_id: userId}, {$push: {following: followUserID}}, {runValidators: true, new: true})
        if (follow) {
            const receiveFollow = await User.findOneAndUpdate({_id: followUserID}, {$push: {followers: userId}}, {runValidators: true, new: true})
            if (receiveFollow) {
                return res.json({
                    status: "success",
                    message: "Following",
                    data: follow
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
})

//unfollowuser
router.put("/unfollow", checkAuth, async(req,res) => {
    try{

        const userId = req.userData._id
        const unFollowUserID = req.query.unFollowUserID
        
        const unFollow = await User.findOneAndUpdate({_id: userId}, {$pull: {following: {$in: unFollowUserID}}}, {runValidators: true, new: true})
        if (unFollow) {
            const receiveUnFollow = await User.findOneAndUpdate({_id: unFollowUserID}, {$pull: {followers: {$in: userId}}}, {runValidators: true, new: true})
            if (receiveUnFollow) {
                return res.json({
                    status: "success",
                    message: "unfollow",
                    data: unFollow
                })
            }
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
})

module.exports = router