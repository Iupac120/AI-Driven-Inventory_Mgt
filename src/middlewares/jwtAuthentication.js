import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { UnAuthorizedError } from "../errors/customError.js";


export default async function jwtAuthentication(req,res,next) {
    //check headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json("Invalid credential")
    }
    //if header is valid
    const token = authHeader.split(' ')[1]
    try {
        //VERIFY jwt credential
        const payload = jwt.verify(token,process.env.ACCESS_TOKEN)
        req.user = {jwtId: payload.userId, name:payload.username}
        //req.user = await User.find({_id: payload.userId}).select("-password")
        next()
    } catch (error) {
        return res.status(401).json("Failed credential verfication")
    }
} 
