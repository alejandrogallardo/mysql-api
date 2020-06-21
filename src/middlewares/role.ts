import { Request, Response, NextFunction } from 'express'
import { User } from '../entity/User'
import { getRepository } from 'typeorm'

export const chekRole = (roles:Array<string>) => {
    return async (req: Request, res:Response, next:NextFunction) => {
        // destructuring
        const {userId} = res.locals.jwtPayload
        const userRepository = getRepository(User)
        let user: User

        try {
            user = await userRepository.findOneOrFail(userId)
        } catch (e) {
            return res.status(401).json({message: 'Not Authorized'})
        }

        //Check
        const {role} = user
        if( roles.includes(role) ){
            next()
        } else {
            res.status(401).json({message: 'Not Authorized'})
        }
    }
}