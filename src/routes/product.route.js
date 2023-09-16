// Destructure Router from express
import { Router } from "express"
import ProductController from "../controllers/product.js"
import { trycatchHandler } from "../utils/trycatchHandler.js"
import jwtAuthentication from "../middlewares/jwtAuthentication.js"

// Setting up the Router
const router = Router()
// Setting up the User signup/login routes
router.post("/add",jwtAuthentication,trycatchHandler(ProductController.createProduct));
router.get('/getAllProduct', trycatchHandler(ProductController.getAllProduct));
router.get('/searchByName', trycatchHandler(ProductController.searchByName));
router.get('/searchByBarcode', trycatchHandler(ProductController.searchByBarcode));
router.get('/item/:id',trycatchHandler(ProductController.getSingleProduct));
router.put('/item/:id',jwtAuthentication,trycatchHandler(ProductController.updateProduct));
router.delete('/item/:id',jwtAuthentication,trycatchHandler(ProductController.deleteProduct));




//Exporting the User Router
export { router }