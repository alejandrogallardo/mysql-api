import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from 'class-validator' // sirve para hacer las validaciones de los campos

class UserController {

    // ===========================
    // Obtiene todos los usuarios
    // ============================
    static getAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User) // el entity User
        let users
        try {
            users = await userRepository.find()
        } catch (e) {
            res.status(404).json({
                message: ' Something goes wrong'
            })
        }


        if ( users.length > 0 ) {
            res.send(users) // por defecto el estatus es 200
        } else {
            res.status(404).json({
                message: ' Not result'
            })
        }
    }

    // ===========================
    // Obtiene un usuario
    // ============================
    static getById = async (req: Request, res: Response) => {
        const { id }  = req.params // del front viene un id
        const userRepository = getRepository(User)
        
        try {
            const user = await userRepository.findOneOrFail(id)
            res.send(user)
        } catch (e) {
            res.status(404).json({
                message: ' Not result'
            })
        }
        
    }

    // ===========================
    // Crea un usuario
    // ============================
    static newUser = async (req: Request, res: Response) => {
        const { username, password, role } = req.body
        const user = new User()

        user.username = username
        user.password = password
        user.role = role

        // Validate
        const errors = await validate(user, { validationError: { target: false, value: false } })

        if ( errors.length > 0 ) {
            return res.status(400).json(errors)
        }

        // TODO: Hash password

        const userRepository = getRepository(User)
        try {
            user.hashPassword()
            await userRepository.save(user)
        } catch (e) {
            return res.status(409).json({
                message: 'Username already exist'
            })
        }

        // Al ok
        res.send('User created!')
    }
    
    // ===========================
    // Edita un usuario
    // ============================
    static editUser = async (req: Request, res: Response) => {
        let user
        const { id } = req.params
        const { username, role } = req.body

        const userRepository = getRepository(User)

        // Try to get user
        try {
            user = await userRepository.findOneOrFail(id)   
            user.username = username
            user.rol = role
        } catch (e) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const errors = await validate(user, { validationError: { target: false, value: false } })

        if ( errors.length > 0 ) {
            return res.status(400).json(errors)
        }

        // Try to save user
        try {
            await userRepository.save(user)
        } catch (e) {
            return res.status(409).json({
                message: 'Username already in use'
            })
        }

        res.status(201).json({
            message: 'User'
        })

    }
    
    // ===========================
    // Elimina un usuario
    // ============================
    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params
        const userRepository = getRepository(User)
        let user: User
        
        try {
            user = await userRepository.findOneOrFail(id)
        } catch (e) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        userRepository.delete(id)
        res.status(201).json({
            message: 'User  deleted'
        })

    }
    
}

export default UserController