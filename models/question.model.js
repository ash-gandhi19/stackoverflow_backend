const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
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
      minlength: 5,
      maxlength: 5000,
      required: true,
    },
    upVotes: [
      {
        type: mongoose.Schema.ObjectId,
      },
    ],
    downVotes: [
      {
        type: mongoose.Schema.ObjectId,
      },
    ],
    votes: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [
        {
          type: String,
          minlength: 1,
          maxlength: 15,
        },
      ],
      validate: [(val) => val.length <= 5, "max 5 tags allowed"],
    },
    answers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Answer",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionsSchema, "questions");
