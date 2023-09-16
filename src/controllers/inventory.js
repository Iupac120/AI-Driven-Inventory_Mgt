import Product from "../models/product.model.js"
import Inventory from "../models/inventory.model.js"

export default class InventoryController {
   
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
static async updateInventory (req, res) {
  // const updates = Object.keys(req.body);
  // const allowedUpdates = ['name', 'price', 'minimumQuantity', 'inStock', 'quantity'];
  // const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  // if (!isValidOperation) {
  //   return res.status(400).send({ error: 'Invalid updates!' });
  // }
  //   const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  //   if (!item) {
  //     return res.status(404).send("No item updated");
  //   }
  //   res.status(200).send(item);
  try{
    const {name,price,minimumQuantity,inStock,quantity} = req.body
    const newProduct = await Inventory.findByIdAndUpdate(req.params.productId,{
        $set:{
          name,
          price,
          minimumQuantity,
          inStock,
          quantity
        }
    },{
        new: true, 
        runValidators: true
    })
    if(newProduct){
      newProduct.total = quantity*price
    }
    await newProduct.save()
    if(!newProduct){
        return res.status(403).json("No inventory updated")
    }
    res.status(201).json({
        data: newProduct
    })
}catch(err){
    res.status(500).json({message:err.message})
  }
}


// Delete an inventory item by ID
static async deleteInventory (req, res) {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.status(200).send("Item delete successfully");
}

    
// Search inventory items by name
static async search(req, res) {
  try {
    const { name,barcode,price, quantity, inStock } = req.query;
    const queryObject = {};
    if (inStock) {
      queryObject.inStock = inStock === 'true'; // Convert the string to a boolean
    }
    if(barcode){
      const products = await Product.find({ barcode });      
      // Extract the names from the found products and add them to the query
      const productNames = products.map(product => product.name);
      queryObject.name = { $in: productNames };

    }
    if (name) {
      queryObject.name = { $regex: name, $options: 'i' };
    }
    if (price) {
      // Assuming price is a numeric value, you can search for items with a price less than or equal to the specified value
      queryObject.price = { $lte: parseFloat(price) };
    }

    if (quantity) {
      // Assuming quantity is a numeric value, you can search for items with a quantity greater than or equal to the specified value
      queryObject.quantity = { $gte: parseInt(quantity) };
    }

    const inventoryProducts = await Inventory.find(queryObject);

    if (!inventoryProducts || inventoryProducts.length === 0) {
      return res.status(404).json({ status: "Product not found" });
    }

    res.status(200).json({
      status: "Success",
      data: inventoryProducts,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

}







