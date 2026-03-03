import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {app ,server} from './utils/socket.utils.js';
import path from 'path';


const __dirname = path.resolve();


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser()); 
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent
}));


//import routers
import userRouter from './routes/user.route.js';
import messageRouter from './routes/message.route.js';

//routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/messages', messageRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.use((req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }
  

export default app;