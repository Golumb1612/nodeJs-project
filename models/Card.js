const {
    required
} = require("joi");
const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    bizName: {
        type: String,
        required: true,
        minlength: 2
    },
    bizDesc: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    bizAddress: {
        type: String,
        required: true,
        minlength: 2
    },
    bizPhone: {
        type: String,
        required: true,
        minlength: 9
    },
    bizImage: {
        type: String,
        required: true
    },
    bizNum: {
        type: Number
    },
    userId: {
        type: String
    }
})

const Card = mongoose.model("card", cardSchema);
module.exports = Card;