const express = require("express");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User")

const loginSchema = joi.object({
    email: joi.string().required().email().min(6),
    password: joi.string().required().min(8)
});

router.post("/", async (req, res) => {
    try {
        //joi vali
        req.body.email = req.body.email.toLowerCase()
        const {
            error
        } = loginSchema.validate(req.body)
        if (error) return res.status(400).send(error.message)
        //check exsistance
        let user = await User.findOne({
            email: req.body.email
        })
        if (!user) return res.status(400).send("Wrong email or password!")
        //check pass
        const compareRes = await bcrypt.compare(req.body.password, user.password)
        if (!compareRes) return res.status(400).send("Wrong email or password!");
        //create token
        const genToken = jwt.sign({
            _id: user._id,
            biz: user.biz
        }, process.env.secKey);
        res.status(200).send({
            token: genToken,
            id: user.id,
            biz: user.biz
        })
    } catch (error) {
        res.status(400).send("Oops.. there was an error in login" + error)

    }
})

module.exports = router;