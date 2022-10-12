const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // get token
        let token = req.header("Authorization");
        if (!token) return res.status(401).send("Access denied");

        //check token
       let payload = jwt.verify(token, process.env.secKey);
       req.payload = payload;
       next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }

}