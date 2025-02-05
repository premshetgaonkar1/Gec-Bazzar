import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()


const port=process.env.PORT||8000


const app=express()
//middleware
app.use(cors())
app.use(express.json())




import authRouter from "./routes/auth.routes.js"


app.use("/api/v1",authRouter)




app.get("/",(req,res)=>{
    res.send("welcome to the api")
})

app.listen(port,()=>{
    console.log(`server is running on port :${process.env.PORT}`)
})

 