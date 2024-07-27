import { Request, Response, NextFunction } from "express";
import { ITask } from "../model/task";
declare global {
    namespace Express {
        interface Request {
            task: ITask;
        }
    }
}
declare const validateTaskExist: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
declare const taskBelongsToProject: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
declare const hasAuthorization: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export { validateTaskExist, taskBelongsToProject, hasAuthorization };
