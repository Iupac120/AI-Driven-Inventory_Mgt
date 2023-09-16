// Destructure Router from express
import { Router } from "express"
import InventoryController from "../controllers/inventory.js"
import { trycatchHandler } from "../utils/trycatchHandler.js"
import jwtAuthentication from "../middlewares/jwtAuthentication.js"
// Setting up the Router
const router = Router()
// Setting up the User signup/login routes
router.get('/getAllInventory', trycatchHandler(InventoryController.getAllInventory));
router.get('/get', trycatchHandler(InventoryController.getSingleInventory));
router.get('/search', trycatchHandler(InventoryController.search));
router.get('/check-stock', trycatchHandler(InventoryController.checkStock));
router.put('/item/:id',jwtAuthentication, trycatchHandler(InventoryController.updateInventory));
router.delete('/item/:id',jwtAuthentication, trycatchHandler(InventoryController.deleteInventory));




//Exporting the User Router
export { router }