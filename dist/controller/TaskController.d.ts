import { Request, Response, NextFunction } from "express";
declare class TaskController {
    static createTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getTasks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getTaskById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updateTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static deleteTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updateTaskStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
}
export { TaskController };
