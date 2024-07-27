import { Request, Response, NextFunction } from "express";
import colors from "colors";
import { IProject, Proyecto } from "../model/Project";

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
};

const  validateProjectExist = async ( req: Request, res: Response, next: NextFunction ) => {
    try{
        console.log('Entro a validar');
        const { projectId } = req.params;
        const proyecto = await Proyecto.findById(projectId);
        if( !proyecto ){
            const error = new Error('Proyecto no encontrado');
            return res.status(404).json({ error: error.message });
        };
        req.project = proyecto;
        next();
    }
    catch(error){
        console.log(colors.red.bold('Erro al validar que el proyecto existe' + error));
    }
};

export { validateProjectExist };