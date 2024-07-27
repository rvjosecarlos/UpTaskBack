import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleInputErrors = ( req: Request, res: Response, next: NextFunction ) => {
    const error = validationResult(req);
    if( !error.isEmpty() ){
        console.log(error.array()[0].msg);
        return res.status(400).json({ error: error.array()[0].msg });
    }
    next();
};

export { handleInputErrors };