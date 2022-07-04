const route = require("express").Router();
const answersServices = require("../services/answers.service");
const isAuthenticated = require("../middlewares/verifyJWT");


//get answers of a question
route.get("/ofquestion/:id", answersServices.getAnswersOfQuestion);

//add an answer
route.post("/add", isAuthenticated, answersServices.addAnswer);

//delete an answer
route.delete("/delete/:answerId/:questionId", isAuthenticated, answersServices.deleteAnswer);

//update an answer
route.put("/update", isAuthenticated, answersServices.updateAnswer);

//vote an answer
route.put("/vote", isAuthenticated, answersServices.voteAnswer);

module.exports = route;