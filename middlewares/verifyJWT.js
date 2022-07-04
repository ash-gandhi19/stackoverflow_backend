const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    const token = req.headers["token"];
    if (token) {
        try {
            //verifying if users token is valid
            const { user } = jwt.verify(token, process.env.JWT_SECRET);
            const { password, ...other } = user;
            req.user = other;
            next();
        }
        catch (err) {
            res.status(401).send("Please login to access the content!");
        }
    }
    else {
        res.status(401).send("Please login to access the content!");
    }
}
module.exports = isAuthenticated;