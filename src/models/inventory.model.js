import mongoose from "mongoose";
const inventorySchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    quantity:{
        type: Number,
        default: 0
    },
    minimumQuantity:{
        type: Number,
        default: 10
    },
    price:{
        type: Number,
        default: 0
    },
    total:{
        type:Number,
        default: 0
    },
    inStock:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true
})

export default mongoose.model("Inventory",inventorySchema)