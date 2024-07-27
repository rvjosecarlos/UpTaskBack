import { Request, Response, NextFunction } from "express";
import { Task } from "../model/task";
import { Proyecto } from "../model/Project";
import colors from "colors";

class TaskController {
    static createTask = async ( req: Request, res: Response ) => {
        try{
            const task = new Task(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            await Promise.allSettled([task.save(), req.project.save()]);
            return res.send('Tarea creada');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error al crear la tarea' });
        };
    };

    static getTasks = async ( req: Request, res: Response ) => {
        try{
            const tasks = await Task.find({ project: req.project.id }).populate('project');
            if( !tasks ){
                const error = new Error('No se encontraron tareas');
                return res.status(404).json({ error: error.message });
            }
            return res.json(tasks);
        }
        catch(error){
            console.log(colors.red.bold('Error al obtener las tareas' + error));
            return res.status(500).json({ error: 'Error al obtener las tareas' });
        };
    };

    static getTaskById = async ( req: Request, res: Response ) => {
        try{
            const task = await Task.findById(req.task.id)
                                                        .populate({ path: 'updateStatusHistorial.user', select: "id name email" })
                                                        .populate({ path: 'notes', populate: { path: 'createdBy', select: "id name email" } });
            return res.json(task);
        }
        catch(error){
            console.log(colors.red.bold('Error al obtener tarea por ID ' + error));
            return res.status(500).json({ error: 'Error al obtener la tarea' });
        }
    };

    static updateTask = async ( req: Request, res: Response ) => {
        try{
            const { taskId } = req.params;
            await Task.findByIdAndUpdate( taskId, req.body );
            return res.send('Tarea actualizada');
        }
        catch(error){
            console.log(colors.red.bold( 'Error al actualizar la tarea ' + error ));
            return res.status(500).json({ error: 'Error interno - Actualizar la tarea' });
        }
    };

    static deleteTask = async ( req: Request, res: Response ) => {
        try{
            const { project, task } = req;
            project.tasks = project.tasks.filter( t => t.toString() !== task.id.toString() ); 
            await Promise.allSettled([ Task.findByIdAndDelete(task.id), project.save() ]);
            return res.send('Tarea eliminada');
        }
        catch(error){
            console.log(colors.red.bold('Error al eliminar una tarea ' + error));
            return res.status(500).json({ error: 'Error al eliminar una tarea' });
        }
    };

    static updateTaskStatus = async ( req: Request, res: Response, next: NextFunction ) => {
        try{    
            const { task } = req;
            task.taskStatus = req.body.taskStatus;
            task.updateStatusHistorial.push({ user: req.user.id, taskStatus: req.body.taskStatus });
            await task.save();
            return res.send('Estado de la tarea actualizado');
        }
        catch(error){
            console.log(colors.red.bold('Error al actualizar el estado de la tarea ' + error));
            return res.status(500).json({ error: 'Error al actualizar el estado' });
        }
    };
};

export { TaskController };