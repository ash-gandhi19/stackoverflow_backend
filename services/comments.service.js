const Comment = require("../models/comment.model");
const Question = require("../models/question.model");

module.exports = {
    async addComment(req, res) {

        try {
            const comment = await Comment.create({
                ...req.body,
                userId: req.user._id
            });

            const question = await Question
                .findOneAndUpdate({ _id: req.body.questionId },
                    {
                        $push: { comments: comment._id }
                    }, {
                    new: true
                })
                .populate("userId", "userName profilePicture")
                .populate({
                    path: "comments",
                    populate: {
                        path: "userId",
                        select: "userName"
                    }
                });

            res.send(question);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt post comment");

        }

    },
    async deleteComment(req, res) {
        try {
            await Comment.findByIdAndDelete(req.params.commentId);

            await Question.findOneAndUpdate({ _id: req.params.questionId },
                {
                    $pull: { comments: req.params.commentId }
                }
            );

            res.send("Comment deleted successfully");
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt delete comment");

        }

    }
}