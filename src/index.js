import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from './routes/auth.routes.js'
import bookRoutes from './routes/book.routes.js'

import connectDB from './lib/db.js';

const app =express();
dotenv.config();
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser())
app.use(
  cors({
    origin: true,          // reflect Origin header or allow undefined
    credentials: true,     // allow cookies / auth headers
  })
);

app.use("/api/auth",authRoutes)
app.use("/api/book",bookRoutes)

app.listen(process.env.PORT ,()=>{
    console.log("Server is running on port",process.env.PORT);
    connectDB();
})