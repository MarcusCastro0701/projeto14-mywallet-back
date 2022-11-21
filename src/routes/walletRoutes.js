import { postWallet, getWallet } from '../controllers/walletController.js'
import { Router } from 'express'

const router = Router();


router.post("/wallet", postWallet);

router.get("/wallet", getWallet);

export default router;