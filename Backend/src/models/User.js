import mongoose from "mongoose";
import { hash, verify } from "argon2";

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        index : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user"
    },
    refreshtoken:{
        type : String
    }
},{timestamps : true})

userSchema.pre('save',async function(next){
    try{
        if(this.isModified('password')){
            const hashedpassword = await hash(this.password)
            this.password = hashedpassword
        }
        next()
    }
    catch(error){
        next(error)
    }
})

userSchema.methods.verifyPassword = async function(pass){
    try{
        const match = await verify(this.password,pass)
        return match
    }catch(err){
        console.log(err)
        return false
    }
}

export const User = new mongoose.model('User',userSchema)
