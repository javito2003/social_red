const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//model import
const User = require('../models/user')


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

module.exports = router