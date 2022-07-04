const mongoose = require("mongoose");


const commentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    questionId: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: true
    }

}, { timestamps: true });


module.exports = mongoose.model("Comment", commentsSchema, "comments");