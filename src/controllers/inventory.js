import Product from "../models/product.model.js"
import Inventory from "../models/inventory.model.js"

export default class ProductController {
   
        // Get all inventory items
  static async getAllInventory (req, res){
    const items = await Inventory.find();
    res.status(200).send(items);
 }

// Get a specific inventory item by ID
  static async getSingleInventory (req, res){
    const {name} = req.body
    const item = await Product.findOne({name});
    if (!item) {
      return res.status(404).send("Item does not exist");
    }
    res.status(200).send(item);
}

// Update an inventory item by ID
static async updateProduct (req, res) {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'barcode', 'photo', 'price', 'category', 'expiryDate', 'minimumStock'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
}

// Delete an inventory item by ID
static async deleteProduct (req, res) {
    const item = await Product.findByIdAndDelete(req.params.id);
    if(item){
      const inventoryProduct = await Inventory.findOneAndUpdate({name: item.name})
        inventoryProduct.quantity -= 1;
        inventoryProduct.total = inventoryProduct.quantity * inventoryProduct.price
        await inventoryProduct.save()
    }
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.status(200).send("Item delete successfully");
}

    
// Search inventory items by name
static async search (req, res){
  const {name, price, quantity, inStock} = req.query
  const queryObject = {}
  if (inStock){
        queryObject.inStock = inStock === 'true'? true: false
     }

  if (!searchName) {
    return res.status(400).send({ error: 'Name query parameter is required.' });
  }
    const items = await Product.find({ name: { $regex: searchName, $options: 'i' } });
    res.status(200).send(items);
}

// Search inventory items by barcode
static async searchByBarcode (req, res){
  const searchBarcode = req.query.barcode;
  if (!searchBarcode) {
    return res.status(400).send({ error: 'Barcode query parameter is required.' });
  }
    const item = await Product.findOne({ barcode: searchBarcode });
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
}

}







