import Product from "../models/product.model.js"
import {createCanvas} from "canvas"
import Barcode from "jsbarcode"

export default class ProductController {
    static async createProduct (req,res){
        const canvas = createCanvas()
        Barcode(canvas, req.params.text, {
            format:"CODE128",
            displayValue: true,
            fontSize: 18,
            textMargin: 10
        })
        res.type('image/png')
        const stream =  canvas.createPNGStream()
        stream.pipe(res)
        const {name, barcode, photo, price, quantity,unitofMeasure, productCategory,expiryDate} = req.body
        const existingItem = await InventoryItem.findOne({ barcode });

    if (existingItem) {
      return res.status(400).json({ error: 'Item with this barcode already exists' });
    }

    // Create a new inventory item
    const newItem = new Product({
      name,
      barcode,
      photo,
      price,
      quantity,
      unitOfMeasure,
      productCategory,
      expiryDate,
    });

    // Save the new item to the database
    await newItem.save();

    return res.status(201).json(newItem);
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
}
