// import mongoose from "mongoose";
// const userSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required: true,
//         min: 1,
//         max: 100
//     },
//     email:{
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         validator:{
//             match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please add a valid email string to the email path."]
//         }
//     },
//     password:{
//         type: String,
//         required: true,
//         min: 6
//     },
//     isVerified:{
//         type: Boolean,
//         default: false
//     },
//     refreshToken: {
//         type: String,
//         default: null
//     },
//     accessToken:{
//         type: String,
//         default: null
//     },
//     verifyEmailToken: String,
//     verifyEmailTokenExpire: String,
//     resetPasswordToken: String,
//     resetPasswordExpire:String,
//     googleId:String,
//     facebookId: String,
//     firstName: String,
//     lastName: String,
//     phone:{
//         type: String,
//         unique: false
//     },
//     countryName: String,
//     city: String,
//     state: String,
//     profilePhoto:{
//         type: String,
//         default: "no photo.jpg"
//     }
// },
// {
//     timestamps: true
// })

// export default mongoose.model("user", userSchema)
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true,
      validators: {
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please add a valid email string to the email path."]
      }
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified:{
      type: Boolean,
      default: false
    },
    isAdmin:{
      type: Boolean,
      default: false
    },
    refreshToken:{
      type: String,
      default: null
    },
     emailVerificationToken: {
      type: String,
      default: null
     },
     otpVerificationToken: {
      type: String,
      default: null
     },
     passwordResetToken: {
      type: String,
      default: null
     },
     googleId: {
      type: String,
      default: null
     },
     facebookId: {
      type: String,
      default: null
     },
     resetPasswordExpires:{
      type: Date,
      default: null
     },
     resetPasswordCreatedAt:{
      type: Date,
      default: null
     },
    firstName: String,
    lastName: String,
    fullName: String,
  }, {
    timestamps: true
  })
  
  UserSchema.pre("save", function(next){
    this.fullName = this.firstName + " " +  this.lastName 
    next()
  })

// UserSchema.pre('save', async function(next){
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
// })
UserSchema.methods.accessJwtToken = function (){
return jwt.sign({userId:this._id, username:this.username},process.env.ACCESS_TOKEN,{httpOnly: true,sameSite: "strict",secure: true,expiresIn:process.env.ACCESS_LIFETIME})
} 

UserSchema.methods.refreshJwtToken = function (){
  return jwt.sign({userId:this._id, username:this.username},process.env.REFRESH_TOKEN,{httpOnly: true,sameSite: "strict",secure: true,expiresIn:process.env.REFRESH_LIFETIME})
  }  

UserSchema.methods.comparePassword = async function(candidatePassword){
  const isMatch =  await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
}



export default mongoose.model("User", UserSchema)