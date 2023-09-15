import mongoose from "mongoose";
const inventorySchema = new mongoose.Schema({
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
    quantity:{
        type:Number,
        default: 0
    },
    unitOfMeasure:{
        type:Number,
        default:0
    },
    productCategory:{
        type: String,
        required: true
    },
    expiryDate:{
        type:Date,
    }
},{
    timestamps: true
})

export default mongoose.model("Product",inventorySchema)