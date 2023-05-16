module.exports.isAnonym = (req,res,next)=>{
    const jwt = require('jsonwebtoken')
    const token = req.headers.authorization
    try {
        jwt.verify(token, process.env.SECRET)
        return res.status(400).json({err: "already connected"})
    }
    catch {
        next()
    }
}