import { postSignup } from '../controllers/userController.js'
import { Router } from 'express'

const router = Router();


router.post("/sign-up", postSignup);

export default router;