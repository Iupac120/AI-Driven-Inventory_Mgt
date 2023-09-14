import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        min: 1,
        max: 100
    },
    barcode:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        
    },
    photo:{
        type: String,
        required: true,
    },
    price:{
        type: Boolean,
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
        default:Date.now()
    }
},{
    timestamps: true
})

export default mongoose.model("Product",productSchema)