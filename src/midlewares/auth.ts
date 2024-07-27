import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { IUser, User } from "../model/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authentication = async ( req: Request, res: Response, next: NextFunction ) => {
    try{
        const bearerT = req.headers.authorization.replace('Bearer', '').trim();
        if( !bearerT ){
            return res.status(401).json({ error: 'No autorizado' });
        }

        const validBearerT = jwt.verify(bearerT, process.env.JWT_SECRET);        
        if( typeof validBearerT === 'object' && validBearerT.id ){
            const user = await User.findById(validBearerT.id).select("_id name email");
            if( user ){
                req.user = user;
                next();
            }
            else{
                return res.status(500).json({ error: 'Token no válido' });
            }
        }
    }
    catch(error){
        return res.status(500).json({ error: 'Token no válido' });
    }
};