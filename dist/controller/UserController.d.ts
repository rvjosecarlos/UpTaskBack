import { NextFunction, Request, Response } from "express";
export declare class UserController {
    static createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static confirmUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static requestConfirmationCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static forgotPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static validateToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static newPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static user: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    static updateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updatePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static checkPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
