const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.header('Authorization');
    console.log(token);
    if (!token) return res.status(401).send("Sorry the user is unauthorised");
    token = token.split(' ')[1].trim();
    try {
        let payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = payload;
        console.log("here after authorization");
        next();
    } catch (e) {
        res.status(400).send("Not valid token");
    }
}