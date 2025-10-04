import { User } from "../models/User.js"
export const resetPassword = async function(req,res){
    const {newpassword} = req.body
    if(!newpassword){
        return res.status(401).json({
            success : false,
            message : "Password is Missing"
        })   
    }
    try {
        const id = req.user._id
        const user = await User.findById(id)
        if(!user){
            return res.status(401).json({
                success : false,
                message : "User Not Found"
            })
        }
        user.password = newpassword
        await user.save()
        return res.status(200).json({
            success : true,
            message : "Password Reset Successful"
        })
    } catch (error) {
        console.log( 'Internal server error',err)
        return res.status(200).json({
            success : true,
            message : "Logout Successful"
        })
    }
}

export const getProfile = async function(req,res){
    try{
        return res.status(200).json({
            success : true,
            User : req.user
        })
    }catch(err){
        console.log(err)
        return res.status(200).json({
            success : true,
            message : "Logout Successful"
        })
    }
}