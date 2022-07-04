const mongoose = require("mongoose");


const answersSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 100,
        required: true,

    },
    body: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 5000,
        required: true,

    },
    upVotes: [{
        type: mongoose.Schema.ObjectId,
    }],
    downVotes: [{
        type: mongoose.Schema.ObjectId,
    }],
    votes: {
        type: Number,
        default: 0
    },
    questionId: {
        type: mongoose.Schema.ObjectId,
        ref: "Question"
    }

}, { timestamps: true });

module.exports = mongoose.model("Answer", answersSchema, "answers");