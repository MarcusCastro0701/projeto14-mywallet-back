import { postWallet, getWallet } from '../controllers/walletController.js'
import { Router } from 'express'

//Middlewares
import { verificaHeaders } from '../middlewares/validateHeadersMiddleware.js';
//

const router = Router();



router.post("/wallet", verificaHeaders, postWallet);

router.get("/wallet", verificaHeaders, getWallet);

export default router;