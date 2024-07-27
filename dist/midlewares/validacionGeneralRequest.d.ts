import { Request, Response, NextFunction } from "express";
declare const handleInputErrors: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export { handleInputErrors };
