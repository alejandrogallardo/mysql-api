import { Router } from 'express'

import auth from './auth'
import user from './user'

const ROUTES = Router()

ROUTES.use('/auth', auth)
ROUTES.use('/users', user)

export default ROUTES;