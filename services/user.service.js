const User = require("../models/user.model");

module.exports = {
    async getProfile(req, res) {
        try {

            const user = await User.findById(req.user._id)
                .populate({
                    path: "userQuestions",
                    populate: {
                        path: "userId",
                        select: "userName"
                    }
                })
                .populate({
                    path: "userAnswers",
                    populate: {
                        path: "userId",
                        select: "userName"
                    }
                });

            res.send(user);

        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt get user");

        }
    },

    async updateUser(req, res) {

        try {
            const { fullName, qualification, yearsOfExperience, yearOfPassing } = req.body;

            const userInfo = await User.findOneAndUpdate({ _id: req.user._id },
                { $set: { fullName, qualification, yearsOfExperience, yearOfPassing } },
                {
                    runValidators: true,
                    new: true
                });

            res.send(userInfo);

        }
        catch (err) {
            res.status(500).send("Error editing user");
        }

    }
}