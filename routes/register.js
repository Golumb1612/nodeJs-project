const express = require("express");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerSchema = joi.object({
    name: joi.string().required().min(2),
    email: joi.string().required().email().min(6).lowercase(),
    password: joi.string().required().min(8),
    biz: joi.boolean().required()
});


router.post("/", async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase()
        //joi validation
        const {
            error
        } = registerSchema.validate(req.body)
        if (error) return res.status(400).send(error.message)
        //user exists

        let user = await User.findOne({
            email: req.body.email
        })
        if (user) return res.status(400).send("User already exists");
        //add new user
        user = new User(req.body)
        //enctypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        //create token
        const genToken = jwt.sign({
            _id: user._id,
            biz: user.biz
        }, process.env.secKey);

        await user.save();
        res.status(201).send({
            token: genToken
        })
    } catch (error) {
        res.status(400).send("Error in registration")
    }
});
module.exports = router;