import express from 'express';
import { protectedRoute } from '../middleware/auth.js';
import { getUserForSidebar } from '../controller/message.controller.js';
import { getMessages, sendMessage } from '../controller/message.controller.js';


const messageRouter = express.Router();


messageRouter.get('/users',protectedRoute,getUserForSidebar)
messageRouter.get("/:id", protectedRoute, getMessages);

messageRouter.post("/send/:id", protectedRoute, sendMessage);

export default messageRouter;