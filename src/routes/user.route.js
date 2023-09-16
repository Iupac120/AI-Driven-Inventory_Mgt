
import express from 'express';
import UserController from "../controllers/auth.js"
import jwtAuthentication from '../middlewares/jwtAuthentication.js';
import { trycatchHandler } from '../utils/trycatchHandler.js';


const router = express.Router()

// User Creation Route
router.post("/signup", UserController.createUser)
router.post("/login",UserController.loginUser)
router.get("/profile",jwtAuthentication,UserController.profile)
router.put("/Profile/:userId",jwtAuthentication,UserController.updateProfile)
router.post("/requestPasswordReset",UserController.requestPasswordReset)
router.post("/resetPassword/:userId/:resetString",UserController.resetPassword)
router.post("/verify_otp",UserController.verifyOTP)
router.get("/auth/verify-email",trycatchHandler(UserController.verifyAuth))
router.post("/resend_otp_verification", UserController.resendOTPVerification)
router.get("/refresh", UserController.refresh)
router.get("/logout",UserController.logout)
router.delete("/profile/:userId", jwtAuthentication,UserController.deleteUser)

//Exporting the User Router
export { router }



