"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = require("../model/Project");
const colors_1 = __importDefault(require("colors"));
class ProjectController {
    static createProject = async (req, res) => {
        try {
            req.body.manager = req.user.id;
            const proyecto = new Project_1.Proyecto(req.body);
            await proyecto.save();
            return res.send('Proyecto creado');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            const proyectos = await Project_1.Proyecto.find({
                $or: [
                    { manager: { $in: [req.user.id] } },
                    { team: { $in: [req.user.id] } }
                ]
            });
            return res.json(proyectos);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        }
    };
    static getProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            const proyecto = await Project_1.Proyecto.findById(id).populate('tasks');
            if (!proyecto) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            ;
            if (proyecto.manager.toString() !== req.user.id.toString() && !proyecto.team.includes(req.user.id.toString())) {
                const error = new Error('Acción no válida');
                return res.status(401).json({ error: error.message });
            }
            ;
            return res.json(proyecto);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        }
        ;
    };
    static updateProject = async (req, res) => {
        try {
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
            await Project_1.Proyecto.findByIdAndUpdate(projectId, req.body);
            return res.send('Proyecto actualizado');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        }
        ;
    };
    static deleteProject = async (req, res) => {
        try {
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
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: error.message });
        }
        ;
    };
}
exports.ProjectController = ProjectController;
;
//# sourceMappingURL=ProjectController.js.map