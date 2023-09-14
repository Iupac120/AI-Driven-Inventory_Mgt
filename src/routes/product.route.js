// Destructure Router from express
import { Router } from "express"
import ProductController from "../controllers/product.js"
import { trycatchHandler } from "../utils/trycatchHandler.js"
import { userAuthMiddleWare } from "../middlewares/authMiddleware.js";
// Setting up the Router
const router = Router()
// Setting up the User signup/login routes
router.post("/inventory/add", trycatchHandler(ProductController.createProduct));
router.post('/inventory/set-minimum-stock', trycatchHandler(ProductController.createMinimumStock));




//Exporting the User Router
export { router }