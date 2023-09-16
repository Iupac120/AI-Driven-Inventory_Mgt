// import { createUserValidator, loginUserValidator, resetPasswordValidator } from "../validators/user.validator.js"
// import { BadRequestError, UnAuthorizedError, NotFoundError, ForBiddenError } from "../errors/customError.js"
// import User from "../models/user.model.js"
// import bcrypt from "bcrypt"
// import env from 'dotenv'
// env.config()
// //import {config} from "../config/index.js"
// import { sendEmail } from "../utils/sendEmail.js"
// import { generateToken, refreshToken } from "../utils/jwt.js"
// import path from "path";
// import jwt from "jsonwebtoken"
// import cloudinary from "cloudinary";




// export default class UserController {
    
//     static async createUser(req, res ) {
//       // Joi validation
//       // const {error} = createUserValidator.validate(req.body)
//       // if (error) throw error
//       const { name, email, password } = req.body;
//       // Confirm  email has not been used by another user
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//       if (existingUser.isVerified) {
//       throw new BadRequestError(`An account with ${email} already exists.`);
//       } else if (existingUser.verifyEmailTokenExpire < Date.now()) {
//       // Remove the existing user if the verification token has expired
//       await User.deleteOne({ _id: existingUser._id });
//       } else {
//       throw new BadRequestError(`Please log in to ${email} to get your verification code.`);
//       }
//     }
//       // Generate verification token
//       const saltRounds = 10//process.env.bycrypt_salt_round
//       // Create verification token
//       const verifyEmailToken = Math.floor(100000 + Math.random() * 900000).toString();
//       // Hash password
//       const hashedPassword = bcrypt.hashSync(password, saltRounds);
     
//       const user = new User ({
//       name,
//       email,
//       password: hashedPassword,
//       verifyEmailToken,
//       verifyEmailTokenExpire: Date.now() + process.env.token_expiry,
//       });
      
//      await user.save()
//        // Set body of email
//       const message = `Hi ${name},\n\n Your verification code is: ${verifyEmailToken}`
      
//       const mailSent = await sendEmail({
//           email: user.email,
//           subject: 'Email verification',
//           message
//         })
//         if(mailSent === false) throw new NotFoundError(`${email} cannot be verified. Please provide a valid email address`)
//         res.status(200).json({
//           status: 'Success',
//           message: `An email verification code has been sent to ${email}.`,
//           // message
//         })
//     }
    
//     static async verifyUser(req, res) {
//       // Extract verification token
//       const verifyEmailToken = req.body.verifyEmailToken;
//       // Find the user by the verification token
//       const user = await User.findOne({
//         verifyEmailToken,
//         verifyEmailTokenExpire: { $gt: Date.now() },
//       });
//       if(!user)  throw new BadRequestError('Invalid or expired verification token');
//       // Update user's verification status
//       user.isVerified = true;
//       user.verifyEmailToken = undefined;
//       user.verifyEmailTokenExpire = undefined;
//       await user.save();
//       const token = generateToken(user)
//       const refresh = refreshToken(user)
//       // console.log(refresh)
//       user.refreshToken = refresh
//       user.accessToken = token
//       await user.save()
//       const userData = user.toObject();
//       // delete userData._id;
//       delete userData.password;
//       const maxAge = process.env.cookie_max_age;
//       res.cookie("refresh_token", refresh, { 
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//       maxAge
//     });
//       res.status(201).json({
//       status: "Success",
//       message: 'Account activated successfully.',
//       data: {
//         user: userData
//       },
//       })
//     }

//     static async loginUser(req, res) {
//       const { error } = loginUserValidator.validate(req.body)
//       if (error) throw new BadRequestError("Invalid login details");
//       const { email, password } = req.body;
//       const user = await User.findOne({ email }).select('+password')
//       if(!user) throw new UnAuthorizedError("Invalid login details")
//       if (!user.isVerified) {
//         throw new UnAuthorizedError(`Please login to ${user.email} to activate your account before logging in.`);
//       }
//       // Compare Passwords
//       const isMatch = bcrypt.compareSync(password, user.password)
//       if(!isMatch) throw new UnAuthorizedError("Invalid login details")
//       const token = generateToken(user)
//       const refresh = refreshToken(user)
//       // console.log(refresh)
//       user.refreshToken = refresh;
//       user.accessToken = token;
//       await user.save()
//       const userData = user.toObject();
//       // delete userData._id;
//       delete userData.password;
//       const maxAge = process.env.cookie_max_age;
//       res.cookie("refresh_token", refresh, { 
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//       maxAge
//     });

//       res.status(200).json({
//         status: "Success",
//         message: "Login successful",
//         data: {
//           user: userData
//         },
//       })
//     }

//     static async forgotPassword(req, res ) {
//       const { email } = req.body;
//       // // Confirm  email exists
//       const user = await User.findOne({ email })
//       if (!user) throw new UnAuthorizedError("Please provide a valid email address")
//       // Get reset token
//       const resetPasswordToken = Math.floor(100000 + Math.random() * 900000).toString();
//       // Get reset Expire
//       const resetPasswordExpire = Date.now() + config.token_expiry;
//       // Update user with reset token and expiration date
//       user.resetPasswordToken = resetPasswordToken;
//       user.resetPasswordExpire = resetPasswordExpire;
//       await user.save();

//       const message = `Hello ${user.name}, Your verification code is: ${resetPasswordToken}`
      
//       await sendEmail({
//           email:user.email,
//           subject: 'Password reset',
//           message
//         })

//         res.status(200).json({
//           status: 'Success',
//           message: `An email verification code has been sent to ${email}`,
//           // message
//         })

//     }
//     // Verify the Reset password code  
//     static async resetPasswordCode(req, res) {
//       const { resetPasswordToken } = req.body;
//       const user = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() },
//       });
//       if (!user) throw new UnAuthorizedError("Invalid or expired reset password token");
//       res.status(200).json({
//         status: "Success",
//         message: "Please input your new password",
//       });
//     }
//     // Update the Password
//     static async resetPassword(req, res) {
//       const  resetPasswordToken  = req.params.resetPasswordToken;
//       const user = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() },
//       });
//       if (!user) throw new UnAuthorizedError("Invalid or expired reset password token");
//       // validate new password
//       const { error } = resetPasswordValidator.validate(req.body);
//       if (error) throw error;
//       // Generate tokens
//       const token = generateToken(user)
//       const refresh = refreshToken(user)
//       // Hash new password
//       const saltRounds = process.env.bycrypt_salt_round;
//       user.password = bcrypt.hashSync(req.body.password, saltRounds);
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
//       user.refreshToken = refresh;
//       user.accessToken = token;
//       await user.save();
//       const userData = user.toObject();
//       delete userData._id;
//       delete userData.password;
//       const maxAge = process.env.cookie_max_age;
//       res.cookie("refresh_token", refresh, { 
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//       maxAge 
//     });
//       res.status(200).json({
//         status: "Success",
//         message: "Password updated successfully",
//         data: {
//           user: userData
//         },
//       });
//     }



//   //logout controller
//   static async logout(req, res) {
//     // Check if cookies exist
//     const cookies = req.cookies;
//     if (!cookies?.refresh_token) {
//       throw new UnAuthorizedError('No Refresh Token in Cookies');
//     }

//     // Clear refresh token cookie
//     res.cookie('refresh_token', '', { expires: new Date(0), httpOnly: true });
    

//     // Find the user by refresh token
//     const foundUser = await User.findOne({ refreshToken: cookies.refresh_token });
//     if (!foundUser) {
//       return res.sendStatus(204); // Successful but no content
//     }
//     // Delete the refresh token in the database
//     foundUser.refreshToken = null;
//     foundUser.accessToken = null;
//     await foundUser.save();

//     res.status(200).json({
//       status: 'Success',
//       message: 'Logout successful',
//     });
//   }

//   static async getProfile(req, res,) {
//         const userId = req.user._id;
//         // Fetch the user from the database
//         const user = await User.findById(userId).select('-_id');
//         res.status(200).json({
//         status: "Success",
//         data: user,
//         })
//     }

//     static async updatePersonalInfo(req, res,) {
//         const userId = req.user._id;
//         // if(!userId) throw new UnAuthorizedError('Not authorized')
//         const { phone, firstName, lastName } = req.body;
//         // Fetch the user from the database
//         const user = await User.findById(userId);
//         // Update the personal information
//         user.firstName = firstName;
//         user.lastName = lastName;
//         user.phone = phone;
//         const fullName = firstName + ' ' + lastName;
//         user.name = fullName;
//         await user.save();
//         const userData = user.toObject();
//         delete userData._id;
//         res.status(200).json({
//         status: "Success",
//         message: "Personal information updated successfully",
//         data: userData,
//         })
//     }

//      static async updateAddressInfo(req, res,) {
//         const userId = req.user._id;
//         // if(!userId) throw new UnAuthorizedError('Not authorized')
//         const { countryName,  cityAndState, numberAndStreet, postalCode } = req.body;
//         // Fetch the user from the database
//         const user = await User.findById(userId);
//         // Update the personal information
//         user.countryName = countryName;
//         user.cityAndState = cityAndState;
//         user.numberAndStreet = numberAndStreet;
//         user.postalCode = postalCode;
//         await user.save();
//         const userData = user.toObject();
//         delete userData._id;
//         res.status(200).json({
//         status: "Success",
//         message: "Address updated successfully",
//         data: userData,
//         })
//     }

//     static async profilePhotoUpload(req, res, next) {
//       const userId = req.user;     
//       // Fetch the user from the database
//       const user = await User.findById(userId);
//       if(!user) throw new NotFoundError('User Not Found');
//       // Update the personal information
//       if(!req.files) throw new BadRequestError('Please upload a profile photo');
//       const file = req.files.file;
//       if(!file.mimetype.startsWith('image')) throw new BadRequestError('Please upload the required format');
//       // Check file size
//       if(file.size > config.max_file_upload) throw new BadUserRequestError(`Please upload an image less than ${config.max_file_upload}`);
//       // Create a custom filename
//       file.name = `photo_${userId}${path.parse(file.name).ext}`;
//       // file.name = `photo_${Date.now()}${Math.round(Math.random() * 1E9)}${path.parse(file.name).ext}`;
      
//       file.mv(`${config.file_upload_path}/${file.name}`, async (err) => {
//         if (err) {
//           console.error(err);
//           return next(new FailedRequestError('Problem with file upload'));
//         }
    
//         // Upload image to Cloudinary
//         cloudinary.v2.uploader.upload(
//           `${config.file_upload_path}/${file.name}`,
//           { folder: "profile-photos" },
//           async (error, result) => {
//             if (error) {
//               console.error(error);
//               return next(new FailedRequestError('Failed to upload image to Cloudinary'));
//             }
    
//             const imageUrl = result.secure_url;
    
//             // Update the photo with the Cloudinary image URL
//             await User.findByIdAndUpdate(userId, { profilePhoto: imageUrl })
    
//             res.status(200).json({
//               status: "Success",
//               message: "Profile photo updated successfully",
//               data: imageUrl
//             });
//           }
//         );
//       });
      
//   }
    
 
//   static async deleteUser(req, res) {
//     const userId = req.user;
//     const verifyEmailToken = req.body.verifyEmailToken;
//     const validUser = await User.findById(userId);
//     if (!validUser) throw new NotFoundError('User Not Found')
//      // Find the user by the verification token
//     const user = await User.findOneAndRemove({
//       verifyEmailToken,
//       verifyEmailTokenExpire: { $gt: Date.now() },
//     });
//     if(!user)  throw new BadUserRequestError('Invalid or expired verification token');
//     res.status(200).json({
//     message: `${user.name} with ${user.email} deleted successfully`,
//     status: "Success",
//     })
//   }
 


// }



    
import User from "../models/user.model.js";
import {v4 as uuidv4} from "uuid";
import sendVerificationEmail from "../utils/mail.js";
import {sendResetEmail} from "../utils/mail.js"
import { sendOTPVericationMail } from "../utils/mail.js";
import { trycatchHandler } from "../utils/trycatchHandler.js";
import { createUserValidator } from "../middlewares/joiSchemaValidation.js";
import { loginUserValidator } from "../middlewares/joiSchemaValidation.js";
import { emailValidator } from "../middlewares/joiSchemaValidation.js";
import { resetPasswordValidator } from "../middlewares/joiSchemaValidation.js";
//import { createCustomError } from "../../errors/customError.js";
import { verifyOTPValidator } from "../middlewares/joiSchemaValidation.js";
//import UserVerification from "../database/model/UserVerification.js";
//import PasswordReset from "../database/model/PasswordReset.js";
import {BadRequestError} from "../errors/customError.js";
import { UnAuthorizedError } from "../errors/customError.js";
import bcrypt from "bcrypt";
//import OTPVerification from "../database/model/OTPVerification.js";
import jwt from "jsonwebtoken";
import { hashData } from "../utils/hashData.js";
import { randomString, randomOtp } from "../utils/randomString.js";


//register a new user
export default class UserController {
  static createUser = trycatchHandler(async(req, res, next ) => {
     // Joi validation
    const {error, value} = await createUserValidator.validate(req.body)
    if(error){
      // console.log(error.details)
      // const err = new Error(error.details[0].message)
      // err.status = 400
      // err.message = error.details[0].message
      // return next(err)
      res.status(400).json(error.message)
    }
    const {username,password,email,firstName,lastName} = req.body
    //check if the user Email already exist in the databse  
        const emailExist = await User.findOne({email})
        if (emailExist){
          return res.status(401).json({msg:"Email alreaday exist, please login"})
        }
        //hash otp code and string
        const otp = randomOtp()
        const uniqueString = randomString()
        const hashedString = await hashData(uniqueString)
        const hashOTP = await hashData(otp)
        const hashPassword = await hashData(password)
        //create new user
        const newUser = new User({
          username,
          email,
          password:hashPassword,
          firstName,
          lastName,
          otpVerificationToken: hashOTP,
          emailVerificationToken: hashedString,
          resetPasswordCreatedAt: Date.now(),
          resetPasswordExpires:Date.now() + 10800000
        })
        await newUser.save()
        //handle email verification
        //await sendVerificationEmail(newUser,uniqueString,res)
        await sendOTPVericationMail(newUser,otp,res)
        res.status(200).json({
        status: "Success",
        message: `Verification token has been seen to ${newUser.email}.`
      })
  })

static async verifyAuth (req,res){
  const {code} = req.query
  res.status(200).json(`This is your otp to finish up your signup ${code}`)
}
  //login a rerurning user
  static async loginUser (req, res){
    // Joi validation
    const {error, value} = await loginUserValidator.validate(req.body)
    if(error){
      // console.log(error.details)
      // const err = new Error(error.details[0].message)
      // err.status = 400
      // err.message = error.details[0].message
      // return next(err)
      res.status(400).json(error.message)
    }
    try{
    const {email,password} = req.body
      // check if the email exist
        const emailExist = await User.findOne({email})
        if (!emailExist){
          return next(createCustomError('Email does not exist, verify email or signup', 401))
        }
        if(!emailExist.isEmailVerified) throw new UnAuthorizedError("Verify with the code send to you to login")
        //check if the password is correct
        const isCorrectPassword = await bcrypt.compare(password, emailExist.password)
        if(!isCorrectPassword) throw new UnAuthorizedError("Incorrect password")
          //generate jwt token
        const accessToken = emailExist.accessJwtToken()
        const refreshJwt = emailExist.refreshJwtToken()
        await User.updateOne({email},{refreshToken:refreshJwt})
        res.cookie("jwt",refreshJwt,{httpOnly: true, maxAge:24*60*60*1000})
        res.status(200).json({
        message: "User login successfully",
        status: "Success",
        data:{
          user: emailExist.username,
          userToken: accessToken
        }
      })
    }catch(err){
      res.status(500).json({message:err.message})
    }
  }






  //verify OTP Email
  static async verifyOTP (req,res,next){
     // Joi validation
    
     const {error, value} = await verifyOTPValidator.validate(req.body)
     if(error){
      //  console.log(error.details)
      //  const err = new Error(error.details[0].message)
      //  err.status = 400
      //  err.message = error.details[0].message
      //  return next(err)
      res.status(400).json(error.message)
     }
     try{
    const {body:{otp,  email}} = req
    //check if the user OTP exists
    const userOTPverifyID = await User.findOne({email})
    //const userOTPverifyID = await User.findById({_id:userId})
    if (!userOTPverifyID){
      throw new UnAuthorizedError("Account is invalid or has been valid already")
    }
    //check if the otp has not expired
    const expiresAt = userOTPverifyID.resetPasswordExpires
    const hashedOTP = userOTPverifyID.otpVerificationToken
    if(userOTPverifyID.isEmailVerified){
      throw new UnAuthorizedError("You have been verified. Please login with your email and password")
    }
    if (expiresAt < Date.now()){
      // otp has expired, delete from the record
        userOTPverifyID.resetPasswordExpires = undefined,
        userOTPverifyID.otpVerificationToken = undefined,
        userOTPverifyID.resetPasswordCreatedAt = undefined
  
      await userOTPverifyID.save()
      throw new UnAuthorizedError("OTP has expired, please request again")
    }
    //hash valid otp
    //const salt = await bcrypt.genSalt(10)
    const isMatch = await bcrypt.compare(otp,hashedOTP)
    if (!isMatch){
      throw new UnAuthorizedError("Invalid code passed, check again")
    }
    //update valid otp user
    userOTPverifyID.isEmailVerified = true,
    userOTPverifyID.resetPasswordExpires = undefined,
    userOTPverifyID.otpVerificationToken = undefined,
    userOTPverifyID.resetPasswordCreatedAt = undefined
    await userOTPverifyID.save()
    res.status(201).json({
      status:"Success",
      message:"User email verified successfully"
    })
  }catch(err){
    console.log(err)
    res.status(500).json({message:err.message})
  }
  }


//resed otp, if it has expired
static resendOTPVerification = trycatchHandler(async(req,res,next) => {
         // Joi validation
         const {error, value} = await emailValidator.validate(req.body)
         if(error){
          //  console.log(error.details)
          //  const err = new Error(error.details[0].message)
          //  err.status = 400
          //  err.message = error.details[0].message
          //  return next(err)
          res.status(400).json(error.message)
         }
  const {email} = req.body
  // delete otp in record
  const otpDel = await User.findOne({email:email})
  if(!otpDel){
    return res.status(401).json("Please resend, cannot find your ID")
  }
  const otp = randomOtp()
  const hashOtp = await hashData(otp)
  otpDel.resetPasswordExpires = Date.now() + 10800000
  otpDel.otpVerificationToken = hashOtp
  otpDel.resetPasswordCreatedAt = Date.now()
  await otpDel.save()
  //send otp to email
  await sendOTPVericationMail(otpDel,otp, res)
  res.status(201).json({
    status:"Success",
    message:"Check your mail for new code"
  })
 })


  //request password reset link
  static requestPasswordReset = trycatchHandler(async(req,res,next) => {
           // Joi validation
           const {error, value} = await emailValidator.validate(req.body)
           if(error){
            //  console.log(error.details)
            //  const err = new Error(error.details[0].message)
            //  err.status = 400
            //  err.message = error.details[0].message
            //  return next(err)
            res.status(400).json(error.message)
           }
    const {email} = req.body
    //check if email exist
    const emailExist = await User.findOne({email})
    if(!emailExist){
      return res.status(401).json("Invalid email account, please check your email")
    }
    //check if the email is verified
    if(!emailExist.isEmailVerified){
      return res.status(401).json("You have not been verified.Click the link send to you or resend verification to be verified")
    }
    //update databse
    console.log("here")
    const resetString = randomString()
    const hashedString = await hashData(resetString)
    emailExist.passwordResetToken = hashedString,
    emailExist.resetPasswordCreatedAt = Date.now(),
    emailExist.resetPasswordExpires = Date.now() + 1800000
  await emailExist.save()
    //send a password request url,if verified valid account is found
  await sendResetEmail(emailExist,resetString, res)
      //email sent successfully
  return res.status(201).json({message:"Email sent successfully"})
  })


  //reset password
  static resetPassword = trycatchHandler(async(req,res,next) => {
           // Joi validation
           const {error, value} = await resetPasswordValidator.validate(req.body)
           if(error){
            //  console.log(error.details)
            //  const err = new Error(error.details[0].message)
            //  err.status = 400
            //  err.message = error.details[0].message
            //  return next(err)
            res.status(400).json(error.message)
           }
    const {params:{userId, resetString},body:{newPassword}} = req
    //check if the user exist in db
    const foundResetLink = await User.findById({_id:userId});
    if (!foundResetLink){
      return res.status(401).json("User ID could not be found to sete password")
    }
    //check if the found reset has not expired
    const expiresAt = foundResetLink.resetPasswordExpires
    if (expiresAt < Date.now()){
      //await PasswordReset.deleteOne({userId})
      throw new UnAuthorizedError("Sorry, your link has expired, press reset button to genearte new one")
    } 
    //reset password record still valid
    const isMatch = await bcrypt.compare(resetString, foundResetLink.passwordResetToken)
    if (!isMatch){
      throw new UnAuthorizedError("Incorrect password record, try again")
    }
    //if the passwords match, store it in databse
    const genPass = await hashData(newPassword)
    //update the new password in user db
    foundResetLink.password = genPass
    foundResetLink.resetPasswordExpires = undefined,
    foundResetLink.passwordResetToken = undefined,
    foundResetLink.resetPasswordCreatedAt = undefined
    await foundResetLink.save()
    //password updating successfull
    return res.status(201).json({msg:"Password updated successful"})
  })


  //refresh token handler
  static async refresh (req,res){
    //access cookie to cookies
    const cookies = req.cookies
     //check if cookies exist
     console.log("one", cookies)
     if(!cookies?.jwt) return res.sendStatus(401)
    const refreshTokenCookie = cookies.jwt
    console.log("two", refreshTokenCookie)
    //find from record the cookie user
    const foundUser = await User.findOne({refreshToken:refreshTokenCookie})
    console.log("three",foundUser)
    if (!foundUser) return res.sendStatus(403)
    jwt.verify(refreshTokenCookie,process.env.REFRESH_TOKEN,(err,decoded) => {
      console.log("four",decoded)
        if(err || new String(foundUser._id).trim() !== new String(decoded.userId).trim()) return res.status(403)
        console.log("five", foundUser._id == decoded.userId)
        const acctoke = foundUser.accessJwtToken()
        res.status(201).json(acctoke)
    })
  }

  //logout controller
  static async logout (req,res){
    //on the client delete the access token
    //access cookie to cookies
    const cookies = req.cookies
    //check if cookies exist
    console.log("aaa")
    if(!cookies?.jwt) return res.sendStatus(204) //no content
    //if there is a cookie in the req
    const refreshTokenCookie = cookies.jwt
    console.log("one")
    //find from db if there is refresh token
    const foundUser = await User.findOne({refreshToken:refreshTokenCookie})
    if (!foundUser) {
      //clear the cookies the cookie though not found in the db
      console.log("two")
      res.clearCookie("jwt",{httpOnly: true, maxAge:24*60*60*1000})
      return res.sendStatus(204) //successful but not content
    }
    console.log("three")
    //delete the refresh token in the db
    foundUser.refreshToken = null
    await foundUser.save()
    res.clearCookie("jwt",{httpOnly: true, maxAge: 24*60*60*1000})
    res.status(201).json({message:"You have been logged out"})
  }
  
  //user profile
  static async profile (req,res){
    try {
      const user = await User.findById({_id:req.user.jwtId})
      if(user){
        res.status(200).json({
          username: user.username,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        })
      }else{
        res.status(404).json({message:"Sorry, you data is not found, try to register"})
      }
    } catch (err) {
      res.status(404).json({
        status:"Failed",
        message:err.message
      })
    }
  }
  //update user profile
  static async updateProfile (req,res){
    try {
      const user = await User.findByIdAndUpdate({_id:req.params.userId},{$set:req.body},{
        new: true,
        runValidators: true
      })
      // if(user){
      //     user.username = req.body.username || user.username,
      //     user.name = req.body.name || user.name,
      //     user.email = req.body.email || user.email
      // }
      // if(req.body.password){
      //   user.password = req.body.password
      // }
      // const updateUser = await user.save()
      res.status(200).json({
        username: user.username,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token : user.accessJwtToken()
      })
    } catch (err) {
      res.status(404).json({
        status:"Failed",
        message:err.message
      })
    }
  }

  //delete user
  static async deleteUser (req,res){
    try{
    const user = await User.findByIdAndDelete(req.params.userId)
    if(!user){
      throw new UnAuthorizedError("User not found")
    }
    res.status(200).json({
      status:"success",
      message:"User has been deleted"
    })
  }catch(err){
    res.status(500).json({message:err.message})
  }
  }

  
}
 


