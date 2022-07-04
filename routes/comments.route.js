const route = require("express").Router();
const commentServices = require("../services/comments.service");
const isAuthenticated = require("../middlewares/verifyJWT");


//add a comment
route.post("/add", isAuthenticated, commentServices.addComment);

//delete a comment
route.delete("/delete/:commentId/:questionId", isAuthenticated, commentServices.deleteComment);

module.exports = route;