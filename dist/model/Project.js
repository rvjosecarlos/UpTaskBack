"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proyecto = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const task_1 = require("./task");
const note_1 = require("./note");
;
const ProjectSchema = new mongoose_1.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });
// Middleware para eliminar las tareas asociadas a un proyecto
ProjectSchema.pre('deleteOne', { document: true, query: false }, async function () {
    try {
        const tasks = await task_1.Task.find({ project: this._id });
        for (const task of tasks) {
            await note_1.Note.deleteMany({ task: task._id });
        }
        ;
        await task_1.Task.deleteMany({ project: this._id });
    }
    catch (error) {
        console.log(colors_1.default.red.bold('Error al eliminar las tareas asociadas al proyecto ' + this._id));
    }
});
const Proyecto = mongoose_1.default.model('Project', ProjectSchema);
exports.Proyecto = Proyecto;
//# sourceMappingURL=Project.js.map