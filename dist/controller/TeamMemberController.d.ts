import { Request, Response } from "express";
export declare class TeamMemberController {
    static findMemberByEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static addMember: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static removeMemberById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getTeam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
