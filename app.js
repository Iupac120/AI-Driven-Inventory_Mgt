// import express from "express"
// import env from "dotenv"
// env.config()
// import morgan from "morgan"
// import {router as userRoute} from "./src/routes/user.route.js"
// import {router as productRoute} from "./src/routes/product.route.js"
// import connectDb from "./src/connection/database.js"
// import { errorHandler } from "./src/middlewares/errorHandler.js"
// import { notFound } from "./src/middlewares/not-found.js"
// import cors from "cors"
// const app = express()
// app.use(express.json())
// app.use(cors())
// app.use(morgan("tiny"))
// app.use("/api/v1/user", userRoute)
// app.use("/api/v1/product", productRoute)
// const PORT = process.env.PORT || 5000

// app.get("/",(req,res) => {
//     res.send("starting page")
// })
// app.use(notFound)
// //app.use(errorHandler)

// const start = async () => {
//     try{
//         await connectDb(process.env.MONGO_URI)
//         await app.listen(PORT, () =>{
//             console.log(`Server is running on port ${PORT}`)
//         })
//     }catch(err){
//         console.log(err)
//     }
// }
// start()

import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express';
const app = express()
import morgan from 'morgan';
import passport from "passport";
import session from "express-session"
import cors from "cors";
import cookieParser from "cookie-parser";
import exphbs from "express-handlebars"
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import cookieSession from "cookie-session"
//import { passportCredential } from './src/domains/passport/passport.js.js';
app.use(express.urlencoded({extended:false}));
import MongoStore from 'connect-mongo';
app.use(express.static('public'))
app.use(cors());

import connectDB from './src/connection/database.js';
import {router as userRouter} from "./src/routes/user.route.js"
import {router as productRouter} from "./src/routes/product.route.js"
//import {router as orderRouter} from "./src/domains/order/orderRoutes.js"
//import {router as cartRouter} from "./src/domains/cart/cartRoutes.js"
//import {router as paymentRouter} from "./src/domains/payment/stripe.js"
//import {router as indexRouter} from "./src/domains/passport/index.js"
//import { errorHandler } from './src/middlewares/errorHandler.js';
//import { notFound } from './src/middlewares/notFound.js';
app.use(express.json())
app.use(morgan('tiny'))
//passportCredential(passport)
const store = MongoStore.create({
    mongoUrl:process.env.MONGO_URI
})
app.use(session({
    secret:'restaurantApp',
    resave:false,
    saveUninitialized:true,
    store:store,
    cookie:{maxAge: 360*60*1000}
}))

// app.use(cookieSession({
//     name:'tuto-session',
//     keys:['key1','key2']
// }))
app.use(passport.initialize())
app.use(passport.session())

//assign session
app.use(function(req,res,next){
    res.locals.session = req.session
    next()
})

//API
app.use(cookieParser())
app.use('/api/v1/user',userRouter)
app.use("/api/v1/product",productRouter)
// app.use("/api/v1/order",orderRouter)
// app.use("/api/v1/cart",cartRouter)
// app.use("/api/v1/checkout",paymentRouter)
// app.use("/",indexRouter)
//view engine

//app.engine('.hbs', exphbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/",(req,res) => {
    res.render("index")
})
// app.get("/",(req,res) => {
//     res.send(req.user?req.user:`not logged in, login withfacebbok or google`)
// })

const PORT = process.env.PORT || 5000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        await console.log("Connected to database")
        app.listen(PORT, () => {console.log(`server is listening at port ${PORT}`)})
    } catch (err) {
        console.log(err)
    }
}


//error middlewares

// app.use(notFound)
// app.use(errorHandler)
start()
