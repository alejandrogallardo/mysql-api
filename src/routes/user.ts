import { Router } from 'express'
import UserController from '../controller/UserController'
import { checkJwt } from '../middlewares/jwt'
import { chekRole } from './../middlewares/role'

const ROUTER = Router()

// Get all users
ROUTER.get('/', [checkJwt, chekRole(['admin'])], UserController.getAll)
// Get one user
ROUTER.get('/:id', UserController.getById)
// Create new user
ROUTER.post('/', UserController.newUser)
// Edit user
ROUTER.patch('/:id', UserController.editUser)
// Delete user
ROUTER.delete('/:id', UserController.deleteUser)

export default ROUTER