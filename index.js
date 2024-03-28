import express from "express"
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import cors from "cors"
import { UserRouter } from "./routes/user.js"
import cookieParser from "cookie-parser"


const app=express()
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173","https://bucolic-cocada-0f2433.netlify.app"],
    credentials:true
}))
app.use(cookieParser())

app.get("/",async(req,res)=>
{
    res.send("landed correctly")
})
app.use("/auth",UserRouter)


const PORT=process.env.PORT
const MONGO_URL=process.env.MONGO_URL
// console.log(MONGO_URL)



const connection=await mongoose.connect(MONGO_URL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})


export default connection