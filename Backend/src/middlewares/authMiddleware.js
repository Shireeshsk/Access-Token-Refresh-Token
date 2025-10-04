import jwt from "jsonwebtoken"
import {config} from "dotenv"
config()
import { User } from "../models/User.js"

export const verifyAuth = async function(req,res,next){
    const authHeaders = req.headers['Authorization'] || req.headers['authorization']
    if(!authHeaders){
        return res.status(401).json({
            success : false,
            message : "Token Not Found"
        })
    }
    const token = authHeaders.split(" ")[1]
    if(!token){
        return res.status(401).json({
            success : false,
            message : "Token Not Found"
        })
    }
    try {
        const payload = jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        const user = await User.findById(payload.id)
        if(!user){
            return res.status(401).json({
                success : false,
                message : "Invalid Token"
            })
        }
        req.user = user
        next();
    } catch (error) {
        return res.status(401).json({
            success : false,
            message : "Invalid Token"
        })
    }
}