const express = require("express");
const router = express.Router();
const joi = require("joi");
const _ = require("lodash");
const auth = require("../middlewares/auth");
const Card = require("../models/Card");
const bizCardSchema = joi.object({
    bizName: joi.string().required().min(2),
    bizDesc: joi.string().required().min(2).max(255),
    bizAddress: joi.string().required().min(2),
    bizPhone: joi.string().required().min(9),
    bizImage: joi.string().required(),
    bizNum: joi.number()
});

router.post("/", auth, async (req, res) => {
    try {
        const {
            error
        } = bizCardSchema.validate(req.body);
        if (error) return res.status(400).send(error.message);

        let card = new Card(req.body);

        let isBiz = true;

        while (isBiz) {
            let bizNumber = _.random(1000, 99999);
            let checkCard = await Card.findOne({
                bizNum: bizNumber
            });
            if (checkCard) return res.status(400).send("Card number already exists, saving again will solve the problem")
            if (!checkCard) isBiz = false;
            card.bizNum = bizNumber;
            card.userId = req.payload._id;
            await card.save();
            res.status(200).send({
                bizName: req.body.bizName,
                bizDesc: req.body.bizDesc,
                bizAddress: req.body.bizAddress,
                bizPhone: req.body.bizPhone,
                bizImage: req.body.bizImage
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/getcards", auth, async (req, res) => {
    try {
        let cards = await Card.find();
        res.status(200).send(cards);
    } catch (error) {
        res.status(400).send("Error in geting cards" + error);
    }
});

router.get("/cardsbyuserid", auth, async (req, res) => {
    try {
        let cards = await Card.find({
            userId: req.payload._id
        });
        res.status(200).send(cards);
    } catch (error) {
        res.status(400).send("Error in card" + error);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
      const { error } = bizCardSchema.validate(req.body);
      if (error) return res.status(400).send(error.message);
  
      let card = await Card.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
  
      if (!card) return res.status(400).send("no such card");

      await card.save();
  
      res.status(200).send(card);
    } catch (error) {
      res.status(400).send("Error " + error);
    }
  });

router.delete("/:id", auth, async (req, res) => {
    try {
      let card = await Card.findByIdAndRemove(req.params.id);
      if (!card) return res.status(400).send("no such card");
      res.status(200).send("Your card has been deleted");
    } catch (error) {
      res.status(400).send("Error " + error);
    }
  });

module.exports = router;