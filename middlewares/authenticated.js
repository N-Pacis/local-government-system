const jwt = require('jsonwebtoken')
const config = require('config')

function authenticate(req,res,next){
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send("Access denied you need to login first")
    try{
        const decodedToken = jwt.verify(token,config.get("jwtPrivateKey"))
        req.user = decodedToken
        next()
    }
    catch(ex){
        res.status(400).send("Invalid token")
    }
}
module.exports.auth = authenticate