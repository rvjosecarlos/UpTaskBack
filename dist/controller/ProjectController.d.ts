import { Request, Response } from "express";
declare class ProjectController {
    static createProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getAllProjects: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updateProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static deleteProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { ProjectController };
