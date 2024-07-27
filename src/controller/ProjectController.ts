import { Request, Response } from "express";
import { Proyecto } from "../model/Project";
import colors from "colors";

class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        try{
            req.body.manager = req.user.id;
            const proyecto = new Proyecto(req.body);
            await proyecto.save();
            return res.send('Proyecto creado');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        }
    };
    
    static getAllProjects = async (req: Request, res: Response) => {
        try{
            const proyectos = await Proyecto.find({
                $or: [
                    { manager: { $in: [req.user.id] }},
                    { team: { $in: [req.user.id] } }
                ]
            });
            return res.json(proyectos);
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        }
    };

    static getProjectById = async ( req: Request, res: Response ) => {
        const { id } = req.params;
        try{
            const proyecto = await Proyecto.findById(id).populate('tasks');
            if( !proyecto ){
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            };

            if( proyecto.manager.toString() !== req.user.id.toString() && !proyecto.team.includes(req.user.id.toString()) ){
                const error = new Error('Acción no válida');
                return res.status(401).json({ error: error.message });
            };

            return res.json(proyecto);
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        };
    };

    static updateProject = async ( req: Request, res: Response ) => {
        try{
            /*
            const { id } = req.params;
            const proyecto = await Proyecto.findById(id);
            if(!proyecto){
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }

            if( proyecto.manager.toString() !== req.user.id.toString() ){
                const error = new Error('Acción no válida');
                return res.status(401).json({ error: error.message });
            };
            */
            const projectId = req.project.id;
            await Proyecto.findByIdAndUpdate(projectId, req.body);
            return res.send('Proyecto actualizado');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        };
    };

    static deleteProject = async ( req: Request, res: Response) => {
        try{
            /*
            const { id } = req.params;
            const proyecto = await Proyecto.findById(id);
            if(!proyecto){
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }

            if( proyecto.manager.toString() !== req.user.id.toString() ){
                const error = new Error('Acción no válida');
                return res.status(401).json({ error: error.message });
            }; */
            const proyecto = req.project;            
            await proyecto.deleteOne();
            return res.send('Proyecto eliminado');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        };
    };
};

export { ProjectController };