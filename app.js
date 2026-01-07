import express from "express"
import router from "./routes/eventRoute.js"
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const app=express()
app.use(cors())
app.use(express.json())
app.use('/api/events',router)
export default app;
