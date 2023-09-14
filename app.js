import express from "express"
import env from "dotenv"
env.config()
import morgan from "morgan"
import {router as userRoute} from "./src/routes/user.route.js"
import {router as productRoute} from "./src/routes/product.route.js"
import connectDb from "./src/connection/database.js"
import { errorHandler } from "./src/middlewares/errorHandler.js"
import { notFound } from "./src/middlewares/not-found.js"
import cors from "cors"
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan("tiny"))
app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
const PORT = process.env.PORT || 5000

app.get("/",(req,res) => {
    res.send("starting page")
})
app.use(notFound)
//app.use(errorHandler)

const start = async () => {
    try{
        await connectDb(process.env.MONGO_URI)
        await app.listen(PORT, () =>{
            console.log(`Server is running on port ${PORT}`)
        })
    }catch(err){
        console.log(err)
    }
}
start()
