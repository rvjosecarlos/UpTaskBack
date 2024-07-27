import mongoose, { Document, Types, PopulatedDoc } from "mongoose";
import { IUser } from "./User";
export interface INote {
    content: string;
    createdBy: PopulatedDoc<IUser & Document>;
    task: Types.ObjectId;
}
declare const Note: mongoose.Model<INote, {}, {}, {}, mongoose.Document<unknown, {}, INote> & INote & {
    _id: Types.ObjectId;
}, any>;
export { Note };
