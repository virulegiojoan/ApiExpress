import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/jwtMiddleware.js";


const router = Router()

router.post('/register', userController.register)

router.post('/login', userController.login)

router.get('/profile',verifyToken, userController.profile)


export default router;