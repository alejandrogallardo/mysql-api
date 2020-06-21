import { getRepository } from 'typeorm'
import { Request, Response } from 'express'
import { User } from '../entity/User'
import * as jwt from 'jsonwebtoken'
import config from '../config/config'
import { validate } from 'class-validator'

class AuthController {
    // req lo que viene del frontend
    static login = async (req: Request, res: Response) => {
        const{ username, password } = req.body

        if ( !(username && password) ) {
            return res.status(400).json({
                message: 'Username and Password are required!'
            })
        }

        const userRepository = getRepository(User)
        let user: User

        try{
            user = await userRepository.findOneOrFail({
                where: {
                    username
                }
            })
        }
        catch (e) {
            return res.status(400).json({
                message: 'Username or Password incorrect'
            })
        }

        // Check password
        if ( !user.checkPassword(password) ) {
            return res.status(400).json({
                message: 'Username or password are incorrect'
            })
        }

        const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {expiresIn:'1h'})

        // res.send(user) al principio se envia esto 
        // se envia el token
        res.json({ message: 'ok', token })

    }

    static chagePassword = async (req:Request, res:Response) => {
        const {userId} = res.locals.jwtPayload
        const {oldPassword, newPassword} = req.body

        if( !(oldPassword && newPassword) ){
            res.status(400).json({message:'Old password and password are required'})
        }

        const userRepository = getRepository(User)
        let user: User

        try {
            user = await userRepository.findOneOrFail(userId)
        } catch (e) {
            res.status(400).json({message: 'Something goes wrong!'})
        }

        if(!user.checkPassword(oldPassword)){
            return res.status(401).json({message: 'Chekc your old password'})
        }
        user.password = newPassword
        const validateOps = {validationError: {target: false, value: false}}
        const errors = await validate(user, validateOps)

        if (errors.length > 0) {
            return res.status(400).json(errors)
        }

        //hash password
        user.hashPassword()
        userRepository.save(user)
        res.json({message: 'Password change'})
    }

}

export default AuthController