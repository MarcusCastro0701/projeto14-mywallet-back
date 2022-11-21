import { postWallet, getWallet } from '../controllers/walletController.js'
import { Router } from 'express'

//Middlewares
import { verificaHeaders } from '../middlewares/validateHeadersMiddleware.js';
//

const router = Router();

router.use(verificaHeaders)


router.post("/wallet", postWallet);

router.get("/wallet", getWallet);

export default router;