import { postLogin, deleteSair } from '../controllers/sessionController.js'
import { Router } from 'express'

const router = Router();

router.post("/login", postLogin);  

router.delete("/sair", deleteSair);

export default router;