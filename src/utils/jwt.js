import jwt from "jsonwebtoken"
import env from "dotenv"
env.config()
//import {config} from "../config/index.js"

export function generateToken(user){
  const payload = {
    _id: user._id
  }
  const token = jwt.sign(payload, process.env.jwt_secret_key, { expiresIn: process.env.jwt_expiry });
  return token 
}
export function refreshToken(user){
  const payload = {_id:user._id}
  const token = jwt.sign(payload, process.env.refresh_secret_key, {expiresIn:process.env.refresh_expiry})
  return token
}
export function verifyToken(token){
  return jwt.verify(token, process.env.jwt_secret_key)
}