import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        min: 1,
        max: 100
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validator:{
            match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please add a valid email string to the email path."]
        }
    },
    password:{
        type: String,
        required: true,
        min: 6
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: null
    },
    accessToken:{
        type: String,
        default: null
    },
    verifyEmailToken: String,
    verifyEmailTokenExpire: String,
    resetPasswordToken: String,
    resetPasswordExpire:String,
    googleId:String,
    facebookId: String,
    firstName: String,
    lastName: String,
    phone:{
        type: String,
        unique: false
    },
    countryName: String,
    city: String,
    state: String,
    profilePhoto:{
        type: String,
        default: "no photo.jpg"
    }
},
{
    timestamps: true
})

export default mongoose.model("user", userSchema)