import { Request, Response, NextFunction } from "express";
import { IUser } from "../model/User";
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export declare const authentication: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
