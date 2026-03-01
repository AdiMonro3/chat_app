import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json()); 
app.use(cookieParser()); 

//import routers
import userRouter from './routes/user.route.js';


//routes
app.use('/api/v1/users', userRouter);

export default app;