import { Router } from 'express'
import AuthController from '../controller/AuthController'
import { checkJwt } from './../middlewares/jwt'

const ROUTER = Router()

// Login
ROUTER.post('/login', AuthController.login)

ROUTER.post('/change-password', [checkJwt], AuthController.chagePassword)

export default ROUTER