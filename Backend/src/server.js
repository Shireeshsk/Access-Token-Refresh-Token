import express from 'express'
import {config} from 'dotenv'
config()
import cookieParser from 'cookie-parser';
import {router as authroutes } from './routes/auth-routes.js'
import {router as userRoutes} from './routes/user-routes.js'
import cors from 'cors'
import mongoose from 'mongoose'
const app = express();
const port = process.env.PORT
const corsOptions={
    origin:'http://localhost:5173',
    credentials: true 
}

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('Database connection successful'))
.catch((e)=>console.log('Error in connection : ',e))

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',authroutes)
app.use('/api/user',userRoutes)

app.listen(port , ()=>{
    console.log(`server is running on http://localhost:${port}`)
})
