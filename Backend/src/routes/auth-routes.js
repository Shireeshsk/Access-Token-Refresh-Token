import express from 'express'
import { loginUser, registerUser , RefreshToken , logoutUser} from '../controllers/Auth-controller.js'

export const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/refresh-token',RefreshToken)
router.post('/logout',logoutUser)