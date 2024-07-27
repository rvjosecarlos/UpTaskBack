import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { IUser } from "./User";

export interface INote {
    content: string,
    createdBy: PopulatedDoc<IUser & Document>
    task: Types.ObjectId
};

const NoteSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, {timestamps: true});

const Note = mongoose.model<INote>('Note', NoteSchema);
export { Note };