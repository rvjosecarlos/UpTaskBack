import mongoose, { Document, PopulatedDoc, ObjectId } from "mongoose";
import { IProject } from "./Project";
import { INote } from "./note";
declare const statusTask: {
    PENDING: string;
    ON_HOLD: string;
    IN_PROGRESS: string;
    UNDER_REVIEW: string;
    COMPLETED: string;
};
export type TaskStatus = typeof statusTask[keyof typeof statusTask];
interface ITask extends Document {
    name: string;
    description: string;
    project: PopulatedDoc<IProject & Document>;
    taskStatus: TaskStatus;
    updateStatusHistorial: {
        user: ObjectId;
        taskStatus: TaskStatus;
    }[];
    notes: PopulatedDoc<INote & Document>[];
}
declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask> & ITask & Required<{
    _id: unknown;
}>, any>;
export { Task, ITask };
