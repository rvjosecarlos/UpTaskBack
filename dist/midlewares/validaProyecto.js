"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectExist = void 0;
const colors_1 = __importDefault(require("colors"));
const Project_1 = require("../model/Project");
;
const validateProjectExist = async (req, res, next) => {
    try {
        console.log('Entro a validar');
        const { projectId } = req.params;
        const proyecto = await Project_1.Proyecto.findById(projectId);
        if (!proyecto) {
            const error = new Error('Proyecto no encontrado');
            return res.status(404).json({ error: error.message });
        }
        ;
        req.project = proyecto;
        next();
    }
    catch (error) {
        console.log(colors_1.default.red.bold('Erro al validar que el proyecto existe' + error));
    }
};
exports.validateProjectExist = validateProjectExist;
//# sourceMappingURL=validaProyecto.js.map