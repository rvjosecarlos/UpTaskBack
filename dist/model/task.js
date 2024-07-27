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
exports.Task = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const note_1 = require("./note");
const statusTask = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
};
;
const TaskSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    taskStatus: {
        type: String,
        enum: Object.values(statusTask),
        default: statusTask.PENDING
    },
    project: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Project'
    },
    updateStatusHistorial: [
        {
            user: {
                type: mongoose_1.Types.ObjectId,
                ref: 'User'
            },
            taskStatus: {
                type: String,
                enum: Object.values(statusTask),
                default: statusTask.PENDING
            }
        }
    ],
    notes: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'Note'
        }
    ]
}, { timestamps: true });
// Definir middleware para eliminar las notas cuando se elimine una tarea
TaskSchema.pre('deleteOne', { document: true, query: false }, async function () {
    try {
        await note_1.Note.deleteMany({ task: this._id });
    }
    catch (error) {
        console.log(colors_1.default.red.bold("Error al borrar la nota asociada a la tarea " + this._id.toString()));
    }
});
const Task = mongoose_1.default.model('Task', TaskSchema);
exports.Task = Task;
//# sourceMappingURL=task.js.map