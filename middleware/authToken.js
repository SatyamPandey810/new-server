const jwt = require("jsonwebtoken")

async function authToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(200).json({
                message: "Token is missing",
                error: true,
                success: false
            })
        }
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (error, decoded) {
            if (error) {
                throw new Error
            }
            req.userId = decoded.userId       
            // console.log(decoded.userId);         
            next()
        })


    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            data: [],
            error: true,
            success: false
        })
    }
}
module.exports = authToken