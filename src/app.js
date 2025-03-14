import express, { urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config()


const port=process.env.PORT||8000


const app=express()
//middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))




import authRouter from "./routes/auth.routes.js"


app.use("/api/v1",authRouter)

import itemRouter from "./routes/item.routes.js"

app.use("/api/v1",itemRouter)

import requestRouter from "./routes/request.routes.js"

 app.use("/api/v1",requestRouter)



app.get("/",(req,res)=>{
    res.send("welcome to the api")
})

app.listen(port,()=>{
    console.log(`server is running on port :${process.env.PORT}`)
})

 