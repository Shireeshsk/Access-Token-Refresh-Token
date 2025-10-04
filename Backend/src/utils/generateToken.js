import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
import argon2 from "argon2"
config()

export const generateAccessToken = function(user){
    const accesspayload = {
        id : user._id,
        username :  user.username,
        email : user.email,
        role : user.role
    }
    const accessToken = jwt.sign(accesspayload,process.env.JWT_ACCESS_SECRET,{expiresIn : '15m'})
    return accessToken
}

export const generateRefreshToken = function(user){
    const refreshpayload = {
        id : user._id,
        username : user.username
    }
    const refreshToken = jwt.sign(refreshpayload,process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'})
    return refreshToken
}

export const HashRefreshToken = async (token)=>{
    const secret = process.env.JWT_REFRESH_SECRET
    const hashed = await argon2.hash(token + secret,{ type: argon2.argon2id, hashLength: 32 })
    return hashed
}

export const VerifyHashedRefresh = async(token,hashedtoken)=>{
    const secret = process.env.JWT_REFRESH_SECRET
    const sk = await argon2.verify(hashedtoken, token + secret)
    return sk
}