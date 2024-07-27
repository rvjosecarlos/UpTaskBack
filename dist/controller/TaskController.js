"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_1 = require("../model/task");
const colors_1 = __importDefault(require("colors"));
class TaskController {
    static createTask = async (req, res) => {
        try {
            const task = new task_1.Task(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            await Promise.allSettled([task.save(), req.project.save()]);
            return res.send('Tarea creada');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error al crear la tarea' });
        }
        ;
    };
    static getTasks = async (req, res) => {
        try {
            const tasks = await task_1.Task.find({ project: req.project.id }).populate('project');
            if (!tasks) {
                const error = new Error('No se encontraron tareas');
                return res.status(404).json({ error: error.message });
            }
            return res.json(tasks);
        }
        catch (error) {
            console.log(colors_1.default.red.bold('Error al obtener las tareas' + error));
            return res.status(500).json({ error: 'Error al obtener las tareas' });
        }
        ;
    };
    static getTaskById = async (req, res) => {
        try {
            const task = await task_1.Task.findById(req.task.id)
                .populate({ path: 'updateStatusHistorial.user', select: "id name email" })
                .populate({ path: 'notes', populate: { path: 'createdBy', select: "id name email" } });
            return res.json(task);
        }
        catch (error) {
            console.log(colors_1.default.red.bold('Error al obtener tarea por ID ' + error));
            return res.status(500).json({ error: 'Error al obtener la tarea' });
        }
    };
    static updateTask = async (req, res) => {
        try {
            const { taskId } = req.params;
            await task_1.Task.findByIdAndUpdate(taskId, req.body);
            return res.send('Tarea actualizada');
        }
        catch (error) {
            console.log(colors_1.default.red.bold('Error al actualizar la tarea ' + error));
            return res.status(500).json({ error: 'Error interno - Actualizar la tarea' });
        }
    };
    static deleteTask = async (req, res) => {
        try {
            const { project, task } = req;
            project.tasks = project.tasks.filter(t => t.toString() !== task.id.toString());
            await Promise.allSettled([task_1.Task.findByIdAndDelete(task.id), project.save()]);
            return res.send('Tarea eliminada');
        }
        catch (error) {
            console.log(colors_1.default.red.bold('Error al eliminar una tarea ' + error));
            return res.status(500).json({ error: 'Error al eliminar una tarea' });
        }
    };
    static updateTaskStatus = async (req, res, next) => {
        try {
            const { task } = req;
            task.taskStatus = req.body.taskStatus;
            task.updateStatusHistorial.push({ user: req.user.id, taskStatus: req.body.taskStatus });
            await task.save();
            return res.send('Estado de la tarea actualizado');
        }
        catch (error) {
            console.log(colors_1.default.red.bold('Error al actualizar el estado de la tarea ' + error));
            return res.status(500).json({ error: 'Error al actualizar el estado' });
        }
    };
}
exports.TaskController = TaskController;
;
//# sourceMappingURL=TaskController.js.map