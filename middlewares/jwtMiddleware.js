import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) =>{
    let token = req.headers.authorization

    if(!token) {
        return res.status(403).json({message: "No token provided"})
    }

    token = token.split("")[1]
    console.log(token)

    try{

    const {email} =jwt.verify(token, process.env.JWT_SECRET)

    req.email=email

    next()

}catch(err){
    console.error(err)
    return res.status(403).json({message: "Invalid token"})
}



}