import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        message:"FirstName is Required"
    },
    lastname:{
        type:String,
        required:true,
        message:"LastName is Required"
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        message:"Password is required"
    }

},
{
    versionKey:false
})

const UserModel=mongoose.model("User",UserSchema)
export { UserModel as User}