import { postSignup } from '../controllers/userController.js'
import { Router } from 'express'

const router = Router();

import {verificaBody} from '../middlewares/validateBodyMiddleware.js'

router.post("/sign-up", verificaBody, postSignup);

export default router;