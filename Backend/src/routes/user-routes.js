import express from 'express'
import { verifyAuth } from '../middlewares/authMiddleware.js'
import { resetPassword , getProfile } from '../controllers/User-controller.js'
export const router = express.Router()
router.post('/reset-password',verifyAuth,resetPassword);
router.get('/get-profile',verifyAuth,getProfile)