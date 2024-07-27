import { Request, Response } from "express";
import { INote } from "../model/note";
export declare class NoteController {
    static getNotes: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static addNote: (req: Request<{}, {}, INote>, res: Response) => Promise<Response<any, Record<string, any>>>;
    static deleteNote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
