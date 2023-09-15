// Destructure Router from express
import { Router } from "express"
import UserController from "../controllers/auth.js"
import { trycatchHandler } from "../utils/trycatchHandler.js"
import { userAuthMiddleWare } from "../middlewares/authMiddleware.js";
// Setting up the Router
const router = Router()
// Setting up the User signup/login routes
router.post("/signup", trycatchHandler(UserController.createUser));
router.get("/signup", trycatchHandler(UserController.getCreateUser));
router.post('/verify', trycatchHandler(UserController.verifyUser));
router.get('/verify', trycatchHandler(UserController.getVerifyUser));
router.get("/signin", trycatchHandler(UserController.getLogin));
router.post("/signin", trycatchHandler(UserController.loginUser));
router.get("/logout", userAuthMiddleWare, trycatchHandler(UserController.logout));
router.get("/forgotpassword", trycatchHandler(UserController.getForgotPassword));
router.post("/forgotpassword", trycatchHandler(UserController.forgotPassword));
router.get("/resetpassword/code", trycatchHandler(UserController.getResetPasswordCode));
router.post("/resetpassword/code", trycatchHandler(UserController.resetPasswordCode));
router.put("/resetpassword/:resetPasswordToken", trycatchHandler(UserController.resetPassword));
router.get("/profile", userAuthMiddleWare, trycatchHandler(UserController.getProfile));
router.get("/profile/personalinfo", userAuthMiddleWare, trycatchHandler(UserController.getUpdatePersonalInfo));
router.put("/profile/personalinfo", userAuthMiddleWare, trycatchHandler(UserController.updatePersonalInfo));
router.get("/profile/addressinfo", userAuthMiddleWare, trycatchHandler(UserController.getUpdateAddressInfo));
router.put("/profile/addressinfo", userAuthMiddleWare, trycatchHandler(UserController.updateAddressInfo));
router.get("/profile/photo", userAuthMiddleWare, trycatchHandler(UserController.getProfilePhotoUpload));
router.put("/profile/photo", userAuthMiddleWare, trycatchHandler(UserController.profilePhotoUpload));
router.delete("/deleteuser", userAuthMiddleWare, trycatchHandler(UserController.deleteUser));




//Exporting the User Router
export { router }