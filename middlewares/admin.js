module.exports = function (req, res, next) {
    if (req.user.role !== 'admin') return res.status(401).send("Forbidden");
    next();
}