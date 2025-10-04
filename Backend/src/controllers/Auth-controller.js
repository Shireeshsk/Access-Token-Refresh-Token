import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { generateAccessToken,generateRefreshToken , HashRefreshToken , VerifyHashedRefresh } from '../utils/generateToken.js'
export const registerUser = async function(req,res){
    const {username , email , password} = req.body
    try{
        if(!username || !password || !email){
            return res.status(401).json({
                success : false,
                message : "All Required Credentials"
            })
        }
        const user = await User.findOne({$or : [{username},{email}]})
        if(user){
            return res.status(400).json({
                status : false,
                message : 'User Already Exists'
            })
        }
        const newUser = await new User({email,password,username})
        await newUser.save()
        const accessToken = generateAccessToken(newUser)
        const refreshToken = generateRefreshToken(newUser)
        const hashedtoken = await HashRefreshToken(refreshToken)
        newUser.refreshtoken = hashedtoken
        await newUser.save()
        res.cookie(process.env.COOKIE_NAME,refreshToken,{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            maxAge : 7 * 24 * 60 * 60 * 1000,
            sameSite : 'lax'
        })
        return res.status(200).json({
            success : true,
            message : 'User Registration Successful',
            accessToken : accessToken
        })
    }catch(err){
        console.log('Internal server error \n',err)
        return res.status(500).json({
            success : false,
            message : 'Internal server error'
        })
    }
}

export const loginUser = async function(req,res){
    try{
        const {username , password} = req.body
        const user = await User.findOne({username})
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            })
        }
        const match = await user.verifyPassword(password)
        if(!match){
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            })
        }
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        const hashedtoken = await HashRefreshToken(refreshToken)
        user.refreshtoken = hashedtoken
        await user.save()
        res.cookie(process.env.COOKIE_NAME,refreshToken,{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            maxAge : 7 * 24 * 60 * 60 * 1000,
            sameSite : 'lax'
        })
        return res.status(200).json({
            success : true,
            message : "Login successful",
            accessToken : accessToken,
        })
    }catch(err){
        console.log( 'Internal server error',err)
        return res.status(500).json({
            success : false,
            message : 'Internal server error'
        })
    }
}

export const RefreshToken = async function(req,res){
    const token = req.cookies[process.env.COOKIE_NAME]
    if(!token){
        return res.status(401).json({
            success : false,
            message : "Token Not Found"
        })
    }
    try {
        const payload = jwt.verify(token,process.env.JWT_REFRESH_SECRET)
        const user = await User.findOne({_id : payload.id})
        if(!user || !(await VerifyHashedRefresh(token,user.refreshtoken))){
            return res.status(403).json({
                success : false,
                message : "Forbidden to refresh the token"
            })
        }
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        const newhashedrefresh = await HashRefreshToken(refreshToken)
        user.refreshtoken = newhashedrefresh
        await user.save()
        res.cookie(process.env.COOKIE_NAME,refreshToken,{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            maxAge : 7 * 24 * 60 * 60 * 1000,
            sameSite : 'lax'
        })
        return res.status(200).json({
            success : true,
            message : "Access Token Refreshed Successfully",
            accessToken : accessToken
        })
    } catch (err) {
        console.log( 'Internal server error',err)
        return res.status(500).json({
            success : false,
            message : 'Internal server error'
        })
    }
}

export const logoutUser = async function(req,res){
    const token = req.cookies[process.env.COOKIE_NAME]
    if(!token){
        return res.status(401).json({
            success : false,
            message : "Token not Found"
        })
    }
    try {
        const payload = jwt.verify(token,process.env.JWT_REFRESH_SECRET)
        const user = await User.findOne({_id : payload.id})
        if(user){
            user.refreshtoken = null
            await user.save()
        }
        res.clearCookie(process.env.COOKIE_NAME,{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : 'strict'
        })
        return res.status(200).json({
            success : true,
            message : "Logout Successful"
        })
    } catch (err) {
        console.log( 'Internal server error',err)
        return res.status(200).json({
            success : true,
            message : "Logout Successful"
        })
    }
}
