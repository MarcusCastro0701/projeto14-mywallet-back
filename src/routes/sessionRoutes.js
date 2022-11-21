import { postLogin, deleteSair } from '../controllers/sessionController.js'
import { Router } from 'express'

import {verificaBody} from '../middlewares/validateBodyMiddleware.js'
import { verificaHeaders } from '../middlewares/validateHeadersMiddleware.js';

const router = Router();

router.post("/login", verificaBody, postLogin);  

router.delete("/sair", verificaHeaders, deleteSair);

export default router;