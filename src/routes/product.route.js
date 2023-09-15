// Destructure Router from express
import { Router } from "express"
import ProductController from "../controllers/product.js"
import { trycatchHandler } from "../utils/trycatchHandler.js"
import { userAuthMiddleWare } from "../middlewares/authMiddleware.js";
// Setting up the Router
const router = Router()
// Setting up the User signup/login routes
router.post("/add", trycatchHandler(ProductController.createProduct));
router.get('/getAllProduct', trycatchHandler(ProductController.getAllProduct));
router.post('/set-minimum-stock', trycatchHandler(ProductController.createMinimumStock));
router.get('/searchByName', trycatchHandler(ProductController.searchByName));
router.get('/searchByBarcode', trycatchHandler(ProductController.searchByBarcode));
router.get('/:id', trycatchHandler(ProductController.getSingleProduct));
router.put('/:id', trycatchHandler(ProductController.updateProduct));
router.delete('/:id', trycatchHandler(ProductController.deleteProduct));




//Exporting the User Router
export { router }