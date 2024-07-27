import { Request, Response, NextFunction } from "express";
import { ITask, Task } from "../model/task";
import colors from "colors";

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

const validateTaskExist = async ( req: Request, res: Response, next: NextFunction ) => {
    try{
        const { taskId } = req.params;
        const task = await Task.findById(taskId).populate('project');
        if( !task ){
            const error = new Error('Tarea no encontrada');
            return res.status(404).json({ error: error.message });
        };
        req.task = task;
        next();
    }
    catch(error){
        console.log(colors.red.bold('Error al validar la existencia de una tarea ' + error));
    };
};

const taskBelongsToProject = ( req: Request, res: Response, next: NextFunction ) => {
    const { projectId } = req.params;
    if( projectId !== req.task.project.id.toString() ){
        const error = new Error('La tarea no pertenece al proyecto buscado');
        return res.status(400).json({ error: error.message });
    }
    next();
}

const hasAuthorization = ( req: Request, res: Response, next: NextFunction ) => {
    if( req.user.id.toString() !== req.project.manager.toString() ){
        const error = new Error('Acción no válida');
        return res.status(401).json({ error: error.message });
    }
    next();
};

export { validateTaskExist, taskBelongsToProject, hasAuthorization };