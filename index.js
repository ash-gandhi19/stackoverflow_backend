const express = require("express");
const mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
 dotenv.config();
const usersRoute = require("./routes/users.route");
const authRoute = require("./routes/auth.route");
const questionsRoute = require("./routes/questions.route");
const commentsRoute = require("./routes/comments.route");
const answersRoute = require("./routes/answers.route");

const main = async () => {
  
try{
  // Connecting to mongoDb Atlas
  mongoose.connect(process.env.MONGO_URL);

  const app = express();
var PORT = normalizePort(process.env.PORT);
  // Middlewares
 
   app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "jade");
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.json());
    app.use(helmet());
    app.use(morgan("common"));
    app.use(cors());

    app.use("/auth", authRoute);

    app.use("/users", usersRoute);

    app.use("/questions", questionsRoute);

    app.use("/comments", commentsRoute);

  app.use("/answers", answersRoute);
 /* app.listen(port, () => {
    console.log(`API is ready on http://localhost:${port}`);
  });*/
  app.listen(PORT, () => {
      console.log(`API is ready on http://localhost:${PORT}`);
    });

 } catch (error) {
    console.log("error starting our application", error);
  }
};

main();
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
  
