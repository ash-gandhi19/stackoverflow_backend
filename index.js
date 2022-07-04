const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const usersRoute = require("./routes/users.route");
const authRoute = require("./routes/auth.route");
const questionsRoute = require("./routes/questions.route");
const commentsRoute = require("./routes/comments.route");
const answersRoute = require("./routes/answers.route");

const main = async () => {
  dotenv.config();

  // Connecting to mongoDb Atlas
  mongoose.connect(process.env.MONGO_URL);

  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: process.env.FRONTEND,
    })
  );

  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));

  app.use("/auth", authRoute);

  app.use("/users", usersRoute);

  app.use("/questions", questionsRoute);

  app.use("/comments", commentsRoute);

  app.use("/answers", answersRoute);
  app.listen(process.env.PORT, () => {
    console.log(`API is ready on http://localhost:${process.env.PORT}`);
  });
};

main();
