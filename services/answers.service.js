const Answer = require("../models/answer.model");
const Question = require("../models/question.model");
const User = require("../models/user.model");

module.exports = {
    async addAnswer(req, res) {

        try {

            const { title, body, questionId } = req.body;

            const answer = await Answer.create({
                title,
                body,
                questionId,
                userId: req.user._id
            });

            await Question.findOneAndUpdate({ _id: questionId },
                {
                    $push: { answers: answer._id }
                }
            );

            await User.findOneAndUpdate({ _id: req.user._id },
                {
                    $push: { userAnswers: answer._id }
                }
            );

            const finalAnswer = await answer.populate("userId");
            res.send(finalAnswer);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt post answer");

        }

    },

    async updateAnswer(req, res) {

        try {

            const { answerId, title, body } = req.body;

            const answer = await Answer.findOneAndUpdate({ _id: answerId },
                {
                    $set: { title, body }
                },
                {
                    new: true,
                    runValidators: true
                }
            ).populate("userId", "userName");

            res.send(answer);

        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt update answer");

        }

    },

    async deleteAnswer(req, res) {
        try {

            const { answerId, questionId } = req.params;

            await Answer.findByIdAndDelete(answerId);

            await Question.findOneAndUpdate({ _id: questionId },
                {
                    $pull: { answers: answerId }
                }
            );

            await User.findOneAndUpdate({ _id: req.user._id },
                {
                    $pull: { userAnswers: answerId }
                }
            );

            res.send("answer deleted successfully");
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt delete answer");

        }

    },

    async getAnswersOfQuestion(req, res) {
        try {

            const answers = await Answer.find({ questionId: req.params.id })
                .populate("userId", "userName");

            res.send(answers);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt get answers");

        }

    },

    async voteAnswer(req, res) {

        try {

            const { answerId, vote } = req.body;

            const answer = await Answer.findById(answerId).populate("userId", "userName");

            if (vote === "up") {

                answer.downVotes = answer.downVotes.filter(v => v.toString() !== req.user._id.toString());

                if (!answer.upVotes.includes(req.user._id)) {
                    answer.upVotes.push(req.user._id);
                }

            }
            else {

                answer.upVotes = answer.upVotes.filter(v => v.toString() !== req.user._id.toString());

                if (!answer.downVotes.includes(req.user._id)) {
                    answer.downVotes.push(req.user._id);
                }

            }

            answer.votes = answer.upVotes.length - answer.downVotes.length;

            await answer.save({ validateBeforeSave: false });

            res.send(answer);

        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt vote answer");

        }

    },
}