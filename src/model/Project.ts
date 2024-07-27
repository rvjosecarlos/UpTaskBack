import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import colors from "colors";
import { ITask, Task } from "./task";
import { IUser } from "./User";
import { Note } from "./note";

interface IProject extends Document {
    projectName: string,
    clientName: string,
    description: string,
    tasks: PopulatedDoc<ITask & Document>[],
    manager: PopulatedDoc<IUser & Document>,
    team: PopulatedDoc<IUser & Document>[]
};

const ProjectSchema: Schema = new Schema({
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
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

// Middleware para eliminar las tareas asociadas a un proyecto
ProjectSchema.pre('deleteOne', { document: true, query: false }, async function(){
    try{
        const tasks = await Task.find({ project: this._id });
        for( const task of tasks ){
            await Note.deleteMany({ task: task._id });
        };

        await Task.deleteMany({ project: this._id });
    }
    catch(error){
        console.log(colors.red.bold('Error al eliminar las tareas asociadas al proyecto ' + this._id));
    }
});

const Proyecto = mongoose.model<IProject>('Project', ProjectSchema);
export { Proyecto, IProject };