import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    barcode:{
        type: String,
        required: true,
        
    },
    photo:{
        type: String
    },
    price:{
        type: Number,
        default: 0
    },
    category:{
        type: String,
        required: true
    },
    expiryDate:{
        type:Date,
    }
},{
    timestamps: true
})

export default mongoose.model("Product",productSchema)