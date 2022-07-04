const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/transporter");

module.exports = {
  async register(req, res) {
    try {
      const { fullName, userName, email, password: plainPassword } = req.body;

      // Checking if user already exists
      const userExists = await User.findOne({ email });
      if (userExists)
        return res.status(409).send("this email is already registered");

      // Checking if username already exists
      const usernameExists = await User.findOne({ userName });
      if (usernameExists)
        return res.status(409).send("this username already exists!");

      //Encoding password
      const encryptedPassword = await bcryptjs.hash(plainPassword, 10);

      // Creating new user
      const user = await User.create({
        fullName,
        userName,
        email,
        password: encryptedPassword,
      });

      const { password, ...other } = user._doc;

      res.status(200).send(other);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  async login(req, res) {
    try {
      const { email, password: plainPassword } = req.body;

      // Checking if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send("user not found/ Wrong email");

      // Checking if password is matching
      const validPass = await bcryptjs.compare(plainPassword, user.password);
      if (!validPass) return res.status(403).send("wrong password");

      // generating jwt token
      const token = jwt.sign({ user }, process.env.JWT_SECRET);

      res.send({ token: token, id: user._id });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const emailToken = jwt.sign(
        {
          user: email,
        },
        process.env.JWT_SECRET
      );

      //if user exists save token as password
      const user = await User.findOneAndUpdate(
        { email: email },
        { $set: { password: emailToken } },
        { new: true }
      );

      if (!user) return res.status(404).send("user not found.");

      const url = `${process.env.FRONTEND}/resetpassword/${emailToken}`;

      // send email verification mail
      await transporter.sendMail({
        to: email,
        subject: "Reset Password",
        html: `Please click this link to reset your password: <a href="${url}">${url}</a>`,
      });

      res.send("sent reset password email");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error sending mail. try later");
    }
  },

  async resetPassword(req, res) {
    try {
      const { password: plainPassword, randomString } = req.body;

      // Checking if jwt is valid
      jwt.verify(randomString, process.env.JWT_SECRET);

      //Encoding password
      const encryptedPassword = await bcryptjs.hash(plainPassword, 10);

      //if randomstring from client side is same as password in db change password
      await User.findOneAndUpdate(
        { password: req.body.randomString },
        { $set: { password: encryptedPassword } }
      );

      res.send("password updated successfully!");
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
};
