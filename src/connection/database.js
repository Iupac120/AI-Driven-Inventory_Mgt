import mongoose from "mongoose";

const connectDb = (url) => {
    return mongoose.connect(url,{
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
}

export default connectDb