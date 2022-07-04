const route = require("express").Router();
const questionsServices = require("../services/questions.service");
const isAuthenticated = require("../middlewares/verifyJWT");

// create question
route.post("/create", isAuthenticated, questionsServices.createQuestion);

// update question
route.put("/update/:id", isAuthenticated, questionsServices.updateQuestion);

//get all questions
route.get("/all", questionsServices.getAllQuestion);

//search questions
route.get("/search", questionsServices.searchQuestion);

//search questions by tag
route.get("/tagged/:tag", questionsServices.searchQuestionByTag);

//get all tags
route.get("/tags", questionsServices.getTags);

// get a particular question and update views
route.put("/get/:id", questionsServices.getQuestion);

// up/down vote
route.put("/vote/:id", isAuthenticated, questionsServices.voteQuestion);

// delete question
route.delete("/delete/:id", isAuthenticated, questionsServices.deleteQuestion);

module.exports = route;
