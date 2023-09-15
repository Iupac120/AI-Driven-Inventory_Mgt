// // Destructure Router from express
// import { Router } from "express"
// import UserController from "../controllers/auth.js"
// import { trycatchHandler } from "../utils/trycatchHandler.js"
// import { userAuthMiddleWare } from "../middlewares/authMiddleware.js";
// // Setting up the Router
// const router = Router()
// // Setting up the User signup/login routes
// router.post("/signup", trycatchHandler(UserController.createUser));
// router.get("/signup", trycatchHandler(UserController.getCreateUser));
// router.post('/verify', trycatchHandler(UserController.verifyUser));
// router.get('/verify', trycatchHandler(UserController.getVerifyUser));
// router.get("/signin", trycatchHandler(UserController.getLogin));
// router.post("/signin", trycatchHandler(UserController.loginUser));
// router.get("/logout", userAuthMiddleWare, trycatchHandler(UserController.logout));
// router.get("/forgotpassword", trycatchHandler(UserController.getForgotPassword));
// router.post("/forgotpassword", trycatchHandler(UserController.forgotPassword));
// router.get("/resetpassword/code", trycatchHandler(UserController.getResetPasswordCode));
// router.post("/resetpassword/code", trycatchHandler(UserController.resetPasswordCode));
// router.put("/resetpassword/:resetPasswordToken", trycatchHandler(UserController.resetPassword));
// router.get("/profile", userAuthMiddleWare, trycatchHandler(UserController.getProfile));
// router.get("/profile/personalinfo", userAuthMiddleWare, trycatchHandler(UserController.getUpdatePersonalInfo));
// router.put("/profile/personalinfo", userAuthMiddleWare, trycatchHandler(UserController.updatePersonalInfo));
// router.get("/profile/addressinfo", userAuthMiddleWare, trycatchHandler(UserController.getUpdateAddressInfo));
// router.put("/profile/addressinfo", userAuthMiddleWare, trycatchHandler(UserController.updateAddressInfo));
// router.get("/profile/photo", userAuthMiddleWare, trycatchHandler(UserController.getProfilePhotoUpload));
// router.put("/profile/photo", userAuthMiddleWare, trycatchHandler(UserController.profilePhotoUpload));
// router.delete("/deleteuser", userAuthMiddleWare, trycatchHandler(UserController.deleteUser));




// //Exporting the User Router
// export { router }

import express from 'express';
import UserController from "../controllers/auth.js"
import { trycatchHandler } from '../utils/trycatchHandler.js';
import jwtAuthentication from '../middlewares/jwtAuthentication.js';
import { verifyTokenAndAdmin } from '../utils/verifyTokenAndAdmin.js';

// Setting up our User router
//const router = new express.Router()
const router = express.Router()

// User Creation Route
router.post("/signup", UserController.createUser)
// login router
router.post("/login",UserController.loginUser)
//user profile
router.get("/profile",jwtAuthentication,UserController.profile)
//update profile
router.put("/Profile/:userId",jwtAuthentication,UserController.updateProfile)
//link router for email
router.get("/verify/:userId/:uniqueString",UserController.getUserEmailLink)
// error link router for email
router.get("/verified",UserController.getUserEmailMsg)
//request password reset router
router.post("/requestPasswordReset",UserController.requestPasswordReset)
// reset password
router.post("/resetPassword/:userId/:resetString",UserController.resetPassword)
//resend email verification
router.post("/resendVerificationLink",UserController.resendVericationLink)
//otp verification route
router.post("/verify_otp/:userId",UserController.verifyOTP)
//resend otp verification after expiration
router.post("/resend_otp_verification", UserController.resendOTPVerification)
// refresh route
router.get("/refresh", UserController.refresh)
// logout route
router.get("/logout",UserController.logout)
//delete user
router.delete("/profile/:userId", jwtAuthentication,UserController.deleteUser)
//admin can find any user
router.get("/find/:id", verifyTokenAndAdmin,UserController.deleteUser)
//admin can find all users
router.get("/find", verifyTokenAndAdmin,UserController.deleteUser)
//Exporting the User Router
export { router }

// export const obj = { name: "james" }

// export function callName(){
//   console.log("Calling ", obj.name)
// }

