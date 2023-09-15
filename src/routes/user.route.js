// Destructure Router from express
import { Router } from "express"
import UserController from "../controllers/auth.js"
import { trycatchHandler } from "../utils/trycatchHandler.js"
import { userAuthMiddleWare } from "../middlewares/authMiddleware.js";
// Setting up the Router
const router = Router()
// Setting up the User signup/login routes
router.post("/signup", trycatchHandler(UserController.createUser));
router.get("/signup", trycatchHandler(UserController.getUserPage));
router.post('/verify', trycatchHandler(UserController.verifyUser));
router.post("/signin", trycatchHandler(UserController.loginUser));
router.get("/logout", userAuthMiddleWare, trycatchHandler(UserController.logout));
router.post("/forgotpassword", trycatchHandler(UserController.forgotPassword));
router.post("/resetpassword/code", trycatchHandler(UserController.resetPasswordCode));
router.put("/resetpassword/:resetPasswordToken", trycatchHandler(UserController.resetPassword));
router.get("/profile", userAuthMiddleWare, trycatchHandler(UserController.getProfile));
router.put("/profile/personalinfo", userAuthMiddleWare, trycatchHandler(UserController.updatePersonalInfo));
router.put("/profile/addressinfo", userAuthMiddleWare, trycatchHandler(UserController.updateAddressInfo));
router.put("/profile/photo", userAuthMiddleWare, trycatchHandler(UserController.profilePhotoUpload));
router.delete("/deleteuser", userAuthMiddleWare, trycatchHandler(UserController.deleteUser));




//Exporting the User Router
export { router }