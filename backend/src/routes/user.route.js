import express from 'express';
import {signup} from '../controller/user.controller.js';
import {login} from '../controller/user.controller.js';
import { logout } from '../controller/user.controller.js';
import { searchUsers } from '../controller/user.controller.js';
import { protectedRoute } from '../middleware/auth.js';
import { checkAuth } from '../controller/user.controller.js';
import { updateProfile } from '../controller/user.controller.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.get('/search', protectedRoute,searchUsers);
userRouter.get("/check", protectedRoute, checkAuth);
userRouter.put("/update-profile", protectedRoute, updateProfile);



export default userRouter;