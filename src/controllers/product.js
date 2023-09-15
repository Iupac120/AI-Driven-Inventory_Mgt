import Product from "../models/product.model.js"
import Inventory from "../models/inventory.model.js"
import {createCanvas} from "canvas"
import Barcode from "jsbarcode"

export default class ProductController {
  static async createProduct(req, res) {
      const { name, barcode, photo, price, category, expiryDate } = req.body;
      // Check if an item with the same barcode already exists
      let existingItem = await Product.findOne({ barcode });
      if (existingItem) {
        // If the item exists, increment the quantity
        const inventoryProduct = await Inventory.findOneAndUpdate({name: existingItem.name})
        inventoryProduct.quantity += 1;
        inventoryProduct.total = inventoryProduct.quantity * inventoryProduct.price
        await inventoryProduct.save()
        return res.status(200).json("Item added"); // Return the updated item
      }
      // If the item doesn't exist, create a new one
      const newItem = new Product({
        name,
        barcode,
        photo,
        price,
        category,
        expiryDate,
      });
      await newItem.save();
      const newInventory = new Inventory({
        name,
        price,
        quantity: 1,
        inStock: true,
        total:price
      })
      await newInventory.save()
      return res.status(201).json(newItem); // Return the newly created item
  }
 

        // Get all inventory items
  static async getAllProduct (req, res){
    const items = await Product.find();
    res.status(200).send(items);
 }

// Get a specific inventory item by ID
  static async getSingleProduct (req, res){
    const item = await Product.findById(req.params.id);
    if (!item) {
      return res.status(404).send();
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
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
}

    
// Search inventory items by name
static async searchByName (req, res){
  const searchName = req.query.name;

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







