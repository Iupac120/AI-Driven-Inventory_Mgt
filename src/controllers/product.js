import Product from "../models/product.model.js"
import {createCanvas} from "canvas"
import Barcode from "jsbarcode"

export default class ProductController {
  static async createProduct(req, res) {
      const { name, barcode, photo, price, quantity, unitOfMeasure, productCategory, expiryDate } = req.body;
      // Check if an item with the same barcode already exists
      let existingItem = await Product.findOne({ barcode });
      if (existingItem) {
        // If the item exists, increment the quantity
        existingItem.quantity += 1;
        await existingItem.save();
        return res.status(200).json("Item added"); // Return the updated item
      }
      // If the item doesn't exist, create a new one
      const newItem = new Product({
        name,
        barcode,
        photo,
        price,
        quantity: quantity || 1, // Set a default quantity if not provided
        unitOfMeasure,
        productCategory,
        expiryDate,
      });
      await newItem.save();
      return res.status(201).json(newItem); // Return the newly created item
  }
  


    static async createMinimumStock (req,res){
            const { barcode, minimumStock } = req.body;
            const item = await Product.findOne({ barcode })
            if (!item) {
              return res.status(404).json({ error: 'Item not found' });
            }
            item.minimumStock = minimumStock;
            await item.save();
            return res.status(200).json(item);
    } 

        // Get all inventory items
  static async getAllProduct (req, res){
    const items = await InventoryItem.find();
    res.status(200).send(items);
 }

// Get a specific inventory item by ID
  static async getSingleProduct (req, res){
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
}

// Update an inventory item by ID
static async updateProduct (req, res) {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'barcode', 'photo', 'price', 'quantity', 'unitOfMeasure', 'productCategory', 'expiryDate', 'minimumStock'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
}

// Delete an inventory item by ID
static async deleteProduct (req, res) {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
}

    
// Search inventory items by name
static async searchByName (req, res){
  const searchName = req.query.name;

  if (!searchName) {
    return res.status(400).send({ error: 'Name query parameter is required.' });
  }

  try {
    const items = await InventoryItem.find({ name: { $regex: searchName, $options: 'i' } });
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error);
  }
}

// Search inventory items by barcode
static async searchByBarcode (req, res){
  const searchBarcode = req.query.barcode;

  if (!searchBarcode) {
    return res.status(400).send({ error: 'Barcode query parameter is required.' });
  }

  try {
    const item = await InventoryItem.findOne({ barcode: searchBarcode });
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
}

}







