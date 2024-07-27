import { Request, Response, NextFunction } from "express";
import { IProject } from "../model/Project";
declare global {
    namespace Express {
        interface Request {
            project: IProject;
        }
    }
}
declare const validateProjectExist: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export { validateProjectExist };
