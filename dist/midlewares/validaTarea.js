"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAuthorization = exports.taskBelongsToProject = exports.validateTaskExist = void 0;
const task_1 = require("../model/task");
const colors_1 = __importDefault(require("colors"));
const validateTaskExist = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const task = await task_1.Task.findById(taskId).populate('project');
        if (!task) {
            const error = new Error('Tarea no encontrada');
            return res.status(404).json({ error: error.message });
        }
        ;
        req.task = task;
        next();
    }
    catch (error) {
        console.log(colors_1.default.red.bold('Error al validar la existencia de una tarea ' + error));
    }
    ;
};
exports.validateTaskExist = validateTaskExist;
const taskBelongsToProject = (req, res, next) => {
    const { projectId } = req.params;
    if (projectId !== req.task.project.id.toString()) {
        const error = new Error('La tarea no pertenece al proyecto buscado');
        return res.status(400).json({ error: error.message });
    }
    next();
};
exports.taskBelongsToProject = taskBelongsToProject;
const hasAuthorization = (req, res, next) => {
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('Acción no válida');
        return res.status(401).json({ error: error.message });
    }
    next();
};
exports.hasAuthorization = hasAuthorization;
//# sourceMappingURL=validaTarea.js.map