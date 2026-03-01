import express from 'express';
import {signup} from '../controller/user.controller.js';
import {login} from '../controller/user.controller.js';
import { logout } from '../controller/user.controller.js';
import { searchUsers } from '../controller/user.controller.js';
import { protectedRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.get('/search', protectedRoute,searchUsers);

export default userRouter;