module.exports.isAuth = (req,res,next)=>{
    const jwt = require('jsonwebtoken')
    const token = req.headers.authorization

    try {
        const info = jwt.verify(token, process.env.SECRET)
        req.user = info
        next()
    }
    catch {
        return res.status(401).json({err: "not authorized"})
    }
}