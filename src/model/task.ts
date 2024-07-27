import mongoose, { Document, Types, Schema, PopulatedDoc, ObjectId } from "mongoose";
import colors from "colors";
import { IProject } from "./Project";
import { INote, Note } from "./note";

const statusTask = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
}

export type TaskStatus = typeof statusTask[keyof typeof statusTask];

interface ITask extends Document {
    name: string,
    description: string,
    project: PopulatedDoc<IProject & Document>,
    taskStatus: TaskStatus,
    updateStatusHistorial: {
        user: ObjectId,
        taskStatus: TaskStatus
    }[],
    notes: PopulatedDoc<INote & Document>[]
};

const TaskSchema: Schema = new Schema({
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
        type: Types.ObjectId,
        ref: 'Project'
    },
    updateStatusHistorial: [
        {
            user: {
                type: Types.ObjectId,
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
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, { timestamps: true });

// Definir middleware para eliminar las notas cuando se elimine una tarea
TaskSchema.pre('deleteOne', { document: true, query: false }, async function(){
    try{
        await Note.deleteMany({ task: this._id });
    }
    catch(error){
        console.log(colors.red.bold("Error al borrar la nota asociada a la tarea " + this._id.toString()))
    }
});

const Task = mongoose.model<ITask>('Task',TaskSchema);
export { Task, ITask };