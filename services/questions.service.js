require("dotenv").config();
const Question = require("../models/question.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const Answer = require("../models/answer.model");
const APIFeatures = require("../utils/apiFeatures");

module.exports = {
  async createQuestion(req, res) {
    try {
      // only save unique tags in DB
      req.body.tags = req.body.tags.map((t) => t.trim().toLowerCase());
      const uniqueTags = new Set(req.body.tags);
      req.body.tags = [...uniqueTags];

      const newQuestion = {
        ...req.body,
        userId: req.user._id,
      };

      const question = await Question.create(newQuestion);

      //adding new questions id to userQuestions
      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { userQuestions: question._id },
        }
      );

      res.send({
        question: question,
        user: req.user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Couldnt post question");
    }
  },
  async updateQuestion(req, res) {
    try {
      // only save unique tags in DB
      req.body.tags = req.body.tags.map((t) => t.trim().toLowerCase());
      const uniqueTags = new Set(req.body.tags);
      req.body.tags = [...uniqueTags];

      const question = await Question.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: req.body,
        },
        {
          new: true,
        }
      )
        .populate("userId", "userName profilePicture")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
            select: "userName",
          },
        });

      res.send(question);
    } catch (err) {
      console.log(err);
      res.status(500).send("Couldnt post question");
    }
  },
  async deleteQuestion(req, res) {
    try {
      const question = await Question.findByIdAndDelete(req.params.id);

      //removing questions id from userQuestions
      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: {
            userQuestions: req.params.id,
            userAnswers: { $in: question.answers },
          },
        }
      );

      //deleting all question comments
      await Comment.deleteMany({ questionId: req.params.id });

      //delete all answers of that question
      await Answer.deleteMany({ questionId: req.params.id });

      res.send("deletion successful");
    } catch (err) {
      console.log(err);
      res.status(500).send("Couldnt delete question");
    }
  },
  async getQuestion(req, res) {
    try {
      const question = await Question.findById(req.params.id)
        .populate("userId", "userName profilePicture")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
            select: "userName",
          },
        });

      question.views++;

      await question.save({ validateBeforeSave: false });

      res.send(question);
    } catch (err) {
      console.log(err);
      res.status(500).send("Couldnt get question");
    }
  },
  async getAllQuestion(req, res) {
    try {
      const apiFeatures = new APIFeatures(Question.find(), req.query)
        .filter()
        .pagination();

      const questions = await apiFeatures.query.populate("userId", "userName");
      const noOfQuestions = await Question.countDocuments();

      res.send({
        questions,
        noOfQuestions,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Couldnt get questions");
    }
  },
  async searchQuestionByTag(req, res) {
    try {
      const questions = await Question.find({
        tags: { $in: req.params.tag },
      }).populate("userId", "userName");

      res.send(questions);
    } catch (err) {
      console.log(err);
      res.status(500).send("Couldnt get questions by tag");
    }
  },
  async getTags(req, res) {
    try {
      const questions = await Question.find({}, { tags: 1 });

      const tagsArrayOfArrays = questions.map((q) => q.tags);

      const tagsArray = tagsArrayOfArrays.reduce(
        (flatten, arr) => [...flatten, ...arr],
        []
      );

      const uniqueTags = new Set(tagsArray);

      res.send([...uniqueTags]);
    } catch (err) {
      console.log(err);
      res.status(500).send("Couldnt get tags");
    }
  },
  async searchQuestion(req, res) {
    try {
      const { keyword } = req.query;

      const keywordRegex = keyword
        ? {
            body: {
              $regex: keyword,
              $options: "i",
            },
            title: {
              $regex: keyword,
              $options: "i",
            },
          }
        : {};

      const questions = await Question.find({
        $and: [
          {
            $or: [
              { body: keywordRegex.body },
              { title: keywordRegex.title },
              { tags: { $in: keyword } },
            ],
          },
        ],
      }).populate("userId", "userName");

      res.send(questions);
    } catch (err) {
      console.log(err);
      res.status(500).send("Couldnt search questions");
    }
  },
  async voteQuestion(req, res) {
    try {
      const question = await Question.findById(req.params.id)
        .populate("userId", "userName profilePicture")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
            select: "userName",
          },
        });

      if (req.body.vote === "up") {
        question.downVotes = question.downVotes.filter(
          (v) => v.toString() !== req.user._id.toString()
        );

        if (!question.upVotes.includes(req.user._id)) {
          question.upVotes.push(req.user._id);
        }
      } else {
        question.upVotes = question.upVotes.filter(
          (v) => v.toString() !== req.user._id.toString()
        );

        if (!question.downVotes.includes(req.user._id)) {
          question.downVotes.push(req.user._id);
        }
      }

      question.votes = question.upVotes.length - question.downVotes.length;

      await question.save({ validateBeforeSave: false });

      res.send(question);
    } catch (err) {
      console.log(err);
      res.status(500).send("Couldnt vote question");
    }
  },
};
