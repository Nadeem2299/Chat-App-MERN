import express from "express";
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import dotenv from 'dotenv'
import cors from "cors"
import cookieParser from "cookie-parser" 
import { connectDB } from "./lib/db.js";

const app = express();
dotenv.config();
const prot = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(prot,()=>{
  console.log("Server is running on port "+prot);
  connectDB();
})